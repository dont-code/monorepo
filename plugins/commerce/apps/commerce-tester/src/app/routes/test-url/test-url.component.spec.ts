import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestUrlComponent} from './test-url.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";

describe('TestUrlComponent', () => {
  let component: TestUrlComponent;
  let fixture: ComponentFixture<TestUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule,FormsModule, InputTextModule, RadioButtonModule],
      declarations: [TestUrlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
