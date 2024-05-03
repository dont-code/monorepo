import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {PriceCompareComponent} from "./price-compare.component";

describe('Price Compare Component', () => {
  let component: PriceCompareComponent;
  let fixture: ComponentFixture<PriceCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceCompareComponent ],
      imports: [PluginCommonModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
