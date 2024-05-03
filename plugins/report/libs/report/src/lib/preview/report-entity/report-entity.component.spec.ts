import 'core-js/stable/structured-clone'; // Some bugs in Jest disable the native call
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportEntityComponent} from './report-entity.component';
import {PluginCommonModule} from '@dontcode/plugin-common';
import {
  Action,
  Change,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  DontCodeTestManager,
  dtcde
} from "@dontcode/core";
import {Observable} from "rxjs";

describe('ReportEntityComponent', () => {
  let component: ReportEntityComponent;
  let fixture: ComponentFixture<ReportEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportEntityComponent],
      imports: [PluginCommonModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEntityComponent);
    component = fixture.componentInstance;
  });

  it ('should handle subfields', (done) => {

    dtcde.getModelManager().resetContent({
      creation: {
        entities: {
          'aa': {
            name: 'Entity1',
            fields: {
              'aaa': {
                name: 'name',
                type: 'string'
              },
              'aab': {
                name: 'value',
                type: 'number'
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
                title: 'Pie Chart',
                type: 'Pie',
                of: 'value'
              }
            }
          }
        }
      }
    });

    DontCodeTestManager.addDummyProviderFromContent("creation/entities/aa", [{
      Name: 'Test1',
      Value: 123
    }, {
      Name: 'Test2',
      Value: 456
    }]);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba');
    component.initCommandFlow(provider, entityPointer);

    fixture.detectChanges();

    DontCodeTestManager.waitUntilTrue(() => {
      return (component.getSubFields().length == 1) && (component.title=='Test');
    }, done);
  });


  it ('should manage grouping', (done) => {

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
                name: 'Value',
                type: 'number'
              }
            }
          }
        },
        reports: {
          'ba': {
            title: 'SimpleTest',
            for: 'SimpleEntity',
            groupedBy: {
              'bab':{
                of: "Name",
                label: "By Name",
                display: {
                  'baba':  {
                    operation: "Count",
                    of:"Name",
                    label:"#"
                  },
                  'babb':  {
                    operation:"Sum",
                    of:"Value",
                    label:"Sum"
                  }
                }
              }
            },
            as: {
              'baa': {
                title: 'Simple Table',
                type: 'Table'
              }
            }
          }
        }
      }
    });

    DontCodeTestManager.addDummyProviderFromContent("creation/entities/aa", [{
      Name: 'Test1',
      Value: 123
    }, {
      Name: 'Test2',
      Value: 456
    },{
      Name: 'Test1',
      Value: 432
    }, {
      Name: 'Test2',
      Value: 124
    }, {
      Name: 'Test2',
      Value: 642
    }]);

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba');
    component.initCommandFlow(provider, entityPointer);

    fixture.detectChanges();

    DontCodeTestManager.waitUntilTrue(() => {
      return (component.reportEntityData?.groupedByEntities?.values?.size==2);
    }, done);
  });

  it ('should manage cross table grouping', (done) => {

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

    const provider = new TestProviderInterface(dtcde.getModelManager().findAtPosition('creation/reports/ba'));
    const entityPointer = provider.calculatePointerFor('creation/reports/ba');
    component.initCommandFlow(provider, entityPointer);

    fixture.detectChanges();

    DontCodeTestManager.waitUntilTrueAndEmit(() => {
      return (component.reportEntityData?.groupedByEntities?.values?.size==3);
    }).then(correct => {
      if (correct) {
        // Check that the data is correct
        const values = component.reportEntityData?.groupedByEntities?.values;
        if (values!=null) {
          expect(values.get('Price1')?.length).toEqual(4);
          expect(values.get('Price1')?.[0].value).toEqual(2);
          expect(values.get('Price1')?.[1].value).toEqual(156+46);
          expect(values.get('Price2')?.[0].value).toEqual(1);
          expect(values.get('Price2')?.[2].value).toEqual(112);
          expect(values.get('Price3')?.[0].value).toEqual(2);
          expect(values.get('Price3')?.[3].value).toEqual(340+90);

          expect(component.reportEntityData.sortedData.length).toEqual(5);
          expect((component.reportEntityData.sortedData[0] as any).OnlyLowest).toEqual('Price2');
          expect((component.reportEntityData.sortedData[1] as any).OnlyLowest).toEqual('Price3');
          expect((component.reportEntityData.sortedData[2] as any).OnlyLowest).toEqual('Price1');
          expect((component.reportEntityData.sortedData[3] as any).OnlyLowest).toEqual('Price3');
          expect((component.reportEntityData.sortedData[4] as any).OnlyLowest).toEqual('Price1');

          done();
        }else {
          done("No values calculated");
        }
      }else {
        done("Couldn't calculate values of Grouped Entities.");
      }
    });

    // Now checks that the data is correct
  });
});

class TestProviderInterface implements CommandProviderInterface {
  constructor(protected toRet: any) {}

  getJsonAt(position: string): any {
    return this.toRet;
  }

  receiveCommands(position?: string, lastItem?: string): Observable<Change> {
    return new Observable<Change>();
  }

  calculatePointerFor(position: string): DontCodeModelPointer {
    return dtcde.getSchemaManager().generateSchemaPointer(position);
  }

  getSchemaManager(): DontCodeSchemaManager {
    return dtcde.getSchemaManager();
  }

  sendCommand(action: Action): Promise<void> {
    return Promise.resolve(undefined);
  }
}
