import type { addressesList } from "../types/paths/addresses.types.js";

export const GET: addressesList = async ($) => {
  const query = $.query as unknown as Record<string, unknown>;
  let addresses = $.context.state.addresses;
  if ($.query.customer !== undefined) {
    addresses = addresses.filter(
      (entry) => entry.customer === $.query.customer,
    );
  }
  const live = query.live;
  if (live !== undefined) {
    const expectedLive = live === true || live === "true";
    addresses = addresses.filter((entry) => entry.live === expectedLive);
  }
  const updatedStart = query.updated_start;
  if (typeof updatedStart === "string") {
    addresses = addresses.filter((entry) => entry.updated >= updatedStart);
  }
  const updatedEnd = query.updated_end;
  if (typeof updatedEnd === "string") {
    addresses = addresses.filter((entry) => entry.updated <= updatedEnd);
  }

  return $.response[200].json(
    $.context.paginate(addresses, {
      headers: $.headers,
      path: "/addresses/",
      query,
    }),
  );
};
