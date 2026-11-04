import type { activityListReposStarredByAuthenticatedUser } from "../../types/paths/user/starred.types.js";

export const GET: activityListReposStarredByAuthenticatedUser = async ($) => {
  const repositories = $.context.listStarredRepos($.query);
  return $.response[200].json(repositories).match(
    "application/vnd.github.v3.star+json",
    repositories.map((repo) => ({
      starred_at: "2024-01-01T00:00:00Z",
      repo,
    })),
  );
};
