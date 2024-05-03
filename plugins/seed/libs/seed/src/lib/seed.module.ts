import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SeedFieldComponent} from './preview/seed-field/seed-field.component';
import {SeededEntityComponent} from './preview/seeded-entity/seeded-entity.component';
import {SeedPlugin} from "./declaration/seed-plugin";
import {dtcde} from '@dontcode/core';
import {PluginCommonModule} from '@dontcode/plugin-common';
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    imports: [CommonModule, PluginCommonModule.forRoot(), ReactiveFormsModule, DropdownModule],
  declarations: [
    SeedFieldComponent,
    SeededEntityComponent
  ],
  id:'dontcode-plugin/seed' // A module containing previewer components must have an id to be found by the dont-code platform.
})
export class SeedModule {
  constructor() {
    console.log('Seed Plugin Template registering');   // Look for this log to make sure your plugin has been loaded
    dtcde.registerPlugin(new SeedPlugin ());  // When created a module must register to the platform.
  }

  // We declare the components referenced by the SeedPlugin configuration
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any> ([
      ['SeedFieldComponent', SeedFieldComponent],
      ['SeededEntityComponent', SeededEntityComponent]
    ]);
  }
}

export * from './preview/seed-field/seed-field.component';
export * from './preview/seeded-entity/seeded-entity.component';
