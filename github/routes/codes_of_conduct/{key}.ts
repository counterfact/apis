import type { codesOfConductGetConductCode } from "../../types/paths/codes_of_conduct/{key}.types.js";

export const GET: codesOfConductGetConductCode = async ($) => {
  const code = $.context.getCodeOfConduct($.path.key);
  return code
    ? $.response[200].json(code)
    : $.response[404].json({ message: "Not Found", status: "404" });
};
