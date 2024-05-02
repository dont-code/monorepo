/** Declaration file generated by dts-gen */

country
{
  export function all(): any;

  export function count(): any;

  export function countryCapitalList(): any;

  export function countryCurrencyList(): Array<{ country, currency, currency_code }>;

  export function countryIsdCodeList(): any;

  export function countryLanguageList(): any;

  export function countryList(): any;

  export function findByCountryCode(code: any): void;

  export function findByCountryISD(isd: any): void;

  export function findByCountryName(name: any): void;

  export function findCountryByCapital(cap: any): void;

  export function search(str: any): void;

  export function searchByLanguage(str: any): void;
}

export default country;
