import type { basic_error } from "../../../components/schemas/basic-error.js";

export type temporary_redirect = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
  };
  examples: {};
};
