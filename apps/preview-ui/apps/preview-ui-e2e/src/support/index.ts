// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-mochawesome-reporter/register';
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes(`import.meta`)) {
    return false;
  }
  return true;
});

afterEach(() => {
  cy.wait(50, {log: false}).then(() => cy.addTestContext(Cypress.TerminalReport.getLogs('txt')))
});

installLogsCollector();

