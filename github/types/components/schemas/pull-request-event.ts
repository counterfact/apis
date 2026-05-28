import type { pull_request_minimal } from "./pull-request-minimal.js";
import type { simple_user } from "./simple-user.js";
import type { label } from "./label.js";

export type pull_request_event = {
  action: string;
  number: number;
  pull_request: pull_request_minimal;
  assignee?: simple_user;
  assignees?: Array<simple_user>;
  label?: label;
  labels?: Array<label>;
};
