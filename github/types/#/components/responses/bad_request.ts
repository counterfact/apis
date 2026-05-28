import type { basic_error } from "../../../components/schemas/basic-error.js";
import type { scim_error } from "../../../components/schemas/scim-error.js";

export type bad_request = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: basic_error;
    };
    "application/scim+json": {
      schema: scim_error;
    };
  };
  examples: {};
};
