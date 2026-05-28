/**
 * Porter Author
 */
export type porter_author = {
  id: number;
  remote_id: string;
  remote_name: string;
  email: string;
  name: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  import_url: string;
};
