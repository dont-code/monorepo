import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHandlerComponent } from './shop-handler.component';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {DontCodeTestManager, dtcde} from "@dontcode/core";
import {EasyParaScrapper} from "../../shared/scrappers/easy-para-scrapper";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

describe('ShopHandlerComponent', () => {
  let component: ShopHandlerComponent;
  let fixture: ComponentFixture<ShopHandlerComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopHandlerComponent ],
      imports: [PluginCommonModule.forRoot(), HttpClientTestingModule]
    })
    .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
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
    fixture = TestBed.createComponent(ShopHandlerComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
