import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {ScrappedProduct} from "../online-shop-scrapper";

@Component({
  selector: 'dontcode-commerce-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss']
})
export class ProductSelectionComponent {
  @Input()
  listOfProducts=new Array<ScrappedProduct>();

  @Output()
  selected = new EventEmitter<ScrappedProduct|null>();

  constructor(protected ref: ChangeDetectorRef) {
  }

  selectionOf(product: ScrappedProduct):void {
    this.selected.next(product);
  }

  localizedAmount (product:ScrappedProduct): string {
    if( product.productPrice==null || (product.currencyCode==null))
      return product.currencyCode??"";
    return Intl.NumberFormat(globalThis?.window?.navigator.language ?? 'en-US', { style:'currency', currency:product.currencyCode})
      .format(product.productPrice);
  }

  notFound() {
    this.selected.next(null);
  }
}
