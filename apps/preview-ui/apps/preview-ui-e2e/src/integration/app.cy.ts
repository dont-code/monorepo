import {
  clickAutoComplete,
  getHeaderMenu,
  getMainMenu,
  getPageTitle,
  getSendButton,
  getSubMenu,
  getSubMenus,
  getSubMenuWithText,
  getToolbar,
  selectPopupChoiceWithText,
  getTableHeader
} from "../support/app.po";

describe('preview-ui', () => {
  beforeEach(() => cy.visit('/'));

  it('should display standard layout', () => {
    cy.intercept('GET','https://run.dont-code.net/plugin-report/next/remoteEntry.mjs').as('LoadLastPlugin');
    cy.wait('@LoadLastPlugin', {timeout:15000});

    getMainMenu();
    getHeaderMenu(1).should ('contain.text', 'Main Menu');
    getToolbar().should('contain.text','Preview');
    getSubMenu(2).should ('contain.text', 'Home');
    getSubMenu(3).should ('contain.text', 'Dev');
    getSubMenu(3).click();    // Move to dev page
    getPageTitle ().should('contain.text','Debug Page');
  });

  it('should load and reset apps', () => {
    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
      // First load the Task Manager app
    getSubMenuWithText('Dev').click();// Move to dev page
    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoiceWithText("Task Manager Application"); // Create Entity name
    getSendButton().click();
    getToolbar().should('contain.text','Task Manager');
    getSubMenus().should('have.length', 5);
    getSubMenuWithText( 'Task').click();
    getPageTitle().should('contain.text',"Task");
    getTableHeader('Name').should('contain.text', "Name");

      // Then load the Note Editor app
    getSubMenuWithText('Dev').click();// Move to dev page

    clickAutoComplete("template");
    selectPopupChoiceWithText("Note Editor Application"); // Create Entity name
    getSendButton().click();
    getToolbar().should('contain.text','Note Editor');
    getSubMenus().should('have.length', 5);
    getSubMenuWithText( 'Note').click();
    getPageTitle().should('contain.text',"Note");
    getTableHeader('Content').should('contain.text', "Content");

      // Then reset the app
    getSubMenuWithText('Dev').click();// Move to dev page

    clickAutoComplete("template");
    selectPopupChoiceWithText("Empty Application"); // Create Entity name
    getSendButton().click();
    getToolbar().should('contain.text','No Name');
    getSubMenus().should('have.length', 4);

  });

});
