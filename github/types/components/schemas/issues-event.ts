import type { issue } from "./issue.js";
import type { simple_user } from "./simple-user.js";
import type { label } from "./label.js";

export type issues_event = {
  action: string;
  issue: issue;
  assignee?: simple_user;
  assignees?: Array<simple_user>;
  label?: label;
  labels?: Array<label>;
};
