import type { ToolExecution } from "./ToolExecution.js";
import type { Icon } from "./Icon.js";
import type { ToolAnnotations } from "./ToolAnnotations.js";
/**
 * Definition for a tool the client can call.
 */
export type Tool = {
  name: string;
  title?: string | null;
  description?: string | null;
  inputSchema: { [key: string]: unknown };
  execution?: ToolExecution | null;
  outputSchema?: { [key: string]: unknown } | null;
  icons?: Array<Icon> | null;
  annotations?: ToolAnnotations | null;
  _meta?: { [key: string]: unknown } | null;
};
