/**
 * The hierarchy between files in a Git repository.
 */
export type git_tree = {
  sha: string;
  /**
   * @format uri
   */
  url?: string;
  truncated: boolean;
  /**
   * Objects specifying a tree structure
   * @example [{"path":"file.rb","mode":"100644","type":"blob","size":30,"sha":"44b4fc6d56897b048c772eb4087f854f46256132","url":"https://api.github.com/repos/octocat/Hello-World/git/blobs/44b4fc6d56897b048c772eb4087f854f46256132"}]
   */
  tree: Array<{
    /**
     * @example "test/file.rb"
     */
    path: string;
    /**
     * @example "040000"
     */
    mode: string;
    /**
     * @example "tree"
     */
    type: string;
    /**
     * @example "23f6827669e43831def8a7ad935069c8bd418261"
     */
    sha: string;
    /**
     * @example 12
     */
    size?: number;
    /**
     * @example "https://api.github.com/repos/owner-482f3203ecf01f67e9deb18e/BBB_Private_Repo/git/blobs/23f6827669e43831def8a7ad935069c8bd418261"
     */
    url?: string;
  }>;
};
