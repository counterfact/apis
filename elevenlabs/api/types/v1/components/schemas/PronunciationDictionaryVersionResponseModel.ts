export type PronunciationDictionaryVersionResponseModel = {
  version_id: string;
  version_rules_num: number;
  pronunciation_dictionary_id: string;
  dictionary_name: string;
  version_name: string;
  permission_on_resource: ("admin" | "editor" | "commenter" | "viewer") | null;
  created_by: string;
  creation_time_unix: number;
  archived_time_unix?: number | null;
};
