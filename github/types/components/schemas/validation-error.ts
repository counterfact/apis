/**
 * Validation Error
 */
export type validation_error = {
  message: string;
  documentation_url: string;
  errors?: Array<{
    resource?: string;
    field?: string;
    message?: string;
    code: string;
    index?: number;
    value?: string | number | Array<string>;
  }>;
};
