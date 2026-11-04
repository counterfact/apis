/**
 * @example {"type":"url","url":"https://www.example.com"}
 */
export type PodcastURLSource = {
  /**
   * The type of source to create.
   */
  type: "url";
  /**
   * The URL to create the podcast from.
   */
  url: string;
};
