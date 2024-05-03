import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {AmazonScrapper} from "./amazon-scrapper";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('AmazonScrapper', () => {
  let component: AmazonScrapper;
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
    component = new AmazonScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("téléphone Doro 8100", false).then(value => {
      expect(value.length>0).toBeTruthy();
      expect(value[0].productName).toEqual("Doro 8100 4G Smartphone Débloqué pour Seniors, Résistant à l".substring(0,60));
      expect(value[0].productPrice).toEqual (199);
      expect(value[0].productId).toEqual("B09S3XTSPT");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("amazon/doro-8080-smartphone-search.html", httpTestingController,AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"B09S3XTSPT",
      productName:"Doro 8100 4G Smartphone Débloqué"
    }).then(value => {
      expect(value?.productPrice).toEqual(199);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("amazon/doro-8080-smartphone-search.html", httpTestingController,AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });

});

