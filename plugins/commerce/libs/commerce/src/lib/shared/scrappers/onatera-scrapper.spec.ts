import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {OnateraScrapper} from "./onatera-scrapper";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('OnateraScrapper', () => {
  let component: OnateraScrapper;
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
    component = new OnateraScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Chardon Marie", false).then(value => {
      expect(value.length>0).toBeTruthy();
      const product=value[0];
      expect(product.productId).toEqual("2709");
      expect(product.productPrice).toEqual(9.95);
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("onatera/chardon-marie-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({productId:"2709", productName:"Chardon Marie"}).then(value => {
      expect(value?.productPrice).toEqual(9.95);
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("onatera/chardon-marie-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });
});

