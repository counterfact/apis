import type { StudioAgentToolSettingsModel } from "./StudioAgentToolSettingsModel.js";
export type StudioAgentSettingsModel = {
  tool_settings?: { [key: string]: StudioAgentToolSettingsModel };
};
