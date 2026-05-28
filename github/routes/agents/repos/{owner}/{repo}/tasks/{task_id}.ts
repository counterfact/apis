import type { agentTasksGetTaskByRepoAndId } from "../../../../../../types/paths/agents/repos/{owner}/{repo}/tasks/{task_id}.types.js";

export const GET: agentTasksGetTaskByRepoAndId = async ($) => {
  return $.response[200].random();
};
