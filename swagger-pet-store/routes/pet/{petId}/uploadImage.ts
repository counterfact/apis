import type { uploadFile } from "../../../types/paths/pet/{petId}/uploadImage.types.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const getFilenameFromHeaders = (headers: Record<string, string>): string => {
  const explicitFileName =
    headers["x-image-filename"] ?? headers["x-file-name"];
  if (explicitFileName) {
    return path.basename(explicitFileName);
  }

  const contentDisposition = headers["content-disposition"];
  if (!contentDisposition) {
    return "image.bin";
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    return path.basename(decodeURIComponent(utf8Match[1]));
  }

  const standardMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (standardMatch) {
    return path.basename(standardMatch[1]);
  }

  return "image.bin";
};

const isBufferLikeObject = (
  body: unknown,
): body is { type: "Buffer"; data: number[] } =>
  typeof body === "object" &&
  body != null &&
  "type" in body &&
  "data" in body &&
  body.type === "Buffer" &&
  Array.isArray(body.data);

const getImageContent = (body: unknown): string | Uint8Array | null => {
  if (body == null || body === "") {
    return null;
  }
  if (typeof body === "string" || body instanceof Uint8Array) {
    return body;
  }
  if (body instanceof ArrayBuffer) {
    return new Uint8Array(body);
  }
  if (isBufferLikeObject(body)) {
    return Uint8Array.from(body.data);
  }

  return new Uint8Array();
};

export const POST: uploadFile = async ($) => {
  const pet = $.context.petsById.get($.path.petId);
  if (!pet) {
    return $.response[404].empty();
  }

  const imageContent = getImageContent($.x.body);
  if (imageContent == null) {
    return $.response[400].empty();
  }

  const imageFileName = getFilenameFromHeaders($.x.headers);
  const imageDirectory = path.resolve("pet-images", String($.path.petId));
  await mkdir(imageDirectory, { recursive: true });
  await writeFile(path.join(imageDirectory, imageFileName), imageContent);

  $.context.petsById.set($.path.petId, {
    ...pet,
    photoUrls: [...pet.photoUrls, `/photos/${$.path.petId}/${imageFileName}`],
  });

  return $.response[200].json({
    code: 200,
    type: "success",
    message: `Image uploaded for pet ${$.path.petId}${$.query.additionalMetadata ? ` (${$.query.additionalMetadata})` : ""}`,
  });
};
