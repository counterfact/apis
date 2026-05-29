import type {
  reposCreateForAuthenticatedUser,
  reposListForAuthenticatedUser,
} from "../../types/paths/user/repos.types.js";

export const GET: reposListForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listUserRepositories($.query));
};

export const POST: reposCreateForAuthenticatedUser = async ($) => {
  const repository = $.context.saveRepository({
    owner: "octocat",
    name: $.body.name,
    description: $.body.description,
    homepage: $.body.homepage,
    private: $.body.private,
    has_issues: $.body.has_issues,
    has_projects: $.body.has_projects,
    has_wiki: $.body.has_wiki,
    has_discussions: $.body.has_discussions,
    has_downloads: $.body.has_downloads,
    is_template: $.body.is_template,
    allow_auto_merge: $.body.allow_auto_merge,
    allow_merge_commit: $.body.allow_merge_commit,
    allow_rebase_merge: $.body.allow_rebase_merge,
    allow_squash_merge: $.body.allow_squash_merge,
    delete_branch_on_merge: $.body.delete_branch_on_merge,
    default_branch: "main",
    readme: $.body.auto_init ? `# ${$.body.name}\n` : undefined,
  });

  return $.response[201].json(repository);
};
