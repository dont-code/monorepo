import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {
  AbstractDynamicComponent,
  BaseDynamicEvent,
  BaseDynamicEventSource,
  DynamicEvent,
  DynamicEventSource,
  DynamicEventType,
  PossibleTemplateList,
  TemplateList
} from '@dontcode/plugin-common';
import {FormControl} from "@angular/forms";
import {PriceFinderService} from "../../shared/services/price-finder.service";

@Component({
  selector: 'dontcode-commerce-shop-type',
  templateUrl: './shop-type-handler.component.html',
  styleUrls: ['./shop-type-handler.component.scss']
})
export class ShopTypeHandlerComponent extends AbstractDynamicComponent {

  @ViewChild('inlineView', { static: true })
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView', { static: true })
  private fullEditView!: TemplateRef<any>;
  shopTypes = new Array<string>();

  @Output()
  valueChange = new EventEmitter<DynamicEvent>();

  constructor(protected priceFinder:PriceFinderService) {
    super ();
    this.shopTypes=this.priceFinder.getListOfShopTypes();
  }

  override createAndRegisterFormControls (): void {
    this.form.registerControl(this.name, new FormControl(null, {updateOn:"change"}));
  }

  providesTemplates(key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  displayableValue():string {
    const ret= AbstractDynamicComponent.toBeautifyString (this.value);
    if (ret==null)  return "";
    else return ret;
  }

  override listEventSources(): DynamicEventSource[] {
    const ret= super.listEventSources();
    ret.push(
      new BaseDynamicEventSource ("Value", DynamicEventType.VALUE_CHANGE, this.valueChange.asObservable())
    );
    return ret;
  }

  valueChanged($event: any):void {
    this.valueChange.emit(new BaseDynamicEvent("Value", DynamicEventType.VALUE_CHANGE, $event.value));
  }
}
