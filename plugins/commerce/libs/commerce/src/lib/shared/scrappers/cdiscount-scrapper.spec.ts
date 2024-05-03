import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {CDiscountScrapper} from "./cdiscount-scrapper";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('CDiscountScrapper', () => {
  let component: CDiscountScrapper;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopHandlerComponent ],
      imports: [HttpClientTestingModule, PluginCommonModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = new CDiscountScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Doro 8080 smartphone", false).then(value => {
      expect(value.length>0).toBeTruthy();
      expect(value[0].productName).toEqual("Doro 8050 Grey");
      expect(value[0].productPrice).toEqual (177.87);
      expect(value[0].productId).toEqual("DOR7322460078430");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("cdiscount/doro-8080-smartphone-search.html", httpTestingController, AbstractOnlineShopScrapper.CORS_PROXY_ORG_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"DOR7322460078355",
      productName:"Smartphone DORO 8100 Plus Graphite"
    }).then(value => {
      expect(value?.productPrice).toEqual(189.99);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("cdiscount/doro-8080-smartphone-product.html", httpTestingController, AbstractOnlineShopScrapper.CORS_PROXY_ORG_URL);
  });

});

