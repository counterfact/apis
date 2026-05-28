import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_scoped_installation } from "./nullable-scoped-installation.js";

/**
 * The authorization for an OAuth app, GitHub App, or a Personal Access Token.
 */
export type authorization = {
  /**
   * @format int64
   */
  id: number;
  /**
   * @format uri
   */
  url: string;
  /**
   * A list of scopes that this authorization is in.
   */
  scopes: Array<string>;
  token: string;
  token_last_eight: string;
  hashed_token: string;
  app: {
    client_id: string;
    name: string;
    /**
     * @format uri
     */
    url: string;
  };
  note: string;
  /**
   * @format uri
   */
  note_url: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @format date-time
   */
  created_at: string;
  fingerprint: string;
  user?: nullable_simple_user;
  installation?: nullable_scoped_installation;
  /**
   * @format date-time
   */
  expires_at: string;
};
