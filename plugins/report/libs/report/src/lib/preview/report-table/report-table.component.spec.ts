import 'core-js/stable/structured-clone'; // Some bugs in Jest disable the native call
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportTableComponent} from './report-table.component';
import {ComponentLoaderService, EntityListManager, PluginCommonModule} from "@dontcode/plugin-common";
import {
  DontCodeGroupOperationType,
  DontCodeReportGroupType,
  DontCodeReportType,
  DontCodeStoreAggregate,
  DontCodeStoreGroupby,
  DontCodeStoreGroupedByEntities,
  DontCodeStoreGroupedByValues,
  DontCodeStorePreparedEntities,
  DontCodeTestManager,
  dtcde,
  TestProviderInterface
} from "@dontcode/core";
import {By} from "@angular/platform-browser";
import {Component, DebugElement, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TableModule} from "primeng/table";
import {BasicModule} from "@dontcode/plugin-std";
import {FieldsModule} from "@dontcode/plugin-std";
import {TooltipModule} from "primeng/tooltip";
import {SandboxModule} from "@dontcode/sandbox";
import {CrossDataTransformer} from "../cross-data-transformer";

const sortedData = [{
  name: 'Test1',
  type: 'Type1',
  value: 123,
  amount: {amount: 250, currencyCode: 'EUR'},
  date: new Date(2023, 5, 12)
}, {
  name: 'Test3',
  type: 'Type1',
  value: 234,
  amount: {amount: 43, currencyCode: 'EUR'},
  date: new Date(2023, 4, 14)
}, {
  name: 'Test2',
  type: 'Type2',
  value: 456,
  amount: {amount: 125, currencyCode: 'EUR'},
  date: new Date(2023, 5, 14)
}];

/**
 * Recursively generate an object with the structure
 * @param elt
 * @param toAdd
 */
function retrieveHierarchy(elt: DebugElement, toRet?:any): any {
  let toAdd=toRet;
  if( toRet==undefined) {
    toRet={};
    toRet[elt.name]={};
    toAdd=toRet[elt.name];
  }

  let counter=0;
  for (const child of elt.children) {
    const propName=child.name+'.'+counter;
    toAdd[propName]={};
    retrieveHierarchy(child, toAdd[propName]);
    counter++;
  }
  return toRet;
}


/**
 * To ease comparison, we just extract the cost value if the element is a Json representing a Price
 * @param innerHTML
 */
function transformDisplayedValue(innerHTML: string): string {
  try {
    let startRet="Sum:&nbsp;";  // We do as if
    if (innerHTML.indexOf(startRet)==-1) { // It's not a Sum
      startRet='';
    }
    let startAmount=innerHTML.indexOf('"amount": ');
    if( startAmount!=-1) {
      startAmount = startAmount+10;
      const endAmount = innerHTML.indexOf(',', startAmount+1);
      return startRet+innerHTML.substring(startAmount, endAmount);
    } else {
      return innerHTML;
    }
  } catch (e) {
    return innerHTML;
  }
}

describe('ReportTableComponent', () => {
  let component: ReportTableComponent;
  let fixture: ComponentFixture<ReportTableComponent>;
  let containerFixture: ComponentFixture<TestInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTableComponent, TestInsertComponent],
      imports: [PluginCommonModule.forRoot(), SandboxModule, BasicModule, FieldsModule, CommonModule, TableModule, TooltipModule]
    }).compileComponents();

    // For some reasons, plugin module are not correctly registered by TestBed in Angular, so I just register them internally
    const cls:ComponentLoaderService = TestBed.inject(ComponentLoaderService);
    cls.registerModuleForTest(FieldsModule, 'fields');
    cls.registerModuleForTest(BasicModule, 'basic');

    fixture = TestBed.createComponent(ReportTableComponent);
    component=fixture.componentInstance;

    TestInsertComponent.COMPONENT_TO_TEST=component;
    containerFixture = TestBed.createComponent(TestInsertComponent);
    containerFixture.detectChanges();
    fixture.detectChanges();
    await containerFixture.whenStable();
  });

  it('should create', () => {
    expect(containerFixture.componentInstance).toBeTruthy();
  });

  it('should display a non grouped table',async () => {
    dtcde.getModelManager().resetContent(MODEL);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba/as/baa'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba/as/baa');
    component.initCommandFlow(provider, entityPointer);

    await DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return component.cols.length == 5;
    }, 20, 5).then(async value => {
      if (!value) throw new Error ("No column values are updated");
      else {
        component.setValue(new TestEntityListManager('creation/entities/aa', new DontCodeStorePreparedEntities<any>(
          sortedData, undefined, undefined
        )));

        containerFixture.detectChanges();
        expect(component.cleanedTableData).toHaveLength(3);
        expect(component.cols).toHaveLength(5);
        const tableRows = containerFixture.debugElement.queryAll(By.css('tr'));
        expect(tableRows).toHaveLength(4);


        expect(tableRows[1].children[0].nativeElement.textContent.trim()).toEqual('Test1');
        expect(tableRows[1].children[1].nativeElement.textContent.trim()).toEqual('Type1');
        expect(tableRows[1].children[2].nativeElement.textContent.trim()).toEqual('123');
        expect(tableRows[1].children[3].nativeElement.textContent.trim()).toEqual('€250.00');
        expect(tableRows[1].children[4].nativeElement.textContent.trim()).toEqual('06/12/2023');

      }

    });
  });

  it('should display a grouped table with simple types',async () => {
    dtcde.getModelManager().resetContent(MODEL);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/bb/as/bba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/bb/as/bba');
    component.initCommandFlow(provider, entityPointer);

    await DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return component.cols.length == 5;
    }, 20, 5).then(async value => {
      if (!value) throw new Error ("No column values are updated");
      else {
        // We pre-populate all fields to just test the display
        const dontCodeStoreAggregates = {
          "aaa":new DontCodeStoreAggregate('value', DontCodeGroupOperationType.Sum),
          "aab":new DontCodeStoreAggregate('value', DontCodeGroupOperationType.Minimum),
          "aac":new DontCodeStoreAggregate('name', DontCodeGroupOperationType.Count),
          "aad":new DontCodeStoreAggregate('value', DontCodeGroupOperationType.Maximum)
        };
        component.setValue(new TestEntityListManager('creation/entities/aa', new DontCodeStorePreparedEntities<any>(
          sortedData, undefined, new DontCodeStoreGroupedByEntities(
            new DontCodeStoreGroupby('type', dontCodeStoreAggregates),
            new Map ([
                ['Type1',[new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aaa, 123+234),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aab, 123),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aac, 2),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aad, 234)]],
                ['Type2',[new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aaa, 456),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aab, 456),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aac, 1),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aad, 456)]],
              ]
            ))
        )));

        containerFixture.detectChanges();
        expect(component.cleanedTableData).toHaveLength(3);
        expect(component.cols).toHaveLength(5);
        const tableRows = containerFixture.debugElement.queryAll(By.css('tr'));
        expect(tableRows).toHaveLength(8); // 4 rows of data + 2 header + 2 footer

        // Check the groupedby have been calculated correctly
        expect(tableRows[4].children[0].nativeElement.textContent.trim()).toEqual('Count:\xa02');
        expect(tableRows[4].children[2].nativeElement.textContent.trim()).toEqual('Sum:\xa0357Minimum:\xa0123Maximum:\xa0234');
        expect(tableRows[7].children[0].nativeElement.textContent.trim()).toEqual('Count:\xa01');
        expect(tableRows[7].children[2].nativeElement.textContent.trim()).toEqual('Sum:\xa0456Minimum:\xa0456Maximum:\xa0456');
      }

    });
  });

  it('should display a grouped table with plugin types',async () => {
    dtcde.getModelManager().resetContent(MODEL);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/bb/as/bba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/bb/as/bba');
    component.initCommandFlow(provider, entityPointer);

    await DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return component.cols.length == 5;
    }, 20, 5).then(async value => {
      if (!value) throw new Error ("No column values are updated");
      else {
        // We pre-populate all fields to just test the display
        const dontCodeStoreAggregates = {
          "aba":new DontCodeStoreAggregate('amount', DontCodeGroupOperationType.Sum),
          "abb":new DontCodeStoreAggregate('date', DontCodeGroupOperationType.Minimum),
          "abc":new DontCodeStoreAggregate('amount', DontCodeGroupOperationType.Average),
          "abd":new DontCodeStoreAggregate('date', DontCodeGroupOperationType.Maximum)
        };
        component.setValue(new TestEntityListManager('creation/entities/aa', new DontCodeStorePreparedEntities<any>(
          sortedData, undefined, new DontCodeStoreGroupedByEntities(
            new DontCodeStoreGroupby('type', dontCodeStoreAggregates),
            new Map ([
                ['Type1',[new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aba, {amount: 250+43, currencyCode: 'EUR'}),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abb, new Date(2023, 5, 12)),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abc, {amount: (250+43)/2, currencyCode: 'EUR'}),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abd, new Date(2023, 5, 14))]],
                ['Type2',[new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aba, {amount: 125, currencyCode: 'EUR'}),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abb, new Date(2023, 4, 14)),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abc, {amount: 125, currencyCode: 'EUR'}),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.abd, new Date(2023, 4, 14))]],
              ]
            ))
        )));

        containerFixture.detectChanges();
        expect(component.cleanedTableData).toHaveLength(3);
        expect(component.cols).toHaveLength(5);
        const tableRows = containerFixture.debugElement.queryAll(By.css('tr'));
        expect(tableRows).toHaveLength(8);

        // Check the groupedby have been calculated correctly
        expect(tableRows[4].children[3].nativeElement.textContent.trim()).toEqual('Sum:\xa0€293.00Average:\xa0€146.50');
        expect(tableRows[4].children[4].nativeElement.textContent.trim()).toEqual('Minimum:\xa006/12/2023Maximum:\xa006/14/2023');
        expect(tableRows[7].children[3].nativeElement.textContent.trim()).toEqual('Sum:\xa0€125.00Average:\xa0€125.00');
        expect(tableRows[7].children[4].nativeElement.textContent.trim()).toEqual('Minimum:\xa005/14/2023Maximum:\xa005/14/2023');
      }

    });
  });

  it('should display correctly "count of" plugin types',async () => {
    dtcde.getModelManager().resetContent(MODEL);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/bb/as/bba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/bb/as/bba');
    component.initCommandFlow(provider, entityPointer);

    await DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return component.cols.length == 5;
    }, 20, 5).then(async value => {
      if (!value) throw new Error("No column values are updated");
      else {
        // We pre-populate all fields to just test the display
        const dontCodeStoreAggregates = {
          "aca":new DontCodeStoreAggregate('amount', DontCodeGroupOperationType.Count),
          "acb":new DontCodeStoreAggregate('date', DontCodeGroupOperationType.Count)
        };
        component.setValue(new TestEntityListManager('creation/entities/aa', new DontCodeStorePreparedEntities<any>(
          sortedData, undefined, new DontCodeStoreGroupedByEntities(
            new DontCodeStoreGroupby('type', dontCodeStoreAggregates),
            new Map([
                ['Type1', [new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aca, 2),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.acb, 2)]],
                ['Type2', [new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.aca, 1),
                  new DontCodeStoreGroupedByValues(dontCodeStoreAggregates.acb, 1)]]
              ]
            ))
        )));

        containerFixture.detectChanges();
        expect(component.cleanedTableData).toHaveLength(3);
        expect(component.cols).toHaveLength(5);
        const tableRows = containerFixture.debugElement.queryAll(By.css('tr'));
        expect(tableRows).toHaveLength(8);

        // Check the groupedby have been calculated correctly
        expect(tableRows[4].children[3].nativeElement.textContent.trim()).toEqual('Count:\xa02');
        expect(tableRows[4].children[4].nativeElement.textContent.trim()).toEqual('Count:\xa02');
        expect(tableRows[7].children[3].nativeElement.textContent.trim()).toEqual('Count:\xa01');
        expect(tableRows[7].children[4].nativeElement.textContent.trim()).toEqual('Count:\xa01');
      }

    });
  });

  it ('should display OnlyLowest elements per group', (done) => {

    dtcde.getModelManager().resetContent({
      creation: {
        entities: {
          'aa': {
            name: 'SimpleEntity',
            fields: {
              'aaa': {
                name: 'Name',
                type: 'string'
              },
              'aab': {
                name: 'Price1',
                type: 'number'
              },
              'aac': {
                name: 'Price2',
                type: 'number'
              },
              'aad': {
                name: 'Price3',
                type: 'number'
              },

            }
          }
        },
        reports: {
          'ba': {
            title: 'CrossTest',
            for: 'SimpleEntity',
            groupedBy: {
              'baa':{
                label: "By Shop",
                of: "number",
                show:"OnlyLowest",
                display: {
                  'baaa':{
                    operation: "Count",
                    of: "Name",
                    label: "#"
                  },
                  'baab':{
                    operation: "Sum",
                    of: "Price1",
                    label: "Price1 Sum"
                  },
                  'baac':{
                    operation: "Sum",
                    of: "Price2",
                    label: "Price2 Sum"
                  },
                  'baad':{
                    operation: "Sum",
                    of: "Price3",
                    label: "Price3 Sum"
                  }
                }
              }
            },
            as: {
              'bab': {
                title: 'Grouped Table',
                type: 'Table'
              }
            }
          }
        }
      }
    });

    DontCodeTestManager.addDummyProviderFromContent("creation/entities/aa", [{
      Name: 'Test1',
      Price1: 123,
      Price2: 112,
      Price3: 150
    }, {
      Name: 'Test2',
      Price1: 456,
      Price2: 560,
      Price3: 340
    },{
      Name: 'Test3',
      Price1: 156,
      Price2: 260,
      Price3: 340
    }, {
      Name: 'Test4',
      Price1: 183,
      Price2: 123,
      Price3: 90
    }, {
      Name: 'Test5',
      Price1: 46,
      Price2: 50,
      Price3: 130
    }]);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba/as/bab'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba/as/bab');
    const reportDescription = dtcde.getModelManager().findAtPosition('creation/reports/ba') as DontCodeReportType;
    component.initCommandFlow(provider, entityPointer);

    const entityListManager = new EntityListManager(provider.calculatePointerFor(
        'creation/entities/aa'),
      dtcde.getModelManager().findAtPosition('creation/entities/aa'),
      dtcde.getStoreManager(), dtcde.getModelManager());

    entityListManager.searchAndPrepareEntities(undefined, reportDescription.groupedBy,
      new CrossDataTransformer(dtcde.getModelManager(),
        ['Price1', 'Price2', 'Price3'],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.values(reportDescription.groupedBy!)[0] as DontCodeReportGroupType,
        dtcde.getSchemaManager().generateSchemaPointer('creation/entities/aa')
      )
    ).catch(reason => {
      done (reason);
    });

    component.setValue(entityListManager);

    DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return (component.groupedValuesByField?.size==3);
    }).then(correct => {
      if (correct) {
        // Check that the data is correct
        expect(component.cols.length).toEqual(4);
        expect(component.groupRowsBy).toEqual('OnlyLowest');
        containerFixture.detectChanges();

        containerFixture.whenStable().then(()=> {
          const rows = containerFixture.debugElement.queryAll(By.css('tbody > tr'));
          expect(rows.length).toEqual(11); // 5 rows of data + 3 headers + 3 footers
          for (const row of rows) {
            expect((row.children.length==4) || (row.children.length==1) ).toBeTruthy; // 4 columns
          }

          // Grab all textes
          const allTextes=new Array<Array<string>>();
          for (const row of rows) {
            const textes=new Array<string>();
            for (const span of row.queryAll(By.css('span'))) {
              textes.push( span.nativeNode.innerHTML);
            }
            if (textes.length==0) {
              // For grouping it's div and not span
              for (const div of row.queryAll(By.css('div'))) {
                textes.push( div.nativeNode.innerHTML);
              }
            }
            allTextes.push(textes);

          }
          // Check the textes
          expect(allTextes).toStrictEqual([
            ['Price1'],
            ['Test3', '156', '260', '340'],
            ['Test5', '46', '50', '130'],
            ["Count:&nbsp;2","Sum:&nbsp;202","Sum:&nbsp;310","Sum:&nbsp;470"],
            ['Price2'],
            ['Test1','123', '112', '150'],
            [ "Count:&nbsp;1","Sum:&nbsp;123","Sum:&nbsp;112","Sum:&nbsp;150"],
            ['Price3'],
            ['Test2', '456', '560', '340'],
            ['Test4', '183', '123', '90'],
            ["Count:&nbsp;2","Sum:&nbsp;639","Sum:&nbsp;683","Sum:&nbsp;430"]
          ]);

          done();
        }).catch(reason => {
          done(reason);
        });
      } else {
        done("No values calculated");
      }
    }).catch(reason => {
      done (reason);
    });

  });

  it ('should display OnlyLowest elements with plugin and null types', (done) => {

    dtcde.getModelManager().resetContent({
      creation: {
        entities: {
          'aa': {
            name: 'PriceEntity',
            fields: {
              'aaa': {
                name: 'Name',
                type: 'string'
              },
              'aab': {
                name: 'Price1',
                type: 'Price'
              },
              'aac': {
                name: 'Price2',
                type: 'Price'
              },
              'aad': {
                name: 'Price3',
                type: 'Price'
              },

            }
          }
        },
        reports: {
          'ba': {
            title: 'CrossTest Price',
            for: 'PriceEntity',
            groupedBy: {
              'baa':{
                label: "By Shop",
                of: "Price",
                show:"OnlyLowest",
                display: {
                  'baaa':{
                    operation: "Count",
                    of: "Name",
                    label: "#"
                  },
                  'baab':{
                    operation: "Sum",
                    of: "Price1",
                    label: "Price1 Sum"
                  },
                  'baac':{
                    operation: "Sum",
                    of: "Price2",
                    label: "Price2 Sum"
                  },
                  'baad':{
                    operation: "Sum",
                    of: "Price3",
                    label: "Price3 Sum"
                  }
                }
              }
            },
            as: {
              'bab': {
                title: 'Grouped Table',
                type: 'Table'
              }
            }
          }
        }
      }
    });

    DontCodeTestManager.addDummyProviderFromContent("creation/entities/aa", [{
      Name: 'Test1',
      Price1: { cost: {amount:123, currencyCode:'EUR'}},
      Price2: { cost: {amount:112, currencyCode:'EUR'}},
      Price3: { cost: {amount:150, currencyCode:'EUR'}}
    }, {
      Name: 'Test2',
      Price1: { cost: {amount:456, currencyCode:'EUR'}},
      Price2: { cost: {amount:560, currencyCode:'EUR'}},
      Price3: { cost: {amount:340, currencyCode:'EUR'}}
    },{
      Name: 'Test3',
      Price1: { cost: {amount:156, currencyCode:'EUR'}},
      Price2: { cost: {amount:260, currencyCode:'EUR'}},
      Price3: { cost: {amount:340, currencyCode:'EUR'}}
    },{
      Name: 'TestNull',
      Price1: undefined,
      Price2: { cost: {amount: 10, currencyCode:'EUR'}},
      Price3: { cost: { currencyCode:'EUR'}}
    }, {
      Name: 'Test4',
      Price1: { cost: {amount:183, currencyCode:'EUR'}},
      Price2: { cost: {amount:123, currencyCode:'EUR'}},
      Price3: { cost: {amount:90, currencyCode:'EUR'}}
    },{
      Name: 'TestNull2',
      Price1: undefined,
      Price2: { cost: null},
      Price3: { cost: { amount:5, currencyCode:'EUR'}}
    }, {
      Name: 'Test5',
      Price1: { cost: {amount:46, currencyCode:'EUR'}},
      Price2: { cost: {amount:50, currencyCode:'EUR'}},
      Price3: { cost: {amount:130, currencyCode:'EUR'}}
    }], dtcde.getModelManager());

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba/as/bab'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba/as/bab');
    const reportDescription = dtcde.getModelManager().findAtPosition('creation/reports/ba') as DontCodeReportType;
    component.initCommandFlow(provider, entityPointer);

    const entityListManager = new EntityListManager(provider.calculatePointerFor(
        'creation/entities/aa'),
      dtcde.getModelManager().findAtPosition('creation/entities/aa'),
      dtcde.getStoreManager(), dtcde.getModelManager());

    entityListManager.searchAndPrepareEntities(undefined, reportDescription.groupedBy,
      new CrossDataTransformer(dtcde.getModelManager(),
        ['Price1', 'Price2', 'Price3'],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.values(reportDescription.groupedBy!)[0] as DontCodeReportGroupType,
        dtcde.getSchemaManager().generateSchemaPointer('creation/entities/aa')
      )
    ).catch(reason => {
      done (reason);
    });

    component.setValue(entityListManager);

    DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return (component.groupedValuesByField?.size==3);
    }).then(correct => {
      if (correct) {
        // Check that the data is correct
        expect(component.cols.length).toEqual(4);
        expect(component.groupRowsBy).toEqual('OnlyLowest');
        containerFixture.detectChanges();

        containerFixture.whenStable().then(()=> {
          const rows = containerFixture.debugElement.queryAll(By.css('tbody > tr'));
          expect(rows.length).toEqual(13); // 7 rows of data + 3 headers + 3 footers
          for (const row of rows) {
            expect((row.children.length==4) || (row.children.length==1) ).toBeTruthy(); // 4 columns
          }

          // Grab all textes
          const allTextes=new Array<Array<string>>();
          for (const row of rows) {
            const textes=new Array<string>();
            for (const span of row.queryAll(By.css('span'))) {
              textes.push( transformDisplayedValue (span.nativeNode.innerHTML));
            }
            if (textes.length==0) {
              // For grouping it's div and not span
              for (const div of row.queryAll(By.css('div'))) {
                textes.push( transformDisplayedValue(div.nativeNode.innerHTML));
              }
            }
            allTextes.push(textes);

          }
          // Check the texts
          // Please note that as we don't have the CommerceModule, it's the json value that is being displayed
          // So we're going to parse the Json and extract the cost value to ease comparison

          expect(allTextes).toStrictEqual([
            ['Price1'],
            ['Test3', '156', '260', '340'],
            ['Test5', '46', '50', '130'],
            ["Count:&nbsp;2","Sum:&nbsp;202","Sum:&nbsp;310","Sum:&nbsp;470"],
            ['Price2'],
            ['Test1','123', '112', '150'],
            ['TestNull','', '10', '{\n  "cost": {\n    "currencyCode": "EUR"\n  }\n}'],
            [ "Count:&nbsp;2","Sum:&nbsp;123","Sum:&nbsp;122","Sum:&nbsp;150"],
            ['Price3'],
            ['Test2', '456', '560', '340'],
            ['Test4', '183', '123', '90'],
            ['TestNull2','', '{\n  "cost": null\n}', '5'],
            ["Count:&nbsp;3","Sum:&nbsp;639","Sum:&nbsp;683","Sum:&nbsp;435"]
          ]);

          done();
        }).catch(reason => {
          done(reason);
        });
      } else {
        done("No values calculated");
      }
    }).catch(reason => {
      done (reason);
    });

  });

});

const MODEL_SUMTEST_GROUPBY=[{
  of: 'type',
  label: 'Sum of values',
  display: [
    {
      operation: DontCodeGroupOperationType.Sum,
      of: 'value'
    }
  ]
}];

const MODEL = {
  creation: {
    entities: {
      'aa': {
        name: 'Entity1',
        fields: {
          'aaa': {
            name: 'name',
            type: 'Text'
          },
          'aaaa': {
            name: 'type',
            type: 'Text'
          },
          'aab': {
            name: 'value',
            type: 'number'
          },
          'aac': {
            name: 'amount',
            type: 'Euro'
          },
          'aad': {
            name: 'date',
            type: 'Date'
          }
        }
      }
    },
    reports: {
      'ba': {
        title: 'Test',
        for: 'Entity1',
        as: {
          'baa': {
            title: 'Simple Table',
            type: 'Table'
          }
        }
      },
      'bb': {
        title: 'SumTest',
        for: 'Entity1',
        groupedBy: MODEL_SUMTEST_GROUPBY,
        as: {
          'bba': {
            title: 'Sum Table',
            type: 'Table',
            of: 'value',
          }
        }
      }
    }
  }
}

class TestEntityListManager extends EntityListManager<any> {
  constructor(position:string, prepared: DontCodeStorePreparedEntities<any>) {
    super(dtcde.getSchemaManager().generateSchemaPointer(position), {}, dtcde.getStoreManager(), dtcde.getModelManager());
    this.entities=prepared.sortedData;
    this.prepared=prepared;
  }

}

@Component({
  selector: 'dontcode-test-insert',
  template: '<ng-container *ngTemplateOutlet="getTemplate()"></ng-container>'
})
class TestInsertComponent {

  public static COMPONENT_TO_TEST: ReportTableComponent;

  getTemplate(): TemplateRef<any> | null {
    return TestInsertComponent.COMPONENT_TO_TEST.providesTemplates().forFullView;
  }
}
