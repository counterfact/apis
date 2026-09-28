export type NewMemberForm = {
  /**
   * The member's email
   * @example "sandy@acme.com"
   */
  email: string;
  /**
   * The member's password
   * @example "***"
   */
  password?: string;
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
   * The member's built-in role
   * @example "reader"
   */
  role?: "reader" | "writer" | "admin" | "no_access";
  /**
   * An array of the member's custom roles
   * @example ["customRole1","customRole2"]
   */
  customRoles?: Array<string>;
  /**
   * An array of the member's teams
   * @example ["team-1","team-2"]
   */
  teamKeys?: Array<string>;
};
