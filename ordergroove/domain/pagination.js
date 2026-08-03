/**
 * @typedef {object} PaginationRequest
 * @property {Record<string, unknown>} headers
 * @property {string} path
 * @property {Record<string, unknown>} query
 */

/** @param {unknown} cursor @returns {number} */
const cursorOffset = (cursor) => {
  if (typeof cursor !== "string") return 0;
  const match = /^offset:(\d+)$/.exec(cursor);
  return match ? Number(match[1]) : 0;
};

/** @param {unknown} value @returns {number} */
const pageSize = (value) => {
  const parsed = typeof value === "number" ? value : Number(value ?? 10);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100 ? parsed : 10;
};

/**
 * @template Item
 * @param {Item[]} items
 * @param {PaginationRequest} request
 * @returns {{next: string | null, previous: string | null, results: Item[]}}
 */
export const paginate = (items, request) => {
  const size = pageSize(request.query.page_size);
  const offset = Math.min(cursorOffset(request.query.cursor), items.length);
  const host = String(request.headers.host ?? "localhost:3100");

  /** @param {number} linkOffset */
  const link = (linkOffset) => {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(request.query)) {
      if (name !== "cursor" && value !== undefined) {
        for (const entry of Array.isArray(value) ? value : [value]) {
          params.append(name, String(entry));
        }
      }
    }
    params.set("cursor", `offset:${linkOffset}`);
    return `http://${host}${request.path}?${params.toString()}`;
  };

  return {
    next: offset + size < items.length ? link(offset + size) : null,
    previous: offset > 0 ? link(Math.max(0, offset - size)) : null,
    results: items.slice(offset, offset + size),
  };
};
