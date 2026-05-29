import type { basic_error } from "../../../components/schemas/basic-error.js";

export type code_quality_forbidden_write = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
  };
  examples: {};
};
