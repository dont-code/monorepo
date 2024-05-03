import {ChangeDetectorRef, Component, Injector} from '@angular/core';
import {ComponentLoaderService, PluginBaseComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {Change} from "@dontcode/core";

@Component({
  selector: 'dontcode-commerce-price-compare',
  templateUrl: './price-compare.component.html',
  styleUrls: ['./price-compare.component.scss']
})
export class PriceCompareComponent extends PluginBaseComponent {

  constructor(loader: ComponentLoaderService,
              injector: Injector,ref: ChangeDetectorRef) {
    super (loader, injector, ref);
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Method not implemented.');
  }
  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Method not implemented.');
  }

  handleChange(change: Change): void {
  }

}
