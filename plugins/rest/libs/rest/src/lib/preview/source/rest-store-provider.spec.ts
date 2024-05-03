import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {dtcde} from '@dontcode/core';
import {RestStoreProvider} from "@dontcode/plugin-rest";
import {tap} from "rxjs";


describe('Rest Store Provider', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let storeAAProvider: RestStoreProvider<EntityAA>;
  let storeABProvider: RestStoreProvider<EntityAB>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    }).compileComponents();

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    storeAAProvider =  new RestStoreProvider<EntityAA> (httpClient);
    storeABProvider =  new RestStoreProvider<EntityAB> (httpClient);
  });

  it('should load list of entities', (done) => {
    expect(storeAAProvider).toBeDefined();
    dtcde.getModelManager().resetContent(MODEL);
    storeAAProvider.searchEntities("creation/entities/aa").pipe (
      tap (value => {
        expect(value.length).toEqual(2);
        expect(value[0].string).toStrictEqual('Test');
        expect(value[0].number).toStrictEqual(1234);
        expect(value[0].boolean).toStrictEqual(true);
      })
      ).subscribe( {
      complete: () => {
        storeABProvider.searchEntities("creation/entities/ab").pipe (
          tap (value => {
            expect(value.length).toEqual(1);
            expect(value[0].name).toStrictEqual('DateTest');
            expect(value[0].date).toBeInstanceOf(Date);
            expect(value[0].dateTime).toBeInstanceOf(Date);
          })
        ).subscribe({
          complete:() => {
            done();
          },
          error: error => {
            done(error);
          }
        })
      },
    error: error => {
      done(error);
    }});

    const call = httpTestingController.expectOne("/testData/StandardSource");
    call.flush([{string: "Test", number: 1234, boolean:true},{string: "Test2", number: 12.34, boolean:false}]);
    const callDate = httpTestingController.expectOne("/testData/DateSource");
    callDate.flush([{name: "DateTest", dateTime: "2022-03-27T09:31:12.782Z", date:"2022-03-29"}]);

    httpTestingController.verify();
  });

})

interface EntityAA {
  string:string;
  number:number;
  boolean:boolean;
}

interface EntityAB {
  name:string;
  dateTime:Date;
  date:Date;
}

const MODEL= {
  creation: {
    name: "Test1",
    type: "application",
    entities: {
      "aa": {
        name: "Entity1",
        from: 'StandardSource',
        fields: {
          "aaa": {
            name: "string",
            type: "string"
          },
          "aab": {
            name: "number",
            type: "number"
          },
          "aac": {
            name: "boolean",
            type: "boolean"
          }
        }
      },
      "ab": {
        name: 'Entity2',
        from: 'DateSource',
        fields: {
          "aba": {
            name: 'name',
            type: 'string'
          },
          "abb": {
            name: 'dateTime',
            type: 'Date & Time'
          },
          "abc": {
            name: 'date',
            type: 'Date'
          }
        }
      }
    },
    sources: {
      "ba": {
        name: "StandardSource",
        type: "Rest",
        url: "/testData/StandardSource"
      },
      "bb": {
        name: "DateSource",
        type: "Rest",
        url: "/testData/DateSource"
      }
    }
  }
}


