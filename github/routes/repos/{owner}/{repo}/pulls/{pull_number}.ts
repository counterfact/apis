import type {
  pullsGet,
  pullsUpdate,
} from "../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}.types.js";

export const GET: pullsGet = async ($) => {
  const pullRequest = $.context.getPullRequest(
    $.path.owner,
    $.path.repo,
    $.path.pull_number,
  );
  if (!pullRequest) {
    return $.response[404].empty();
  }
  return $.response[200].json(pullRequest);
};

export const PATCH: pullsUpdate = async ($) => {
  const existing = $.context.getPullRequest(
    $.path.owner,
    $.path.repo,
    $.path.pull_number,
  );
  if (!existing) {
    return $.response[404].empty();
  }

  const pullRequest = $.context.savePullRequest($.path.owner, $.path.repo, {
    ...existing,
    number: $.path.pull_number,
    title: $.body.title ?? existing.title,
    body: $.body.body ?? existing.body,
    state: $.body.state ?? existing.state,
    base: $.body.base ?? existing.base.ref,
    maintainer_can_modify:
      $.body.maintainer_can_modify ?? existing.maintainer_can_modify,
    head: existing.head.ref,
  });

  return $.response[200].json(pullRequest);
};
