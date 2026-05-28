/**
 * Represents a 'wiki_commit' secret scanning location type. This location type shows that a secret was detected inside a commit to a repository wiki.
 */
export type secret_scanning_location_wiki_commit = {
  /**
   * The file path of the wiki page
   * @example "/example/Home.md"
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
   * The column at which the secret starts within the start line when the file is interpreted as 8-bit ASCII.
   */
  start_column: number;
  /**
   * The column at which the secret ends within the end line when the file is interpreted as 8-bit ASCII.
   */
  end_column: number;
  /**
   * SHA-1 hash ID of the associated blob
   * @example "af5626b4a114abcb82d63db7c8082c3c4756e51b"
   */
  blob_sha: string;
  /**
   * The GitHub URL to get the associated wiki page
   * @example "https://github.com/octocat/Hello-World/wiki/Home/302c0b7e200761c9dd9b57e57db540ee0b4293a5"
   */
  page_url: string;
  /**
   * SHA-1 hash ID of the associated commit
   * @example "302c0b7e200761c9dd9b57e57db540ee0b4293a5"
   */
  commit_sha: string;
  /**
   * The GitHub URL to get the associated wiki commit
   * @example "https://github.com/octocat/Hello-World/wiki/_compare/302c0b7e200761c9dd9b57e57db540ee0b4293a5"
   */
  commit_url: string;
};
