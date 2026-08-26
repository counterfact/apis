import { DomainError } from "../../_.context.js";

type ResponseBuilder = {
  empty(): unknown;
  json(body: unknown): unknown;
};

type RouteArgument = { response: unknown };

const responses = ($: RouteArgument): Record<number, ResponseBuilder> =>
  $.response as Record<number, ResponseBuilder>;

/** Keep generated route modules thin while preserving contract-shaped errors. */
export const respondJson = async (
  $: RouteArgument,
  status: number,
  operation: () => unknown | Promise<unknown>,
): Promise<unknown> => {
  try {
    return responses($)[status]!.json(await operation());
  } catch (error) {
    if (error instanceof DomainError) {
      return responses($)[error.status]!.json(error.toDetail());
    }
    throw error;
  }
};

export const respondEmpty = async (
  $: RouteArgument,
  operation: () => void | Promise<void>,
): Promise<unknown> => {
  try {
    await operation();
    return responses($)[204]!.empty();
  } catch (error) {
    if (error instanceof DomainError) {
      return responses($)[error.status]!.json(error.toDetail());
    }
    throw error;
  }
};

export const collection = (items: unknown, path: string) => ({
  _links: { self: { href: path, type: "application/json" } },
  items,
});

export const contentType = (
  headers: Record<string, unknown>,
): string | undefined => {
  for (const [name, value] of Object.entries(headers)) {
    if (name.toLowerCase() === "content-type" && typeof value === "string") {
      return value;
    }
  }
  return undefined;
};
