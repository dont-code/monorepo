import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestScrapperComponent } from './test-scrapper.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ButtonModule} from "primeng/button";

describe('TestScrapperComponent', () => {
  let component: TestScrapperComponent;
  let fixture: ComponentFixture<TestScrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestScrapperComponent],
      imports: [HttpClientTestingModule, ButtonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestScrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
