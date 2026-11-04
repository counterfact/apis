/**
 * The template a business-initiated conversation opened with, and how far it got.
 */
export type WhatsAppOpeningMessage = {
  template_name: string;
  wamid?: string | null;
  sent_at_unix: number;
  delivered_at_unix?: number | null;
  read_at_unix?: number | null;
  replied_at_unix?: number | null;
  failed_at_unix?: number | null;
  error_code?: string | null;
  pricing_category?: string | null;
  billable?: boolean | null;
};
