/**
 * Represents a 'discussion_title' secret scanning location type. This location type shows that a secret was detected in the title of a discussion.
 */
export type secret_scanning_location_discussion_title = {
  /**
   * The URL to the discussion where the secret was detected.
   * @format uri
   * @example "https://github.com/community/community/discussions/39082"
   */
  discussion_title_url: string;
};
