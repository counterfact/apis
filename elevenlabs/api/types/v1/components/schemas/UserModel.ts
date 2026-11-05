import type { UserTypeId } from "./UserTypeId.js";
/**
 * OCSF User object.
 *
 * Spec: https://schema.ocsf.io/1.6.0/objects/user
 */
export type UserModel = {
  /**
   * Username
   */
  name?: string | null;
  /**
   * Unique user identifier
   */
  uid?: string | null;
  /**
   * Account type identifier
   * @default 1
   */
  type_id?: UserTypeId;
  /**
   * Account type description
   */
  type?: string | null;
  /**
   * User email address
   */
  email_addr?: string | null;
  /**
   * Full name of the user
   */
  full_name?: string | null;
  /**
   * User's domain
   */
  domain?: string | null;
};
