import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/analysis-items"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.listItems($.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json($.context.createItem($.body)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
