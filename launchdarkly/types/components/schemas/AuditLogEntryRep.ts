import type { UnixMillis } from "./UnixMillis.js";
import type { ResourceAccess } from "./ResourceAccess.js";
import type { ResourceKind } from "./ResourceKind.js";
import type { SubjectDataRep } from "./SubjectDataRep.js";
import type { MemberDataRep } from "./MemberDataRep.js";
import type { TokenSummary } from "./TokenSummary.js";
import type { AuthorizedAppDataRep } from "./AuthorizedAppDataRep.js";
import type { TargetResourceRep } from "./TargetResourceRep.js";
import type { ParentResourceRep } from "./ParentResourceRep.js";
import type { AuditLogEntryListingRep } from "./AuditLogEntryListingRep.js";

export type AuditLogEntryRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The ID of the audit log entry
   * @example "1234a56b7c89d012345e678f"
   */
  _id: string;
  /**
   * The ID of the account to which this audit log entry belongs
   * @example "1234a56b7c89d012345e678f"
   */
  _accountId: string;
  /**
   * Timestamp of the audit log entry
   * @example "1654104600000"
   */
  date: UnixMillis;
  /**
   * Details on the actions performed and resources acted on in this audit log entry
   */
  accesses: Array<ResourceAccess>;
  /**
   * The type of resource this audit log entry refers to
   * @example "flag"
   */
  kind: ResourceKind;
  /**
   * The name of the resource this audit log entry refers to
   * @example "Example feature flag"
   */
  name: string;
  /**
   * Description of the change recorded in the audit log entry
   * @example "Example, turning on the flag for testing"
   */
  description: string;
  /**
   * Shorter version of the change recorded in the audit log entry
   * @example "Example, turning on the flag"
   */
  shortDescription: string;
  /**
   * Optional comment for the audit log entry
   * @example "This is an automated test"
   */
  comment?: string;
  /**
   * Details of the subject who initiated the action described in the audit log entry
   */
  subject?: SubjectDataRep;
  /**
   * Details of the member who initiated the action described in the audit log entry
   */
  member?: MemberDataRep;
  /**
   * Details of the access token that initiated the action described in the audit log entry
   */
  token?: TokenSummary;
  /**
   * Details of the authorized application that initiated the action described in the audit log entry
   */
  app?: AuthorizedAppDataRep;
  /**
   * The action and resource recorded in this audit log entry
   * @example "turned on the flag"
   */
  titleVerb?: string;
  /**
   * A description of what occurred, in the format <code>member</code> <code>titleVerb</code> <code>target</code>
   */
  title?: string;
  /**
   * Details of the resource acted upon in this audit log entry
   * @example "[Ariel Flores](mailto:ariel@acme.com) turned on the flag [example-flag](https://app.launchdarkly.com/example-project/production/features/example-flag) in Production"
   */
  target?: TargetResourceRep;
  parent?: ParentResourceRep;
  /**
   * If the audit log entry has been updated, this is the JSON patch body that was used in the request to update the entity
   */
  delta?: unknown;
  /**
   * A JSON representation of the external trigger for this audit log entry, if any
   */
  triggerBody?: unknown;
  /**
   * A JSON representation of the merge information for this audit log entry, if any
   */
  merge?: unknown;
  /**
   * If the audit log entry has been updated, this is a JSON representation of the previous version of the entity
   */
  previousVersion?: unknown;
  /**
   * If the audit log entry has been updated, this is a JSON representation of the current version of the entity
   */
  currentVersion?: unknown;
  subentries?: Array<AuditLogEntryListingRep>;
};
