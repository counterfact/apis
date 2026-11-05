import type { ProcedureType } from "./ProcedureType.js";
export type CreateProcedureRequestModel = {
  /**
   * Procedure name
   * @default ""
   */
  name?: string;
  /**
   * Initial procedure content
   * @default ""
   */
  content?: string;
  /**
   * Procedure type
   * @default "free_form"
   */
  type?: ProcedureType;
  /**
   * When the agent should use this procedure. Empty string means this is a sub-procedure that should only start when another procedure references it. Omit this field (or send null) to keep the stored trigger, which is empty on create. Send `""` to clear it. `description` is accepted as an alias.
   */
  trigger?: string | null;
  /**
   * Procedure ID of the folder to create this procedure in, or null for root.
   */
  folder_parent_id?: string | null;
};
