import {Component} from "@angular/core";
import 'core-js/stable/structured-clone';
import {CommonTestHostComponent} from "./common-test-host.component";
import {CommonTestManager} from './common-test-manager';
import {ComponentFixture, TestBed} from "@angular/core/testing"; // Some bugs in Jest disable the native call
import { PluginCommonModule, ComponentLoaderService, AbstractDynamicComponent, PossibleTemplateList, TemplateList, DynamicInsertPoint } from "../plugin-common.module";

describe('CommonTestManager', () => {

  let component: CommonTestHostComponent;
  let fixture: ComponentFixture<CommonTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonTestHostComponent],
      providers: [DynamicInsertPoint],
      imports: [PluginCommonModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('should register component', (done) =>  {
    CommonTestManager.registerComponentForType('TestType', 'TestComponent', TestManagerComponent);
    const cls = TestBed.inject(ComponentLoaderService);
    cls.insertComponentForFieldType('TestType', component.dynamicInsertPoint).then (insertedComponent => {
      expect (insertedComponent).toBeTruthy ();
      done();
    }).catch(reason => {
      done (reason);
    })
})

});

@Component({
  selector: 'dontcode-test-manager-component',
  template: ''
})
export class TestManagerComponent extends AbstractDynamicComponent {
  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false ,false);
  }

  providesTemplates(key?: string): TemplateList {
    return new TemplateList(null, null, null);
  }

}
