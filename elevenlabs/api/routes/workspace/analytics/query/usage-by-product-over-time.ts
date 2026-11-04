import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/workspace"]["/analytics"]["/query"]["/usage-by-product-over-time"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
