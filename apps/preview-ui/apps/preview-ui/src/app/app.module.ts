import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SandboxModule} from "@dontcode/sandbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {PluginCommonModule} from "@dontcode/plugin-common";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([], {
    enableTracing: false,
    useHash: true,
    initialNavigation: 'enabledBlocking'
}),
    PluginCommonModule.forRoot(),
    SandboxModule.forRoot({
      indexedDbName: 'Dont-code Previewer',
      applicationName: 'Previewer',
      templateFileUrl: 'assets/dev/templates.json'
    }),
    InputTextModule,
    FormsModule,
    ButtonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
