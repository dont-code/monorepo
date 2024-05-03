import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {MaxicoffeeScrapper} from "./maxicoffee-scrapper";

describe('Maxicoffee', () => {
  let component: MaxicoffeeScrapper;
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
    component = new MaxicoffeeScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Lugat grains", false).then(value => {
      expect(value.length>0).toBeTruthy();
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("maxicoffee/lugat-grains-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({productId:"94032", productName:"1kg Café en grain Le Blend Italien - CAFES LUGAT"}).then(value => {
      expect(value?.productPrice).toEqual(17.8);
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("maxicoffee/lugat-grains-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });
});

