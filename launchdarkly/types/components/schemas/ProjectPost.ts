import type { DefaultClientSideAvailabilityPost } from "./DefaultClientSideAvailabilityPost.js";
import type { EnvironmentPost } from "./EnvironmentPost.js";

export type ProjectPost = {
  /**
   * A human-friendly name for the project.
   * @example "My Project"
   */
  name: string;
  /**
   * A unique key used to reference the project in your code.
   * @example "project-key-123abc"
   */
  key: string;
  /**
   * Whether or not flags created in this project are made available to the client-side JavaScript SDK by default.
   * @example true
   */
  includeInSnippetByDefault?: boolean;
  /**
   * Controls which client-side SDKs can use new flags by default.
   */
  defaultClientSideAvailability?: DefaultClientSideAvailabilityPost;
  /**
   * Tags for the project
   * @example ["ops"]
   */
  tags?: Array<string>;
  /**
   * Creates the provided environments for this project. If omitted default environments will be created instead.
   */
  environments?: Array<EnvironmentPost>;
};
