import type {
  pullsCreate,
  pullsList,
} from "../../../../types/paths/repos/{owner}/{repo}/pulls.types.js";

export const GET: pullsList = async ($) => {
  return $.response[200].json(
    $.context.listPullRequests($.path.owner, $.path.repo, $.query),
  );
};

export const POST: pullsCreate = async ($) => {
  const pullRequest = $.context.savePullRequest($.path.owner, $.path.repo, {
    title: $.body.title,
    body: $.body.body,
    head: $.body.head,
    base: $.body.base,
    draft: $.body.draft,
    maintainer_can_modify: $.body.maintainer_can_modify,
    user: $.context.getUser("octocat"),
  });

  return $.response[201].json(pullRequest);
};
