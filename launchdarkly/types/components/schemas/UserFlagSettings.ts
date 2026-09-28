export type UserFlagSettings = {
  /**
   * An array of flag settings for the user
   * @example {"alternate.page":{"_links":{"self":{"href":"/api/v2/users/lacuna/production/Abbie_Braun/flags/alternate.page","type":"application/json"}},"_value":false,"setting":null},"sort.order":{"_links":{"self":{"href":"/api/v2/users/lacuna/production/Abbie_Braun/flags/sort.order","type":"application/json"}},"_value":true,"setting":null}}
   */
  items: { [key: string]: unknown };
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/users/lacuna/production/Abbie_Braun/flags","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
};
