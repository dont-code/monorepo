import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PriceComponent} from './preview/price/price.component';
import {CommercePlugin} from "./declaration/commerce-plugin";
import {dtcde} from '@dontcode/core';
import {PluginCommonModule} from '@dontcode/plugin-common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PriceCompareComponent} from "./preview/price/price-compare.component";
import {InputTextModule} from "primeng/inputtext";
import {FieldsModule} from "@dontcode/plugin-std";
import {ShopHandlerComponent} from "./preview/shop/shop-handler.component";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {ProductSelectionComponent} from "./shared/ui/product-selection.component";
import {DataViewModule} from "primeng/dataview";
import {CardModule} from "primeng/card";
import {BasicModule} from "@dontcode/plugin-std";
import {TooltipModule} from "primeng/tooltip";
import {ShopTypeHandlerComponent} from "./preview/shop/shop-type-handler.component";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";

@NgModule({
    imports: [CommonModule, PluginCommonModule.forRoot(), BasicModule, FieldsModule, ReactiveFormsModule, InputTextModule, FormsModule, DropdownModule, RippleModule, ButtonModule, DataViewModule, CardModule, TooltipModule, MessageModule, MessagesModule],
  declarations: [
    PriceCompareComponent,
    PriceComponent,
    ShopHandlerComponent,
    ShopTypeHandlerComponent,
    ProductSelectionComponent
  ],
  id:'dontcode-plugin/commerce' // A module containing previewer components must have an id to be found by the dont-code platform.
})
export class CommerceModule {
  constructor() {
    console.log('Commerce Plugin registering');   // Look for this log to make sure your plugin has been loaded
    dtcde.registerPlugin(new CommercePlugin ());  // When created a module must register to the platform.
  }

  // We declare the components referenced by the CommercePlugin configuration
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any> ([
      ['PriceComponent', PriceComponent],
      ['PriceCompareComponent', PriceCompareComponent],
      ['ShopHandlerComponent', ShopHandlerComponent],
      ['ShopTypeHandlerComponent', ShopTypeHandlerComponent]
    ]);
  }
}

export * from './preview/price/price.component';
export * from './preview/shop/shop-handler.component';
export * from './preview/shop/shop-type-handler.component';
export * from './preview/price/price-compare.component';
export * from './shared/price-model';
export * from './shared/services/price-finder.service';
export * from './shared/online-shop-scrapper';
export * from './shared/dynamic-proxy-scrapper';
