export type Body_Download_history_items_v1_history_download_post = {
  /**
   * A list of history items to download, you can get IDs of history items and other metadata using the GET https://api.elevenlabs.io/v1/history endpoint.
   */
  history_item_ids: Array<string>;
  /**
   * Output format to transcode the audio file, can be wav or default.
   */
  output_format?: string | null;
};
