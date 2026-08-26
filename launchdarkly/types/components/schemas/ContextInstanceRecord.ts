import type { Access } from "./Access.js";

export type ContextInstanceRecord = {
  /**
   * Timestamp of the last time an evaluation occurred for this context instance
   * @format date-time
   * @example "2022-04-15T15:00:57.526470334Z"
   */
  lastSeen?: string;
  /**
   * The context instance ID
   * @example "b3JnOmxhdW5jaGRhcmtseQ"
   */
  id: string;
  /**
   * An identifier representing the application where the LaunchDarkly SDK is running
   * @example "GoSDK/1.2"
   */
  applicationId?: string;
  /**
   * A list of the context kinds this context was associated with that the SDK removed because they were marked as anonymous at flag evaluation
   * @example ["device","privateKind"]
   */
  anonymousKinds?: Array<string>;
  /**
   * The context, including its kind and attributes
   * @example "{\"kind\": \"user\", \"key\": \"context-key-123abc\", \"name\": \"Sandy Smith\", \"email\": \"sandy@example.com\"}"
   */
  context: unknown;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project/environments/my-environment","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?filter=applicationId:\"GoSDK/1.2\"","type":"application/json"},"site":{"href":"/my-project/my-environment/context-instances/organization:launch-darkly:user:henry","type":"text/html"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * Details on the allowed and denied actions for this context instance
   */
  _access?: Access;
};
