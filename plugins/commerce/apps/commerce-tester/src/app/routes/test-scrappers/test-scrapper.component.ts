import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {PriceFinderService, PriceModel} from "@dontcode/plugin-commerce";

@Component({
  selector: 'dontcode-test-scrapper',
  templateUrl: './test-scrapper.component.html',
  styleUrls: ['./test-scrapper.component.scss'],
})
export class TestScrapperComponent {
  @Input() shopName='';
  @Input() productName='';

  price:PriceModel={};
  displayPrice=false;
  priceError:any=null;
  url:string|null = null;

  constructor(protected priceFinder:PriceFinderService, protected ref:ChangeDetectorRef) {
  }

  async checkPrice(): Promise<void> {
    this.price = {
      nameInShop: this.productName,
      shop: this.shopName
    };
    try {

      const products = await this.priceFinder.searchProducts(this.productName, this.shopName);
      if (products.length==0) {
        throw new Error ("No product found with name "+this.productName+' in the shop '+this.shopName);
      }
      else {
        this.price.idInShop=products[0].productId;
        const value = await this.priceFinder.findPrice(this.price, this.shopName, '');
        this.priceError = '';
        if ((value != null) && (value.cost!=null)) {
          this.price = value;
          this.displayPrice = true;
          this.priceError = null;
        } else {
          this.displayPrice = false;
          this.priceError = 'No Price found';
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    } catch (reson) {
      const reason = reson as any;
      this.url=reason.url??null;
      this.priceError = reason.message??reason.error?.message??reason.error?.statusText??reason;
      this.displayPrice = false;
      this.price = {inError: true};
      this.ref.markForCheck();
      this.ref.detectChanges();
    }
  }
  displayableError (): string {
    return JSON.stringify(this.priceError);
  }
}


