import type {Scenario} from "../types/index.js";
export const emptySyntheticCredentials:Scenario=($)=>{
 const c=$.loadContext("/convai/conversation");c.issued=new Map();c.nextId=0;c.agents=()=>$.loadContext("/convai/agents");
 c.defaults={time:1735689600,signedTtl:900,webrtcTtl:600,singleUseTtl:900,clientSecretTtl:600,session:{type:"realtime",model:"eleven_realtime_v1_mini",instructions:"",output_modalities:["audio"],temperature:0.7,max_response_output_tokens:4096,max_duration_seconds:600}};
 $.loadContext("/single-use-token").credentials=()=>c;$.loadContext("/convai/realtime").credentials=()=>c;
};
