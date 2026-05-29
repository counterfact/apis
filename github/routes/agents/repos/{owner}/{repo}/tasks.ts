import type { agentTasksListTasksForRepo } from "../../../../../types/paths/agents/repos/{owner}/{repo}/tasks.types.js";
import type { agentTasksCreateTaskInRepo } from "../../../../../types/paths/agents/repos/{owner}/{repo}/tasks.types.js";

export const GET: agentTasksListTasksForRepo = async ($) => {
  return $.response[200].random();
};

export const POST: agentTasksCreateTaskInRepo = async ($) => {
  return $.response[201].random();
};
