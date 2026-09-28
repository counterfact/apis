import type { EventType } from "./EventType.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { FlagEventMemberRep } from "./FlagEventMemberRep.js";
import type { FlagEventImpactRep } from "./FlagEventImpactRep.js";
import type { FlagEventExperimentCollection } from "./FlagEventExperimentCollection.js";

export type FlagEventRep = {
  /**
   * The flag event ID
   * @format uuid
   * @example "e3b2b0e0-9e9b-4c9a-8e9a-0e0e0e0e0e0e"
   */
  id: string;
  /**
   * The project ID
   * @example "65baa44ecc4b5bce113bb4f7"
   */
  projectId: string;
  /**
   * The project key
   * @example "default"
   */
  projectKey: string;
  /**
   * The environment ID
   * @example "65baa44ecc4b5bce113bb4f7"
   */
  environmentId?: string;
  /**
   * The environment key
   * @example "production"
   */
  environmentKey?: string;
  /**
   * The flag key
   * @example "enable-new-payment-method"
   */
  flagKey: string;
  /**
   * The event type
   * @example "enabled_targeting"
   */
  eventType: EventType;
  /**
   * A Unix timestamp in milliseconds
   * @example "1616425200000"
   */
  eventTime: UnixMillis;
  /**
   * The event description
   * @example "Targeting rule enabled"
   */
  description: string;
  /**
   * The audit log entry ID
   * @example "e3b2b0e0-9e9b-4c9a-8e9a-0e0e0e0e0e0e"
   */
  auditLogEntryId?: string;
  /**
   * The member data
   */
  member?: FlagEventMemberRep;
  /**
   * The resource actions
   */
  actions?: Array<string>;
  /**
   * The flag event evaluation impact
   */
  impact: FlagEventImpactRep;
  /**
   * A list of experiment iterations related to the flag event
   */
  experiments?: FlagEventExperimentCollection;
};
