import type { gistsList } from "../types/paths/gists.types.js";
import type { gistsCreate } from "../types/paths/gists.types.js";

export const GET: gistsList = async ($) => {
  return $.response[200].json($.context.listGists());
};

export const POST: gistsCreate = async ($) => {
  const files: NonNullable<ReturnType<typeof $.context.getGist>>["files"] = {};
  for (const [filename, file] of Object.entries($.body.files)) {
    files[filename] = {
      filename,
      content: file.content,
      size: file.content.length,
      type: "text/plain",
    };
  }

  const gist = $.context.saveGist({
    description: $.body.description ?? "",
    public: $.body.public === true || $.body.public === "true",
    files,
  });

  return $.response[201].json(gist);
};
