import type { organization_simple } from "./organization-simple.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Org Membership
 */
export type org_membership = {
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octocat/memberships/defunkt"
   */
  url: string;
  /**
   * The state of the member in the organization. The `pending` state indicates the user has not yet accepted an invitation.
   * @example "active"
   */
  state: "active" | "pending";
  /**
   * The user's membership type in the organization.
   * @example "admin"
   */
  role: "admin" | "member" | "billing_manager";
  /**
   * Whether the user has direct membership in the organization.
   * @example true
   */
  direct_membership?: boolean;
  /**
   * The slugs of the enterprise teams providing the user with indirect membership in the organization.
   * A limit of 100 enterprise team slugs is returned.
   * @example ["ent:team-one","ent:team-two"]
   */
  enterprise_teams_providing_indirect_membership?: Array<string>;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/octocat"
   */
  organization_url: string;
  organization: organization_simple;
  user: nullable_simple_user;
  permissions?: { can_create_repository: boolean };
};
