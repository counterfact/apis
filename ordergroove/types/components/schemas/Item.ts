export type Item = {
  public_id: string;
  order: string;
  subscription?: string | null;
  product: string;
  offer?: string | null;
  quantity: number;
  price?: string | null;
  total_cost?: string | null;
  extra_cost?: string | null;
  one_time: boolean;
  components?: Array<{ [key: string]: unknown }>;
  [key: string]: unknown;
};
