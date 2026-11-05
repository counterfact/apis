import type { Context } from "../_.context.js";
import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"]["/copy"];
export const POST: Route["POST"] = async ($) => {
  try { return $.response.status(200).json(($.x.context as Context).copyItem($.path.analysis_item_id)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
