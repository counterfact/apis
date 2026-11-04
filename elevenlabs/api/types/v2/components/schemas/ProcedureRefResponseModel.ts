import type { ProcedureType } from "./ProcedureType.js";
/**
 * @example {"name":"Customer Support Procedure","procedure_id":"agtprc_6qbpwdq8n01bxhk44bgjy6f10ck3","referenced_dynamic_variables":["customer_id"],"referenced_kb_ids":["kb_123"],"referenced_procedure_ids":["agtprc_other"],"referenced_tool_ids":["tool_123"],"trigger":"When the customer asks for support","type":"free_form","version_id":"agtprcv_7rbqxer9o12cyxi55ckw6sgz1dl4"}
 */
export type ProcedureRefResponseModel = {
  /**
   * Procedure ID
   */
  procedure_id: string;
  /**
   * Version ID of a version of the procedure. None for a procedure never versioned.
   */
  version_id?: string | null;
  /**
   * Procedure name
   * @default ""
   */
  name?: string;
  /**
   * Procedure type
   * @default "free_form"
   */
  type?: ProcedureType;
  /**
   * When the agent should use this procedure. Empty string means this is a sub-procedure that should only start when another procedure references it.
   * @default ""
   */
  trigger?: string;
  /**
   * Tool IDs referenced in the procedure content
   */
  referenced_tool_ids?: Array<string>;
  /**
   * Knowledge base IDs referenced in the procedure content
   */
  referenced_kb_ids?: Array<string>;
  /**
   * Procedure IDs referenced in the procedure content
   */
  referenced_procedure_ids?: Array<string>;
  /**
   * Dynamic variable names used in the procedure content
   */
  referenced_dynamic_variables?: Array<string>;
  /**
   * Procedure ID of the folder this procedure is placed in. None means root.
   */
  folder_parent_id?: string | null;
};
