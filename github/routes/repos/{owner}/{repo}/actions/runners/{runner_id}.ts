import type { actionsGetSelfHostedRunnerForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}.types.js";
import type { actionsDeleteSelfHostedRunnerFromRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}.types.js";

export const GET: actionsGetSelfHostedRunnerForRepo = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteSelfHostedRunnerFromRepo = async ($) => {
  return $.response[204].empty();
};
