import type { UserRecord } from "./UserRecord.js";

export type UsersRep = {
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/users/my-project/my-environment?after=1647993600000&limit=20&searchAfter=my-user","type":"application/json"},"self":{"href":"/api/v2/users/my-project/my-environment?after=1647993600000&limit=20","type":"application/json"}}
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
