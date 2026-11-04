/**
 * A WhatsApp user by phone number and/or BSUID; the phone wins where one is needed.
 */
export type WhatsAppRecipient = {
  phone?: string | null;
  bsuid?: string | null;
};
