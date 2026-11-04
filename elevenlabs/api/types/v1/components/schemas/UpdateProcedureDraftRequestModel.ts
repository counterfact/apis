import type { ProcedureType } from "./ProcedureType.js";
export type UpdateProcedureDraftRequestModel = {
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
   */
  type: ProcedureType;
  /**
   * When the agent should use this procedure. Empty string means this is a sub-procedure that should only start when another procedure references it. Omit this field (or send null) to keep the stored trigger, which is empty on create. Send `""` to clear it. `description` is accepted as an alias.
   */
  trigger?: string | null;
};
