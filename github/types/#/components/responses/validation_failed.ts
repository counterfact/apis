import type { validation_error } from "../../../components/schemas/validation-error.js";

export type validation_failed = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: validation_error;
    };
  };
  examples: {};
};
