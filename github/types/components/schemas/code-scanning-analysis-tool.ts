import type { code_scanning_analysis_tool_name } from "./code-scanning-analysis-tool-name.js";
import type { code_scanning_analysis_tool_version } from "./code-scanning-analysis-tool-version.js";
import type { code_scanning_analysis_tool_guid } from "./code-scanning-analysis-tool-guid.js";

export type code_scanning_analysis_tool = {
  name?: code_scanning_analysis_tool_name;
  version?: code_scanning_analysis_tool_version;
  guid?: code_scanning_analysis_tool_guid;
};
