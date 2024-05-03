/*
 * This RemoteEntryModule is imported here to allow TS to find the Module during
 * compilation, allowing it to be included in the built bundle. This is required
 * for the Module Federation Plugin to expose the Module correctly.
 * */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SandboxModule } from '@dontcode/sandbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ReportModule } from '@dontcode/report';
import { PluginCommonModule } from '@dontcode/plugin-common';
import { BasicModule } from '@dontcode/plugin-std';
import {FieldsModule} from "@dontcode/plugin-std";

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
    BasicModule,
    FieldsModule,
    SandboxModule.forRoot({
      webSocketUrl: environment.webSocketUrl,
      indexedDbName: 'Report Plugin Tester',
      applicationName: 'Report Plugin Tester',
      theme: 'orange',
      templateFileUrl: 'assets/dev/templates.json',
    }),
    ReportModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
