export type UserAttributeNamesRep = {
  /**
   * private attributes
   * @example ["SSN","credit_card_number"]
   */
  private?: Array<string>;
  /**
   * custom attributes
   * @example ["Age","FavoriteFood","FavoriteColor"]
   */
  custom?: Array<string>;
  /**
   * standard attributes
   * @example ["key","ip","firstName","lastName","country","anonymous"]
   */
  standard?: Array<string>;
};
