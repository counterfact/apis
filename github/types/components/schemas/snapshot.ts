import type { metadata } from "./metadata.js";

/**
 * Create a new snapshot of a repository's dependencies.
 */
export type snapshot = {
  /**
   * The version of the repository snapshot submission.
   */
  version: number;
  job: {
    /**
     * The external ID of the job.
     * @example "5622a2b0-63f6-4732-8c34-a1ab27e102a11"
     */
    id: string;
    /**
     * Correlator provides a key that is used to group snapshots submitted over time. Only the "latest" submitted snapshot for a given combination of `job.correlator` and `detector.name` will be considered when calculating a repository's current dependencies. Correlator should be as unique as it takes to distinguish all detection runs for a given "wave" of CI workflow you run. If you're using GitHub Actions, a good default value for this could be the environment variables GITHUB_WORKFLOW and GITHUB_JOB concatenated together. If you're using a build matrix, then you'll also need to add additional key(s) to distinguish between each submission inside a matrix variation.
     * @example "yourworkflowname_yourjobname"
     */
    correlator: string;
    /**
     * The url for the job.
     * @example "http://example.com/build"
     */
    html_url?: string;
  };
  /**
   * The commit SHA associated with this dependency snapshot. Maximum length: 40 characters.
   * @example "ddc951f4b1293222421f2c8df679786153acf689"
   */
  sha: string;
  /**
   * The repository branch that triggered this snapshot.
   * @example "refs/heads/main"
   */
  ref: string;
  /**
   * A description of the detector used.
   */
  detector: {
    /**
     * The name of the detector used.
     * @example "docker buildtime detector"
     */
    name: string;
    /**
     * The version of the detector used.
     * @example "1.0.0"
     */
    version: string;
    /**
     * The url of the detector used.
     * @example "http://example.com/docker-buildtimer-detector"
     */
    url: string;
  };
  metadata?: metadata;
  /**
   * A collection of package manifests, which are a collection of related dependencies declared in a file or representing a logical group of dependencies.
   */
  manifests?: { [key: string]: unknown };
  /**
   * The time at which the snapshot was scanned.
   * @format date-time
   * @example "2020-06-13T14:52:50-05:00"
   */
  scanned: string;
};
