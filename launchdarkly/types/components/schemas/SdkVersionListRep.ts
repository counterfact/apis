import type { SdkVersionRep } from "./SdkVersionRep.js";

export type SdkVersionListRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The list of SDK names and versions
   * @example [{"sdk":"Android","version":"3.1.2"},{"sdk":"Android","version":"3.1.5"},{"sdk":"C","version":"2.4.6"}]
   */
  sdkVersions: Array<SdkVersionRep>;
};
