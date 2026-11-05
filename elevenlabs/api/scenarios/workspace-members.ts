import type { Scenario } from "../types/index.js";

export const emptyWorkspaceMembers: Scenario = ($) => {
  const c = $.loadContext("/workspace"), groups = $.loadContext("/workspace/groups");
  c.profiles = new Map(); c.invitations = new Map();
  c.verifiedDomains = new Set(["example.invalid"]);
  c.memberDirectory = () => groups.members;
  c.groupDirectory = () => groups.groups;
  groups.members = new Map();
  for (const group of groups.groups.values()) group.members = [];
};

export const resetWorkspaceMembers: Scenario = ($) => {
  const c = $.loadContext("/workspace"), groups = $.loadContext("/workspace/groups");
  c.memberDirectory = () => groups.members;
  c.groupDirectory = () => groups.groups;
  c.invitations = new Map();
  c.verifiedDomains = new Set(["example.invalid"]);
  c.profiles = new Map([
    ["sim-member-narrator",{first_name:"Narrator",seat_type:"workspace_admin",is_owner:true,is_locked:false}],
    ["sim-member-assistant",{first_name:"Assistant",seat_type:"workspace_member",is_owner:false,is_locked:true}],
  ]);
};
