import type { actionsRemoveCustomLabelFromSelfHostedRunnerForRepo } from "../../../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}.types.js";

export const DELETE: actionsRemoveCustomLabelFromSelfHostedRunnerForRepo =
  async ($) => {
    return $.response[200].empty();
  };
