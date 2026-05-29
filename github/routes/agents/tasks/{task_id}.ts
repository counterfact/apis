import type { agentTasksGetTaskById } from "../../../types/paths/agents/tasks/{task_id}.types.js";

export const GET: agentTasksGetTaskById = async ($) => {
  return $.response[200].random();
};
