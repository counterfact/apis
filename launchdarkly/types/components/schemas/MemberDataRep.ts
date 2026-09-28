export type MemberDataRep = {
  _links?: { [key: string]: unknown };
  /**
   * The member ID
   * @example "507f1f77bcf86cd799439011"
   */
  _id?: string;
  /**
   * The member email
   * @example "ariel@acme.com"
   */
  email?: string;
  /**
   * The member first name
   * @example "Ariel"
   */
  firstName?: string;
  /**
   * The member last name
   * @example "Flores"
   */
  lastName?: string;
};
