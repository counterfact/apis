/**
 * Represents a 'discussion_comment' secret scanning location type. This location type shows that a secret was detected in a comment on a discussion.
 */
export type secret_scanning_location_discussion_comment = {
  /**
   * The API URL to get the discussion comment where the secret was detected.
   * @format uri
   * @example "https://github.com/community/community/discussions/39082#discussioncomment-4158232"
   */
  discussion_comment_url: string;
};
