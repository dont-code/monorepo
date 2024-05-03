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
import { SeedModule } from '@dontcode/plugin-seed';
import { PluginCommonModule } from '@dontcode/plugin-common';

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
      webSocketUrl: environment.webSocketUrl,
      indexedDbName: 'Seed Plugin Tester',
      applicationName: 'Seed Plugin Tester',
      theme: 'orange',
      templateFileUrl: 'assets/dev/templates.json',
    }),
    SeedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
