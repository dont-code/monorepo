import {MoneyAmount} from "@dontcode/core";
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";


/**
 * The description of a product in an online shop
 */
export class ScrappedProduct {
  productId?: string;
  productName: string|null=null;
  productDescription?: string;
  productUrl?: string;
  productImageUrl?: string;
  productPrice?: number;
  currencyCode?: string;
  outOfStock?:boolean = false;
  marketPlace?:boolean;

}

/**
 * Defines the method an OnlineShopScrapper must support
 */
export interface OnlineShopScrapper {

  getOnlineShopName ():string;
  /**
   * Given a name returns all products that the onlineshop found
   * @return empty array if no product matches the criteria, a rejected promise in case of any type of error getting the list
   * @param name
   */
  searchProductsForNameOrId (nameOrId:string, isId:boolean): Promise<Array<ScrappedProduct>>;

  /**
   * Retrieve the price of the given product.
   * @return null if product is not found, throw an error if scrapping went wrong for any reason
   * @param productId
   */
  updatePrice (product: ScrappedProduct, useProductName?:boolean): Promise<ScrappedProduct|null>;

}

export abstract class AbstractOnlineShopScrapper implements OnlineShopScrapper {

  public static readonly CORS_PROXY_URL='https://corsproxy.io/?';
  public static readonly CORS_PROXY_ORG_URL='https://corsproxy.org/?';

  public static readonly WEBSCRAPING_PROXY_URL='https://api.webscraping.ai/html';
  public static readonly WEBSCRAPING_PROXY_API_KEY='f4fe0d0b-bfa9-49bd-a3f7-404be7bcad85';

  //public static readonly CORS_DONTCODE_PROXY_URL='http://localhost:3000/proxy/debug';
  public static readonly CORS_DONTCODE_PROXY_URL='https://shared.collin.best/proxy/debug';
  //public static readonly CORS_DONTCODE_PROXY_URL='https://yolo.test/proxy/debug';

  protected onlineShopName="Unknown";

  /**
   * Helper method to convert a scrappedProduct to a MoneyAmount.
   * @param scrappedProduct
   */
  static toMoneyAmount(scrappedProduct: ScrappedProduct):MoneyAmount {
    const ret = new MoneyAmount();
    ret.amount=scrappedProduct.productPrice;
    ret.currencyCode=scrappedProduct.currencyCode;
    return ret;
  }

  constructor(protected http:HttpClient) {
  }

  getOnlineShopName(): string {
    return this.onlineShopName;
  }

  getShopTypeName (): string {
    return this.onlineShopName;
  }

  protected requestWithProxy<T extends {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    reportProgress?: boolean;
    observe: 'body'|'response';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    responseType?: 'text' | 'json';
    withCredentials?: boolean;
  }> (method:string, url:string, engine:ProxyEngine, options: T): Promise<any>
  {
    return firstValueFrom(this.http.request(method,
      this.encodeUrlForCors(url, engine),
      this.updateOptionsForCors(method, url, engine, options))
    ).catch ( (reason) => {
      return Promise.reject ({
        url: url,
        engine: engine,
        error: reason
      })
    });
  }

  /**
   * Avoid Cors issue by running the url through a Cors manager proxy
   * @param url the non uri encoded url to reach. Urlencoding will be done by the function
   */
  protected encodeUrlForCors(url:string, engine:ProxyEngine):string {
    let ret = url;
    switch (engine) {
      case ProxyEngine.CORSPROXY_IO:
        ret = AbstractOnlineShopScrapper.CORS_PROXY_URL + encodeURIComponent(url);
        break;
      case ProxyEngine.CORSPROXY_ORG:
        ret = AbstractOnlineShopScrapper.CORS_PROXY_ORG_URL + encodeURIComponent(url);
        break;
      case ProxyEngine.CHROME_ENGINE:
      case ProxyEngine.DONT_CODE:
        ret = AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL;
        break;
      case ProxyEngine.WEBSCRAPING_IA:
        ret = AbstractOnlineShopScrapper.WEBSCRAPING_PROXY_URL
        break;
    }
    return ret;
  }

  /**
   * Adapts the http options for the proxy...
   * @param url
   * @param engine
   * @param httpOptions
   * @protected
   */
protected updateOptionsForCors<T extends {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    reportProgress?: boolean;
    observe: 'body'|'response';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    responseType?: 'text' | 'json';
    withCredentials?: boolean;
  }> (method:string, url:string, engine:ProxyEngine, options: T): T
  {
    switch (engine) {
      case ProxyEngine.CORSPROXY_IO:
        options.withCredentials=false;
        break;
      case ProxyEngine.CORSPROXY_ORG:
        options.withCredentials=false;
        break;
      case ProxyEngine.CHROME_ENGINE:
      case ProxyEngine.DONT_CODE:
        this.addToHttpParams (options, {
          url: encodeURIComponent(url)
          }
        );
        if (engine === ProxyEngine.CHROME_ENGINE) {
          this.addToHttpParams(options, {
            engine: 'chrome'
            }
          );
        }
      break;
      case ProxyEngine.WEBSCRAPING_IA:
        this.addToHttpParams (options, {
          proxy:'datacenter',
          js:false,
          api_key:AbstractOnlineShopScrapper.WEBSCRAPING_PROXY_API_KEY,
          url:url
          }
        );
      break;
    }
    return options;
  }

  abstract searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>>;

  /**
   * By default we do a search with the productId and returns the price
   * @param prod
   * @param useProductName
   */
  updatePrice(prod: ScrappedProduct, useProductName?:boolean): Promise<ScrappedProduct|null> {
    let productToFind = prod.productId;
    if( useProductName==null) useProductName=false;

    if (useProductName||(productToFind==null)) {
      productToFind=prod.productName??undefined;
      useProductName=true;
    }
    if (productToFind==null) {
      return Promise.reject("You must define a product with a name or id ");
    } else {
      return this.searchProductsForNameOrId(productToFind, !useProductName).then(listOfAllElements => {
        for (const product of listOfAllElements) {
          if (product.productId == prod.productId) {
            return product;
          }
        }

        return null;
      }).then (value => {
          // Let's try a seach with the name if possible
        if( (value == null)&&(!useProductName)&& (prod.productName!=null)) {
          return this.searchProductsForNameOrId(prod.productName, false).then(listOfAllElements => {
            for (const product of listOfAllElements) {
              if (product.productId == prod.productId) {
                return product;
              }
            }

            return Promise.reject("Product " + productToFind + " not found in shoptype " + this.onlineShopName);
          });
        }
        if( value!=null)
          return value;
        else {
          return Promise.reject("Product " + productToFind + " not found in shoptype " + this.onlineShopName);
        }
      });
    }
  }

  /**
   * Generates standard headers as a browser would do
   * @protected
   */
  protected standardHeaders (): HttpHeaders {
    const ret= new HttpHeaders ({
      //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      /*'Accept-Encoding': 'gzip, deflate, br',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'*/
    });

    return ret;
  }

  /**
   * Throws an exception if the product scrapped is incorrect
   * @param product
   */
  checkScrappedProduct (productSearch:string, product:ScrappedProduct): void {
    if ((product.productId==null)||(product.productId.length==0)) {
      throw new Error ("No Product Id scrapped by shop "+this.getOnlineShopName()+" for product search "+productSearch);
    }
    if ((product.productName==null)||(product.productName.length==0)) {
      throw new Error ("No Product Name scrapped by shop "+this.getOnlineShopName()+" for product search "+productSearch);
    }
    if (((product.productPrice==null)||(isNaN(product.productPrice))) && (product.outOfStock!=true)) {
      throw new Error ("Incorrect Product Price "+product.productPrice+" scrapped by shop "+this.getOnlineShopName()+" for product search "+productSearch);
    }
  }

  /**
   * Throw an exception if the itemPos is -1 (not found) or after the next product position
   * @param itemPos
   * @param nextStartPos
   * @private
   */
  protected checkStringPosition(itemPos: number, limitPos: number) {
    if ((itemPos==-1)||((limitPos!=-1)&&(itemPos>limitPos)) ) {
      throw new Error ("Error decoding product for Scrapper "+ this.getOnlineShopName());
    }
  }

  protected indexOf(htmlResult: string, toFind: string, startPos: number, limitPos?:number, endIndex:boolean=true): number {
    const result=htmlResult.indexOf(toFind, startPos);
    if( result==-1)
      return result;
    else if ((limitPos!=null) && (limitPos!=-1) && (result>limitPos))
      return -1;

    if (endIndex)
      return result+toFind.length;
    else
      return result;

  }

  protected safeIndexOf(htmlResult: string, toFind: string, startPos: number, limitPos?:number, endIndex:boolean=true): number {
    const result=htmlResult.indexOf(toFind, startPos);
    if( result==-1)
      throw new Error("Cannot find "+toFind+" for "+this.getOnlineShopName());
    else if ((limitPos!=null) && (limitPos!=-1) && (result>limitPos))
      throw new Error ("The product content does not contains "+toFind+' for '+this.getOnlineShopName());

    if (endIndex)
      return result+toFind.length;
    else
      return result;
  }

  protected addToHttpParams (options:{
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }, toAdd: {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  }):void
  {
    if (options.params==null) {
      options.params=toAdd;
    } else {
      if (options.params.appendAll!=null) {
        options.params = (options.params as HttpParams).appendAll(toAdd);
      } else {
        options.params = {...options.params, ...toAdd};
      }
    }
  }
}

export enum ProxyEngine {
  CORSPROXY_IO= "CORSPROXY.IO",
  CORSPROXY_ORG= "CORSPROXY.ORG",
  WEBSCRAPING_IA="WEBSCRAPING.IA",
  DONT_CODE="DONT-CODE.PROXY",
  CHROME_ENGINE= "DONT-CODE.CHROME",
}
