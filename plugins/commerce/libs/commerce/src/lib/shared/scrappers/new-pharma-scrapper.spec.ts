import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {NewPharmaScrapper} from "./new-pharma-scrapper";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";

describe('NewPharmaScrapper', () => {
  let component: NewPharmaScrapper;
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
    component = new NewPharmaScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Chardon Marie", false).then(value => {
      expect(value.length>0).toBeTruthy();
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("new-pharma/chardon-marie-search.html", httpTestingController, AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"670885",
      productName:"Chardon Marie",
      productUrl:"https://www.newpharma.fr/a-vogel/670885/a-vogel-chardon-marie-digestion-extrait-de-plante-flacon-50ml.html"
    }).then(value => {
      expect(value?.productPrice).toEqual(12.2);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("new-pharma/chardon-marie-product.html", httpTestingController, AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });

  it('should get price event without product url', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"670885",
      productName:"Chardon Marie"
    }).then(value => {
      expect(value?.productPrice).toEqual(12.2);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("new-pharma/chardon-marie-search.html", httpTestingController, AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL);
  });
});

