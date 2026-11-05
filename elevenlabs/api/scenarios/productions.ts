import type { Scenario } from "../types/index.js";
export const emptyProductionOrders: Scenario = ($) => {
  const c = $.loadContext("/productions/orders");
  c.orders = new Map();
  c.nextOrderId = 1;
  c.nextItemId = 1;
  c.timestamp = "2025-01-01T00:00:00Z";
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
  ];
  c.languages = new Map([
    ["transcription", { kind: "single", languages }],
    [
      "dub",
      {
        kind: "pair",
        language_pairs: [
          {
            source_language: languages[0],
            destination_languages: [languages[1]],
          },
        ],
      },
    ],
    [
      "subtitles",
      {
        kind: "pair",
        language_pairs: [
          {
            source_language: languages[0],
            destination_languages: [languages[1]],
          },
        ],
      },
    ],
  ]);
};
export const resetProductionOrders: Scenario = ($) => {
  emptyProductionOrders($);
  const c = $.loadContext("/productions/orders"),
    id = "prodorder_00000000000000000000000000",
    media = "prodmedia_00000000000000000000000000";
  c.orders.set(id, {
    metadata: {
      order_id: id,
      name: "Local production",
      state: "open",
      sandbox: false,
      items: [],
      created_at: c.timestamp,
      total_amount_usd: null,
    },
    media: new Map([
      [
        media,
        {
          media_id: media,
          name: "local-source.mp4",
          content_type: "video/mp4",
          language: "en",
          signed_url: "https://simulator.invalid/production-source.mp4",
        },
      ],
    ]),
    deliverables: [],
  });
};
export const completeProductionOrders: Scenario = ($) => {
  const c = $.loadContext("/productions/orders");
  for (const o of c.orders.values()) {
    if (o.metadata.state !== "submitted") continue;
    o.metadata.state = "done";
    o.metadata.completed_at = c.timestamp;
    o.deliverables = [
      {
        name: "local-transcript.txt",
        content_type: "text/plain",
        signed_url: "https://simulator.invalid/production-deliverable.txt",
        version: 1,
      },
    ];
  }
};
