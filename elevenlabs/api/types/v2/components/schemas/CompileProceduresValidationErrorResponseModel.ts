import type { ProcedureValidationError } from "./ProcedureValidationError.js";
/**
 * @example {"errors":{"agtprc_6qbpwdq8n01bxhk44bgjy6f10ck3":[{"message":"Field required","path":"steps.0.message"}]}}
 */
export type CompileProceduresValidationErrorResponseModel = {
  /**
   * Validation errors keyed by procedure ID.
   */
  errors: { [key: string]: Array<ProcedureValidationError> };
};
