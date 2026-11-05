export type SMBClientAccessConfig = {
  /**
   * @default false
   */
  enable_secure_mode?: boolean;
  /**
   * @default false
   */
  identity_verification_enabled?: boolean;
  /**
   * @default false
   */
  identity_verification_email_enabled?: boolean;
  /**
   * @default false
   */
  identity_verification_sms_enabled?: boolean;
};
