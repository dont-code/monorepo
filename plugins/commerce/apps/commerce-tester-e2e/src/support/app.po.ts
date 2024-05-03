
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
export const checkValueOfDropdownWithName = (name: string, value:string) =>  {
  cy.get ('p-dropdown[ng-reflect-name="' + name +'"], p-dropdown[name="'+ name +'"] span .p-dropdown-label').should('contains.text', value);
}

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
export const getButtonWithName = (name: string, timeout?:number) =>
  cy.get('button[ng-reflect-name="' + name + '"], button[name="' + name + '"]', {timeout});
export const getInputWithName = (name: string) =>
  cy.get('input[ng-reflect-name="' + name + '"], input[name="' + name + '"]');
export const getValueOfInputWithName = (name: string) =>
  getInputWithName(name).invoke('val');
export const checkValueOfInputWithName = (name: string, value: string) =>
  getValueOfInputWithName(name).should('equal', value);
export const getCheckWithName = (name: string) =>
  cy.get('p-checkbox[ng-reflect-name="' + name + '"]');
export const getButtonWithText = (text: string) =>
  cy.get('button').contains(text).first();

export const getListRowWithText = (text:string) => cy.get('table > tbody > tr').contains('tr', text);

export const getDivWithId = (id:string) => cy.get('div[id="'+id+'"');
