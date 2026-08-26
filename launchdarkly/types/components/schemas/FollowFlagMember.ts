export type FollowFlagMember = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/members/569f183514f4432160000007","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The member's ID
   * @example "569f183514f4432160000007"
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
   * @example "admin"
   */
  role: string;
  /**
   * The member's email address
   * @example "ariel@acme.com"
   */
  email: string;
};
