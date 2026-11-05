import type { Scenario } from "../types/index.js";
export const emptyRealtimeGroups: Scenario = ($) => {
  const c = $.loadContext("/convai/realtime");
  c.groups = new Map(); c.conversations = new Map(); c.nextId = 1;
  c.creationTime = 1_735_689_602;
  c.creator = {is_creator:true,creator_name:"Simulator User",creator_email:"simulator@example.invalid",role:"admin",access_source:"creator"};
};
export const resetRealtimeGroups: Scenario = ($) => {
  emptyRealtimeGroups($);
  const c = $.loadContext("/convai/realtime");
  c.groups = new Map([
    ["sim-realtime-group",{id:"sim-realtime-group",title:"Simulator Sessions",description:"Synthetic realtime sessions",access_info:structuredClone(c.creator!),sharing:{people_count:0,shared_with_everyone:false,everyone_role:null},created_at_unix_secs:1_735_689_602}],
    ["sim-realtime-group-old",{id:"sim-realtime-group-old",title:"Historical Sessions",description:"Historical synthetic sessions",access_info:structuredClone(c.creator!),sharing:{people_count:0,shared_with_everyone:false,everyone_role:null},created_at_unix_secs:1_735_689_600}],
  ]);
  c.conversations = new Map([["sim-realtime-conversation","sim-realtime-group"],["sim-realtime-conversation-ungrouped",null]]);
};
