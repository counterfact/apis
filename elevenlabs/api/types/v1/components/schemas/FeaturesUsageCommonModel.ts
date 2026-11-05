import type { FeatureStatusCommonModel } from "./FeatureStatusCommonModel.js";
import type { WorkflowFeaturesUsageCommonModel } from "./WorkflowFeaturesUsageCommonModel.js";
import type { TestsFeatureUsageCommonModel } from "./TestsFeatureUsageCommonModel.js";
export type FeaturesUsageCommonModel = {
  language_detection?: FeatureStatusCommonModel;
  transfer_to_agent?: FeatureStatusCommonModel;
  transfer_to_number?: FeatureStatusCommonModel;
  multivoice?: FeatureStatusCommonModel;
  dtmf_tones?: FeatureStatusCommonModel;
  external_mcp_servers?: FeatureStatusCommonModel;
  /**
   * @default false
   */
  pii_zrm_workspace?: boolean;
  /**
   * @default false
   */
  pii_zrm_agent?: boolean;
  tool_dynamic_variable_updates?: FeatureStatusCommonModel;
  /**
   * @default false
   */
  is_livekit?: boolean;
  voicemail_detection?: FeatureStatusCommonModel;
  dtmf_input?: FeatureStatusCommonModel;
  workflow?: WorkflowFeaturesUsageCommonModel;
  agent_testing?: TestsFeatureUsageCommonModel;
  versioning?: FeatureStatusCommonModel;
  file_input?: FeatureStatusCommonModel;
  freeform_procedure?: FeatureStatusCommonModel;
  structured_procedure?: FeatureStatusCommonModel;
};
