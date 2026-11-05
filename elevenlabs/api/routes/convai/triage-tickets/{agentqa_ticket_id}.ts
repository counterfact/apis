import type {Routes} from "../../../types/index.js";
type Route=Routes["/convai"]["/triage-tickets"]["/{agentqa_ticket_id}"];
export const GET:Route["GET"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.get($.path.agentqa_ticket_id));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
export const PATCH:Route["PATCH"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.patch($.path.agentqa_ticket_id,$.body));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
export const DELETE:Route["DELETE"]=async($)=>{
 const c=$.context;
 try { c.delete($.path.agentqa_ticket_id);return $.response.status(204).empty();}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
