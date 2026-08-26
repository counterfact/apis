export type TokenSummary = {
  _links?: { [key: string]: unknown };
  _id?: string;
  /**
   * The name of the token
   * @example "DevOps token"
   */
  name?: string;
  /**
   * The last few characters of the token
   * @example "2345"
   */
  ending?: string;
  /**
   * Whether this is a service token
   * @example false
   */
  serviceToken?: boolean;
};
