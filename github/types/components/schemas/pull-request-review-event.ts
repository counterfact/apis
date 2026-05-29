import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { pull_request_minimal } from "./pull-request-minimal.js";

export type pull_request_review_event = {
  action: string;
  review: {
    id?: number;
    node_id?: string;
    user?: nullable_simple_user;
    body?: string;
    commit_id?: string;
    submitted_at?: string;
    state?: string;
    /**
     * @format uri
     */
    html_url?: string;
    /**
     * @format uri
     */
    pull_request_url?: string;
    _links?: { html: { href: string }; pull_request: { href: string } };
    updated_at?: string;
  };
  pull_request: pull_request_minimal;
};
