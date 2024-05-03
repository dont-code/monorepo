import {DontCodeDataTransformer} from "@dontcode/core";
import {
  DataTransformationInfo,
  DontCodeEntityType,
  DontCodeModel,
  DontCodeModelManager,
  DontCodeModelPointer,
  DontCodeReportGroupShowType,
  DontCodeReportGroupType
} from "@dontcode/core";

/**
 * Transform columns values into rows depending on the graph configuration
 */
export class CrossDataTransformer<T=never> implements DontCodeDataTransformer<T>{
  constructor(protected modelMgr: DontCodeModelManager, protected affectedColumns:string[], protected groupType: DontCodeReportGroupType, protected entityPosition:DontCodeModelPointer) {
  }
  postLoadingTransformation(source: any[]): T[] {
    if (this.groupType.show==null) return source;

    const ret = new Array<T>();
    const fieldMapping = this.calculateFieldMapping();
    const metadataPerField=new Map<string, DataTransformationInfo>();
    // Adds the groupBy Column to each element so that standard groupBy works
    for (const srcItem of source) {
      const newItem = structuredClone(srcItem);
       // Let's calculate the relevant column
      newItem[this.groupType.show.valueOf()]=this.calculateRelevantColumn(srcItem, fieldMapping, metadataPerField);
      ret.push(newItem);
    }
    return ret;
  }

  private calculateRelevantColumn(srcItem: any, fieldMapping:Map<string, string>, metadataPerField:Map<string, DataTransformationInfo>):string|undefined {
    let value=undefined;
    let extractValue=undefined;
    let column=undefined;

      const fieldsPosition=this.entityPosition.subItemPointer(DontCodeModel.APP_FIELDS_NODE);
      for (const field of this.affectedColumns) {
        let metadata = metadataPerField.get(field);
        if (metadata==null) {
          metadata=new DataTransformationInfo();
          metadataPerField.set(field, metadata);
        }
        const fieldId=fieldMapping.get(field);
        if (fieldId==null) return undefined;
        const valueField=this.modelMgr.extractValue(srcItem[field], metadata, fieldsPosition.subItemPointer(fieldId));
        if ((value == null) || (extractValue==null)) {
          value = srcItem[field]
          extractValue=valueField;
          column=field;
        }
        else {
          if (this.groupType.show==DontCodeReportGroupShowType.OnlyLowest) {
            if (valueField < extractValue) {
              value = srcItem[field];
              extractValue=valueField;
              column=field;
            }
          }else { // Keep only Highest values
            if (valueField > extractValue) {
              value = srcItem[field];
              extractValue=valueField;
              column=field;
            }
          }
        }

      }
      return column;
    }

  private calculateFieldMapping(): Map<string, string> {
    const entityDesc = this.modelMgr.findAtPosition(this.entityPosition.position, false) as DontCodeEntityType;
    const ret = new Map<string, string>();
    if (entityDesc.fields!=null) {
      for (const field of Object.entries(entityDesc.fields)) {
        if (field[1].name!=null) {
          ret.set(field[1].name,field[0]);
        }
      }
    }
    return ret;
  }
}
