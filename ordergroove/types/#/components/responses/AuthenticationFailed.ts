import type { Error } from "../../../components/schemas/Error.js";

export type AuthenticationFailed = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: Error;
    };
  };
  examples: {};
};
