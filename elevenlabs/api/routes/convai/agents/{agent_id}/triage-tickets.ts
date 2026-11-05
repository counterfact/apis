import type {Routes} from "../../../../types/index.js";
import type {Context} from "./triage-tickets/_.context.js";
type Route=Routes["/convai"]["/agents"]["/{agent_id}"]["/triage-tickets"];
export const GET:Route["GET"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.list($.query,$.path.agent_id));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
export const POST:Route["POST"]=async($)=>{
 const c=$.context;
 try {return $.response.status(200).json(c.createManual($.path.agent_id,$.body));}catch(error){if(error instanceof Error&&error.name==='TicketError'){const e=error as Error&{status:number;code:string};return $.x.response.status(e.status).json({detail:{status:e.code,message:e.message}});}throw error;}
};
