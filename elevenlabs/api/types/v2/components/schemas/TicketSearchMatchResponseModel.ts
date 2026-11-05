import type { TicketSearchMatchField } from "./TicketSearchMatchField.js";
export type TicketSearchMatchResponseModel = {
  /**
   * Which of the ticket's texts matched.
   */
  field: TicketSearchMatchField;
  /**
   * Whitespace-collapsed excerpt around the match, with an ellipsis where it was cut.
   */
  snippet: string;
  /**
   * Offset of the match in `snippet`.
   */
  highlight_start: number;
  /**
   * Exclusive end offset of the match in `snippet`.
   */
  highlight_end: number;
  /**
   * The commented turn, set when `field` is 'turn_comment'.
   */
  turn_index?: number | null;
};
