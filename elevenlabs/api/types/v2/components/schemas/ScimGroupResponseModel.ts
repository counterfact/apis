import type { SeatType } from "./SeatType.js";
export type ScimGroupResponseModel = {
  scim_external_id: string | null;
  display_name: string;
  created_at_unix?: number | null;
  updated_at_unix?: number | null;
  seat_type?: SeatType | null;
};
