import type { WhatsAppCallPermissionRequestState } from "./WhatsAppCallPermissionRequestState.js";
export type WhatsAppCallPermissionRequest = {
  state: WhatsAppCallPermissionRequestState;
  requested_at_unix?: number | null;
  responded_at_unix?: number | null;
  permanent?: boolean | null;
  granted_by_user_call?: boolean | null;
};
