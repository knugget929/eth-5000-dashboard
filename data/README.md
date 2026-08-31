# Thesis data update guide

Routine thesis updates should change `data/thesis.json`, not application code.

1. Set `updatedAt` and refresh the stored market snapshot.
2. Update each target's `probability`, `trend`, and latest `probabilityHistory` entry.
3. Update only catalyst target views whose evidence changed: `status`, `score`, `short`, `evidence`, triggers, weight, or sources.
4. Prepend a concise entry to `changes` for any material thesis movement.
5. Run `npm run check` and `npm run build` before publishing.

The final history probability for each target must match its current probability. Catalyst status must be `green`, `yellow`, or `red`; scores use the 0–1 range.
