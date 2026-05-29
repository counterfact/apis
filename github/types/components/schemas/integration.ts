import type { simple_user } from "./simple-user.js";
import type { enterprise } from "./enterprise.js";

/**
 * GitHub apps are a new way to extend GitHub. They can be installed directly on organizations and user accounts and granted access to specific repositories. They come with granular permissions and built-in webhooks. GitHub apps are first class actors within GitHub.
 */
export type integration = {
  /**
   * Unique identifier of the GitHub app
   * @example 37
   */
  id: number;
  /**
   * The slug name of the GitHub app
   * @example "probot-owners"
   */
  slug?: string;
  /**
   * @example "MDExOkludGVncmF0aW9uMQ=="
   */
  node_id: string;
  /**
   * @example "\"Iv1.25b5d1e65ffc4022\""
   */
  client_id?: string;
  owner: simple_user | enterprise;
  /**
   * The name of the GitHub app
   * @example "Probot Owners"
   */
  name: string;
  /**
   * @example "The description of the app."
   */
  description: string;
  /**
   * @format uri
   * @example "https://example.com"
   */
  external_url: string;
  /**
   * @format uri
   * @example "https://github.com/apps/super-ci"
   */
  html_url: string;
  /**
   * @format date-time
   * @example "2017-07-08T16:18:44-04:00"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2017-07-08T16:18:44-04:00"
   */
  updated_at: string;
  /**
   * The set of permissions for the GitHub app
   * @example {"issues":"read","deployments":"write"}
   */
  permissions: {
    issues?: string;
    checks?: string;
    metadata?: string;
    contents?: string;
    deployments?: string;
    [key: string]: string;
  };
  /**
   * The list of events for the GitHub app. Note that the `installation_target`, `security_advisory`, and `meta` events are not included because they are global events and not specific to an installation.
   * @example ["label","deployment"]
   */
  events: Array<string>;
  /**
   * The number of installations associated with the GitHub app. Only returned when the integration is requesting details about itself.
   * @example 5
   */
  installations_count?: number;
};
