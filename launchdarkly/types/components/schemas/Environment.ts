import type { ApprovalSettings } from "./ApprovalSettings.js";

export type Environment = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/my-project/environments/my-environment","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
   * @example "57be1db38b75bf0772d11384"
   */
  _id: string;
  /**
   * A project-unique key for the new environment
   * @example "environment-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the new environment
   * @example "My Environment"
   */
  name: string;
  /**
   * The SDK key for the environment. Use this for authorization in server-side SDKs.
   * @example "sdk-xxx"
   */
  apiKey: string;
  /**
   * The mobile key for the environment. Use this for authorization in mobile SDKs.
   * @example "mob-xxx"
   */
  mobileKey: string;
  /**
   * The color used to indicate this environment in the UI
   * @example "F5A623"
   */
  color: string;
  /**
   * The default time (in minutes) that the PHP SDK can cache feature flag rules locally
   * @example 5
   */
  defaultTtl: number;
  /**
   * Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
   * @example true
   */
  secureMode: boolean;
  /**
   * Enables tracking detailed information for new flags by default
   * @example false
   */
  defaultTrackEvents: boolean;
  /**
   * Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
   * @example true
   */
  requireComments: boolean;
  /**
   * Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
   * @example true
   */
  confirmChanges: boolean;
  /**
   * A list of tags for this environment
   * @example ["ops"]
   */
  tags: Array<string>;
  /**
   * Details on the approval settings for this environment
   */
  approvalSettings?: ApprovalSettings;
  /**
   * Whether the environment is critical
   * @example true
   */
  critical: boolean;
};
