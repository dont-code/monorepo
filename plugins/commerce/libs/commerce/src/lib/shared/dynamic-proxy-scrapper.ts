import {HttpClient, HttpResponse} from "@angular/common/http";
import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "./online-shop-scrapper";

export class DynamicProxyScrapper extends AbstractOnlineShopScrapper{
  constructor(http: HttpClient) {
    super(http);
  }
  searchProductsForNameOrId(nameOrId: string, isId: boolean): Promise<Array<ScrappedProduct>> {
    return Promise.reject("Not implemented");
  }

  async callUrlWithProxy (url:string, engine:ProxyEngine|string): Promise<HttpResponse<string>> {
    const proxyEngine= (typeof engine === 'string' )?engine as ProxyEngine:engine as ProxyEngine;

    return await this.requestWithProxy("GET", url, proxyEngine, {observe: 'response', responseType:'text'});
  }

}
