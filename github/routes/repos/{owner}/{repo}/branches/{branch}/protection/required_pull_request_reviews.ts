import type { reposGetPullRequestReviewProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews.types.js";
import type { reposUpdatePullRequestReviewProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews.types.js";
import type { reposDeletePullRequestReviewProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews.types.js";

export const GET: reposGetPullRequestReviewProtection = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdatePullRequestReviewProtection = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeletePullRequestReviewProtection = async ($) => {
  return $.response[204].empty();
};
