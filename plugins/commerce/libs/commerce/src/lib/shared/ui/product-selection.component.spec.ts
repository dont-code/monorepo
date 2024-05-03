import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {ProductSelectionComponent} from "./product-selection.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DataViewModule} from "primeng/dataview";

describe('Product Selection Component', () => {
  let component: ProductSelectionComponent;
  let fixture: ComponentFixture<ProductSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSelectionComponent ],
      imports: [PluginCommonModule.forRoot(), HttpClientTestingModule, DataViewModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
