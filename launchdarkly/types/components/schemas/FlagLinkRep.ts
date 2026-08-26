import type { TimestampRep } from "./TimestampRep.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { FlagLinkMember } from "./FlagLinkMember.js";

export type FlagLinkRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * The flag link key
   * @example "flag-link-key-123abc"
   */
  _key?: string;
  /**
   * The integration key for an integration whose <code>manifest.json</code> includes the <code>flagLink</code> capability, if this is a flag link for an existing integration
   */
  _integrationKey?: string;
  /**
   * The ID of this flag link
   * @example "1234a56b7c89d012345e678f"
   */
  _id: string;
  /**
   * The URL for the external resource the flag is linked to
   * @example "https://example.com/archives/123123123"
   */
  _deepLink: string;
  /**
   * The time to mark this flag link as associated with the external URL. Defaults to the creation time of the flag link, but can be set to another time during creation.
   * @example "{\"milliseconds\": 1655342199935, \"seconds\": 1655342199, \"rfc3339\": \"2022-06-16T01:16:39Z\", \"simple\": \"2022-06-16 01:16:39\"}"
   */
  _timestamp: TimestampRep;
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
  _metadata?: { [key: string]: string };
  /**
   * Timestamp of when the flag link was created
   * @example "1654104600000"
   */
  _createdAt: UnixMillis;
  /**
   * Details on the member associated with this flag link
   */
  _member?: FlagLinkMember;
};
