export type DashboardDataCollectionChartModel = {
  name: string;
  /**
   * @default "data_collection"
   */
  type?: "data_collection";
  data_collection_id: string;
};
