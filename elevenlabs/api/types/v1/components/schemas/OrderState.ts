export type OrderState =
  | "open"
  | "submitted"
  | "paid"
  | "accepted"
  | "rejected"
  | "done"
  | "cancelling"
  | "cancelled"
  | "expired"
  | "merged";
