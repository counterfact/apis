import type { UnixMillis } from "./UnixMillis.js";

export type flagLinkPost = {
  /**
   * The flag link key
   * @example "flag-link-key-123abc"
   */
  key?: string;
  /**
   * The integration key for an integration whose <code>manifest.json</code> includes the <code>flagLink</code> capability, if this is a flag link for an existing integration. Do not include for URL flag links.
   */
  integrationKey?: string;
  /**
   * The time, in Unix milliseconds, to mark this flag link as associated with the external URL. If omitted, defaults to the creation time of this flag link.
   */
  timestamp?: UnixMillis;
  /**
   * The URL for the external resource you are linking the flag to
   * @example "https://example.com/archives/123123123"
   */
  deepLink?: string;
  /**
   * The title of the flag link
   * @example "Example link title"
   */
  title?: string;
  /**
   * The description of the flag link
   * @example "Example link description"
   */
  description?: string;
  /**
   * The metadata required by this integration in order to create a flag link, if this is a flag link for an existing integration. Defined in the integration's <code>manifest.json</code> file under <code>flagLink</code>.
   */
  metadata?: { [key: string]: string };
};
