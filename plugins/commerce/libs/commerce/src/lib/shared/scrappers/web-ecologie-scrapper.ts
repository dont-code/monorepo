import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class WebEcologieScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://www.webecologie.com/rechercher?search_query=QUERY_STRING"
  protected static readonly PRODUCT_START_STRING="<a class=\"product_img_link\"";

  override onlineShopName="WebEcologie";


  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
    const query = WebEcologieScrapper.SEARCH_ONLINE_URL.replace("QUERY_STRING", encodeURIComponent(nameOrId));

    return this.requestWithProxy("GET", query, ProxyEngine.DONT_CODE
    ,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"})
      .then(htmlResult => {

          const ret= new Array<ScrappedProduct>();
          let startPos = htmlResult.indexOf(WebEcologieScrapper.PRODUCT_START_STRING);
          while (startPos>=0) {
            const newProduct = new ScrappedProduct();
            let itemPos = htmlResult.indexOf('href="', startPos)+6;
            newProduct.productUrl=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            itemPos = htmlResult.indexOf('title="', startPos)+7;
            newProduct.productName=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            newProduct.productDescription=undefined;
            itemPos = htmlResult.indexOf('src="', startPos+1)+5;
            newProduct.productImageUrl=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            const startWishlistPos = htmlResult.indexOf('<a class="addToWishlist', startPos)+23;
            itemPos = htmlResult.indexOf('rel="', startWishlistPos)+5;
            newProduct.productId=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));

            this.extractPrice(htmlResult, startPos, newProduct);
            this.checkScrappedProduct(nameOrId, newProduct);
            ret.push(newProduct);

            startPos = htmlResult.indexOf(WebEcologieScrapper.PRODUCT_START_STRING, startPos+1);
          }

          return ret;
        });
  }

  extractPrice (htmlResult:string, startPos:number, newProduct:ScrappedProduct): void {
      let itemPos = htmlResult.indexOf('class="price-first-part">', startPos)+25;
      let price = Number.parseInt(htmlResult.substring(itemPos, htmlResult.indexOf('<', itemPos+1)));

      itemPos = htmlResult.indexOf('class="price-last-part">', startPos)+24;
      price = price + Number.parseInt(htmlResult.substring(itemPos, htmlResult.indexOf('<', itemPos+1)))/100;
      newProduct.productPrice=price;

      itemPos = htmlResult.indexOf("itemprop=\"priceCurrency\"", startPos)+24;
      itemPos = htmlResult.indexOf("content=\"", itemPos)+9;
      newProduct.currencyCode=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));

  }

  /**
   * We have to go directly to the product page, otherwise there may be a redirect
   * @param product
   */
  override updatePrice(product:ScrappedProduct, useProductName?:boolean): Promise<ScrappedProduct|null> {
    if (product.productUrl==null) {
      return super.updatePrice(product, true);  // If the product url is not found, let's try with the product name
    }
    return this.requestWithProxy("GET", product.productUrl,ProxyEngine.DONT_CODE
      ,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"})
      .then(htmlResult => {
        const newProduct:ScrappedProduct = {productId:product.productId,
          productName:product.productName};
          this.extractPrice(htmlResult, 0, newProduct);
          this.checkScrappedProduct(product.productName??"Unknown", newProduct);
          product.productPrice=newProduct.productPrice;
          product.currencyCode=newProduct.currencyCode;
          return product;
      }).catch(error => {
      console.error("Error trying to access page for product "+product.productName, error);
      return super.updatePrice(product, true);
    });

  }
}
