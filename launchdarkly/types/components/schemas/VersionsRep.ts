import type { DateVersion } from "./DateVersion.js";

export type VersionsRep = {
  /**
   * A list of all valid API versions. To learn more about our versioning, read [Versioning](https://apidocs.launchdarkly.com/#section/Overview/Versioning).
   */
  validVersions: Array<DateVersion>;
  /**
   * The most recently released version of the API
   * @example "20220603"
   */
  latestVersion: DateVersion;
  /**
   * The version of the API currently in use. Typically this is the API version specified for your access token. If you add the <code>LD-API-Version: beta</code> header to your request, this will be equal to the <code>latestVersion</code>.
   * @example "20220603"
   */
  currentVersion: DateVersion;
  /**
   * Whether the version of the API currently is use is a beta version. This is always <code>true</code> if you add the <code>LD-API-Version: beta</code> header to your request.
   * @example false
   */
  beta?: boolean;
};
