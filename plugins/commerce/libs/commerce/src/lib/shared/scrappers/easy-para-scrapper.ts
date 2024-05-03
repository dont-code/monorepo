import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class EasyParaScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://jhu6zvksfy-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia+for+JavaScript+%283.35.1%29%3B+Browser%3B+Magento2+integration+%283.6.0%29%3B+autocomplete.js+0.38.0&x-algolia-application-id=JHU6ZVKSFY&x-algolia-api-key=YTYyYzkyNzgyZDliZTZlMDk1OGE1MDQwNjRkYWY1ZmY4ZTE5OWZhYmU4ZGUyNTM2NDFjNmU4YjllNWMwNmJmNXRhZ0ZpbHRlcnM9\n"

  protected static JSON_QUERY=
    {"requests":[{"indexName":"prod_magento2_fr_products","params":"query=QUERY_STRING&hitsPerPage=6&analyticsTags=autocomplete&clickAnalytics=true&facets=%5B%22categories.level0%22%5D&numericFilters=visibility_search%3D1&ruleContexts=%5B%22magento_filters%22%2C%22%22%5D"},{"indexName":"prod_magento2_fr_section_manufacturer","params":"query=chardon%20marie&hitsPerPage=6&analyticsTags=autocomplete&clickAnalytics=true"},{"indexName":"prod_magento2_fr_categories","params":"query=chardon%20marie&hitsPerPage=4&analyticsTags=autocomplete&clickAnalytics=true&numericFilters=include_in_menu%3D1"}]}

  override onlineShopName="EasyParapharmacie";


  constructor(http: HttpClient) {
    super(http);
  }

 override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(EasyParaScrapper.JSON_QUERY);

    postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST", EasyParaScrapper.SEARCH_ONLINE_URL,
      ProxyEngine.CORSPROXY_IO,
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

                newProduct.productPrice=aResult.price.EUR.default;
                newProduct.currencyCode="EUR";
                newProduct.productName=aResult.name;
                newProduct.productDescription=aResult.short_description??aResult.description;
                newProduct.productId=aResult.ean_code?.toString();
                if (newProduct.productId==null) {
                  console.warn("Product "+newProduct.productName+" searched by "+nameOrId+" for Shop "+this.getOnlineShopName()+" has no ean_code, getting objectId instead");
                  newProduct.productId=aResult.objectID;
                }
                newProduct.productUrl=aResult.url;
                newProduct.productImageUrl=aResult.image_url;

                this.checkScrappedProduct(nameOrId, newProduct);
                ret.push(newProduct);
              }
            }
          }

          return ret;
        });
  }

}
