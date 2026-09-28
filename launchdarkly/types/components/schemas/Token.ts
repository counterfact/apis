import type { ObjectId } from "./ObjectId.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { Statement } from "./Statement.js";

export type Token = {
  /**
   * The ID of the access token
   * @example "61095542756dba551110ae21"
   */
  _id: ObjectId;
  /**
   * The ID of the owner of the account for the access token
   * @example "569f514156e003339cfd3917"
   */
  ownerId: ObjectId;
  /**
   * The ID of the member who created the access token
   * @example "569f514183f2164430000002"
   */
  memberId: ObjectId;
  /**
   * Details on the member who created the access token
   */
  _member?: MemberSummary;
  /**
   * A human-friendly name for the access token
   * @example "Example reader token"
   */
  name?: string;
  /**
   * A description for the access token
   * @example "A reader token used in testing and examples"
   */
  description?: string;
  /**
   * Timestamp of when the access token was created
   * @example "1628001602644"
   */
  creationDate: UnixMillis;
  /**
   * Timestamp of the last modification of the access token
   * @example "1628001602644"
   */
  lastModified: UnixMillis;
  /**
   * A list of custom role IDs to use as access limits for the access token
   * @example []
   */
  customRoleIds?: Array<ObjectId>;
  /**
   * An array of policy statements, with three attributes: effect, resources, actions. May be used in place of a built-in or custom role.
   * @example []
   */
  inlineRole?: Array<Statement>;
  /**
   * Built-in role for the token
   * @example "reader"
   */
  role?: string;
  /**
   * The token value. When creating or resetting, contains the entire token value. Otherwise, contains the last four characters.
   * @example "1234"
   */
  token?: string;
  /**
   * Whether this is a service token or a personal token
   * @example false
   */
  serviceToken?: boolean;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/tokens","type":"application/json"},"self":{"href":"/api/v2/tokens/61095542756dba551110ae21","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The default API version for this token
   * @example 20220603
   */
  defaultApiVersion?: number;
  /**
   * Timestamp of when the access token was last used
   * @example "0"
   */
  lastUsed?: UnixMillis;
};
