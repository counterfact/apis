import type { UserRecord } from "./UserRecord.js";

export type Users = {
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/user-search/my-project/my-environment?after=1647993600000&limit=20&searchAfter=my-user&sort=userKey","type":"application/json"},"self":{"href":"/api/v2/user-search/my-project/my-environment?after=1647993600000&limit=20&sort=userKey","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * The total number of users in the environment
   * @example 245
   */
  totalCount: number;
  /**
   * Details on the users
   */
  items: Array<UserRecord>;
};
