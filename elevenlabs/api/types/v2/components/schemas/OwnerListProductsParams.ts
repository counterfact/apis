/**
 * Every owner-editable field, including what callers must not hear.
 */
export type OwnerListProductsParams = {
  list_kwargs?: { [key: string]: unknown };
  /**
   * @default "owner_list_products"
   */
  smb_tool_type?: "owner_list_products";
};
