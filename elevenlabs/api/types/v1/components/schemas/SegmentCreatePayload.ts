export type SegmentCreatePayload = {
  start_time: number;
  end_time: number;
  text?: string | null;
  translations?: { [key: string]: string } | null;
};
