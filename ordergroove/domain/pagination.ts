export interface CursorPage<Value> {
  next: string | null;
  previous: string | null;
  results: Value[];
}

const encode = (offset: number) =>
  Buffer.from(String(offset), "utf8").toString("base64url");

const decode = (cursor?: string) => {
  if (!cursor) return 0;
  const offset = Number(Buffer.from(cursor, "base64url").toString("utf8"));
  return Number.isInteger(offset) && offset >= 0 ? offset : 0;
};

/**
 * Source: https://developer.ordergroove.com/reference/pagination
 * Cursor encoding is intentionally simulator-only; clients must keep it opaque.
 */
export const paginate = <Value>(
  values: Value[],
  resource: string,
  pageSize = 10,
  cursor?: string,
): CursorPage<Value> => {
  const size = Math.max(1, Math.min(100, pageSize));
  const offset = decode(cursor);
  const link = (target: number) =>
    `https://restapi.ordergroove.com/${resource}/?cursor=${encode(target)}&page_size=${size}`;
  return {
    next: offset + size < values.length ? link(offset + size) : null,
    previous: offset > 0 ? link(Math.max(0, offset - size)) : null,
    results: values.slice(offset, offset + size),
  };
};
