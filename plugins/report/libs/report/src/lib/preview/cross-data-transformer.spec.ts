import 'core-js/stable/structured-clone'; // Some bugs in Jest disable the native call
import { DontCodeGroupOperationType, DontCodeReportGroupShowType, MoneyAmount, dtcde } from "@dontcode/core";
import { CrossDataTransformer } from "./cross-data-transformer";
import { assert } from "console";

describe('CrossDataTransformer', () => {

  it('should select OnlyLowest column properly', () => {
    dtcde.getModelManager().resetContent (SELECT_ONLY_LOWEST_MODEL);
    const transformer = new CrossDataTransformer<SimpleTestEntity> (dtcde.getModelManager(), ['Price1', 'Price2', 'Price3'], 
      {
        of:'Entity',
        show:DontCodeReportGroupShowType.OnlyLowest,
        display: {
          'aa': {
            of: 'Price1',
            operation:DontCodeGroupOperationType.Sum
          }
        }
      },dtcde.getSchemaManager().generateSchemaPointer('creation/entities/a')
      );
    
    const result = transformer.postLoadingTransformation ([
      { Name:'Name1', Price1:12, Price2: 15, Price3: 24},
      { Name:'Name2', Price1:12, Price2: 5, Price3: 24},
      { Name:'Name3', Price1:12, Price2: 15, Price3: 4},
      { Name:'Name4', Price1:2, Price2: 15, Price3: 24}
    ]);

    expect(result.map (elem => (elem as any).OnlyLowest)).toEqual([
      'Price1', 'Price2', 'Price3', 'Price1'
    ]);
  });

  it('should select OnlyLowest column with plugin properly', () => {
    dtcde.getModelManager().resetContent (SELECT_ONLY_LOWEST_PLUGIN_MODEL);
    const transformer = new CrossDataTransformer<PluginTestEntity> (dtcde.getModelManager(), ['Price1', 'Price2', 'Price3'], 
      {
        of:'Entity',
        show:DontCodeReportGroupShowType.OnlyLowest,
        display: {
          'aa': {
            of: 'Price1',
            operation:DontCodeGroupOperationType.Sum
          }
        }
      },dtcde.getSchemaManager().generateSchemaPointer('creation/entities/a')
      );
    
    const result = transformer.postLoadingTransformation ([
      { Name:'Name1', Price1:null, Price2: {
        cost: {
          amount:null,
          currencyCode: 'EUR'
        }
      }, Price3: {
        cost: {
          amount:24,
          currencyCode: 'EUR'
        }}
      },
      { Name:'Name2', Price1:{
        cost: {
          amount:12,
          currencyCode: 'EUR'
        }}, Price2: {
          cost: {
            amount:5,
            currencyCode: 'EUR'
          }}
        },
      { Name:'Name3', Price1:{
        cost: {
          amount:12,
          currencyCode: 'EUR'
        }}, Price2: {
          cost: null
        }, Price3: {
          cost: {
            amount:4,
            currencyCode: 'EUR'
          }
        }
      },
      { Name:'Name4', Price1:{
        cost: {
          amount:2,
          currencyCode: 'EUR'
        }}, Price2: {
          cost: {
            amount:15,
            currencyCode: 'EUR'
          }}, Price3: {
        cost: {
          currencyCode:'EUR'
        }
      }},
      { Name:'Name5', Price1:{
          cost: {
            amount:null,
            currencyCode: 'EUR'
        }}, Price2: {
          cost: {
            amount:5,
            currencyCode: 'EUR'
        }}, Price3: {
          cost: {
            amount:20,
            currencyCode: 'EUR'
        }}
      },
    ]);

    expect(result.map (elem => (elem as any).OnlyLowest)).toEqual([
      'Price3', 'Price2', 'Price3', 'Price1', 'Price2'
    ]);
  });
})

const SELECT_ONLY_LOWEST_MODEL = {
  creation: {
    entities: {
      'a': {
        name: 'Entity',
        fields: {
          'aaa': {
            name: 'name',
            type: 'Text'
          },
          'aaaa': {
            name: 'Price1',
            type: 'number'
          },
          'aab': {
            name: 'Price2',
            type: 'number'
          },
          'aac': {
            name: 'Price3',
            type: 'number'
          }
        }
      }
    }
  }
}

const SELECT_ONLY_LOWEST_PLUGIN_MODEL = {
  creation: {
    entities: {
      'a': {
        name: 'Entity',
        fields: {
          'aaa': {
            name: 'name',
            type: 'Text'
          },
          'aaaa': {
            name: 'Price1',
            type: 'Price'
          },
          'aab': {
            name: 'Price2',
            type: 'Price'
          },
          'aac': {
            name: 'Price3',
            type: 'Price'
          }
        }
      }
    }
  }
}


interface SimpleTestEntity {
  Name:string,
  Price1: number,
  Price2: number,
  Price3: number
}

interface PluginTestEntity {
  Name:string,
  Price1: TestPriceModel,
  Price2: TestPriceModel,
  Price3: TestPriceModel
}

interface TestPriceModel {
    cost?:MoneyAmount;
    shop?:string;
    priceDate?:Date;
}