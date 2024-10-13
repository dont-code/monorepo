import {
  checkValueOfDropdownWithName, checkValueOfInputWithName,
  clickAutoComplete,
  getButtonWithName, getButtonWithText,
  getDropdownListItemWithName,
  getDropdownWithName,
  getInputWithName,
  getListRowWithText,
  getSendButton,
  getSubMenuWithText,
  selectPopupChoiceWithText,
} from '../support/app.po';
import {getPriceFormWithName, getTableHeader} from "../support/commerce.po";

describe('Commerce test', () => {
  beforeEach(() => cy.visit('/'));
  beforeEach(() => cy.forceDeleteIndexedDbStorage("Commerce Plugin Tester"));

  it('should display Price', () => {
      cy.intercept('GET', '/assets/dev/templates.json').as('LoadTemplate');
      cy.intercept({hostname:'shared.collin.best'}, {
        body: RESULT_QUERY

      }).as('LoadPrice');

      getSubMenuWithText('Dev').click(); // Move to dev page

      cy.wait('@LoadTemplate');

      clickAutoComplete('template');
      selectPopupChoiceWithText('Online Shops');
      getSendButton().click();

      clickAutoComplete('template');
      selectPopupChoiceWithText('Product Price');
      getSendButton().click();

      getSubMenuWithText('Online Shop').click();
      cy.get('th[id="header-Shop"]');
      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Shop').type("Shop 1");
      getDropdownWithName('Type').click("right");
      getDropdownListItemWithName('GreenWeez').click();
      getButtonWithName("save").click();
      cy.get('th[id="header-Shop"]').should('be.visible');

      getSubMenuWithText('Online Shop').click();  // Click again as it seems sometimes the new button is not working.
      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Shop').type("Shop 2");
      getDropdownWithName('Type').click("right");
      getDropdownListItemWithName('EasyParapharmacie').click();
      getButtonWithName("save").click();

      cy.get('th[id="header-Shop"]').should('be.visible');
      getSubMenuWithText('Dev').click(); // Move to dev page
      getSubMenuWithText('Online Shop').click();
      cy.get('th[id="header-Shop"]');
      getSubMenuWithText('Product').click();

      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Name').type("Product 1");
      getInputWithName('nameInShop').type("Product 1 Name");
      getDropdownWithName('shop').click('right');
      getDropdownListItemWithName('Shop 2').click();
      getButtonWithName('FetchPrice').click();
      cy.wait('@LoadPrice');

      getButtonWithText('Select').first().click();
      checkValueOfInputWithName('cost', Intl.NumberFormat(navigator.language).format(10.99));

      getDropdownWithName('currencyCode').click('right');
      getDropdownListItemWithName('Pound Sterling - GBP').click();

      getButtonWithName("save").click();
      cy.get('th[id="header-Name"]').should('be.visible');

      getListRowWithText(FormatUtils.generateMoney(10.99, "GBP"));
  });

  it('should be easy to use', () => {
        // Loads a specific template
      cy.intercept('GET', '/assets/dev/templates.json', MULTI_PRODUCT_TEMPLATE
      ).as('LoadMultiTemplate');

      getSubMenuWithText('Dev').click(); // Move to dev page

      cy.wait('@LoadMultiTemplate');

      clickAutoComplete('template');
      selectPopupChoiceWithText('Online Shop');
      getSendButton().click();

      clickAutoComplete('template');
      selectPopupChoiceWithText('Multi Product');
      getSendButton().click();

      getSubMenuWithText('Online Shop').click();
      getTableHeader('Shop').should('contain.text', "Shop");

      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Shop').type("Shop GW");
      getDropdownWithName('Type').click("right");
      getDropdownListItemWithName('GreenWeez').click();
      getButtonWithName("save").click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Shop"]').should('be.visible');
      getListRowWithText("Shop GW");

      getSubMenuWithText('Online Shop').click();  // Click again as it seems sometimes the new button is not working.
      getTableHeader('Shop').should('contain.text', "Shop");

      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Shop').type("Shop EP");
      getDropdownWithName('Type').click("right");
      getDropdownListItemWithName('EasyParapharmacie').click();
      getButtonWithName("save").click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Shop"]').should('be.visible');
      getListRowWithText("Shop EP");

      getSubMenuWithText('Multi Product').click();
      getTableHeader('Name').should('contain.text', "Name");

      getButtonWithName("new").should('be.enabled');
      getButtonWithName("new").click();
      getInputWithName('Name').type("Global Product Name");

      let curShop = getPriceFormWithName("Shop EP");
      curShop.within(() => {
        getInputWithName('nameInShop').focus();
        getInputWithName('nameInShop').should('have.value', "Global Product Name");
        checkValueOfDropdownWithName('shop', "Shop EP");
      });

      curShop = getPriceFormWithName("Shop GW");
      curShop.within(() => {
        getInputWithName('nameInShop').should('have.value', "Global Product Name");
        checkValueOfDropdownWithName('shop', "Shop GW");
      });

      getButtonWithName("save").click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Name"]').should('be.visible');

      getSubMenuWithText('Dev').click(); // Move to dev page
      getSubMenuWithText('Multi Product').click();

      getListRowWithText("Global Product Name").click();

      // Check the values were saved properly
      curShop = getPriceFormWithName("Shop EP");
      curShop.within(() => {
        getInputWithName('nameInShop').should('have.value', "Global Product Name");
        checkValueOfDropdownWithName('shop', "Shop EP");
      });

      getInputWithName('Name').type(" New");

      curShop = getPriceFormWithName("Shop EP");
      curShop.within(() => {
        getInputWithName('nameInShop').focus();
        getInputWithName('nameInShop').should('have.value', "Global Product Name New");

        getInputWithName('nameInShop').clear().type("Shop Product Name");
      });

      getInputWithName('Name').type(" Again");
      curShop.within(() => {
        getInputWithName('nameInShop').focus();
        getInputWithName('nameInShop').should('have.value', "Shop Product Name");
      });
    });

});

const RESULT_QUERY= {
  "results": [
    {
      "hits": [],
    },
    {
      "hits": [
        {
          "name": "Détoxifiant Hépatique Desmodium, Chardon Marie 20 Ampoules Arkofluides Arkopharma",
          "url": "https://www.easypara.fr/arkofluides-detoxifiant-hepatique-20-ampoules.html",
          "image_url": "https://www.easypara.fr/media/catalog/product/cache/500698179a37c83eaf5d7bed656e45f3/9/1/91293.jpg",
          "ean_code": 3578835500752,
          "price": {
            "EUR": {
              "default": 10.99,
            }
          }
        },
        {
          "name": "Chardon Marie 60 Gelules Naturactive",
          "url": "https://www.easypara.fr/naturactive-chardon-marie-60-gelules.html",
          "image_url": "https://www.easypara.fr/media/catalog/product/cache/500698179a37c83eaf5d7bed656e45f3/3/8/38135.jpg",
          "ean_code": 3700026996703,
          "price": {
            "EUR": {
              "default": 9.8,
            }
          }
        }
      ]
    }
  ]

};

const MULTI_PRODUCT_TEMPLATE=          [
  {
    "name": "Online Shops",
    "sequence": [
      {
        "position": "creation/entities/a",
        "type": "ADD",
        "value": {
          "name": "Online Shop"
        }
      },
      {
        "position": "creation/entities/a/fields",
        "type": "ADD",
        "value": {
          "aa": {
            "name": "Shop",
            "type": "Text"
          },
          "ab": {
            "name": "Type",
            "type": "Shop type"
          }
        }
      }
    ]
  },
  {
    "name": "Multi Product",
    "sequence": [
      {
        "position": "creation/entities/b",
        "type": "ADD",
        "value": {
          "name": "Multi Product"
        }
      },
      {
        "position": "creation/entities/b/fields",
        "type": "ADD",
        "value": {
          "aa": {
            "name": "Name",
            "type": "Text"
          },
          "ab": {
            "name": "Shop EP",
            "type": "Price"
          },
          "ac": {
            "name": "Shop GW",
            "type": "Price"
          }
        }
      }
    ]
  }
];
export class FormatUtils {
  public static generateMoney(amount: number, currencyCode: string): string {
    let ret = Intl.NumberFormat(navigator.language, {style: 'currency', currency: currencyCode}).format(amount);

    // Replace nbsps with space
    ret = ret.replace("\u00a0", " ");
    ret = ret.replace("\u202F", " ");
    /*   const chars=[];
       for (let i=0;i<ret.length;i++) {
         chars.push(ret.charCodeAt(i));
       }
       console.log("Checked:",ret, ...chars);*/
    return ret;
  }
}
