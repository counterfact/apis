import type { ProjectResponseModel } from "./ProjectResponseModel.js";
/**
 * @example {"projects":[{"access_level":"viewer","author":"John Doe","can_be_downloaded":true,"content_type":"Novel","cover_image_url":"https://example.com/cover.jpg","create_date_unix":1714204800,"created_by_user_id":"Vbtgl3bRdj6lk79rYAgx","creation_meta":{"creation_progress":0.5,"status":"pending","type":"blank"},"default_model_id":"eleven_multilingual_v2","default_paragraph_voice_id":"JBFqnCBsd6RMkjVDRZzb","default_paragraph_voice_ref_id":"JBFqnCBsd6RMkjVDRZzb","default_title_voice_id":"JBFqnCBsd6RMkjVDRZzb","default_title_voice_ref_id":"JBFqnCBsd6RMkjVDRZzb","description":"This is a description of my project.","fiction":"fiction","genres":["Novel","Short Story"],"isbn_number":"978-90-274-3964-2","language":"en","last_conversion_date_unix":1714204800,"mature_content":false,"name":"My Project","original_publication_date":"2025-01-01","project_id":"aw1NgEzBg83R7vgmiJt6","public_share_id":"abc123def456789","quality_check_on":false,"quality_check_on_when_bulk_convert":false,"state":"default","target_audience":"young adult","title":"My Project","volume_normalization":true}]}
 */
export type GetProjectsResponseModel = {
  /**
   * A list of projects with their metadata.
   */
  projects: Array<ProjectResponseModel>;
};
