import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * The status of a commit.
 */
export type status = {
  url: string;
  avatar_url: string;
  id: number;
  node_id: string;
  state: string;
  description: string;
  target_url: string;
  context: string;
  created_at: string;
  updated_at: string;
  creator: nullable_simple_user;
};
