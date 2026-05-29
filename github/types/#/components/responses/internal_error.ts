import type { basic_error } from "../../../components/schemas/basic-error.js";

export type internal_error = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
  };
  examples: {};
};
