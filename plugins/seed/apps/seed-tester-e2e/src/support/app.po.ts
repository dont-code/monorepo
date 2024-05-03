export const getGreeting = () => cy.get('h1');
export const getContentArea = () => cy.get('dontcode-sandbox-screen');
export const getSubMenuWithText = (text: string) =>
  cy
    .get('#mainMenu > .grid > .col > .ng-trigger > .p-menu-list')
    .contains(text);
export const clickAutoComplete = (name: string) =>
  cy.get('#' + name + ' > .p-autocomplete > .p-autocomplete-dropdown').click();
export const selectPopupChoiceWithText = (text: string) =>
  cy.get('.p-autocomplete-items').contains(text).click();
export const getSendButton = () => cy.get('#sendButton');
export const getDropdownWithName = (name: string) =>
  cy.get(
    'p-dropdown[ng-reflect-name="' +
      name +
      '"], p-dropdown[name="' +
      name +
      '"]'
  );
export const getDropdownListItemWithName = (content: string) =>
  cy.get('.p-dropdown-item').contains(content);
export const getButtonWithName = (name: string) =>
  cy.get('button[name="' + name + '"]');
export const getInputWithName = (name: string) =>
  cy.get('input[ng-reflect-name="' + name + '"], input[name="' + name + '"]');
export const getValueOfInputWithName = (name: string) =>
  getInputWithName(name).invoke('val');
export const checkValueOfInputWithName = (name: string, value: string) =>
  getValueOfInputWithName(name).should('equal', value);
export const getCheckWithName = (name: string) =>
  cy.get('p-checkbox[ng-reflect-name="' + name + '"]');
