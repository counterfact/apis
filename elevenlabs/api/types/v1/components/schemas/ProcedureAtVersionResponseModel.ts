import type { ProcedureType } from "./ProcedureType.js";
/**
 * @example {"content":"# Customer Support Procedure\n\n1. Greet the customer...","name":"Customer Support Procedure","procedure_id":"agtprc_6qbpwdq8n01bxhk44bgjy6f10ck3","trigger":"When the customer asks for support","type":"free_form","version_id":"agtprcv_7rbqxer9o12cyxi55ckw6sgz1dl4"}
 */
export type ProcedureAtVersionResponseModel = {
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
   */
  name: string;
  /**
   * Procedure content
   */
  content: string;
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
   * Procedure ID of the folder this procedure is placed in. None means root.
   */
  folder_parent_id?: string | null;
};
