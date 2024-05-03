import {Component, QueryList, ViewChildren} from '@angular/core';
import {TestScrapperComponent} from "./test-scrapper.component";

@Component({
  selector: 'dontcode-test-scrappers',
  templateUrl: './list-scrappers.component.html',
  styleUrls: ['./list-scrappers.component.scss'],
})
export class ListScrappersComponent {

  @ViewChildren(TestScrapperComponent)
  listOfTestComponents = new QueryList<TestScrapperComponent>();

  async checkAllPrices (): Promise<void> {
    for (const child of this.listOfTestComponents) {
      await child.checkPrice();
    }
  }
}
