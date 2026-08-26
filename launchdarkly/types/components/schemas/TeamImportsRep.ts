import type { MemberImportItem } from "./MemberImportItem.js";

export type TeamImportsRep = {
  /**
   * An array of details about the members requested to be added to this team
   */
  items?: Array<MemberImportItem>;
};
