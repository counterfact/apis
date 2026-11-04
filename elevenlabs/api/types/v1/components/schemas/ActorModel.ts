import type { UserModel } from "./UserModel.js";
/**
 * OCSF Actor object - describes the entity that performed the action.
 *
 * Spec: https://schema.ocsf.io/1.6.0/objects/actor
 */
export type ActorModel = {
  /**
   * User who performed the action
   */
  user: UserModel;
  /**
   * Client application or service name
   */
  app_name?: string | null;
  /**
   * Client application unique identifier
   */
  app_uid?: string | null;
  /**
   * Session information
   */
  session?: { [key: string]: unknown } | null;
};
