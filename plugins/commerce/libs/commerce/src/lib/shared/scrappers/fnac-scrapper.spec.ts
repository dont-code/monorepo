import {TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ShopHandlerComponent} from "../../preview/shop/shop-handler.component";
import {HttpClient} from "@angular/common/http";
import {expectOneSampleFile} from "../common-scrapper-test.spec";
import {FnacScrapper} from "./fnac-scrapper";

describe('FnacScrapper', () => {
  let component: FnacScrapper;
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
    component = new FnacScrapper(httpClient);
  });

  it('should search', (done) => {
    expect(component).toBeTruthy();
    component.searchProductsForNameOrId("Doro 8080 smartphone", false).then(value => {
      expect(value.length>0).toBeTruthy();
      expect(value[0].productName).toEqual("DORO 8080 - 4G smartphone / Mémoire interne 32 Go - microSD slot - 5.7&quot; - 1440 x 720 pixels - rear camera 16 MP - blanc");
      expect(value[0].productPrice).toEqual (289.88);
      expect(value[0].productId).toEqual("ID43280553");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("fnac/doro-8080-smartphone-search.html", httpTestingController);
  });

  it('should get price', (done) => {
    expect(component).toBeTruthy();
    component.updatePrice({
      productId:"ID43280553",
      productName:"DORO 8080 - 4G smartphone ",
      productUrl:"https://www.fnac.com/mp43280553/DORO-8080-4G-smartphone-Memoire-interne-32-Go-microSD-slot-5-7-1440-x-720-pixels-rear-camera-16-MP-blanc/w-4?oref=a7c1a8d6-48b9-71ad-e734-0d88831bf2cb#omnsearchpos=1"
    }).then(value => {
      expect(value?.productPrice).toEqual(267.57);
      expect(value?.currencyCode).toEqual("EUR");
      done();
    }).catch(error => {
      done (error);
    });
    expectOneSampleFile("fnac/doro-8080-smartphone-product.html", httpTestingController);
  });

});

