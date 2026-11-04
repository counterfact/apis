export type StartProcedureToolResultSuccessModel = {
  /**
   * @default "start_procedure_success"
   */
  result_type?: "start_procedure_success";
  /**
   * @default "success"
   */
  status?: "success";
  procedure_id: string;
  procedure_name: string;
  procedure_entry_workflow_node?: string | null;
  procedure_return_workflow_node?: string | null;
  /**
   * @default "Procedure is now started. Follow its instructions from the <active-procedures> section of your system prompt."
   */
  message?: string;
};
