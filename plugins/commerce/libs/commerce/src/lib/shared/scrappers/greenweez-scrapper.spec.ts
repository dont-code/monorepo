import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {GreenWeezScrapper} from "./greenweez-scrapper";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('GreenweezScrapper', () => {
  let component: GreenWeezScrapper;
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
    component = new GreenWeezScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Chardon Marie", false).then(value => {
      expect(value.length>0).toBeTruthy();
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("greenweez/chardon-marie-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({productId:"1NATF0093", productName:"Chardon Marie"}).then(value => {
      expect(value?.productPrice).toEqual(9.95);
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("greenweez/chardon-marie-search-result.json", httpTestingController,AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });
});

