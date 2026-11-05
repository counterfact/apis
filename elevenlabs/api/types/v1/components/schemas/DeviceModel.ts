/**
 * Device information.
 *
 * Spec: https://schema.ocsf.io/1.6.0/objects/device
 */
export type DeviceModel = {
  /**
   * IP address
   */
  ip?: string | null;
  /**
   * Device hostname
   */
  hostname?: string | null;
  /**
   * Device type ID (99 = Unknown)
   * @default 99
   */
  type_id?: number;
};
