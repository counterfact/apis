import type { UnixMillis } from "./UnixMillis.js";

export type Client = {
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/oauth/clients","type":"application/json"},"self":{"href":"/api/v2/oauth/clients/50666563-9144-4125-b822-33f308227e45","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Client name
   */
  name: string;
  /**
   * Client description
   */
  description?: string;
  /**
   * The account ID the client is registered under
   */
  _accountId: string;
  /**
   * The client's unique ID
   */
  _clientId: string;
  /**
   * The client secret. This will only be shown upon creation.
   */
  _clientSecret?: string;
  /**
   * The client's redirect URI
   */
  redirectUri: string;
  /**
   * Timestamp of client creation date
   * @example "1494437420312"
   */
  _creationDate: UnixMillis;
};
