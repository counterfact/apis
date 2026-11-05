import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Update_audio_native_Project_content_v1_audio_native__project_id__content_post =
  {
    /**
     * Either txt or HTML input file containing the article content. HTML should be formatted as follows '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;Your content&lt;/p&gt;&lt;h5&gt;More of your content&lt;/h5&gt;&lt;p&gt;Some more of your content&lt;/p&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;'
     * @format binary
     */
    file?: MultipartFile;
    /**
     * Whether to auto convert the project to audio or not.
     * @default false
     */
    auto_convert?: boolean;
    /**
     * Whether to auto publish the new project snapshot after it's converted.
     * @default false
     */
    auto_publish?: boolean;
  };
