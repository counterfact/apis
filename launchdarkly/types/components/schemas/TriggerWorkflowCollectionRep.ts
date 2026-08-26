import type { TriggerWorkflowRep } from "./TriggerWorkflowRep.js";

export type TriggerWorkflowCollectionRep = {
  /**
   * An array of flag triggers
   */
  items?: Array<TriggerWorkflowRep>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
