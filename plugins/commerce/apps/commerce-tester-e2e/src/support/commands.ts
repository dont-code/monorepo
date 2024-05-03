// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    clearDbCollections (dbName:string,...collections:string[]): Promise<void>;
    forceDeleteIndexedDbStorage (dbName:string): Cypress.Chainable<any>;
  }
}
//

Cypress.Commands.add('forceDeleteIndexedDbStorage', (dbName:string) => {
  console.log("Test: Deleting DB "+dbName);
  return cy.window().then ( (win) => {
    return cy.wrap (new Promise<void>((resolve, reject)=>  {
      if ((win as any)._indexedDbStorageServiceForceDelete != null) {
        console.log("Test: DB Delete Call");
        (win as any)._indexedDbStorageServiceForceDelete(dbName).then(() => {
          console.log("Test: DB Deleted");
          resolve();
        }).catch ( (reason:any) => {
          reject(reason);
        });
      } else {
        reject("Test: No Delete function in global window");
      }
    }));
  });
});

Cypress.Commands.add('clearDbCollections', (dbName:string, ...collections:string[]) => {

  return new Promise<void>((resolve, reject) => {
    console.log("Test: Cleaning DB");
    const checkversionrequest = window.indexedDB.open(dbName);

    checkversionrequest.onsuccess = (evt) =>{
      console.debug("Test: Opening IndexedDB");
      const db:IDBDatabase = (evt.target as any).result;

      for (const collection of collections) {
        if (db.objectStoreNames.contains( collection )) {
          //console.debug("Test: Clearing collection "+collection);
          const txn = db.transaction(collection, 'readwrite');
          txn.objectStore(collection).clear();
          txn.commit();
          console.debug("Test: Collection cleared "+collection);
        }
      }
      db.close();
      console.debug("Test: Closed IndexedDB");
      resolve ();
    };

    checkversionrequest.onerror = (evt) =>{
      reject("Test: Cannot open Database "+dbName+" because of "+evt.target);
    }
    resolve();
  });

});
