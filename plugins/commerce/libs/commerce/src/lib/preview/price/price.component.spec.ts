import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceComponent } from './price.component';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('PriceComponent', () => {
  let component: PriceComponent;
  let fixture: ComponentFixture<PriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceComponent ],
      imports: [PluginCommonModule.forRoot(), HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should support setValue', () => {
    component.setValue(null);

  });

});
