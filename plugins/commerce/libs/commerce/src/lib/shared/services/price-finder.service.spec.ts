import {TestBed} from '@angular/core/testing';

import {PriceFinderService} from './price-finder.service';
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";
import {waitForOneMatchSampleFile} from "../common-scrapper-test.spec";
import {EasyParaScrapper} from "../scrappers/easy-para-scrapper";
import {PriceModel} from "../price-model";
import {AbstractOnlineShopScrapper} from "../online-shop-scrapper";
import {DontCodeTestManager, dtcde} from "@dontcode/core";

describe('PriceFinderService', () => {
  let service: PriceFinderService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, PluginCommonModule.forRoot()]
    });
    service = TestBed.inject(PriceFinderService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 it('should manage easypara prices', (done) => {
    dtcde.getModelManager().resetContent({
      creation: {
        entities: {
          aa: {
            name: 'Online Shop',
            fields: {aaa: {name: 'Shop', type: 'Text'}, aab: {name: 'Type', type: 'Text'}}
          }
        }
      }
    });
    const shopTypeName =new EasyParaScrapper(httpClient).getShopTypeName();
    DontCodeTestManager.addDummyProviderFromContent("creation/entities/aa",[{
        "Name":"Shop 1",
        "Type":shopTypeName
      }]
    );
    const productModel: {name:string, price?:PriceModel} = {
      name:"Chardon Marie"
    };
    service.searchProducts("Chardon Marie", 'Shop 1').then(products => {
       const selectedProduct = products[5]; // Chardon Marie A. Vogel
       productModel.price={
         idInShop:selectedProduct.productId,
         nameInShop:selectedProduct.productName??undefined,
         cost:AbstractOnlineShopScrapper.toMoneyAmount(selectedProduct),
         priceDate:new Date()
       }

      service.findPrice(productModel.price,"Shop 1", "").then(value => {
          expect(value).toBeTruthy();
          done();
       }).catch(error => {
         done (error);
       });
    }).catch(error => {
      done (error);
    });
    // We wait for 2 queries
    waitForOneMatchSampleFile("easypara/chardon-marie-search-result.json", httpTestingController, done,AbstractOnlineShopScrapper.CORS_PROXY_URL);
    waitForOneMatchSampleFile("easypara/chardon-marie-search-result.json", httpTestingController, done,AbstractOnlineShopScrapper.CORS_PROXY_URL);
  });
});
