import {AfterViewInit, ChangeDetectorRef, Component, Injector, Optional, TemplateRef, ViewChild} from '@angular/core';
import {
    ComponentLoaderService,
    EntityListManager,
    EntityStoreService,
    PluginBaseComponent,
    PossibleTemplateList,
    SubFieldInfo,
    TemplateList,
    ValueService,
} from '@dontcode/plugin-common';
import {
    Change,
    ChangeType,
    CommandProviderInterface,
    DontCodeEntityType,
    DontCodeFieldType,
    DontCodeModel,
    DontCodeModelManager,
    DontCodeModelPointer,
    DontCodeReportGroupType,
    DontCodeReportType,
    DontCodeStorePreparedEntities,
    dtcde
} from '@dontcode/core';
import {CrossDataTransformer} from "../cross-data-transformer";
import formatters from "chart.js/dist/core/core.ticks";

@Component({
  selector: 'dontcode-report-entity',
  templateUrl: './report-entity.component.html',
  styleUrls: ['./report-entity.component.scss'],
})
export class ReportEntityComponent extends PluginBaseComponent implements AfterViewInit {

  @ViewChild('defaultdisplay')
  private defaultTemplate!: TemplateRef<any>;

  title="No Title";

  store:EntityListManager|null=null;
  dataLoading = false;
  reportDescription:DontCodeReportType|null=null;
  reportEntityData = new DontCodeStorePreparedEntities<never> ([]);
  targetEntityPointer: DontCodeModelPointer|null=null;
  fieldTypeTransformer: CrossDataTransformer|null=null;

  constructor(loader: ComponentLoaderService, protected entityService:EntityStoreService, protected valueService: ValueService, injector: Injector, ref: ChangeDetectorRef
    ,@Optional() protected modelMgr:DontCodeModelManager) {
    super(loader, injector, ref);
    if (this.modelMgr==null)  // Sometimes it's not injected...
      this.modelMgr=dtcde.getModelManager();
  }

  override initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ): any {
    super.initCommandFlow(provider, pointer);

    if (!this.entityPointer)
      throw new Error(
        'Cannot listen to changes without knowing a base position'
      );
    this.reportDescription=provider.getJsonAt(this.entityPointer.position) as DontCodeReportType;
    this.initTargetEntity ();
    this.decomposeJsonToMultipleChanges(
      this.entityPointer,
      this.reportDescription
    ); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening(true); // Listen to all changes made in the report definition
  }

  protected initTargetEntity ():void {
    if( this.entityPointer==null)
      return;
    const targetInfo = this.valueService.findTargetOfProperty("for", this.entityPointer.position);

    if ((targetInfo!=null)&& (this.provider!=null)) {
      this.targetEntityPointer=this.provider.getSchemaManager().generateSchemaPointer(targetInfo.pointer);
      this.store = this.entityService.retrieveListManager(this.targetEntityPointer, this.valueService.findAtPosition(targetInfo.pointer, false));
      this.pluginHelper.initOtherChangeListening(true, this.targetEntityPointer);
    }

  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // When testing entityPointer is not defined
    this.loadTargetEntities();
  }

  private loadTargetEntities() {
    if ((this.entityPointer) && (this.provider)) {
      if (this.store != null) {
        this.dataLoading = true;
        this.calculateTransformer ();
        this.store.searchAndPrepareEntities(this.reportDescription?.sortedBy, this.reportDescription?.groupedBy, this.fieldTypeTransformer??undefined).then(() => {
          // eslint-disable-next-line no-restricted-syntax
          console.debug("Loaded entities");
          this.reportEntityData = this.store?.prepared ?? new DontCodeStorePreparedEntities<never>([]);
          this.dataLoading = false;
          this.updateSubFieldsValues();
          this.ref.markForCheck();
          this.ref.detectChanges();
        }, reason => {
          this.dataLoading = false;
        });
      }
    } else {
      throw new Error('Cannot create subcomponents before initCommandFlow is called');
    }
  }

  protected updateSubFieldsValues (): void {
    for (const field of this.fields) {
      if( field.component!=null) {
        field.component.setValue(this.store);
      }
    }
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Method not implemented.');
  }
  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Method not implemented.');
  }

  override setValue(val: any) {
    // Just ignore it
    // eslint-disable-next-line no-restricted-syntax
    console.debug("setValue() called for ReportEntity");
  }

  override getValue(): any {
    // Just ignore as well
    // eslint-disable-next-line no-restricted-syntax
    console.debug("getValue() called for ReportEntity");
    return undefined;
  }


  handleChange(change: Change): void {
    if (change?.pointer?.positionInSchema === DontCodeModel.APP_REPORTS_DISPLAY) {
      this.updateSubFieldsWithChange(change, DontCodeModel.APP_REPORTS_DISPLAY_NODE).then(value => {
        if (value != null) {
          this.updateSubFieldsValues();
          this.ref.markForCheck();
          this.ref.detectChanges();
        }
      }).catch(reason => {
        console.error(reason);
      })
    } else if (change?.pointer?.positionInSchema === DontCodeModel.APP_REPORTS_TITLE) {
      switch (change.type) {
        case ChangeType.DELETE:
          this.title='';
          break;
        default:
          this.title = change.value;
      }
    } else if ((this.targetEntityPointer!=null) && (change?.pointer?.isSubItemOf(this.targetEntityPointer)!=null)) {
      // A change has been made in the entity itself
      this.loadTargetEntities();
    }
  }

  override subFieldFullViewTemplate(subField: string | SubFieldInfo): TemplateRef<any> | null {
    let ret = super.subFieldFullViewTemplate(subField);
    if( ret==null)
      ret = this.defaultTemplate;
    return ret;
  }

  /**
   * Some reports are based on columns instead of rows. So we must recalculate the loaded values
   */
  calculateTransformer (): void {
    this.fieldTypeTransformer=null;
    if ((this.reportDescription!=null)&& (this.targetEntityPointer!=null) && (this.provider!=null)) {
        // Is the report based on type of columns ?
      if (this.reportDescription.groupedBy!=null) {
        const groupByColumn = Object.values(this.reportDescription.groupedBy)[0]?.of;
        if( groupByColumn!=null) {
          // Is it an existing entity property or a column type name ?
          const entityDesc = this.valueService.findAtPosition(this.targetEntityPointer.position, false) as DontCodeEntityType;
          if (entityDesc.fields!=null) {
            const columnNames=new Array<string>();
            for (const field of Object.values(entityDesc.fields) as DontCodeFieldType[]) {
              if (field.name == groupByColumn) {
                // We found the column for the groupby, so nothing to do
                return;
              } else {
                if (field.type == groupByColumn) {
                  columnNames.push(field.name);
                }
              }
            }

            // Did we find columns ?
            if (columnNames.length!=0) {
              // Yes ! Let's groupBy these columns then
              this.fieldTypeTransformer=new CrossDataTransformer<never>(
                this.modelMgr, columnNames,
                Object.values(this.reportDescription.groupedBy)[0] as DontCodeReportGroupType, this.targetEntityPointer);
            }

          }
        }
      }
    }
  }

}

