import type { COUNTERFACT_RESPONSE } from "../counterfact-types/index.js";
import type { basic_error } from "../types/components/schemas/basic-error.js";

type RuntimeResponseFactory = Record<
  number,
  { json(body: basic_error): COUNTERFACT_RESPONSE }
>;

/** Runtime 404 support for operations whose bundled generated type omits it. */
export const notFound = (response: unknown): COUNTERFACT_RESPONSE =>
  (response as RuntimeResponseFactory)[404].json({
    message: "Not Found",
    status: "404",
  });
