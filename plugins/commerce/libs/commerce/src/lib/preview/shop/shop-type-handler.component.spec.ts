import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {ShopTypeHandlerComponent} from "@dontcode/plugin-commerce";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ShopTypeHandlerComponent', () => {
  let component: ShopTypeHandlerComponent;
  let fixture: ComponentFixture<ShopTypeHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopTypeHandlerComponent ],
      imports: [PluginCommonModule.forRoot(), HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopTypeHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
