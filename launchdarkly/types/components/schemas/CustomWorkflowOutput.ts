import type { ConflictOutput } from "./ConflictOutput.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { StageOutput } from "./StageOutput.js";
import type { ExecutionOutput } from "./ExecutionOutput.js";
import type { WorkflowTemplateMetadata } from "./WorkflowTemplateMetadata.js";

export type CustomWorkflowOutput = {
  /**
   * The ID of the workflow
   * @example "12ab3c4d5ef1a2345bcde67f"
   */
  _id: string;
  /**
   * The version of the workflow
   * @example 1
   */
  _version: number;
  /**
   * Any conflicts that are present in the workflow stages
   */
  _conflicts: Array<ConflictOutput>;
  /**
   * Timestamp of when the workflow was created
   * @example "1654104600000"
   */
  _creationDate: UnixMillis;
  /**
   * The member ID of the maintainer of the workflow. Defaults to the workflow creator.
   * @example "12ab3c45de678910abc12345"
   */
  _maintainerId: string;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The name of the workflow
   * @example "Progressive rollout starting in two days"
   */
  name: string;
  /**
   * A brief description of the workflow
   * @example "Turn flag on for 10% of customers each day"
   */
  description?: string;
  /**
   * The kind of workflow
   * @example "custom"
   */
  kind?: string;
  /**
   * The stages that make up the workflow. Each stage contains conditions and actions.
   */
  stages?: Array<StageOutput>;
  /**
   * The current execution status of the workflow
   * @example "{\"status\": \"completed\"}"
   */
  _execution: ExecutionOutput;
  /**
   * For workflows being created from a workflow template, this value holds any parameters that could potentially be incompatible with the current project, environment, or flag
   */
  meta?: WorkflowTemplateMetadata;
  /**
   * For workflows being created from a workflow template, this value is the template's key
   * @example "example-workflow-template"
   */
  templateKey?: string;
};
