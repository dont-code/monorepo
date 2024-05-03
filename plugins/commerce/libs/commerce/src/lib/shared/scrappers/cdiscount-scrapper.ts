import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {firstValueFrom, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class CDiscountScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://www.cdiscount.com/search/10/QUERY_STRING.html";
  protected static readonly PRODUCT_START_STRING='<li data-sku="';

  protected static readonly BASE_URL='https://www.cdiscount.com'

  override onlineShopName="CDiscount";

  constructor(httpClient:HttpClient) {
    super(httpClient);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
    // remove accents
/*    const words=nameOrId.split(" ");
    let encodedName = "";
    for (const word of words) {
      encodedName+=encodeURIComponent(word)+"+";
    }
    if( words.length>=1) {
      // Remove the last +
      encodedName=encodedName.substring(0, encodedName.length-1);
    }*/
    const query = CDiscountScrapper.SEARCH_ONLINE_URL.replace("QUERY_STRING", encodeURIComponent(nameOrId));

    return this.requestWithProxy("GET", query, ProxyEngine.CORSPROXY_ORG,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"})
      .then(htmlResult => {

          const ret= new Array<ScrappedProduct>();
          let startPos = htmlResult.indexOf(CDiscountScrapper.PRODUCT_START_STRING);
          // We ignore the first one as its the template
          startPos = htmlResult.indexOf(CDiscountScrapper.PRODUCT_START_STRING, startPos+1);

          while (startPos>=0) {
            const nextStartPos =htmlResult.indexOf(CDiscountScrapper.PRODUCT_START_STRING, startPos+1);
            const newProduct = new ScrappedProduct();
            let itemPos = this.safeIndexOf(htmlResult,'href="', startPos, nextStartPos);
            newProduct.productUrl=htmlResult.substring(itemPos, this.safeIndexOf(htmlResult, '"', itemPos+1, nextStartPos,false));
            itemPos = this.indexOf(htmlResult,'<h2 class="prdtTit">', startPos, nextStartPos);
            if (itemPos==-1) {
              // style is different in product page
              itemPos = this.indexOf(htmlResult,'<h2 class="prdtBILTit">', startPos, nextStartPos);
            }
            newProduct.productName=htmlResult.substring(itemPos, this.safeIndexOf(htmlResult,'</h2>', itemPos+1, nextStartPos,false));
            newProduct.productDescription=undefined;
            itemPos = this.safeIndexOf(htmlResult, 'src="', startPos+1, nextStartPos);
            newProduct.productImageUrl=htmlResult.substring(itemPos, this.safeIndexOf(htmlResult, '"', itemPos+1, nextStartPos,false));
            itemPos = this.safeIndexOf(htmlResult, 'data-productid="', startPos, nextStartPos);
            newProduct.productId=htmlResult.substring(itemPos, this.safeIndexOf(htmlResult, '"', itemPos+1, nextStartPos, false));

            this.extractPrice(htmlResult, startPos, nextStartPos, newProduct);
            this.checkScrappedProduct(nameOrId, newProduct);
            ret.push(newProduct);

            startPos = htmlResult.indexOf(CDiscountScrapper.PRODUCT_START_STRING, startPos+1);
          }

          return ret;
        });
  }

  extractPrice (htmlResult:string, startPos:number, nextStartPos:number, newProduct:ScrappedProduct): void {
      let itemPos = this.indexOf(htmlResult,'<span class="price priceColor hideFromPro">', startPos, nextStartPos);
    if (itemPos!=-1) {
      const commaPos = this.safeIndexOf(htmlResult, ',', itemPos + 1, nextStartPos, false);
      const price = Number.parseInt(htmlResult.substring(itemPos, commaPos));
      const cents = Number.parseInt(htmlResult.substring(
        commaPos + 1,
        this.safeIndexOf(htmlResult, '&euro;', commaPos + 1, nextStartPos, false)));

      newProduct.productPrice = price + cents / 100;
    } else {
      itemPos = this.safeIndexOf(htmlResult,'<span class="hideFromPro priceColor price">', startPos, nextStartPos);
      const price = Number.parseInt(htmlResult.substring(itemPos, this.safeIndexOf(htmlResult,'<sup>', itemPos+1, nextStartPos,false)));
      const cents = Number.parseInt(htmlResult.substring(this.safeIndexOf(htmlResult,'</sup>', itemPos+1, nextStartPos, false)-2
        ,this.safeIndexOf(htmlResult,'</sup>', itemPos+1, nextStartPos,false) ));
      newProduct.productPrice = price + cents / 100;

    }
    newProduct.currencyCode = "EUR"
  }

}
