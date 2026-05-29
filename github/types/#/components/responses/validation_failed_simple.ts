import type { validation_error_simple } from "../../../components/schemas/validation-error-simple.js";

export type validation_failed_simple = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: validation_error_simple;
    };
  };
  examples: {};
};
