import type { Routes } from "../../types/index.js";
type Route = Routes["/assets"]["/{asset_id}"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json($.context.get($.path.asset_id));
  } catch (error) {
    if (error instanceof Error && error.name === "AssetError")
      return $.x.response
        .status(404)
        .json({
          detail: { status: "asset_not_found", message: error.message },
        });
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try {
    $.context.delete($.path.asset_id);
    return $.response.status(204).empty();
  } catch (error) {
    if (error instanceof Error && error.name === "AssetError")
      return $.x.response
        .status(404)
        .json({
          detail: { status: "asset_not_found", message: error.message },
        });
    throw error;
  }
};
