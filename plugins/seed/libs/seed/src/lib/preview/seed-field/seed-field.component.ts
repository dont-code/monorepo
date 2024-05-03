import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';

@Component({
  selector: 'dontcode-seed-field',
  templateUrl: './seed-field.component.html',
  styleUrls: ['./seed-field.component.scss']
})
export class SeedFieldComponent extends AbstractDynamicComponent {

  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  seeds:Array<any>;

  constructor() {
    super ();
    this.seeds = [
      {name: 'Tomato Seed', code: 'Tomato'},
      {name: 'Rosa Seed', code: 'Rosa'},
      {name: 'Pea Seed', code: 'Pea'},
      {name: 'Bean Seed', code: 'Bean'},
      {name: 'Other Seed', code: 'Other'}
    ];
  }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }
}
