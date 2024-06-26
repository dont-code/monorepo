import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import * as i18nCountries from 'i18n-iso-countries';
import countryDataEn from 'i18n-iso-countries/langs/en.json'

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent extends AbstractDynamicComponent implements OnInit{
  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  countries = new Array<{ name:string, alpha2code:string }>();
//  selectedCountry;

  ngOnInit(): void {
    i18nCountries.registerLocale(countryDataEn);

    for (const alpha2 in i18nCountries.getAlpha2Codes()) {
      this.countries.push({name:i18nCountries.getName(alpha2,'en')||alpha2, alpha2code: alpha2});
    }
  }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

}
