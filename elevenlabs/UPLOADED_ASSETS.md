# Uploaded assets and production media

POST /v1/assets stores the uploaded file in the canonical asset record and returns its public metadata. Existing list, search, get, and delete operations see the new asset. Deletion removes its stored bytes too. Context.upload(name, file) can be reused by later behavior that actually creates an asset; getUpload returns an independent copy for local context consumers.

POST /v1/productions/orders/{order_id}/media registers a file or a configured URL source on an open order. Exactly one source is required. The declared language must be a supported source language in the current Productions language catalog. Registered media can be read and used in order items through submission and scenario completion. Media belongs to one order. The canonical order media entry owns the copied file; mediaUpload returns an independent copy.

These are local simulator limits, not ElevenLabs service limits:

- Uploads must contain 1–1,048,576 bytes with consistent declared size, a nonblank filename of at most 240 characters, and a MIME type without parameters.
- Asset display names must be nonblank and at most 240 characters. Asset uploads accept any syntactically valid MIME type; Productions accepts audio and video MIME types.
- URL registration requires a filename and MIME type matching the configured source's MIME type. The default configured URL is https://simulator.invalid/production-source.mp3 and contains the previously decoded bounded MPEG silence fixture from the speech scenario. Unknown sources fail explicitly; no network fetch occurs.
- Bytes are copied and stored as supplied. No decoding, media detection, provider processing, signed URL hosting, charging, or actual production work occurs. Returned URLs identify synthetic local content and are not downloadable endpoints.

Scenario startup/reset initializes counters, limits, timestamps, source fixtures, and baseline records. Reset replaces records and removes uploads; emptyAssets and emptyProductionOrders remove their respective records. productionMediaSources restores configured URL fixtures from the current bounded speech bytes. Public JSON metadata never includes the internal upload payload.
