import type { FeatureWorkflowId } from "./FeatureWorkflowId.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { Instructions } from "./Instructions.js";

export type FeatureFlagScheduledChange = {
  /**
   * The ID of this scheduled change
   * @example "12ab3c45de678910abc12345"
   */
  _id: FeatureWorkflowId;
  /**
   * Timestamp of when the scheduled change was created
   * @example "1654123897062"
   */
  _creationDate: UnixMillis;
  /**
   * The ID of the scheduled change maintainer
   * @example "12ab3c45de678910abc12345"
   */
  _maintainerId: string;
  /**
   * Version of the scheduled change
   * @example 1
   */
  _version: number;
  /**
   * When the scheduled changes should be executed
   * @example "1636558831870"
   */
  executionDate: UnixMillis;
  /**
   * The actions to perform on the execution date for these scheduled changes
   * @example "[ { \"kind\": \"turnFlagOn\" }]"
   */
  instructions: Instructions;
  /**
   * Details on any conflicting scheduled changes
   */
  conflicts?: unknown;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
