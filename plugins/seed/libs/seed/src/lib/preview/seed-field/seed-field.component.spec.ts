import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedFieldComponent } from './seed-field.component';
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('SeedFieldComponent', () => {
  let component: SeedFieldComponent;
  let fixture: ComponentFixture<SeedFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedFieldComponent ],
      imports: [ PluginCommonModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
