/**
 * Blob
 */
export type blob = {
  content: string;
  encoding: string;
  /**
   * @format uri
   */
  url: string;
  sha: string;
  size: number;
  node_id: string;
  highlighted_content?: string;
};
