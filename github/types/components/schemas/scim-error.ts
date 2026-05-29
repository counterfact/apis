/**
 * Scim Error
 */
export type scim_error = {
  message?: string;
  documentation_url?: string;
  detail?: string;
  status?: number;
  scimType?: string;
  schemas?: Array<string>;
};
