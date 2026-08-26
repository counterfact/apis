import type { UnixMillis } from "./UnixMillis.js";
import type { StageOutput } from "./StageOutput.js";

export type WorkflowTemplateOutput = {
  _id: string;
  _key: string;
  name?: string;
  _creationDate: UnixMillis;
  _ownerId: string;
  _maintainerId: string;
  _links: { [key: string]: unknown };
  description?: string;
  stages?: Array<StageOutput>;
};
