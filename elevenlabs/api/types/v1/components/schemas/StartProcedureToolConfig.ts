import type { ProcedureVersionRef } from "./ProcedureVersionRef.js";
import type { ProcedureDraftRef } from "./ProcedureDraftRef.js";
export type StartProcedureToolConfig = {
  /**
   * @default "start_procedure"
   */
  system_tool_type?: "start_procedure";
  procedures?: { [key: string]: ProcedureVersionRef | ProcedureDraftRef };
};
