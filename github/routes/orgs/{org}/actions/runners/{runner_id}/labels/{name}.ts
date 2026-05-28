import type { actionsRemoveCustomLabelFromSelfHostedRunnerForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}/labels/{name}.types.js";

export const DELETE: actionsRemoveCustomLabelFromSelfHostedRunnerForOrg =
  async ($) => {
    return $.response[200].empty();
  };
