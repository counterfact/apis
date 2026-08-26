export type TagCollection = {
  /**
   * List of tags
   * @example ["ops","pro"]
   */
  items: Array<string>;
  _links: { [key: string]: unknown };
  /**
   * The total number of tags
   * @example 103
   */
  totalCount?: number;
};
