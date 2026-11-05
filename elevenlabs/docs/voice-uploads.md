# Voice uploads

POST `/v1/voices/add` creates an owned cloned voice in the canonical collection.
POST `/v1/voices/{voice_id}/edit` atomically edits metadata and appends samples;
professional voices use their separate PVC workflow. Uploaded MPEG bytes are
copied into canonical sample storage and work with existing read/delete routes.
Requests support at most 20 nonempty declared MPEG files totaling 10 MiB.
No acoustic cloning, noise removal or metadata moderation is performed.

POST `/v1/similar-voices` requires an audio file and returns deterministic,
scenario-owned synthetic distance rankings against current library records.
It supports threshold and top_k filtering, with defaults 2 and 10. It performs
no acoustic inference. Reset restores counters, fixture distances and samples.
