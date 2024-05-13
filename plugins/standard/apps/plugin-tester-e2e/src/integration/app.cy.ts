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
  selectPopupChoiceWithText
} from "../support/app.po";
import {getTableHeader} from "../support/edit.po";

describe('Plugin tester', () => {
  beforeEach(() => cy.visit('/'));

  it('should display standard layout', () => {
    getMainMenu();
    getHeaderMenu(1).should ('contain.text', 'Main Menu');
    getToolbar().should('contain.text','Tester');
    getSubMenu(2).should ('contain.text', 'Home');
    getSubMenu(3).should ('contain.text', 'Dev');
    getSubMenu(3).click();    // Move to dev page
    getPageTitle ().should('contain.text','Debug Page');
  });


});
