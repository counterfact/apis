export type User = {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @example "theUser"
   */
  username?: string;
  /**
   * @example "John"
   */
  firstName?: string;
  /**
   * @example "James"
   */
  lastName?: string;
  /**
   * @example "john@email.com"
   */
  email?: string;
  /**
   * @example "12345"
   */
  password?: string;
  /**
   * @example "12345"
   */
  phone?: string;
  /**
   * User Status
   * @format int32
   * @example 1
   */
  userStatus?: number;
};
