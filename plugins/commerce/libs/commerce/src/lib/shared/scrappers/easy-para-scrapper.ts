import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class EasyParaScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://jhu6zvksfy-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia+for+JavaScript+%284.14.3%29%3B+Browser%3B+Magento2+integration+%283.13.0%29%3B+autocomplete-core+%281.7.1%29%3B+autocomplete-js+%281.7.1%29"

  protected static JSON_QUERY=
  {"requests":[{"indexName":"prod_magento2_fr_suggestions","query":"QUERY_STRING","params":"hitsPerPage=5&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__&clickAnalytics=true"},{"query":"QUERY_STRING","indexName":"prod_magento2_fr_products","params":"hitsPerPage=6&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__&analyticsTags=autocomplete&clickAnalytics=true&distinct=true&facets=%5B%22categories.level0%22%5D&numericFilters=visibility_search%3D1&ruleContexts=%5B%22magento_filters%22%2C%22%22%5D"},{"query":"QUERY_STRING","indexName":"prod_magento2_fr_section_manufacturer","params":"hitsPerPage=6&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__&analyticsTags=autocomplete&clickAnalytics=true&distinct=true"},{"query":"QUERY_STRING","indexName":"prod_magento2_fr_categories","params":"hitsPerPage=4&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__&analyticsTags=autocomplete&clickAnalytics=true&distinct=true&numericFilters=include_in_menu%3D1"}]}

  override onlineShopName="EasyParapharmacie";


  constructor(http: HttpClient) {
    super(http);
  }

 override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(EasyParaScrapper.JSON_QUERY);

    for (let i=1;i<4;i++) {
     postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    }
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST", EasyParaScrapper.SEARCH_ONLINE_URL,
      ProxyEngine.DONT_CODE,
    {body:postContent, responseType:"json", observe:"body", headers: {
      "x-algolia-api-key":"YTYyYzkyNzgyZDliZTZlMDk1OGE1MDQwNjRkYWY1ZmY4ZTE5OWZhYmU4ZGUyNTM2NDFjNmU4YjllNWMwNmJmNXRhZ0ZpbHRlcnM9",
      "x-algolia-application-id":"JHU6ZVKSFY"
    }})
      .then(jsonResult => {
          if( typeof jsonResult == "string")
            jsonResult = JSON.parse(jsonResult);

          const ret= new Array<ScrappedProduct>();
          const result=(jsonResult as any).results as Array<any>;
          if (result.length>0) {
            const hits=result[1].hits as Array<any>;
            if( hits!=null) {
              for (const aResult of hits) {
                const newProduct = new ScrappedProduct();

                newProduct.productPrice=aResult.price.EUR.default;
                newProduct.currencyCode="EUR";
                newProduct.productName=aResult.name;
                newProduct.productDescription=aResult.short_description??aResult.description;
                newProduct.productId=aResult.ean_code?.toString();
                if ((newProduct.productId==null) || (newProduct.productId.length==0)) {
                  console.warn("Product "+newProduct.productName+" searched by "+nameOrId+" for Shop "+this.getOnlineShopName()+" has no ean_code, getting objectId instead");
                  newProduct.productId=aResult.objectID;
                }
                newProduct.productUrl=aResult.url;
                newProduct.productImageUrl=aResult.image_url;
                newProduct.outOfStock=(aResult.in_stock>=1);

                this.checkScrappedProduct(nameOrId, newProduct);
                ret.push(newProduct);
              }
            }
          }

          return ret;
        });
  }

}
