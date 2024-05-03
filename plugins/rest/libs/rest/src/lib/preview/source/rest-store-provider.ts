import {
  AbstractDontCodeStoreProvider,
  DontCodeModel,
  DontCodeModelManager,
  DontCodeStoreCriteria,
  dtcde,
  StoreProviderHelper,
  UploadedDocumentInfo
} from "@dontcode/core";
import {lastValueFrom, Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


export class RestStoreProvider<T=never> extends AbstractDontCodeStoreProvider<T>{
  modelMgr: DontCodeModelManager;

  constructor(protected http:HttpClient) {
    super();
    this.modelMgr = dtcde.getModelManager();
  }

  override deleteEntity(position: string, key: any): Promise<boolean> {
    return Promise.resolve(false);
  }

  override loadEntity(position: string, key: any): Promise<T | undefined> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    const config = this.modelMgr.findTargetOfProperty(DontCodeModel.APP_ENTITIES_FROM_NODE, position)?.value;

    let loadUrl = config.url;
    if (key!=null) {
      try {
        const targetUrl = new URL (config.url);
        targetUrl.pathname=targetUrl.pathname+'/'+key;
        loadUrl=targetUrl.toString();
      } catch (wrongUrl) {
        console.error("The url for loading the entity is incorrect", config.url);
        return Promise.reject("The url for loading the entity is incorrect:"+ config.url);
      }
    }

    const obs = this.http.get<T>(loadUrl, {observe:"body", responseType:"json"}).pipe(
      map (value => {
        if (Array.isArray(value)) {
            throw new Error ("When loading an entity, the returned value should be one element");
        } // Should be unique value
        return value;
      }),
      map (value => {
        StoreProviderHelper.cleanUpLoadedData([value], StoreProviderHelper.findSpecialFields(position, entity));
        return value;
      }))
    return lastValueFrom(obs);
  }

  override searchEntities(position: string, ...criteria: DontCodeStoreCriteria[]): Observable<Array<T>> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return throwError(() => {
        return new Error ("No entity found at position "+position)
      });
    }

    // Search for all the date fields as we will need to convert them:
    const specialFields = StoreProviderHelper.findSpecialFields(position, entity);

    const config = this.modelMgr.findTargetOfProperty(DontCodeModel.APP_ENTITIES_FROM_NODE, position)?.value;

    return this.http.get(config.url, {observe:"body", responseType:"json"}).pipe(map(value => {
      let ret:T[]=[];
        // Check if the result is an array, otherwise try to find an array embedded in the result
        if (Array.isArray(value)) {
          ret= value as Array<T>;
        } else {
          let prop: keyof typeof value;
          for (prop in value) {
            if (Array.isArray(value[prop])) {
              ret= (value[prop] as unknown as Array<T>);
            }
          }
        }
        return StoreProviderHelper.applyFilters(ret, ...criteria);
      }
    ),
      map (result => {
        StoreProviderHelper.cleanUpLoadedData(result, specialFields);
        return result;
      }));
  }

  storeEntity(position: string, entity: T): Promise<T> {
    return Promise.reject("RestStoreProvider cannot store elements");
  }

  canStoreDocument(position?: string): boolean {
    return false;
  }

  storeDocuments(toStore: File[], position?: string): Observable<UploadedDocumentInfo> {
    return throwError(() => {
      return new Error ('Document storage is unsupported.');
    });
  }

}
