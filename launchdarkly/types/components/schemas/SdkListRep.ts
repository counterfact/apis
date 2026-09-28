export type SdkListRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The list of SDK names
   * @example ["Android","Java","Node.js"]
   */
  sdks: Array<string>;
};
