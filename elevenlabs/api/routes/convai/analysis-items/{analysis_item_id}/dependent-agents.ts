import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"]["/dependent-agents"];
export const GET: Route["GET"] = async ($) => {
  try { return $.response.status(200).json($.context.dependentAgents($.path.analysis_item_id, $.query)); }
  catch (error) {
    if (error instanceof Error && error.name === "AnalysisItemError") {
      const failure = error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
