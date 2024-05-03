import {MoneyAmount} from "@dontcode/core";

export interface PriceModel {
  cost?:MoneyAmount;
  shop?:string;
  priceDate?:Date;
  lastCheckDate?:Date;

  idInShop?:string;
  nameInShop?:string;
  urlInShop?:string;

  outOfStock?:boolean;
  inError?:boolean;
}
