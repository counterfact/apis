import type { UnixMillis } from "./UnixMillis.js";
import type { LastSeenMetadata } from "./LastSeenMetadata.js";
import type { IntegrationMetadata } from "./IntegrationMetadata.js";
import type { MemberTeamSummaryRep } from "./MemberTeamSummaryRep.js";
import type { MemberPermissionGrantSummaryRep } from "./MemberPermissionGrantSummaryRep.js";
import type { OAuthProviderKind } from "./OAuthProviderKind.js";

export type Member = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The member's ID
   * @example "507f1f77bcf86cd799439011"
   */
  _id: string;
  /**
   * The member's first name
   * @example "Ariel"
   */
  firstName?: string;
  /**
   * The member's last name
   * @example "Flores"
   */
  lastName?: string;
  /**
   * The member's built-in role. If the member has no custom roles, this role will be in effect.
   * @example "reader"
   */
  role: string;
  /**
   * The member's email address
   * @example "ariel@acme.com"
   */
  email: string;
  /**
   * Whether the member has a pending invitation
   * @example false
   */
  _pendingInvite: boolean;
  /**
   * Whether the member's email address has been verified
   * @example true
   */
  _verified: boolean;
  /**
   * The member's email address before it has been verified, for accounts where email verification is required
   */
  _pendingEmail?: string;
  /**
   * The set of custom roles (as keys) assigned to the member
   * @example ["devOps","backend-devs"]
   */
  customRoles: Array<string>;
  /**
   * Whether multi-factor authentication is enabled for this member
   */
  mfa: string;
  /**
   * Default dashboards that the member has chosen to ignore
   */
  excludedDashboards?: Array<string>;
  /**
   * The member's last session date (as Unix milliseconds since epoch)
   * @example "1608260796147"
   */
  _lastSeen: UnixMillis;
  /**
   * Additional metadata associated with the member's last session, for example, whether a token was used
   */
  _lastSeenMetadata?: LastSeenMetadata;
  /**
   * Details on the member account in an external source, if this member is provisioned externally
   */
  _integrationMetadata?: IntegrationMetadata;
  /**
   * Details on the teams this member is assigned to
   */
  teams?: Array<MemberTeamSummaryRep>;
  /**
   * A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
   */
  permissionGrants?: Array<MemberPermissionGrantSummaryRep>;
  /**
   * Timestamp of when the member was created
   * @example "1628001602644"
   */
  creationDate: UnixMillis;
  /**
   * A list of OAuth providers
   */
  oauthProviders?: Array<OAuthProviderKind>;
};
