import type { ToolExecutionResponseModel } from "./ToolExecutionResponseModel.js";
export type GetToolExecutionsPageResponseModel = {
  executions: Array<ToolExecutionResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
