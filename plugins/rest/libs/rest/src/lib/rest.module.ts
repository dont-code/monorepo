import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RestPlugin} from "./declaration/rest-plugin";
import {dtcde} from '@dontcode/core';
import {SourceHandler} from "./preview/source/source-handler";

@NgModule({
    imports: [CommonModule],
  declarations: [],
  id:'dontcode-plugin/rest' // A module containing previewer components must have an id to be found by the dont-code platform.
})
export class RestModule {
  constructor() {
    console.log('Rest Plugin registering');   // Look for this log to make sure your plugin has been loaded
    dtcde.registerPlugin(new RestPlugin());  // When created a module must register to the platform.
  }

  exposedPreviewHandlers(): Map<string, any> | null {
    return new Map<string, any> ([['SourceHandler', SourceHandler]
      ]);
  }
}

export * from './preview/source/rest-store-provider';
export * from './preview/source/source-handler';
