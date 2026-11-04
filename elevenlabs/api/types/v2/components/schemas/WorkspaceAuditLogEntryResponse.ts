import type { AccountChangeActivityId } from "./AccountChangeActivityId.js";
import type { AuthenticationActivityId } from "./AuthenticationActivityId.js";
import type { EntityManagementActivityId } from "./EntityManagementActivityId.js";
import type { UserAccessManagementActivityId } from "./UserAccessManagementActivityId.js";
import type { GroupManagementActivityId } from "./GroupManagementActivityId.js";
import type { SeverityId } from "./SeverityId.js";
import type { StatusId } from "./StatusId.js";
import type { ActorModel } from "./ActorModel.js";
import type { DeviceModel } from "./DeviceModel.js";
import type { HttpRequestModel } from "./HttpRequestModel.js";
/**
 * Audit log entry with Firestore document ID for API responses.
 */
export type WorkspaceAuditLogEntryResponse = {
  /**
   * Event metadata
   */
  metadata?: { [key: string]: unknown };
  /**
   * Event time in milliseconds since epoch
   */
  time?: number;
  /**
   * Activity ID
   */
  activity_id:
    | AccountChangeActivityId
    | AuthenticationActivityId
    | EntityManagementActivityId
    | UserAccessManagementActivityId
    | GroupManagementActivityId;
  /**
   * Activity name
   */
  activity_name: string;
  /**
   * Event category
   * @default "Identity & Access Management"
   */
  category_name?: string;
  /**
   * Category UID for IAM
   * @default 3
   */
  category_uid?: number;
  /**
   * Event class name
   * @default ""
   */
  class_name?: string;
  /**
   * Event class UID
   * @default 0
   */
  class_uid?: number;
  /**
   * Severity level
   * @default 1
   */
  severity_id?: SeverityId;
  /**
   * Status of the action
   */
  status_id: StatusId;
  /**
   * Actor performing the action
   */
  actor: ActorModel;
  /**
   * Device information
   */
  device?: DeviceModel | null;
  /**
   * HTTP request details
   */
  http_request?: HttpRequestModel | null;
  /**
   * Human-readable event description
   */
  message: string;
  /**
   * Attributes not mapped to OCSF
   */
  unmapped?: { [key: string]: unknown };
  /**
   * Firestore document ID
   */
  id: string;
  /**
   * Event time in human-readable RFC 3339 format, derived from 'time'.
   */
  time_dt: string;
  /**
   * OCSF type_uid is class_uid * 100 + activity_id.
   */
  type_uid: number;
  /**
   * OCSF type_name combines class_name and activity_name.
   */
  type_name: string;
};
