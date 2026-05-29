import type {
  pullsCreateReview,
  pullsListReviews,
} from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews.types.js";

export const GET: pullsListReviews = async ($) => {
  return $.response[200].json(
    $.context.listPullRequestReviews(
      $.path.owner,
      $.path.repo,
      $.path.pull_number,
      $.query,
    ),
  );
};

export const POST: pullsCreateReview = async ($) => {
  const review = $.context.savePullRequestReview(
    $.path.owner,
    $.path.repo,
    $.path.pull_number,
    {
      body: $.body.body,
      state: $.body.event ?? "PENDING",
      commit_id: $.body.commit_id,
      user: $.context.getUser("hubot"),
    },
  );

  return $.response[200].json(review);
};
