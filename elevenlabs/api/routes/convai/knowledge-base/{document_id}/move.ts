import type { Routes } from "../../../../types/index.js";
type Route=Routes["/convai"]["/knowledge-base"]["/{document_id}"]["/move"];
export const POST:Route["POST"]=async($)=>{
  try { $.context.moveDocument($.path.document_id,$.body); return $.response.status(200).empty(); }
  catch (error) {
    if (error instanceof Error && error.name === "KnowledgeBaseError") {
      const failure=error as Error & {status:number;code:string};
      return $.x.response.status(failure.status).json({detail:{status:failure.code,message:failure.message}});
    }
    throw error;
  }
};
