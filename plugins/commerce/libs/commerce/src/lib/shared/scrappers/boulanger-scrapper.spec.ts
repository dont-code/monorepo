import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {BoulangerScrapper} from "./boulanger-scrapper";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('BoulangerScrapper', () => {
  let component: BoulangerScrapper;
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
    component = new BoulangerScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Doro 8080 smartphone", false).then(value => {
      expect(value.length>0).toBeTruthy();
      expect(value[0].productName).toEqual("Smartphone DORO 8100 Plus Graphite");
      expect(value[0].productPrice).toEqual (229);
      expect(value[0].productId).toEqual("1177036");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("boulanger/doro-8080-smartphone-search.html", httpTestingController, AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"1177036",
      productName:"Smartphone DORO 8100 Plus Graphite"
    }).then(value => {
      expect(value?.productPrice).toEqual(229);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("boulanger/doro-8080-smartphone-search.html", httpTestingController, AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });

});

