export type EndProcedureToolResultSuccessModel = {
  /**
   * @default "end_procedure_success"
   */
  result_type?: "end_procedure_success";
  /**
   * @default "success"
   */
  status?: "success";
  procedure_id: string;
  procedure_name: string;
  /**
   * @default ""
   */
  message?: string;
};
