import {Injectable, Optional} from '@angular/core';
import {AbstractOnlineShopScrapper, OnlineShopScrapper, ScrappedProduct} from "../online-shop-scrapper";
import {HttpClient} from "@angular/common/http";
import {EasyParaScrapper} from "../scrappers/easy-para-scrapper";
import {
  DontCodeEntityType,
  DontCodeModelManager,
  DontCodeStoreCriteriaOperator,
  DontCodeStoreManager,
  dtcde
} from "@dontcode/core";
import {PriceModel} from "../price-model";
import {GreenWeezScrapper} from "../scrappers/greenweez-scrapper";
import {CommercePlugin} from "../../declaration/commerce-plugin";
import {firstValueFrom} from "rxjs";
import {NewPharmaScrapper} from "../scrappers/new-pharma-scrapper";
import {WebEcologieScrapper} from "../scrappers/web-ecologie-scrapper";
import {BoulangerScrapper} from "../scrappers/boulanger-scrapper";
import {DartyScrapper} from "../scrappers/darty-scrapper";
import {CDiscountScrapper} from "../scrappers/cdiscount-scrapper";
import {AmazonScrapper} from "../scrappers/amazon-scrapper";
import {FnacScrapper} from "../scrappers/fnac-scrapper";
import {OnateraScrapper} from "../scrappers/onatera-scrapper";
import {MaxicoffeeScrapper} from "../scrappers/maxicoffee-scrapper";

@Injectable({
  providedIn: 'root'
})
export class PriceFinderService {

  private static DONT_UPDATE_UNTIL_DELAY_MS = 1000*60*10; // Don't update price until 10mn has passed since the last one
  protected listOfScrappers = new Map<string, OnlineShopScrapper> ();
  protected shopTypeNames = new Array<string>();

  constructor(protected httpClient:HttpClient, @Optional() protected modelMgr:DontCodeModelManager,
              @Optional() protected storeMgr:DontCodeStoreManager) {
    if (this.modelMgr==null)  this.modelMgr=dtcde.getModelManager();
    if (this.storeMgr==null) this.storeMgr=dtcde.getStoreManager();

    this.addScrapper (new EasyParaScrapper(httpClient));
    this.addScrapper (new GreenWeezScrapper(httpClient));
    this.addScrapper(new NewPharmaScrapper(httpClient));
    this.addScrapper(new WebEcologieScrapper(httpClient));
    this.addScrapper(new OnateraScrapper(httpClient));
    this.addScrapper(new BoulangerScrapper(httpClient));
    this.addScrapper(new DartyScrapper(httpClient));
    this.addScrapper(new CDiscountScrapper(httpClient));
    this.addScrapper(new FnacScrapper(httpClient));
    this.addScrapper(new AmazonScrapper(httpClient));
    this.addScrapper(new MaxicoffeeScrapper(httpClient));
  }

  addScrapper (newScrapper: OnlineShopScrapper): void {
    this.listOfScrappers.set(newScrapper.getOnlineShopName(), newScrapper);
    this.shopTypeNames.push(newScrapper.getOnlineShopName());
  }

  getListOfShopTypes (): Array<string> {
    return this.shopTypeNames;
  }

  /**
   * Finds the list of products corresponding to the productInfo given for the shopTypeName given at the model position given.
   * @param productInfo
   * @param position
   * @param shopName
   * @param model
   */
  async searchProducts (productName: string, shopName:string): Promise<Array<ScrappedProduct>> {
    const scrapper = this.listOfScrappers.get(await this.getShopTypeNameOf (shopName));
    if (scrapper==null)
      throw new Error ("Shop type "+shopName+" not found");

    return scrapper.searchProductsForNameOrId(productName,false);
  }

  /**
   * Finds the price of a product in parameter for a shop in parameter. It looks for a Price element in the product info given.
   * and updates it
   * @param productValue
   * @param position
   * @param shopName
   * @param model
   */
  async findPrice (productValue: any, shopName:string, position:string, model?:DontCodeEntityType): Promise<PriceModel|null> {
    if (productValue == null) {
      throw new Error("No product to get price for");
    }
    const scrapper = this.listOfScrappers.get(await this.getShopTypeNameOf(shopName));
    if (scrapper == null)
      throw new Error("Shop type " + shopName + " not found");

    if (model == null) {
      model = this.modelMgr.findAtPosition(position, false);
    }
    // We're looking for a Price that points to the shopType given in parameter
    let priceField = null;
    let productPrice: PriceModel | null = null;
    if (model?.fields!=null) {
      for (const field of Object.values(model.fields)) {
        if (field.type === "Price") {
          // We found one, is it the correct one ?
          priceField = field;
          productPrice = productValue[priceField.name];
          break;
          /*if (productPrice?.shop!==shopTypeName) {
            priceField=null;
            productPrice=null;
          }else {
            break;
          }*/
        }
      }
    }

    // In case we didn't find anything, we assume the value in parameter is the price
    if (priceField == null) {
      priceField = model;
      productPrice = productValue;
    }

    // Let's see if we already have the id of the item, then we can get the price very quickly
    const productId = this.findProductId(productPrice);
    if ((productId == null) || (productPrice == null)) {
      return Promise.reject("Product Id not found in " + productValue);
    } else {

      if (productPrice != null) {
        // First update the lastCheckDate to avoid continuously retrying to get the price in case of error
        productPrice.lastCheckDate = new Date();
        return scrapper.updatePrice({
          productId,
          productName: productPrice.nameInShop ?? null,
          productUrl: productPrice.urlInShop
        }).then(updated => {
          if ((updated != null) && (productPrice != null)) {
            productPrice.cost = AbstractOnlineShopScrapper.toMoneyAmount(updated);
            productPrice.outOfStock = updated.outOfStock;
            productPrice.priceDate=new Date();
            productPrice.inError = false;
            return productPrice;
          }
          return null;
        }).catch(reason => {
          console.error("Cannot update price for " + productPrice?.nameInShop + " because of ", reason);
          if (productPrice!=null)
            productPrice.inError=true;
          throw reason;
        });
      } else {
        return Promise.reject("Impossible to be there...");
      }
    }
  }

  protected findProductId (info:any):string|null {
      // Try to find if we have a list of shop per product
    if (info?.idInShop!=null) {
      return info?.idInShop;
    } else {
      if (info?.productId!=null)
        return info?.productId;
      else if (info?.id!=null) {
        return info?.id;
      }
    }
    return null;
  }

  protected findProductName (info:any):string|null {
    // Try to find if we have a list of shop per product
    if (info?.nameInShop!=null) {
      return info?.nameInShop;
    } else {
      if (info?.productName!=null)
        return info?.productName;
      else if (info?.name!=null) {
        return info?.name;
      }
    }
    return null;
  }

  async updatePriceIfPossible(val: PriceModel, position:string):Promise<PriceModel|null> {
    if( (val.idInShop!=null)&& (val.shop!=null)) {
      if( typeof val.lastCheckDate === 'string') {
        val.lastCheckDate= new Date(val.lastCheckDate);
      }
      if ((val.lastCheckDate==null) ||
          (val.lastCheckDate.getTime()+PriceFinderService.DONT_UPDATE_UNTIL_DELAY_MS < new Date().getTime())
      ) {
        // Yes we can update
        //console.debug("Need to update price for ", val.nameInShop);
        const newPrice = await this.findPrice(val, val.shop, position);

        if( newPrice!=null)
          newPrice.priceDate=new Date();
        return newPrice;
      }
    }
    return null;

  }

  private getShopTypeNameOf(shopName: string):Promise<string> {
    const query="$.creation.entities[?(@.name=='"+CommercePlugin.SHOP_ENTITY_NAME+"')]";
    const targetEntitiesPos = this.modelMgr.queryModelToSingle(query)?.pointer;

    if (targetEntitiesPos==null)  return Promise.resolve(shopName);

    return firstValueFrom(this.storeMgr.searchEntities(targetEntitiesPos, {
      name:'Shop',
      value:shopName,
      operator:DontCodeStoreCriteriaOperator.EQUALS
    })).then((loaded) => {
      if (loaded?.length!=1) return shopName;
      if( (loaded[0] as any).Type!=null)
        return (loaded[0] as any).Type;
      else
        return shopName;
    });
  }
}
