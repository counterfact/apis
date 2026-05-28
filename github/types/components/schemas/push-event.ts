export type push_event = {
  repository_id: number;
  push_id: number;
  ref: string;
  head: string;
  before: string;
};
