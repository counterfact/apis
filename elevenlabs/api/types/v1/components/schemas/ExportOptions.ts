import type { SegmentedJsonExportOptions } from "./SegmentedJsonExportOptions.js";
import type { DocxExportOptions } from "./DocxExportOptions.js";
import type { PdfExportOptions } from "./PdfExportOptions.js";
import type { TxtExportOptions } from "./TxtExportOptions.js";
import type { HtmlExportOptions } from "./HtmlExportOptions.js";
import type { SrtExportOptions } from "./SrtExportOptions.js";
export type ExportOptions =
  | (SegmentedJsonExportOptions & { format: "segmented_json" })
  | (DocxExportOptions & { format: "docx" })
  | (PdfExportOptions & { format: "pdf" })
  | (TxtExportOptions & { format: "txt" })
  | (HtmlExportOptions & { format: "html" })
  | (SrtExportOptions & { format: "srt" });
