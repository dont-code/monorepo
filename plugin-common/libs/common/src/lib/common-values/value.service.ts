import {Change, DontCodeModelManager, DontCodeSchemaItem, ModelQuerySingleResult} from "@dontcode/core";
import {Injectable} from "@angular/core";

/**
 * Stores and constantly updates the json (as an instance of the DontCodeSchema) as it is being edited / modified through Change events
 * It's a wrapper around DontCodeModelManager
 * It does not store the entity values but the description of entities, screens... as defined in the Editor
 */
@Injectable({
  providedIn: 'root'
})
export class ValueService {

  constructor(protected modelMgr:DontCodeModelManager) {
  }

  getContent(): any {
    return this.modelMgr.getContent();
  }

  /**
   * Resets the current json content to the one given in parameter
   * @param newContent
   */
  resetContent(newContent: any): void {
    this.modelMgr.resetContent(newContent);
  }
  /**
   * Subscribes to the Subject in parameter to receive model updates through changes.
   * Changes are generated by the Editor as the user modifies the application.
   * It then modifies it's internal json to be up to date.
   * @param receivedCommands
   * @deprecated in favor of applyChange
   */
/*  receiveUpdatesFrom(receivedCommands: Subject<Change>): void {
    this.model.receiveUpdatesFrom(receivedCommands);
  }
*/
  /**
   * Apply the change to the model and returns the list of subchanges implied by it
   * @param chg
   */
/*  applyChange (chg: Change): Change[] {
    return this.modelMgr.applyChange(chg);
  }*/
  /**
   * Provides the json extract at the given position.
   * For example, findAtPosition ('creation/entities/a') will returns the description (fields...) of the first entity created with the editor
   * @param position
   * @param create
   */
  findAtPosition(position: string, create?: boolean): any {
    return this.modelMgr.findAtPosition(position, create);
  }

  /**
   * Enable querying the model for any value, following jsonPath model
   * To use when potentially you expect multiple values
   * @param query: the query as a jsonPath
   * @param position: in case the jsonPath is relative
   */
  queryModelToArray(query: string, position?: string): Array<any> {
    return this.modelMgr.queryModelToArray(query, position);
  }

  /**
   * Enable querying the model for any value, following jsonPath model
   * To use when potentially you expect a single value.
   * @param query: the query as a  jsonPath
   * @param position: in case the jsonPath is relative
   */
  queryModelToSingle(query: string, position?: string): ModelQuerySingleResult|null {
    return this.modelMgr.queryModelToSingle(query, position);
  }

  /**
   * Returns the list of values that are possible target of a given property path. With this the Builder User Interface can display to the user a combo-box will all targets
   * For example, with the following model:
   * "from": {
   *           "type": "string",
   *           "format": "$.creation.sources.name"
   *         }
   *
   * findAllPossibleTargetsOrProperty ("from", ...) will returns all sources names.
   * @param property
   * @param position
   * @param schemaItem
   */
  findAllPossibleTargetsOfProperty(
    property: string,
    position: string,
    schemaItem?: DontCodeSchemaItem
  ): Array<any> {
    return this.modelMgr.findAllPossibleTargetsOfProperty(property, position, schemaItem);
  }

  /**
   * Returns the exact element that matches the target of a given property path.
   *
   * For example, with the following Dont-code model:
   * "from": {
   *           "type": "string",
   *           "format": "$.creation.sources.name"
   *         }
   *
   * and an instantiated model like this:
   * {
   *   "from": "EntityName"
   * }
   * findAllPossibleTargetsOrProperty ("from", ...) will return only the source named "EntityName".
   * @param property
   * @param position
   * @param schemaItem
   */
  findTargetOfProperty(
    property: string,
    position: string,
    schemaItem?: DontCodeSchemaItem
  ): ModelQuerySingleResult|null {
    return this.modelMgr.findTargetOfProperty(property, position, schemaItem);
    }

  }
