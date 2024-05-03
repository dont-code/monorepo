import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {HttpClient} from "@angular/common/http";

export class BoulangerScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://www.boulanger.com/resultats?tr=QUERY_STRING"
  protected static readonly PRODUCT_START_STRING="<article";

  protected static readonly BASE_URL='https://www.boulanger.com'

  override onlineShopName="Boulanger";

  constructor(httpClient:HttpClient) {
    super(httpClient);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
    // remove accents
    nameOrId = nameOrId.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    const query = BoulangerScrapper.SEARCH_ONLINE_URL.replace("QUERY_STRING", nameOrId);

    // Let's first try with the free CorsProxy, and only if it doesn't work then we'll use the non-free Webscraping
    return this.requestWithProxy("GET", query, ProxyEngine.CORSPROXY_IO, {observe: 'body', responseType: 'text'})
      .then(htmlResult => {
        return this.analysePageResult(nameOrId, htmlResult);
      }).catch(reason => {
        if ((reason.code==null) || (reason.statusText==='Unknown Error'))  // Cors error due to a redirect
        {
          return this.requestWithProxy("GET", query, ProxyEngine.WEBSCRAPING_IA, {observe: 'body', responseType: 'text'})
            .then(htmlResult => {
              return this.analysePageResult(nameOrId, htmlResult)
            });
        }else {
          return reason;
        }
      });
  }

  analysePageResult (nameOrId:string, htmlResult:string): Array<ScrappedProduct> {
    const ret= new Array<ScrappedProduct>();
    let startPos = htmlResult.indexOf(BoulangerScrapper.PRODUCT_START_STRING);
    while (startPos >= 0) {
      const newProduct = new ScrappedProduct();
      let itemPos = htmlResult.indexOf('href="', startPos) + 6;
      newProduct.productUrl = BoulangerScrapper.BASE_URL + htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos + 1));
      itemPos = htmlResult.indexOf('data-product-label="', startPos) + 20;
      newProduct.productName = htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos + 1));
      newProduct.productDescription = undefined;
      itemPos = htmlResult.indexOf('<img src="', startPos + 1) + 10;
      newProduct.productImageUrl = htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos + 1));
      itemPos = htmlResult.indexOf('data-product-id="', startPos) + 17;
      newProduct.productId = htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos + 1));

      this.extractPrice(htmlResult, startPos, newProduct);
      this.checkScrappedProduct(nameOrId, newProduct);
      ret.push(newProduct);

      startPos = htmlResult.indexOf(BoulangerScrapper.PRODUCT_START_STRING, startPos + 1);
    }

    return ret;

  }

  extractPrice (htmlResult:string, startPos:number, newProduct:ScrappedProduct): void {
      const itemPos = htmlResult.indexOf('data-analytics_product_unitprice_ati="', startPos)+38;
      const price = Number.parseFloat(htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1)));

      newProduct.productPrice=price;
      newProduct.currencyCode="EUR"

  }


}
