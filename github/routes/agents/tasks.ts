import type { agentTasksListTasks } from "../../types/paths/agents/tasks.types.js";

export const GET: agentTasksListTasks = async ($) => {
  return $.response[200].random();
};
