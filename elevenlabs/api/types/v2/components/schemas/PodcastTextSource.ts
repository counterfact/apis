/**
 * @example {"text":"This is a test podcast.","type":"text"}
 */
export type PodcastTextSource = {
  /**
   * The type of source to create.
   */
  type: "text";
  /**
   * The text to create the podcast from.
   */
  text: string;
};
