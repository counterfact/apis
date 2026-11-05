# Document file ingestion

Four local, validated v1 operations now use canonical simulator state:

- POST `/v1/pronunciation-dictionaries/add-from-file`
- POST `/v1/convai/knowledge-base`
- POST `/v1/convai/knowledge-base/file`
- PATCH `/v1/convai/knowledge-base/{documentation_id}/update-file`

Dictionary uploads accept UTF-8 `.pls`/`.xml` files with PLS/XML or binary media
labels. A namespace-aware saxes parser accepts PLS 1.0 lexicons containing one
grapheme and one alias or phoneme per lexeme. Standard and numeric XML references
are decoded, including escaped whitespace, and exported canonical versions can
be imported again. Empty lexicons work. DTDs, custom entities, processing
instructions, unknown attributes/elements, nested pronunciations, and complex
lexemes are rejected before mutation. The scenario sets 1 MiB, 255-character
filename/name, and 10,000-rule limits.

Knowledge-base uploads accept nonblank UTF-8 `.txt`, `.md`, and `.markdown`
files with text/plain, text/markdown, or application/octet-stream media labels,
up to the scenario's 1 MiB / 255-character filename limits. PDF, office document
extraction, OCR, invalid UTF-8, binary controls, and empty files are unsupported.
Markdown is preserved as escaped source text in the existing HTML content model;
no Markdown or HTML is executed or converted.

File replacement retains the document ID, creation time, folder membership,
access, and live dependent-agent relationships. It replaces name/filename,
content and size, advances modification time, invalidates the canonical RAG
indexes, and replaces the canonical source-file URL with a revision-specific
synthetic URL. These URLs are opaque local fixtures; no HTTP file server or
external signed-URL service is promised. Reset and deletion use existing cleanup.

The deprecated shared ingestion route requires exactly one file or configured
URL source. Omitted agent_id works normally. Explicit agent_id is rejected as
unsupported instead of inventing undocumented agent-association semantics.
Unknown URLs fail without network requests. Failed validation preserves state,
IDs, mutation counters, indexes, and source URLs.
