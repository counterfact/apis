import type { uploadFile } from "../../../types/paths/pet/{petId}/uploadImage.types.js";

export const POST: uploadFile = async ($) => {
  if (!$.context.hasPet($.path.petId)) {
    return $.response[404].empty();
  }

  return $.response[200].json({
    code: 200,
    type: "success",
    message: `Image uploaded for pet ${$.path.petId}${$.query.additionalMetadata ? ` (${$.query.additionalMetadata})` : ""}`,
  });
};
