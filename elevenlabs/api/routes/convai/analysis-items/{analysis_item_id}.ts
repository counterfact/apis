import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.getItem($.path.analysis_item_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const PATCH: Route["PATCH"] = async ($) => {
  try { return $.response.status(200).json($.context.updateItem($.path.analysis_item_id, $.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const DELETE: Route["DELETE"] = async ($) => {
  try { return $.response.status(200).json($.context.deleteItem($.path.analysis_item_id, $.query.force ?? false)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
