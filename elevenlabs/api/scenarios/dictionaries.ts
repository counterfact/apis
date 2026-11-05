import type { Scenario } from "../types/index.js";
import type { DictionaryRecord, DictionaryRule } from "../routes/pronunciation-dictionaries/_.context.js";

/** Synthetic pronunciation metadata and version snapshots for client testing. */
export const resetDictionaries: Scenario = ($) => {
  const records: [string, DictionaryRecord][] = ["sim-dictionary", "sim-dictionary-archived"].map((id, index) => {
    const rules: DictionaryRule[] = [
      { type: "alias", string_to_replace: "API", alias: "A P I" },
      { type: "phoneme", string_to_replace: "Counterfact", phoneme: "ˈkaʊntərfækt", alphabet: "ipa" },
    ];
    return [id, {
      metadata: {
        id,
        name: index === 0 ? "Simulator Terms" : "Archived Terms",
        description: "Local pronunciation fixture; no speech is generated.",
        created_by: "sim-user",
        creation_time_unix: 1_735_689_600 + index,
        latest_version_id: `${id}-v1`,
        latest_version_rules_num: rules.length,
        permission_on_resource: "admin",
        archived_time_unix: index === 0 ? null : 1_735_689_700,
      },
      versions: new Map([[`${id}-v1`, rules]]),
    }];
  });
  $.loadContext("/pronunciation-dictionaries").dictionaries = new Map(records);
};

export const emptyDictionaries: Scenario = ($) => {
  $.loadContext("/pronunciation-dictionaries").dictionaries = new Map();
};
