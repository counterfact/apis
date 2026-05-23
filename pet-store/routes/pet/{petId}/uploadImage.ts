import type { uploadFile } from "../../../types/paths/pet/{petId}/uploadImage.types.js";

export const POST: uploadFile = async ($) => {
  return $.response[200].random();
};
