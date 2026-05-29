/**
 * A unique encryption key
 */
export type gpg_key = {
  /**
   * @format int64
   * @example 3
   */
  id: number;
  /**
   * @example "Octocat's GPG Key"
   */
  name?: string;
  primary_key_id: number;
  /**
   * @example "3262EFF25BA0D270"
   */
  key_id: string;
  /**
   * @example "xsBNBFayYZ..."
   */
  public_key: string;
  /**
   * @example [{"email":"octocat@users.noreply.github.com","verified":true}]
   */
  emails: Array<{ email?: string; verified?: boolean }>;
  /**
   * @example [{"id":4,"primary_key_id":3,"key_id":"4A595D4C72EE49C7","public_key":"zsBNBFayYZ...","emails":[],"can_sign":false,"can_encrypt_comms":true,"can_encrypt_storage":true,"can_certify":false,"created_at":"2016-03-24T11:31:04-06:00","expires_at":null,"revoked":false}]
   */
  subkeys: Array<{
    /**
     * @format int64
     */
    id?: number;
    primary_key_id?: number;
    key_id?: string;
    public_key?: string;
    emails?: Array<{ email?: string; verified?: boolean }>;
    subkeys?: Array<unknown>;
    can_sign?: boolean;
    can_encrypt_comms?: boolean;
    can_encrypt_storage?: boolean;
    can_certify?: boolean;
    created_at?: string;
    expires_at?: string;
    raw_key?: string;
    revoked?: boolean;
  }>;
  /**
   * @example true
   */
  can_sign: boolean;
  can_encrypt_comms: boolean;
  can_encrypt_storage: boolean;
  /**
   * @example true
   */
  can_certify: boolean;
  /**
   * @format date-time
   * @example "2016-03-24T11:31:04-06:00"
   */
  created_at: string;
  /**
   * @format date-time
   */
  expires_at: string;
  /**
   * @example true
   */
  revoked: boolean;
  raw_key: string;
};
