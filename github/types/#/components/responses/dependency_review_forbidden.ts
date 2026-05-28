import type { basic_error } from "../../../components/schemas/basic-error.js";

export type dependency_review_forbidden = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
  };
  examples: {};
};
