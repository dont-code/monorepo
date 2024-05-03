/*
 * This RemoteEntryModule is imported here to allow TS to find the Module during
 * compilation, allowing it to be included in the built bundle. This is required
 * for the Module Federation Plugin to expose the Module correctly.
 * */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { SandboxModule } from '@dontcode/sandbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CommerceModule } from '@dontcode/plugin-commerce';
import { MenuUpdater, SANDBOX_MENUS, PluginCommonModule } from '@dontcode/plugin-common';
import { TestUrlComponent } from './routes/test-url/test-url.component';
import { MenuItem } from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListScrappersComponent } from './routes/test-scrappers/list-scrappers.component';
import { TestScrapperComponent } from './routes/test-scrappers/test-scrapper.component';
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsModule} from "@dontcode/plugin-std";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {RadioButtonModule} from "primeng/radiobutton";

const appRoutes: Routes = [
  { path: 'testUrl', component: TestUrlComponent },
  { path: 'testScrappers', component: ListScrappersComponent },
];

export class CustomMenu implements MenuUpdater {
  additionalMenus(): MenuItem[] {
    return [
      {
        label: 'Test Scrappers',
        icon: 'pi pi-server',
        routerLink: ['testScrappers'],
      },
      {
        label: 'Test Url',
        icon: 'pi pi-question-circle',
        routerLink: ['testUrl'],
      },
    ];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    TestUrlComponent,
    ListScrappersComponent,
    TestScrapperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      useHash: true,
      initialNavigation: 'enabledBlocking',
    }),
    FormsModule,
    ButtonModule,
    InputTextModule,
    PluginCommonModule.forRoot(),
    SandboxModule.forRoot({
      webSocketUrl: environment.webSocketUrl,
      indexedDbName: 'Commerce Plugin Tester',
      applicationName: 'Commerce Plugin Tester',
      theme: 'orange',
      templateFileUrl: 'assets/dev/templates.json',
    }),
    FieldsModule,
    CommerceModule,
    InputTextareaModule,
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule,
    RadioButtonModule,
  ],
  providers: [
    {
      provide: SANDBOX_MENUS,
      useClass: CustomMenu,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
