import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {HttpClient} from "@angular/common/http";

export class DartyScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://z0ypi1plpq-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia+for+JavaScript+%284.17.0%29%3B+Browser";
/**
static readonly SEARCH_ONLINE_URL="https://www.darty.com/nav/recherche/QUERY_STRING.html"
  protected static readonly PRODUCT_START_STRING="<div class=\"product_detail";
*/
  protected static JSON_QUERY= {
  "requests": [{
    "indexName": "darty_prod_es6",
    "query": "QUERY_STRING",
    "params": "hitsPerPage=4&tagFilters=%5B%22dcom%22%5D"
  }, {
    "indexName": "darty_prod_es6_query_suggestions",
    "query": "QUERY_STRING",
    "params": "hitsPerPage=5"}]
};

  protected static readonly BASE_URL='https://www.darty.com'
  protected static readonly BASE_IMAGE_URL='https://image.darty.com/darty?type=image&source=IMAGE_URL&width=120&heigth=180&quality=80'

  override onlineShopName="Darty";
  private httpHeaders= {
    "x-algolia-api-key":"740b60dee22b6ca679462288f6cd9c7b",
    "x-algolia-application-id":"Z0YPI1PLPQ"
  };


  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
    let postContent=JSON.stringify(DartyScrapper.JSON_QUERY);

    postContent = postContent.replace("QUERY_STRING", nameOrId);
    postContent = postContent.replace("QUERY_STRING", nameOrId);  // QUERY_STRING appears twice
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST",DartyScrapper.SEARCH_ONLINE_URL
      ,ProxyEngine.CORSPROXY_IO, {body: postContent,headers: this.httpHeaders,responseType:"json", observe:"body"})
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

                newProduct.productPrice=this.extractPrice (aResult);
                newProduct.currencyCode="EUR";
                newProduct.productName=aResult.reference;
                newProduct.productDescription=undefined;
                newProduct.productId=aResult.codic;
                newProduct.productUrl=DartyScrapper.BASE_URL+"/nav/codic/"+aResult.codic;
                //if( aResult.rewriteUrl==null) {
                if (aResult.pictures?.length>0)
                  newProduct.productImageUrl=DartyScrapper.BASE_IMAGE_URL.replace("IMAGE_URL", aResult.pictures[0].algoliaPict);
                //} else {
                //  newProduct.productImageUrl="https://image.darty.com/"+aResult.rewriteUrl+"_n"+aResult.pictures[0].name;
                //}

                this.checkScrappedProduct(nameOrId, newProduct);
                ret.push(newProduct);
              }
            }
          }

          return ret;
        });
  }

/**  extractPrice (htmlResult:string, startPos:number, newProduct:ScrappedProduct): void {
      const itemPos = htmlResult.indexOf('data-automation-id="product_price">', startPos)+35;
      const priceAsString = htmlResult.substring(itemPos, htmlResult.indexOf('<', itemPos+1));

      let decodedPrice = "";
      for (let car of priceAsString) {
        if (car==='0' || car==='1' || car==='2' || car==='3' || car==='4' ||
        car==='5' || car==='6' || car==='7' || car==='8' || car==='9' || car===',' || car==='.') {
          if (car===',') car = '.';
          decodedPrice+=car;
        }
      }

      newProduct.productPrice=Number.parseFloat(decodedPrice);
      newProduct.currencyCode="EUR"
  }
*/
  /**
   * We have to go directly to the product page, otherwise there may be a redirect
   * @param product
   */
  override updatePrice(product:ScrappedProduct, useProductName?:boolean): Promise<ScrappedProduct|null> {
    return super.updatePrice(product, true);  // If the product url is not found, let's try with the product name
  }


private extractPrice(response: any): number {
  if (response.priceSort!=null)
    return response.priceSort/100;
  if (response.dartyExclusivePriceSort!=null)
    return response.dartyExclusivePriceSort/100;
  let ret=0;
  for (const key in response.prices.stores) {
    if( key==='000000') {
      ret= response.prices.stores[key]/100;
    } else if ((key==='dartyExclusive') && ( ret===0)) {
    ret = response.prices.stores[key]/100;
    }else if (ret===0) {
      ret = response.prices.stores[key]/100;
    }
  }

  return ret;
}
}
