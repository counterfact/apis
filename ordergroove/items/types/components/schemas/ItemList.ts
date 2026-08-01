import type { Item } from "./Item.js";

export type ItemList = {
  results?: Array<Item>;
  next?: string;
  previous?: string;
};
