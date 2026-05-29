/**
 * Request Copilot code review for new pull requests automatically if the author has access to Copilot code review and their premium requests quota has not reached the limit.
 */
export type repository_rule_copilot_code_review = {
  type: "copilot_code_review";
  parameters?: {
    /**
     * Copilot automatically reviews draft pull requests before they are marked as ready for review.
     */
    review_draft_pull_requests?: boolean;
    /**
     * Copilot automatically reviews each new push to the pull request.
     */
    review_on_push?: boolean;
  };
};
