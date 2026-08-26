import type { Token } from "./Token.js";

export type Tokens = {
  /**
   * An array of access tokens
   */
  items?: Array<Token>;
  _links?: { [key: string]: unknown };
  /**
   * The number of access tokens returned
   */
  totalCount?: number;
};
