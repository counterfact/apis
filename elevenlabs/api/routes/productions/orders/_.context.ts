import type { MultipartFile } from "../../../counterfact-types/index.js";
import { copyUpload } from "../../assets/_.context.js";
import type { OrderResponse } from "../../../types/v1/components/schemas/OrderResponse.js";
import type { OrderMediaResponse } from "../../../types/v1/components/schemas/OrderMediaResponse.js";
import type { DeliverableInfo } from "../../../types/v1/components/schemas/DeliverableInfo.js";
import type { LanguagesResponse } from "../../../types/v1/components/schemas/LanguagesResponse.js";
import type { UpsertOrderItemRequest } from "../../../types/v1/components/schemas/UpsertOrderItemRequest.js";
export type StoredOrder = {
  metadata: OrderResponse;
  media: Map<string, OrderMediaResponse & { upload?: MultipartFile }>;
  deliverables: DeliverableInfo[];
};
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
export class ProductionError extends Error {
  override name = "ProductionError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const fail = (status: number, code: string, message: string): never => {
  throw new ProductionError(status, code, message);
};
const invalid = (): never =>
  fail(400, "invalid_production_request", "Invalid local Productions request");
const states = [
  "open",
  "submitted",
  "paid",
  "accepted",
  "rejected",
  "done",
  "cancelling",
  "cancelled",
  "expired",
  "merged",
];
export class Context {
  orders = new Map<string, StoredOrder>();
  languages = new Map<string, LanguagesResponse>();
  nextMediaId = 0;
  uploadDefaults: { maxBytes: number; maxName: number } | undefined;
  mediaSources = new Map<string, MultipartFile>();
  nextOrderId = 1;
  nextItemId = 1;
  timestamp = "";
  private stored(id: string) {
    return (
      this.orders.get(id) ??
      fail(404, "production_order_not_found", "Order not found")
    );
  }
  private open(id: string) {
    const o = this.stored(id);
    if (o.metadata.state !== "open")
      fail(409, "production_order_not_open", "Only open orders can be changed");
    return o;
  }
  create(v: unknown) {
    if (v == null) v = {};
    if (
      !object(v) ||
      Object.keys(v).some((k) => k !== "sandbox") ||
      (v.sandbox != null && typeof v.sandbox !== "boolean")
    )
      return invalid();
    const id = `prodorder_${String(this.nextOrderId++).padStart(26, "0")}`;
    const sandbox = v.sandbox === true;
    this.orders.set(id, {
      metadata: {
        order_id: id,
        name: "Untitled order",
        state: "open",
        sandbox,
        items: [],
        created_at: this.timestamp,
        total_amount_usd: null,
      },
      media: new Map(),
      deliverables: [],
    });
    return { order_id: id, sandbox };
  }
  get(id: string) {
    return structuredClone(this.stored(id).metadata);
  }
  list(q: Obj) {
    const size = q.page_size ?? 20,
      offset = q.offset ?? 0;
    if (
      !Number.isInteger(size) ||
      Number(size) < 1 ||
      Number(size) > 100 ||
      !Number.isInteger(offset) ||
      Number(offset) < 0
    )
      return invalid();
    const status =
      q.status == null
        ? null
        : typeof q.status === "string"
          ? [q.status]
          : q.status;
    if (
      status !== null &&
      (!Array.isArray(status) || status.some((s) => !states.includes(s)))
    )
      return invalid();
    const date = (v: unknown) =>
      v == null
        ? null
        : typeof v === "string" && Number.isFinite(Date.parse(v))
          ? Date.parse(v)
          : invalid();
    const start = date(q.start_date),
      end = date(q.end_date);
    if (start !== null && end !== null && start > end) return invalid();
    const all = [...this.orders.values()]
      .map((o) => o.metadata)
      .filter(
        (o) =>
          (status === null || status.includes(o.state)) &&
          (start === null || Date.parse(o.created_at) >= start) &&
          (end === null || Date.parse(o.created_at) <= end),
      )
      .sort(
        (a, b) =>
          b.created_at.localeCompare(a.created_at) ||
          a.order_id.localeCompare(b.order_id),
      );
    return {
      orders: all
        .slice(Number(offset), Number(offset) + Number(size))
        .map((o) => {
          const {
            items,
            created_at,
            paid_at,
            accepted_at,
            completed_at,
            ...summary
          } = o;
          return structuredClone(summary);
        }),
    };
  }
  update(id: string, v: unknown) {
    const o = this.open(id);
    if (
      !object(v) ||
      !object(v.request) ||
      Object.keys(v).some((k) => k !== "request") ||
      Object.keys(v.request).some((k) => k !== "name") ||
      typeof v.request.name !== "string" ||
      !v.request.name.trim() ||
      v.request.name.length > 120
    )
      return invalid();
    o.metadata.name = v.request.name;
    return { name: o.metadata.name };
  }
  media(id: string, media: string) {
    const record =
      this.stored(id).media.get(media) ??
      fail(404, "production_media_not_found", "Media not found on order");
    const { upload, ...metadata } = record;
    return structuredClone(metadata);
  }
  mediaUpload(id: string, media: string) {
    this.media(id, media);
    const upload = this.stored(id).media.get(media)!.upload;
    return upload ? structuredClone(upload) : undefined;
  }
  registerMedia(id: string, value: unknown) {
    const order = this.open(id),
      config = this.uploadDefaults;
    if (
      !config ||
      !object(value) ||
      typeof value.declared_language !== "string" ||
      Object.keys(value).some(
        (key) =>
          ![
            "declared_language",
            "media",
            "media_url",
            "media_url_filename",
            "media_url_content_type",
          ].includes(key),
      )
    )
      return invalid();
    const language = value.declared_language;
    const supported = [...this.languages.values()].some((entry) =>
      entry.kind === "single"
        ? entry.languages.some((l) => l.code === language)
        : entry.language_pairs.some(
            (pair) => pair.source_language.code === language,
          ),
    );
    if (!supported || (value.media != null) === (value.media_url != null))
      return invalid();
    let source: unknown = value.media;
    if (value.media_url != null) {
      if (
        typeof value.media_url !== "string" ||
        typeof value.media_url_filename !== "string" ||
        typeof value.media_url_content_type !== "string"
      )
        return invalid();
      const fixture =
        this.mediaSources.get(value.media_url) ??
        fail(
          400,
          "unsupported_production_media_source",
          "Only configured local URL sources are supported",
        );
      if (value.media_url_content_type !== fixture.contentType)
        return invalid();
      source = { ...fixture, filename: value.media_url_filename };
    } else if (
      value.media_url_filename != null ||
      value.media_url_content_type != null
    )
      return invalid();
    let upload: MultipartFile;
    try {
      upload = copyUpload(source, config.maxBytes, config.maxName);
    } catch {
      return invalid();
    }
    if (!/^(audio|video)\//.test(upload.contentType)) return invalid();
    let next = this.nextMediaId;
    const exists = (key: string) =>
      [...this.orders.values()].some((o) => o.media.has(key));
    while (exists(`prodmedia_${String(next).padStart(26, "0")}`)) next++;
    const media_id = `prodmedia_${String(next).padStart(26, "0")}`;
    order.media.set(media_id, {
      media_id,
      name: upload.filename,
      content_type: upload.contentType,
      language,
      signed_url: `https://simulator.invalid/productions/${id}/${media_id}`,
      upload,
    });
    this.nextMediaId = next + 1;
    return { media_id };
  }
  upsert(id: string, v: unknown) {
    const o = this.open(id);
    if (
      !object(v) ||
      !object(v.request) ||
      Object.keys(v).some((k) => k !== "request")
    )
      return invalid();
    const req = v.request;
    if (
      Object.keys(req).some((k) => !["item", "item_id"].includes(k)) ||
      !object(req.item)
    )
      return invalid();
    const item = req.item;
    if (
      !["dub", "subtitles", "transcription"].includes(String(item.kind)) ||
      typeof item.source_language !== "string" ||
      !item.source_language.trim()
    )
      return invalid();
    const ids = item.kind === "dub" ? [item.media_id] : item.media_ids;
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((m) => typeof m !== "string")
    )
      return invalid();
    for (const m of ids)
      if (!o.media.has(m))
        fail(404, "production_media_not_found", "Media not found on order");
    if (
      item.kind !== "transcription" &&
      (!Array.isArray(item.destination_languages) ||
        !item.destination_languages.length ||
        item.destination_languages.some(
          (l) => typeof l !== "string" || !l.trim(),
        ))
    )
      return invalid();
    let itemId = req.item_id;
    let index = -1;
    if (itemId != null) {
      if (typeof itemId !== "string") return invalid();
      index = o.metadata.items.findIndex((i) => i.item_id === itemId);
      if (index < 0)
        fail(404, "production_item_not_found", "Order item not found");
    } else itemId = `proditem_${String(this.nextItemId++).padStart(26, "0")}`;
    const stored = {
      item_id: itemId as string,
      item: structuredClone(item) as UpsertOrderItemRequest["item"],
      quote: null,
    };
    if (index < 0) o.metadata.items.push(stored);
    else o.metadata.items[index] = stored;
    return { item_id: stored.item_id, quote: null };
  }
  remove(id: string, item: string) {
    const o = this.open(id),
      index = o.metadata.items.findIndex((i) => i.item_id === item);
    if (index < 0)
      fail(404, "production_item_not_found", "Order item not found");
    o.metadata.items.splice(index, 1);
    return { success: true };
  }
  submit(id: string) {
    const o = this.open(id);
    if (!o.metadata.items.length)
      fail(400, "production_order_empty", "Order must have at least one item");
    o.metadata.state = "submitted";
    o.metadata.submitted_at = this.timestamp;
    return {
      order_id: id,
      state: o.metadata.state,
      submitted_at: this.timestamp,
    };
  }
  deliverables(id: string) {
    const o = this.stored(id);
    return {
      deliverables: structuredClone(
        o.metadata.state === "done" ? o.deliverables : [],
      ),
    };
  }
  availableLanguages(kind: string) {
    return structuredClone(
      this.languages.get(kind) ??
        fail(400, "invalid_order_item_kind", "Unsupported order item kind"),
    );
  }
}
