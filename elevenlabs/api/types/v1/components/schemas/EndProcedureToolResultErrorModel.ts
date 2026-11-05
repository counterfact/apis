import type { EndProcedureToolErrorStatus } from "./EndProcedureToolErrorStatus.js";
export type EndProcedureToolResultErrorModel = {
  /**
   * @default "end_procedure_error"
   */
  result_type?: "end_procedure_error";
  status: EndProcedureToolErrorStatus;
  procedure_id?: string | null;
  message: string;
};
