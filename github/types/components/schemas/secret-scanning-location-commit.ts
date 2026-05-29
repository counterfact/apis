/**
 * Represents a 'commit' secret scanning location type. This location type shows that a secret was detected inside a commit to a repository.
 */
export type secret_scanning_location_commit = {
  /**
   * The file path in the repository
   * @example "/example/secrets.txt"
   */
  path: string;
  /**
   * Line number at which the secret starts in the file
   */
  start_line: number;
  /**
   * Line number at which the secret ends in the file
   */
  end_line: number;
  /**
   * The column at which the secret starts within the start line when the file is interpreted as 8BIT ASCII
   */
  start_column: number;
  /**
   * The column at which the secret ends within the end line when the file is interpreted as 8BIT ASCII
   */
  end_column: number;
  /**
   * SHA-1 hash ID of the associated blob
   * @example "af5626b4a114abcb82d63db7c8082c3c4756e51b"
   */
  blob_sha: string;
  /**
   * The API URL to get the associated blob resource
   */
  blob_url: string;
  /**
   * SHA-1 hash ID of the associated commit
   * @example "af5626b4a114abcb82d63db7c8082c3c4756e51b"
   */
  commit_sha: string;
  /**
   * The API URL to get the associated commit resource
   */
  commit_url: string;
  /**
   * The GitHub URL to get the associated commit resource.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/blob/af5626b/example/secrets.txt#L1-L1"
   */
  html_url?: string;
};
