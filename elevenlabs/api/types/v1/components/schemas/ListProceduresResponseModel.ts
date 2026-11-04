import type { ProcedureListItemResponseModel } from "./ProcedureListItemResponseModel.js";
/**
 * @example {"procedures":[{"has_draft":false,"name":"Customer Support Procedure","procedure_id":"agtprc_6qbpwdq8n01bxhk44bgjy6f10ck3","referenced_dynamic_variables":["customer_id"],"referenced_kb_ids":["kb_123"],"referenced_procedure_ids":["agtprc_other"],"referenced_tool_ids":["tool_123"],"trigger":"When the customer asks for support","type":"free_form","version_id":"agtprcv_7rbqxer9o12cyxi55ckw6sgz1dl4"}]}
 */
export type ListProceduresResponseModel = {
  /**
   * Procedures on the branch with their draft-aware metadata.
   */
  procedures: Array<ProcedureListItemResponseModel>;
};
