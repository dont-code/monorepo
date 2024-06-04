import {ChangeDetectorRef, Component, Injector} from "@angular/core";
import {
  AbstractDynamicLoaderComponent,
  ComponentLoaderService,
  PossibleTemplateList,
  TemplateList
} from '../plugin-common.module';

@Component({
  selector: 'dontcode-test-host',
  template: '<dtcde-dynamic></dtcde-dynamic>'
})
export class CommonTestHostComponent extends AbstractDynamicLoaderComponent {
  constructor(loader:ComponentLoaderService, injector:Injector, ref:ChangeDetectorRef ) {
    super(loader, injector, ref);
  }
  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false ,false);
  }

  providesTemplates(key?: string): TemplateList {
    return new TemplateList(null, null, null);
  }

}
