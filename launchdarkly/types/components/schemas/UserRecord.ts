import type { ObjectId } from "./ObjectId.js";
import type { User } from "./User.js";
import type { Access } from "./Access.js";

export type UserRecord = {
  /**
   * Timestamp of the last time this user was seen
   * @format date-time
   * @example "2022-06-28T23:21:29.176609596Z"
   */
  lastPing?: string;
  /**
   * The environment ID
   * @example "1234a56b7c89d012345e678f"
   */
  environmentId?: ObjectId;
  /**
   * The ID of the member who is the owner for this account
   * @example "12ab3c45de678910abc12345"
   */
  ownerId?: ObjectId;
  /**
   * Details on the user
   */
  user?: User;
  /**
   * If this record is returned as part of a list, the value used to sort the list. This is only included when the <code>sort</code> query parameter is specified. It is a time, in Unix milliseconds, if the sort is by <code>lastSeen</code>. It is a user key if the sort is by <code>userKey</code>.
   * @example "user-key-123abc"
   */
  sortValue?: unknown;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/users/my-project/my-environment","type":"application/json"},"self":{"href":"/api/v2/users/my-project/my-environment/my-user","type":"application/json"},"settings":{"href":"/api/v2/users/my-project/my-environment/my-user/flags","type":"text/html"},"site":{"href":"/my-project/my-environment/users/my-user","type":"text/html"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * Details on the allowed and denied actions for this user
   */
  _access?: Access;
};
