import type { StartProcedureToolErrorStatus } from "./StartProcedureToolErrorStatus.js";
export type StartProcedureToolResultErrorModel = {
  /**
   * @default "start_procedure_error"
   */
  result_type?: "start_procedure_error";
  status: StartProcedureToolErrorStatus;
  procedure_id?: string | null;
  message: string;
};
