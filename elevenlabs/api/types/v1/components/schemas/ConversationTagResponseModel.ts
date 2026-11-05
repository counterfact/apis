export type ConversationTagResponseModel = {
  tag_id: string;
  workspace_id: string;
  owner_user_id: string;
  title: string;
  description: string | null;
  created_at_unix_secs: number;
};
