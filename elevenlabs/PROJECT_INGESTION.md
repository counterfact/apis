# Local Studio and AudioNative ingestion

`POST /v1/studio/projects` creates a blank project from `name`, or imports one
uploaded document using `from_document`. `from_content_json` accepts bounded
chapter/block/tts-node content using the existing Studio chapter rules. Sources
are mutually exclusive. Default voices and model come from scenario configuration
and are checked against the current voice/model catalogs before any state changes.

`POST /v1/studio/projects/{project_id}/content` uses the same bounded document or
structured-content ingestion and replaces the live chapters while preserving
project metadata and historical snapshots. An absent body or empty multipart body
clears chapters and muted tracks. `auto_convert` validates and queues the complete
replacement atomically; pending conversions prevent replacement. Remote URL
imports are explicitly unsupported.

Studio chapter edits accept an absent body as an unchanged chapter. Both Studio
snapshot stream operations accept an absent body for their default MP3 fixture.
Null and invalid option bodies remain errors.

`POST /v1/audio-native` creates a player-enabled Studio project; `name` alone
creates a blank project. TXT/HTML uploads become a chapter prefixed with the
player title and author. Player settings come from scenarios and request overrides.
`POST /v1/audio-native/{project_id}/content` requires a file and replaces that
project's current chapters. It uses the live Studio title and author. All reads,
conversion, deletion and snapshots use the same canonical Studio state.

Imports accept UTF-8 TXT, Markdown and HTML for Studio, and UTF-8 TXT or HTML for
AudioNative. HTML must be well-formed with no attributes, DTDs, custom entities,
CDATA or processing instructions; supported tags are html, body, div, p, h1–h6,
span, strong, em, b, i and self-closing br. Text and ordinary XML character entities
are extracted. This is a small HTML subset, not a browser HTML parser. Uploaded
files are limited to 16 KiB, filenames/project names to 200 characters, chapter
text (including AudioNative title/author) to 2,000 characters, structured imports
to 100 chapters and HTML nesting to 16 levels. Scenarios own these limits.

PDF, EPUB, office formats, URL fetching, OCR, voice assignment, voice overrides,
callbacks, direct publishing reads and nonstandard audio quality are unsupported.
No inference or real audio rendering runs. Explicit unsupported options fail
before canonical project state or counters change. Standard quality, automatic
text normalization and existing catalog voice/model defaults work normally.

`auto_convert` captures a synthetic conversion job. Blank projects cannot be
converted. Run `completeStudioConversions` to finish conversions. Content updates
may also set `auto_publish: true` together with `auto_convert: true`; run
`completeAudioNative` to complete and select that publication's snapshot. Conversion
alone does not publish, and existing published snapshots remain immutable and
selected until a requested publication completes. Reset scenarios restore the
baseline. The existing bodyless Studio content reset remains available.
