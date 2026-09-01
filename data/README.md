# Thesis data update guide

The data directory separates evidence, judgment, and presentation while keeping the static dashboard simple.

1. `thesis-policy.json` contains the relatively stable target logic, weights, and notification thresholds.
2. `research/latest.json` contains sourced observations. A daily run may also add `research/archive/YYYY-MM-DD.json`.
3. `evaluation/current.json` records the current scores, states, probabilities, and decision note.
4. `thesis.json` is the render payload loaded by the browser.

For a routine update:

1. Refresh the market snapshot and sourced observations.
2. Re-evaluate only the catalyst views affected by new evidence.
3. Keep policy weights, evaluation values, and render values aligned.
4. Set `updatedAt`; add a current history point for each target.
5. Prepend a sourced “What changed?” entry when the thesis changes.
6. Run `npm run check && npm run build`, then commit to `main`.

Catalyst status must be `green`, `yellow`, or `red`; scores use the 0–1 range. Each target's weights total 100. The final history date and probability must match the current render state.
