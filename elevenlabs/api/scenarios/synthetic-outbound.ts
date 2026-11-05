import type {Scenario} from "../types/index.js";
export const emptySyntheticOutbound:Scenario=($)=>{
 const c=$.loadContext("/convai/whatsapp-accounts");c.accounts=new Map();c.requests=new Map();c.nextId=0;
 c.agents=()=>$.loadContext("/convai/agents");c.phones=()=>$.loadContext("/convai/phone-numbers");c.conversations=()=>$.loadContext("/convai/conversations");
 c.defaults={time:1735689700,template:{conversation_id:"",agent_id:"",status:"initiated",conversation_product:"agent",transcript:[],analysis:null,has_audio:false,has_user_audio:false,has_response_audio:false,has_auxiliary_audio:false,tag_ids:[],metadata:{start_time_unix_secs:0,call_duration_secs:0,cost:0,cost_fiat:null}}};
 $.loadContext("/convai/twilio").communication=()=>c;$.loadContext("/convai/exotel").communication=()=>c;$.loadContext("/convai/sip-trunk").communication=()=>c;$.loadContext("/convai/whatsapp").communication=()=>c;
};
export const resetSyntheticOutbound:Scenario=($)=>{
 emptySyntheticOutbound($);$.loadContext("/convai/whatsapp-accounts").accounts.set("sim-whatsapp",{business_account_id:"sim-whatsapp-business",phone_number_id:"sim-whatsapp",business_account_name:"Synthetic Business",phone_number_name:"Synthetic Support",phone_number:"+15005550004",account_type:"cloud_api",assigned_agent_id:"sim-agent",assigned_agent_name:null,enable_messaging:true,enable_audio_message_response:true,enable_typing_indicator:true,is_token_expired:false});
};
export const syntheticOutboundProviders:Scenario=($)=>{
 const phones=$.loadContext("/convai/phone-numbers").phones;
 phones.set("sim-phone-exotel",{public:{phone_number_id:"sim-phone-exotel",phone_number:"+15005550005",label:"Synthetic Exotel",provider:"exotel",supports_inbound:true,supports_outbound:true}});
 const sip=phones.get("sim-phone-sip")!.public;if(sip.provider==="sip_trunk"){sip.supports_outbound=true;sip.outbound_trunk={address:"sip.simulator.invalid",transport:"tls",media_encryption:"allowed",has_auth_credentials:false,has_outbound_trunk:true};sip.provider_config=structuredClone(sip.outbound_trunk);}
};
export const completeSyntheticOutbound:Scenario=($)=>{
 const c=$.loadContext("/convai/whatsapp-accounts"),conversations=$.loadContext("/convai/conversations").conversations;
 for(const id of c.requests.keys()){const conversation=conversations.get(id);if(conversation?.status==="initiated"){conversation.status="done";conversation.metadata.termination_reason="synthetic_completed";}}
};
