import type { basic_error } from "../../../components/schemas/basic-error.js";

export type unprocessable_analysis = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
  };
  examples: {};
};
