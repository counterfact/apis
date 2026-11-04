import type { FeatureStatusCommonModel } from "./FeatureStatusCommonModel.js";
export type WorkflowFeaturesUsageCommonModel = {
  /**
   * @default false
   */
  enabled?: boolean;
  tool_node?: FeatureStatusCommonModel;
  standalone_agent_node?: FeatureStatusCommonModel;
  phone_number_node?: FeatureStatusCommonModel;
  end_node?: FeatureStatusCommonModel;
  override_agent_node?: FeatureStatusCommonModel;
};
