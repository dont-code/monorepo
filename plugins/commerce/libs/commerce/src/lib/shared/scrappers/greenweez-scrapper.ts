import {AbstractOnlineShopScrapper, ProxyEngine, ScrappedProduct} from "../online-shop-scrapper";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

export class GreenWeezScrapper extends AbstractOnlineShopScrapper {

  static readonly SEARCH_ONLINE_URL="https://api.greenweez.com/graphql";

  static readonly BASE_URL="https://greenweez.com";

  protected static JSON_QUERY=
  {"query":"\n  query search($query: String!, $userId: String!) {\n    search(query: $query, userId: $userId) {\n      brands {\n        name\n        id\n        highlight\n      }\n      categories {\n        name\n        slug\n        highlight\n      }\n      offers {\n        ...indexOfferFragment\n      }\n      ads {\n        pageId\n        error\n        productAds {\n          adUnitId\n          index\n          adUnitSize\n          products {\n            id\n            type\n            adId\n            productId\n            offer {\n              ...indexOfferFragment\n            }\n          }\n        }\n      }\n      total\n    }\n  }\n  \n  fragment indexOfferFragment on IndexOffer {\n    analytics {\n      queryId\n      position\n    }\n    brand\n    brands {\n      name\n      images {\n        path\n        type\n      }\n    }\n    colorVariants\n    imageUrl\n    info {\n      amount\n      unit\n    }\n    isFresh\n    isMarketplace\n    isRefurbished\n    isSecondHand\n    legacyProductId\n    mainCategory\n    merchantName\n    name\n    objectID\n    offerId\n    pricing {\n      channelCode\n      price\n      originalPrice\n      minimumPrice\n      discount\n      priceIncludedVat\n      priceHasIncludedVat\n      taxAmount\n      taxPercent\n      originalTaxAmount\n      originalPriceIncludedVat\n      appliedPromotion {\n        id\n        name\n        startDate\n        endDate\n        discount_value\n        discountValue\n        discountType\n      }\n    }\n    pricingInfos {\n      isCommitted\n      discountPercent\n      original\n      current\n      hasShortExpiration\n    }\n    productFlagType\n    productId\n    productSlug\n    ratingAverage\n    shippingLabel\n    slug\n    stock\n    totalNbOfRating\n    variant\n    variantCode\n    variantId\n  }\n\n","variables":{"query":"QUERY_STRING","userId":"e212209f-2820-4be0-bc9c-022d6f3636a7"},"operationName":"search"}

  override onlineShopName="GreenWeez";

  constructor(http: HttpClient) {
    super(http);
  }

  override searchProductsForNameOrId(nameOrId: string, isId:boolean): Promise<Array<ScrappedProduct>> {
      // We copy the content
    let postContent=JSON.stringify(GreenWeezScrapper.JSON_QUERY);

      // 3 replacements to do
    postContent = postContent.replace("QUERY_STRING", encodeURIComponent(nameOrId));
    postContent=JSON.parse(postContent);
    return this.requestWithProxy("POST",GreenWeezScrapper.SEARCH_ONLINE_URL, ProxyEngine.DONT_CODE,
    {body:postContent, responseType:"json", observe:"body"})
      .then(jsonResult => {
          if( typeof jsonResult == "string")
            jsonResult = JSON.parse(jsonResult);

          const ret= new Array<ScrappedProduct>();
          const offers=(jsonResult as any).data?.search?.offers as Array<any>;
          if( (offers!=null) && (offers.length>0)) {
            for (const aResult of offers) {
              const newProduct = new ScrappedProduct();

              newProduct.productPrice=aResult.pricing.priceIncludedVat/100;
              newProduct.currencyCode="EUR";
              newProduct.productName=aResult.name;
              newProduct.productDescription=undefined;
              newProduct.productId=aResult.variantCode;
              newProduct.productUrl= this.calculateProductUrl (aResult);
              newProduct.productImageUrl=this.findImageUrl (aResult.imageUrl);
              newProduct.marketPlace=aResult.isMarketPlace===true;
              newProduct.outOfStock=(aResult.stock!=null) && (aResult.stock <= 0);

              this.checkScrappedProduct(nameOrId, newProduct);
              ret.push(newProduct);
            }
          }

          return ret;
        });
  }

  calculateProductUrl (shopData:any): string {
    return GreenWeezScrapper.BASE_URL+'/produit/'+shopData.productSlug+'/'+shopData.variantCode;
  }

  findImageUrl (imageUrl:string|undefined): string|undefined {

    if (imageUrl!=null)
        return GreenWeezScrapper.BASE_URL+"/_next/image?url=https%3A%2F%2Fcdn.greenweez.com%2Fproducts%2F"+imageUrl+"&w=480&q=75"
    return;
  }
}
