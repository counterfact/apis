import type { ClientSideAvailability } from "./ClientSideAvailability.js";
import type { Access } from "./Access.js";
import type { Environments } from "./Environments.js";

export type Project = {
  /**
   * The location and content type of related resources
   * @example {"environments":{"href":"/api/v2/projects/my-project/environments","type":"application/json"},"self":{"href":"/api/v2/projects/my-project","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The ID of this project
   * @example "57be1db38b75bf0772d11383"
   */
  _id: string;
  /**
   * The key of this project
   * @example "project-key-123abc"
   */
  key: string;
  /**
   * Whether or not flags created in this project are made available to the client-side JavaScript SDK by default
   * @example true
   */
  includeInSnippetByDefault: boolean;
  /**
   * Describes which client-side SDKs can use new flags by default
   */
  defaultClientSideAvailability?: ClientSideAvailability;
  /**
   * A human-friendly name for the project
   * @example "My Project"
   */
  name: string;
  /**
   * Details on the allowed and denied actions for this project
   */
  _access?: Access;
  /**
   * A list of tags for the project
   * @example ["ops"]
   */
  tags: Array<string>;
  /**
   * The key of the default release pipeline for this project
   */
  defaultReleasePipelineKey?: string;
  /**
   * A paginated list of environments for the project. By default this field is omitted unless expanded by the client.
   */
  environments?: Environments;
};
