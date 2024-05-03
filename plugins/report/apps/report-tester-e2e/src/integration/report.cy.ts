import {
  clickAutoComplete,
  getContentArea,
  getSendButton,
  getSubMenuWithText,
  selectPopupChoiceWithText,
} from '../support/app.po';

describe('plugin-tester', () => {
  beforeEach(() => cy.visit('/'));

  it('should display Basic Report', () => {
    cy.intercept('GET', '/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click(); // Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete('template');
    selectPopupChoiceWithText('Test Basic Report');
    getSendButton().click();
    getSubMenuWithText('Basic Report').click();

    getContentArea().contains('Basic Report');
  });
});
