# ADR 0005: Recurrence and date semantics

Status: accepted — 2026-08-02

Ordergroove's data-model guide maps `every_period` 1–4 to days, weeks, months, and years and says an order's next place date is the previous date plus subscription frequency. The simulator performs UTC calendar arithmetic and clamps invalid month/year days to month end. This overflow rule and the fixed clock are simulator-only conventions because the public docs do not define them.
