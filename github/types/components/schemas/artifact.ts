/**
 * An artifact
 */
export type artifact = {
  /**
   * @example 5
   */
  id: number;
  /**
   * @example "MDEwOkNoZWNrU3VpdGU1"
   */
  node_id: string;
  /**
   * The name of the artifact.
   * @example "AdventureWorks.Framework"
   */
  name: string;
  /**
   * The size in bytes of the artifact.
   * @example 12345
   */
  size_in_bytes: number;
  /**
   * @example "https://api.github.com/repos/github/hello-world/actions/artifacts/5"
   */
  url: string;
  /**
   * @example "https://api.github.com/repos/github/hello-world/actions/artifacts/5/zip"
   */
  archive_download_url: string;
  /**
   * Whether or not the artifact has expired.
   */
  expired: boolean;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  expires_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * The SHA256 digest of the artifact. This field will only be populated on artifacts uploaded with upload-artifact v4 or newer. For older versions, this field will be null.
   * @example "sha256:cfc3236bdad15b5898bca8408945c9e19e1917da8704adc20eaa618444290a8c"
   */
  digest?: string;
  workflow_run?: {
    /**
     * @example 10
     */
    id?: number;
    /**
     * @example 42
     */
    repository_id?: number;
    /**
     * @example 42
     */
    head_repository_id?: number;
    /**
     * @example "main"
     */
    head_branch?: string;
    /**
     * @example "009b8a3a9ccbb128af87f9b1c0f4c62e8a304f6d"
     */
    head_sha?: string;
  };
};
