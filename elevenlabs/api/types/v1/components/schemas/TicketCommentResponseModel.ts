export type TicketCommentResponseModel = {
  comment: string;
  created_at_unix_secs: number;
  owner_user_id: string | null;
};
