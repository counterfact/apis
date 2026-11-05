import type { AnalysisItemAttachmentAction } from "./AnalysisItemAttachmentAction.js";
export type AnalysisItemAttachmentResultData = {
  agent_id: string;
  branch_id: string;
  action: AnalysisItemAttachmentAction;
  changed: boolean;
};
