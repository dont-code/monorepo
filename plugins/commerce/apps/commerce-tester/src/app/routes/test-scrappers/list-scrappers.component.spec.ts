import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScrappersComponent } from './list-scrappers.component';
import {TestScrapperComponent} from "./test-scrapper.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ButtonModule} from "primeng/button";

describe('TestScrappersComponent', () => {
  let component: ListScrappersComponent;
  let fixture: ComponentFixture<ListScrappersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListScrappersComponent, TestScrapperComponent],
      imports: [HttpClientTestingModule, ButtonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListScrappersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
