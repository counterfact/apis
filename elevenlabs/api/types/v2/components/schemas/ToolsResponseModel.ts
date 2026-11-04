import type { ToolResponseModel } from "./ToolResponseModel.js";
export type ToolsResponseModel = {
  tools: Array<ToolResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
