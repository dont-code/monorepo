export const getPriceFormWithName = (name:string ) =>
  cy.contains( 'label', name).parent();

export const getTableHeader = (name:string) => cy.get('th[id="header-'+name+'"]');
