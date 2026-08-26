import type { UnixMillis } from "./UnixMillis.js";

export type PostDeploymentEventInput = {
  /**
   * The project key
   * @example "default"
   */
  projectKey: string;
  /**
   * The environment key
   * @example "production"
   */
  environmentKey: string;
  /**
   * The application key. This defines the granularity at which you want to view your insights metrics. Typically it is the name of one of the GitHub repositories that you use in this project.<br/><br/>LaunchDarkly automatically creates a new application each time you send a unique application key.
   * @example "billing-service"
   */
  applicationKey: string;
  /**
   * The application name. This defines how the application is displayed
   * @example "Billing Service"
   */
  applicationName?: string;
  /**
   * The kind of application. Default: <code>server</code>
   * @example "server"
   */
  applicationKind?: "server" | "browser" | "mobile";
  /**
   * The application version. You can set the application version to any string that includes only letters, numbers, periods (<code>.</code>), hyphens (<code>-</code>), or underscores (<code>_</code>).<br/><br/>We recommend setting the application version to at least the first seven characters of the SHA or to the tag of the GitHub commit for this deployment.
   * @example "a90a8a2"
   */
  version: string;
  /**
   * The version name. This defines how the version is displayed
   * @example "v1.0.0"
   */
  versionName?: string;
  /**
   * The event type
   * @example "started"
   */
  eventType: "started" | "failed" | "finished" | "custom";
  /**
   * The time, in Unix milliseconds, when the event occurred. If not included, the time will default to when the event is processed and stored in LaunchDarkly.
   * @example "1706701522000"
   */
  eventTime?: UnixMillis;
  /**
   * A JSON object containing metadata about the event
   * @example {"buildSystemVersion":"v1.2.3"}
   */
  eventMetadata?: { [key: string]: unknown };
  /**
   * A JSON object containing metadata about the deployment
   * @example {"buildNumber":"1234"}
   */
  deploymentMetadata?: { [key: string]: unknown };
};
