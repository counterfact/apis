import type {
  reposDelete,
  reposGet,
  reposUpdate,
} from "../../../types/paths/repos/{owner}/{repo}.types.js";

export const GET: reposGet = async ($) => {
  const repository = $.context.getRepository($.path.owner, $.path.repo);
  if (!repository) {
    return $.response[404].empty();
  }
  return $.response[200].json(repository);
};

export const PATCH: reposUpdate = async ($) => {
  const repository = $.context.updateRepository($.path.owner, $.path.repo, {
    name: $.body.name,
    description: $.body.description,
    homepage: $.body.homepage,
    private: $.body.private,
    visibility: $.body.visibility,
    has_issues: $.body.has_issues,
    has_projects: $.body.has_projects,
    has_wiki: $.body.has_wiki,
    has_discussions: $.body.has_discussions,
    default_branch: $.body.default_branch,
    allow_auto_merge: $.body.allow_auto_merge,
    allow_merge_commit: $.body.allow_merge_commit,
    allow_rebase_merge: $.body.allow_rebase_merge,
    allow_squash_merge: $.body.allow_squash_merge,
    delete_branch_on_merge: $.body.delete_branch_on_merge,
  });

  if (!repository) {
    return $.response[404].empty();
  }

  return $.response[200].json(repository);
};

export const DELETE: reposDelete = async ($) => {
  if (!$.context.deleteRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }
  return $.response[204].empty();
};
