/**
 * Represents a 'discussion_body' secret scanning location type. This location type shows that a secret was detected in the body of a discussion.
 */
export type secret_scanning_location_discussion_body = {
  /**
   * The URL to the discussion where the secret was detected.
   * @format uri
   * @example "https://github.com/community/community/discussions/39082#discussion-4566270"
   */
  discussion_body_url: string;
};
