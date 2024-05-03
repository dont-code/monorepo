import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {min, Subscription} from "rxjs";
import {DynamicProxyScrapper, ProxyEngine} from "@dontcode/plugin-commerce";

@Component({
  selector: 'dontcode-test-url',
  templateUrl: './test-url.component.html',
  styleUrls: ['./test-url.component.scss'],
})
export class TestUrlComponent implements OnDestroy {
  testUrl: string|null = null;
  testResponse: HttpResponse<string>|null = null;
  testError: string | null=null;

  subscription = new Subscription();
  protected readonly ProxyEngine = ProxyEngine;
  proxy: string = ProxyEngine.DONT_CODE.valueOf();
  scrapper: DynamicProxyScrapper;

  constructor(
    protected httpClient:HttpClient,
    protected ref: ChangeDetectorRef
    ) {
    this.scrapper=new DynamicProxyScrapper(httpClient);
  }

  tryUrl() {
    if (this.testUrl!=null) {
      this.scrapper.callUrlWithProxy(this.testUrl, this.proxy).then( (value) => {
          this.testResponse = value;
          this.testError=null;
          console.debug("Result for " + this.testUrl + ":", this.testResponse);
          this.ref.markForCheck();
          this.ref.detectChanges();
      }).catch((error) => {
        if (error instanceof HttpErrorResponse) {
          this.testError=(error as HttpErrorResponse).message;
        } else {
          this.testError = error.toString();
        }
        this.testResponse=null;
        console.error("Error loading testUrl "+this.testUrl+':',error);
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
      )
    }
  }

  isTestError ():boolean {
    return this.testError!=null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  limitedTextResult(): string {
    if (this.testResponse?.body!=null) {
      return this.testResponse.body.substring(0, Math.min(5000, this.testResponse.body.length));
    }else {
      return '';
    }
  }
}
