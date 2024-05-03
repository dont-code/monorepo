import {
  clickAutoComplete,
  getContentArea,
  getDropdownListItemWithName,
  getDropdownWithName,
  getInputWithName,
  getSendButton,
  getSubMenuWithText,
  selectPopupChoiceWithText,
} from '../support/app.po';

describe('plugin-tester', () => {
  beforeEach(() => cy.visit('/'));

  it('should display Seed Field', () => {
    cy.intercept('GET', '/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click(); // Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete('template');
    selectPopupChoiceWithText('Test Seed Field');
    getSendButton().click();
    getSubMenuWithText('Seed Field').click();

    getDropdownWithName('Test').click();
    getDropdownListItemWithName('Rosa Seed').click();

    getContentArea().contains('Value of Test: Rosa');
  });

  it('should display Seeder entity', () => {
    cy.intercept('GET', '/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click(); // Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete('template');
    selectPopupChoiceWithText('Test Seeded Entity');
    getSendButton().click();
    getSubMenuWithText('Seeded').click();

    getContentArea().contains('Hello from SeededEntityComponent !');
  });

  it('should still display other entities', () => {
    cy.intercept('GET', '/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click(); // Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete('template');
    selectPopupChoiceWithText('Test Other Entity');
    getSendButton().click();
    getSubMenuWithText('Not Seeded').click();

    getInputWithName('id').type('abc');
    getInputWithName('count').type('124');
    getInputWithName('check').click();

    getContentArea().contains('Value of id: abc');
    getContentArea().contains('Value of count: 124');
  });
});
