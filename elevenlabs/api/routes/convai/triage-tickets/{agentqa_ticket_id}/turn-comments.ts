import type {Routes} from "../../../../types/index.js";
type Route=Routes["/convai"]["/triage-tickets"]["/{agentqa_ticket_id}"]["/turn-comments"];
export const POST:Route["POST"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.comment($.path.agentqa_ticket_id,$.body,true));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
