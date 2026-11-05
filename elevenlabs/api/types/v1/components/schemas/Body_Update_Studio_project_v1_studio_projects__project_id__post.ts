export type Body_Update_Studio_project_v1_studio_projects__project_id__post = {
  /**
   * The name of the Studio project, used for identification only.
   */
  name: string;
  /**
   * The voice_id that corresponds to the default voice used for new titles.
   */
  default_title_voice_id: string;
  /**
   * The voice_id that corresponds to the default voice used for new paragraphs.
   */
  default_paragraph_voice_id: string;
  /**
   * An optional name of the author of the Studio project, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  title?: string | null;
  /**
   * An optional name of the author of the Studio project, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  author?: string | null;
  /**
   * An optional ISBN number of the Studio project you want to create, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  isbn_number?: string | null;
  /**
   * When the Studio project is downloaded, should the returned audio have postprocessing in order to make it compliant with audiobook normalized volume requirements
   * @default false
   */
  volume_normalization?: boolean;
};
