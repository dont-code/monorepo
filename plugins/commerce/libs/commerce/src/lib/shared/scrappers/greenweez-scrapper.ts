import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class GreenWeezScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://54m7x8foua-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (4.14.2); Browser (lite); instantsearch.js (4.48.0); react (17.0.2); react-instantsearch (6.36.0); react-instantsearch-hooks (6.36.0); JS Helper (3.11.1)&x-algolia-api-key=52441d0a775f924291679b7c224d6782&x-algolia-application-id=54M7X8FOUA"
  static readonly BASE_URL="https://greenweez.com";

  protected static JSON_QUERY=
    {
      "requests": [{
        "indexName": "france_prod_offers_genepi_fr_FR",
        "params": "attributesToRetrieve=%5B%22main_category%22%2C%22attributes%22%2C%22capacity%22%2C%22discount.percent%22%2C%22flags%22%2C%22ObjectID%22%2C%22name%22%2C%22options.color.available_colors%22%2C%22seller%22%2C%22shop_data.id%22%2C%22shop_data.variant.images%22%2C%22shop_data.variant.product.id%22%2C%22shop_data.variant.product.legacyId%22%2C%22shop_data.variant.product.slug%22%2C%22shop_data.variant.product.brand.name%22%2C%22shop_data.variant.code%22%2C%22shop_data.sellerCatalog.seller%22%2C%22shop_data.pricing%22%2C%22shop_data.offerData%22%2C%22shop_data.onHand%22%2C%22stats%22%5D&clickAnalytics=true&facets=%5B%5D&filters=has_parent_objectID%3D0&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=20&query=QUERY_STRING&tagFilters="
      }, {
        "indexName": "france_prod_brands_genepi_fr_FR",
        "params": "attributesToRetrieve=%5B%22name%22%2C%22slug%22%5D&clickAnalytics=true&facets=%5B%5D&filters=&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=6&query=QUERY_STRING&tagFilters="
      }, {
        "indexName": "france_prod_categories_genepi_fr_FR",
        "params": "attributesToRetrieve=%5B%22parent%22%2C%22name%22%2C%22slug%22%2C%22level%22%5D&clickAnalytics=true&facets=%5B%5D&filters=&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=6&query=QUERY_STRING&tagFilters="
      }]
    }

  override onlineShopName="GreenWeez";

  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(GreenWeezScrapper.JSON_QUERY);

      // 3 replacements to do
    postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST",GreenWeezScrapper.SEARCH_ONLINE_URL, ProxyEngine.DONT_CODE,
    {body:postContent, responseType:"json", observe:"body"})
      .then(jsonResult => {
          if( typeof jsonResult == "string")
            jsonResult = JSON.parse(jsonResult);

          const ret= new Array<ScrappedProduct>();
          const result=(jsonResult as any).results as Array<any>;
          if (result.length>0) {
            const hits=result[0].hits as Array<any>;
            if( hits!=null) {
              for (const aResult of hits) {
                const newProduct = new ScrappedProduct();

                newProduct.productPrice=aResult.shop_data.pricing.priceIncludedVat/100;
                newProduct.currencyCode="EUR";
                newProduct.productName=aResult.name;
                newProduct.productDescription=undefined;
                newProduct.productId=aResult.shop_data.variant.code;
                newProduct.productUrl= this.calculateProductUrl (aResult.shop_data);
                newProduct.productImageUrl=this.findImageUrl (aResult.shop_data.variant.images);
                newProduct.marketPlace=aResult.flags.marketPlace===true;

                this.checkScrappedProduct(nameOrId, newProduct);
                ret.push(newProduct);
              }
            }
          }

          return ret;
        });
  }

  calculateProductUrl (shopData:any): string {
    return GreenWeezScrapper.BASE_URL+'/produit/'+shopData.variant.product.slug+'/'+shopData.variant.code+'/'+shopData.id;
  }

  findImageUrl (images:Array<any>): string|undefined {
    for (const image of images) {
      if (image.type=="variant")
        return GreenWeezScrapper.BASE_URL+"/_next/image?url=https%3A%2F%2Fcdn.greenweez.com%2Fproducts%2F"+image.path+"&w=640&q=75"
    }
    return;
  }
}
