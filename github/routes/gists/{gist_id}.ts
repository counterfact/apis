import type { gistsGet } from "../../types/paths/gists/{gist_id}.types.js";
import type { gistsUpdate } from "../../types/paths/gists/{gist_id}.types.js";
import type { gistsDelete } from "../../types/paths/gists/{gist_id}.types.js";

export const GET: gistsGet = async ($) => {
  const gist = $.context.getGist($.path.gist_id);
  if (!gist) {
    return $.response[404].empty();
  }
  return $.response[200].json(gist);
};

export const PATCH: gistsUpdate = async ($) => {
  const existing = $.context.getGist($.path.gist_id);
  if (!existing) {
    return $.response[404].empty();
  }

  const files = { ...existing.files };
  if ($.body.files) {
    for (const [filename, file] of Object.entries($.body.files)) {
      if (file == null) {
        delete files[filename];
      } else {
        const newFilename = file.filename ?? filename;
        if (newFilename !== filename) {
          delete files[filename];
        }
        files[newFilename] = {
          ...files[newFilename],
          filename: newFilename,
          content: file.content ?? files[filename]?.content,
        };
      }
    }
  }

  const updated = $.context.saveGist({
    ...existing,
    description: $.body.description ?? existing.description,
    files,
  });

  return $.response[200].json(updated);
};

export const DELETE: gistsDelete = async ($) => {
  if (!$.context.hasGist($.path.gist_id)) {
    return $.response[404].empty();
  }
  $.context.deleteGist($.path.gist_id);
  return $.response[204].empty();
};
