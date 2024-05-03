import {ChangeDetectorRef, Component, Injector} from '@angular/core';
import {ComponentLoaderService, PluginBaseComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {Change} from "@dontcode/core";

@Component({
  selector: 'dontcode-seeded-entity',
  templateUrl: './seeded-entity.component.html',
  styleUrls: ['./seeded-entity.component.scss']
})
export class SeededEntityComponent extends PluginBaseComponent {

  constructor(loader: ComponentLoaderService,
              injector: Injector,
              ref: ChangeDetectorRef) {
    super (loader, injector, ref);
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Method not implemented.');
  }
  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Method not implemented.');
  }

  handleChange(change: Change): void {
    // Nothing here
  }

}
