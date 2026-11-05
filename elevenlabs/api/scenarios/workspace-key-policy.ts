import type { Scenario } from "../types/index.js";
export const emptyWorkspaceKeyPolicy:Scenario=($)=>{
  const c=$.loadContext("/workspaces/api-keys");
  c.callers=new Map();c.override=null;c.planDefault=true;
  c.keys=()=>[...$.loadContext("/service-accounts").accounts.values()].flatMap(a=>[...a.keys.values()]);
};
export const resetWorkspaceKeyPolicy:Scenario=($)=>{
  emptyWorkspaceKeyPolicy($);
  $.loadContext("/workspaces/api-keys").callers=new Map([["sim-workspace-caller","sim-service-key"]]);
};
