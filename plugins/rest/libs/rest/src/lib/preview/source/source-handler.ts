import {
  Change,
  ChangeType,
  DontCodeModelManager,
  DontCodeStoreManager,
  dtcde,
  StoreProviderHelper
} from "@dontcode/core";
import {AbstractPluginHandler} from "@dontcode/plugin-common";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RestStoreProvider} from "./rest-store-provider";

@Injectable({
  providedIn: 'root'
})
export class SourceHandler extends AbstractPluginHandler {

  protected storeMgr:DontCodeStoreManager;
  protected modelMgr:DontCodeModelManager;

  constructor(protected httpClient:HttpClient) {
    super();
    this.storeMgr = dtcde.getStoreManager();
    this.modelMgr = dtcde.getModelManager();
    this.storeMgr.setProviderForSourceType(new RestStoreProvider(this.httpClient), 'Rest');
  }

  /**
   * Update storeMgr with any changes done to Rest sources
   * @param change
   */
  handleChange (change: Change ) : void {

      // Clear the cache anytime the rest configuration changes
    StoreProviderHelper.clearConfigCache();
/*    if (change.pointer==null) {
      console.log('Cannot handle source event ', change.position+' without the pointer');
      return;
    }
    const  val = this.modelMgr.findAtPosition(change.getSafeParentPosition());
    switch (change.type) {
      case ChangeType.DELETE:
        this.storeMgr.removeProviderForSourceType(val.name);
        break;
      case ChangeType.ADD:
      case ChangeType.RESET:
        this.storeMgr.setProviderForSourceType(new RestStoreProvider(val.url, this.httpClient), val.name);
        break;
      case ChangeType.MOVE:
      case ChangeType.UPDATE:
        this.storeMgr.setProviderForSourceType(new RestStoreProvider(val.url, this.httpClient ), val.name);
        break;
      default:
        break;
    }*/
  }
}
