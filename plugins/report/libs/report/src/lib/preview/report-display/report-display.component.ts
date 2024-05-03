import {Component, TemplateRef, ViewChild,} from '@angular/core';
import {
  AbstractDynamicComponent,
  EntityListManager,
  PossibleTemplateList,
  TemplateList,
} from '@dontcode/plugin-common';
import {
  Change,
  ChangeType,
  CommandProviderInterface,
  DontCodeModel,
  DontCodeModelManager,
  DontCodeModelPointer,
  DontCodeReportDisplayType,
  DontCodeSchemaManager, DontCodeStorePreparedEntities,
  PreviewHandler
} from "@dontcode/core";
import {GraphDataTransformer} from "../graph-data-transformer";
import {Observable} from "rxjs";
import {ChartData, ChartOptions, ChartType, DefaultDataPoint} from "chart.js";

@Component({
  selector: 'dontcode-report-field',
  templateUrl: './report-display.component.html',
  styleUrls: ['./report-display.component.scss'],
})
export class ReportDisplayComponent extends AbstractDynamicComponent implements PreviewHandler {
  @ViewChild('fullView', {static: true})
  private fullView!: TemplateRef<any>;

  type?: string;
  title="";

  provider: CommandProviderInterface | null = null;
  graphModelPointer: DontCodeModelPointer | null = null;
  protected dataTransformer:GraphDataTransformer;
  chartData$: Observable<ChartData<ChartType, DefaultDataPoint<ChartType>>>;
  chartOption$: Observable<ChartOptions<ChartType>>;

  entityNamePropertyName?:string|null;

  constructor(protected modelMgr:DontCodeModelManager, protected schemaMgr:DontCodeSchemaManager) {
    super();
    this.dataTransformer = new GraphDataTransformer(modelMgr);
    this.chartData$ = this.dataTransformer.dataObservable();
    this.chartOption$ = this.dataTransformer.optionObservable ();
  }

  providesTemplates(): TemplateList {
    return new TemplateList(null, this.fullView, this.fullView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, true, true);
  }

  override setValue(val: EntityListManager) {
    super.setValue(val);
    // We can directly receive the store instead of the array of values
/*    if( (val!=null) && (val.entities!=null)) {
      val = val.entities;
    }*/
    this.dataTransformer.updateSourceData(val);

  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): void {
    this.provider=provider;
    this.graphModelPointer=pointer;

    const json = this.provider.getJsonAt(pointer.position) as DontCodeReportDisplayType;
    this.dataTransformer.setConfig(json);
    this.type = this.dataTransformer.translatedGraphType ();
    this.title = json.title;

      // Try to guess the field of the target entity of the report that represents the name of the entity
    const reportPosition = DontCodeModelPointer.parentPosition(this.graphModelPointer.containerPosition);
    if (reportPosition  != null) {
      const entity = this.modelMgr.findTargetOfProperty(DontCodeModel.APP_REPORTS_FOR_NODE, reportPosition);
      if( (entity!=null) && (entity.value!=null)) {
        this.entityNamePropertyName = this.modelMgr.guessNamePropertyOfElement(null, entity.value.fields);
        // Gets the type information of the target field
        if (json.of!=null) {
          for (const field of Object.values<any>(entity.value.fields)) {
            if( field[DontCodeModel.APP_FIELDS_NAME_NODE]==json.of) {
              this.dataTransformer.setTargetType (field[DontCodeModel.APP_FIELDS_TYPE_NODE]);
              break;
            }
          }
        }
      }
      else {
        this.entityNamePropertyName = null;
      }
    }
    if( this.entityNamePropertyName!=null)
      this.dataTransformer.setLabelFieldName (this.entityNamePropertyName);
  }

  handleChange(change: Change): void {
      // We are changing the config
    if (change.position==this.graphModelPointer?.position) {
      if (change.type===ChangeType.DELETE) {
        this.dataTransformer.setConfig();
        this.type=undefined;
      }else {
        this.dataTransformer.setConfig(change.value as DontCodeReportDisplayType);
        this.type = this.dataTransformer.translatedGraphType();
      }
    } else if (change.position==this.graphModelPointer?.position+'/'+DontCodeModel.APP_REPORTS_DISPLAY_TYPE_NODE) {
      if (change.type===ChangeType.DELETE) {
        this.dataTransformer.setConfig();
        this.type=undefined;
      }else {
        this.dataTransformer.changeGraphType(change.value as string);
        this.type = this.dataTransformer.translatedGraphType();
      }
    }
  }

}
