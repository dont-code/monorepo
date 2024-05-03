import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportDisplayComponent} from './preview/report-display/report-display.component';
import {ReportEntityComponent} from './preview/report-entity/report-entity.component';
import {ReportPlugin} from './declaration/report-plugin';
import {dtcde} from '@dontcode/core';
import {PluginCommonModule} from '@dontcode/plugin-common';
import {ReactiveFormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {ReportTableComponent} from './preview/report-table/report-table.component';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ChartModule,
    PluginCommonModule.forRoot(),
    TableModule,
    TooltipModule
  ],
  declarations: [
    ReportDisplayComponent,
    ReportEntityComponent,
    ReportTableComponent,
  ],
  id: 'dontcode-plugin/report', // A module containing previewer components must have an id to be found by the dont-code platform.
})
export class ReportModule {
  constructor() {
    console.log('Report Plugin registering'); // Look for this log to make sure your plugin has been loaded
    dtcde.registerPlugin(new ReportPlugin()); // When created a module must register to the platform.
  }

  // We declare the components referenced by the ReportPlugin configuration
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any>([
      ['ReportEntityComponent', ReportEntityComponent],
      ['ReportDisplayComponent', ReportDisplayComponent],
      ['ReportTableComponent', ReportTableComponent],
    ]);
  }
}

export * from './preview/report-display/report-display.component';
export * from './preview/report-table/report-table.component';
export * from './preview/report-entity/report-entity.component';
