import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {HttpClient} from "@angular/common/http";

export class MaxicoffeeScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://na.search.sensefuel.live/searchf/4147d2a1-7a21-4697-8a4c-0e25183f3ce9"

  protected static JSON_QUERY = {
    "acp": {},
    "suggest": {},
    "key": "1678529428523-0-AskResult",
    "parentKey": null,
    "terms": {"expression": "QUERY_STRING", "inputSource": "keyboard", "intentDetection": {}},
    "trackFingerPrint": {"tracks": [], "environmentId": "333"},
    "items": {"from": 0, "size": 30, "bypassSpellcheck": false},
    "prefixQuery": {},
    "filters": {},
    "scopes": [],
    "spotlights": [],
    "sort": null,
    "needShortcuts": true,
    "userIds": {"id": null, "previousId": null, "custId": null, "isAuthenticated": false},
    "sellerId": "France métropolitaine",
    "kickerContents": {"size": 6},
    "contents": {"from": 0, "size": 30, "playOnIntent": ["nlu|content"]},
    "references": {"size": 32}
  };

  override onlineShopName="Maxicoffee";


  constructor(http: HttpClient) {
    super(http);
  }

 override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(MaxicoffeeScrapper.JSON_QUERY);

    postContent = postContent.replace("QUERY_STRING", nameOrId);
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST", MaxicoffeeScrapper.SEARCH_ONLINE_URL,
      ProxyEngine.CORSPROXY_IO,
    {body:postContent, responseType:"json", observe:"body"})
      .then(jsonResult => {
          if( typeof jsonResult == "string")
            jsonResult = JSON.parse(jsonResult);

          const ret= new Array<ScrappedProduct>();
          const results=(jsonResult as any).data.items.p as Array<any>;
          if (results.length>0) {
            for (const aResult of results) {
              const newProduct = new ScrappedProduct();

              newProduct.productPrice=aResult.prcn;
              newProduct.currencyCode="EUR";
              newProduct.productName=aResult.ttl;
              newProduct.productDescription=undefined;
              newProduct.productId=aResult.id;
              newProduct.productUrl=aResult.lnk;
              newProduct.productImageUrl=aResult.img;
              newProduct.outOfStock= aResult.avl === "in stock";

                this.checkScrappedProduct(nameOrId, newProduct);
              ret.push(newProduct);
            }
          }

          return ret;
        });
  }

}
