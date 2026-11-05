import type {Routes} from "../../../../types/index.js";
type Route=Routes["/convai"]["/triage-tickets"]["/{agentqa_ticket_id}"]["/merge"];
export const POST:Route["POST"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.merge($.path.agentqa_ticket_id,$.body));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
