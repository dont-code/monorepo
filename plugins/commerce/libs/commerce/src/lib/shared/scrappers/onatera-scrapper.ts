import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class OnateraScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://f75bb6q2sy-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia+for+JavaScript+%284.11.0%29%3B+Browser+%28lite%29%3B+instantsearch.js+%284.41.0%29%3B+Vue+%282.6.14%29%3B+Vue+InstantSearch+%284.3.3%29%3B+JS+Helper+%283.8.2%29&x-algolia-api-key=f319f4e4b15d239ba0509b3c6c4a0ecd&x-algolia-application-id=F75BB6Q2SY"
  static readonly BASE_URL="https://onatera.com";

  static readonly  IMAGE_BASE_URL='https://media.onatera.com/cache/product_image_listing_DM/'

  protected static JSON_QUERY=
    {
      "requests": [{
        "indexName": "intl.product.fr.fr",
        "params": "clickAnalytics=true&facets=%5B%5D&hitsPerPage=0&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }, {
        "indexName": "intl.product.fr.fr",
        "params": "clickAnalytics=true&facets=%5B%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=6&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }, {
        "indexName": "intl.category.fr.fr",
        "params": "clickAnalytics=true&facets=%5B%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=3&numericFilters=ref_count%20%3E%200&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }, {
        "indexName": "intl.brand.fr.fr",
        "params": "clickAnalytics=true&facets=%5B%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=3&numericFilters=product_count%20%3E%200&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }, {
        "indexName": "intl.active.fr.fr",
        "params": "clickAnalytics=true&facets=%5B%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=3&numericFilters=product_count%20%3E%200&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }, {
        "indexName": "intl.content.for_recipes.fr.fr",
        "params": "clickAnalytics=true&facetFilters=%5B%22type%3Adiy%22%5D&facets=%5B%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=3&query=QUERY_STRING&tagFilters=&userToken=anonymous_09f81bae3a73d5bcb1582423816110b7"
      }]
    }
  override onlineShopName="Onatera";

  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(OnateraScrapper.JSON_QUERY);

      // And add the query
    postContent=postContent.replace (/QUERY_STRING/g, encodeURIComponent(nameOrId));

    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST", OnateraScrapper.SEARCH_ONLINE_URL, ProxyEngine.CORSPROXY_IO
    ,{body:postContent, responseType:"json", observe:"body"})
      .then(jsonResult => {
          if( typeof jsonResult == "string")
            jsonResult = JSON.parse(jsonResult);

          const ret= new Array<ScrappedProduct>();
          const results=(jsonResult as any).results as Array<any>;
          if (results.length>0) {
            for (const result of results) {
              const hits=result.hits as Array<any>;
              if( hits!=null) {
                for (const aResult of hits) {
                  if( aResult.is_active==true) {
                  const productName=aResult.name+' '+aResult.brand_name+' ';
                  if (aResult.variants!=null) {
                      for (const variant of aResult.variants) {
                        const newProduct = new ScrappedProduct();

                        newProduct.productPrice=variant.price/100;
                        newProduct.outOfStock=!variant.hasStock;
                        newProduct.currencyCode="EUR";
                        newProduct.productName=productName+variant.name;
                        newProduct.productDescription=variant.shortDescription??variant.description;
                        newProduct.productId=variant.productVariantId.toString();
                        newProduct.productUrl=OnateraScrapper.BASE_URL+variant.url;
                        newProduct.productImageUrl=OnateraScrapper.IMAGE_BASE_URL+variant.picture_path;

                        this.checkScrappedProduct(nameOrId, newProduct);
                        ret.push(newProduct);
                      }
                    }
                  }
                }
              }
            }
          }

          return ret;
        });
  }

}
