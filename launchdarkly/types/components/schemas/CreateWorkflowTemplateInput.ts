import type { FeatureWorkflowId } from "./FeatureWorkflowId.js";
import type { StageInput } from "./StageInput.js";

export type CreateWorkflowTemplateInput = {
  key: string;
  name?: string;
  description?: string;
  workflowId?: FeatureWorkflowId;
  stages?: Array<StageInput>;
  projectKey?: string;
  environmentKey?: string;
  flagKey?: string;
};
