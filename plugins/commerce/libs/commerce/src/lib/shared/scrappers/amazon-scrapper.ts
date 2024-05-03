import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {HttpClient} from "@angular/common/http";

export class AmazonScrapper extends AbstractOnlineShopScrapper {

  //static readonly SEARCH_ONLINE_URL="https://www.amazon.fr/s?__mk_fr_FR=C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1KL4W8UW3UJH4&i=aps&field-keywords=QUERY_STRING&ref=nb_sb_noss_2&url=search-alias=aps";
  static readonly SEARCH_ONLINE_URL = "https://www.amazon.fr/s?k=QUERY_STRING";
  protected static readonly PRODUCT_START_STRING='<div data-asin="';

  protected static readonly BASE_URL='https://www.amazon.fr'

  override onlineShopName="Amazon";


  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
    // remove accents
    const query = AmazonScrapper.SEARCH_ONLINE_URL.replace("QUERY_STRING", encodeURIComponent(nameOrId));

    return this.requestWithProxy("GET", query, ProxyEngine.DONT_CODE,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"})
      .catch(reason => {
        console.error('Error getting amazon price with DontCode Proxy', reason);
        if ((reason.status!=null) && (reason.status>=500)) {
          return this.requestWithProxy("GET", query, ProxyEngine.CORSPROXY_IO,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"});
        } else {
          return Promise.reject(reason);
        }
      }).catch (reason => {
        console.error('Error getting amazon price with CorsProxyIO', reason);
        if ((reason.status!=null) && (reason.status>=500)) {
          return this.requestWithProxy("GET", query, ProxyEngine.WEBSCRAPING_IA,{headers:{Accept:'text/html'}, responseType:"text", observe:"body"});
        } else {
          return Promise.reject(reason);
        }
      })
      .then (completeHtml => {

          const ret= new Array<ScrappedProduct>();
          let startPos = completeHtml.indexOf(AmazonScrapper.PRODUCT_START_STRING);
          while (startPos>=0) {
            const endPos=completeHtml.indexOf(AmazonScrapper.PRODUCT_START_STRING, startPos+1);
              // Just extract the product bits
            const htmlResult=completeHtml.substring(startPos, endPos);

            const newProduct = new ScrappedProduct();
            const middlePos = htmlResult.indexOf('data-component-type="s-product-image"');
            let itemPos = htmlResult.indexOf('data-asin="')+11;
            if( (htmlResult.charAt(itemPos)=='"') || (middlePos==-1)) {
              startPos = completeHtml.indexOf(AmazonScrapper.PRODUCT_START_STRING, startPos+1);
              continue; // Ignore the non products
            }
            newProduct.productId=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            itemPos = htmlResult.indexOf('href="', middlePos)+6;
            let url=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            if (url.startsWith('/sspa/click'))  // It'href="/sspas a sponsored link
            {
              const urlPos=url.indexOf('url=')+4;
              url = url.substring(urlPos);
              url = url.replace(/%2F/g, '/');
            }

            newProduct.productUrl=AmazonScrapper.BASE_URL+url;
            itemPos = htmlResult.indexOf('src="', middlePos+1)+5;
            newProduct.productImageUrl=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));
            itemPos = htmlResult.indexOf('a-text-normal">', middlePos)+15;
            newProduct.productDescription=htmlResult.substring(itemPos, htmlResult.indexOf('<', itemPos+1));
            if( (newProduct.productDescription!=null) && (newProduct.productDescription?.length>60)) {
              newProduct.productName=newProduct.productDescription.substring(0,60);
            } else {
              newProduct.productName=newProduct.productDescription||null;
            }
            itemPos = htmlResult.indexOf('data-asin="')+11;
            newProduct.productId=htmlResult.substring(itemPos, htmlResult.indexOf('"', itemPos+1));

            this.extractPrice(htmlResult, middlePos, newProduct);
            this.checkScrappedProduct(nameOrId, newProduct);
            ret.push(newProduct);

            startPos = htmlResult.indexOf(AmazonScrapper.PRODUCT_START_STRING, startPos+1);
          }

          return ret;
        });
  }

  extractPrice (htmlResult:string, startPos:number, newProduct:ScrappedProduct): void {
      const itemPos = htmlResult.indexOf('<span class="a-price-whole">', startPos)+28;

      let price = htmlResult.substring(itemPos, htmlResult.indexOf('</span>', itemPos+1));
      price = price.replace(',','.');
      newProduct.productPrice=Number.parseFloat(price);
      newProduct.currencyCode="EUR"

  }

}
