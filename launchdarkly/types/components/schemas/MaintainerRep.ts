import type { MemberSummary } from "./MemberSummary.js";
import type { MemberTeamSummaryRep } from "./MemberTeamSummaryRep.js";

export type MaintainerRep = {
  /**
   * Details on the member who maintains this resource
   */
  member?: MemberSummary;
  /**
   * Details on the team that maintains this resource
   */
  team?: MemberTeamSummaryRep;
};
