import {GraphDataTransformer} from "./graph-data-transformer";
import {firstValueFrom, map} from "rxjs";
import {dtcde} from "@dontcode/core";
import {EntityListManager} from "@dontcode/plugin-common";
import {ChartType} from "chart.js";
import {AutocolorsOptions} from "chartjs-plugin-autocolors-typescript";

// Declare the plugin otherwise Graph Data Transformer won't compile
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    autocolors?: AutocolorsOptions
  }
}

describe('GraphDataTransformer', () => {
  // let component: ReportDisplayComponent;
  // let fixture: ComponentFixture<ReportDisplayComponent>;

  beforeEach(async () => {
    /*await TestBed.configureTestingModule({
      declarations: [ReportDisplayComponent],
      imports: [PluginCommonModule.forRoot()],
    }).compileComponents();*/
  });

  beforeEach(() => {
   // fixture = TestBed.createComponent(ReportDisplayComponent);
   // component = fixture.componentInstance;

  });

  it('should translate simple data', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Pie',
      of: 'value',
      title: 'Pie Chart'
    });

    toTest.updateSourceData (new TestEntityListManager('',[{
      whatever: 'Test1',
      value: 123
    }, {
      whatever: 'Test2',
      value: 456
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual([1, 2]);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).not.toBeNull();
      expect(result.datasets[0].data).toEqual([123,456]);
    })))
  });

  it('should translate object data', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Pie',
      of: 'object',
      title: 'Pie Chart'
    });

    toTest.setLabelFieldName('name');
    toTest.setTargetType("Euro");

    toTest.updateSourceData (new TestEntityListManager ('',[{
      name: 'Test1',
      object: {
        amount: 343,
        currency: 'EUR'
      }
    }, {
      name: 'Test2',
      object: {
        amount: 436,
        currency: 'USD'

      }
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual(['Test1', 'Test2']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).not.toBeNull();
      expect(result.datasets[0].data).toEqual([343,436]);
    })))
  });

  it('should manage date values', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Pie',
      of: 'object',
      title: 'Pie Chart'
    });

    toTest.setLabelFieldName('name');

    toTest.updateSourceData (new TestEntityListManager('',[{
      name: 'Test1',
      object: new Date()
    }, {
      name: 'Test2',
      object: new Date()
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual(['Test1', 'Test2']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toHaveLength(2);
      expect(typeof result.datasets[0].data[0]).toEqual('number');
    })))
  });

  it('should support null values', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Pie',
      of: 'object',
      title: 'Pie Chart'
    });

    toTest.setLabelFieldName('name');

    toTest.updateSourceData ( new TestEntityListManager('',[{
      name: 'Test1',
      object: {
        value: null,
        label: 'Label'
      }
    }, {
      name:'Test2',
      object: {
        value: 343,
        label: 'Label2'
        }
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual(['Test1', 'Test2']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toHaveLength(2);
      // Values has been autoamtically extracted
      expect(result.datasets[0].data).toEqual([null, 343]);
    })))
  });

  it('should sum up values for the same label', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Bar',
      of: 'value',
      by: 'type',
      title: 'Bar Chart'
    });

    toTest.setTargetType('number');
    toTest.setLabelFieldName('name');

    toTest.updateSourceData (new TestEntityListManager('',[{
      name: 'Test1',
      value: 12,
      type: 'Type1'
    }, {
      name: 'Test2',
      value: 15,
      type: 'Type2'
    }, {
      name: 'Test3',
      value: 20,
      type: 'Type1'
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual(['Type1', 'Type2']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toHaveLength(2);
      expect(result.datasets[0].data).toEqual([
        { x:'Type1', 'y':32, src: 32},
        { x:'Type2', 'y':15, src: 15}]); // Should be the sum of Type1 values and Type2 values
    })));
  });

  it('should sum up money for the same label', () => {
    const toTest = new GraphDataTransformer( dtcde.getModelManager(), {
      type: 'Pie',
      of: 'cost',
      by: 'type',
      title: 'Bar Chart'
    });

    toTest.setTargetType('Euro');
    toTest.setLabelFieldName('name');

    toTest.updateSourceData (new TestEntityListManager('',[{
      name: 'Test1',
      cost: {
        amount:12,
        currencyCode:'EUR'},
      type: 'Type1'
    }, {
      name: 'Test2',
      cost: {
        amount: 15,
        currencyCode:'EUR'},
      type: 'Type2'
    }, {
      name: 'Test3',
      cost: {
        amount: 20,
        currencyCode:'EUR'},
      type: 'Type1'
    }]));

    return firstValueFrom(toTest.dataObservable().pipe(map (result => {
      expect(result.labels).not.toBeNull();
      expect(result.labels).toEqual(['Type1', 'Type2']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toHaveLength(2);
      expect(result.datasets[0].data).toEqual([32, 15]); // Should be the sum of Type1 values and Type2 values
    })));
  });


});

class TestEntityListManager extends EntityListManager {
  constructor(position:string, values:any[]) {
    super(dtcde.getSchemaManager().generateSchemaPointer(position), {}, dtcde.getStoreManager(), dtcde.getModelManager());
    this.entities=values as never[];
  }

}
