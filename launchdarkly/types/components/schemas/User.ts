export type User = {
  /**
   * The user key. This is the only mandatory user attribute.
   * @example "user-key-123abc"
   */
  key?: string;
  /**
   * If provided, used with the user key to generate a variation in percentage rollouts
   * @example "2398127"
   */
  secondary?: string;
  /**
   * The user's IP address
   * @example "10.10.10.10"
   */
  ip?: string;
  /**
   * The user's country
   * @example "United States"
   */
  country?: string;
  /**
   * The user's email
   * @example "sandy@example.com"
   */
  email?: string;
  /**
   * The user's first name
   * @example "Sandy"
   */
  firstName?: string;
  /**
   * The user's last name
   * @example "Smith"
   */
  lastName?: string;
  /**
   * An absolute URL to an avatar image.
   * @example "http://example.com/avatar.png"
   */
  avatar?: string;
  /**
   * The user's full name
   * @example "Sandy Smith"
   */
  name?: string;
  /**
   * Whether the user is anonymous. If true, this user does not appear on the Contexts list in the LaunchDarkly user interface.
   * @example false
   */
  anonymous?: boolean;
  /**
   * Any other custom attributes for this user. Custom attributes contain any other user data that you would like to use to conditionally target your users.
   */
  custom?: { [key: string]: unknown };
  /**
   * A list of attribute names that are marked as private. You can use these attributes in targeting rules and segments. If you are using a server-side SDK, the SDK will not send the private attribute back to LaunchDarkly. If you are using a client-side SDK, the SDK will send the private attribute back to LaunchDarkly for evaluation. However, the SDK won't send the attribute to LaunchDarkly in events data, LaunchDarkly won't store the private attribute, and the private attribute will not appear on the Contexts list.
   */
  privateAttrs?: Array<string>;
};
