import type { ResourceKind } from "./ResourceKind.js";

export type ResourceId = {
  /**
   * The environment key
   * @example "environment-key-123abc"
   */
  environmentKey?: string;
  /**
   * Deprecated, use <code>key</code> instead
   * @deprecated
   */
  flagKey?: string;
  /**
   * The key of the flag or segment
   * @example "segment-key-123abc"
   */
  key?: string;
  /**
   * The type of resource, <code>flag</code> or <code>segment</code>
   * @example "segment"
   */
  kind?: ResourceKind;
  /**
   * The project key
   * @example "project-key-123abc"
   */
  projectKey?: string;
};
