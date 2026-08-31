# ETH Mission Control — $5K / $10K

A visual, mobile-first Ethereum thesis dashboard for two explicit scenarios:

- **$5K ETH** — touches $5,000 by Dec. 31, 2027; current thesis estimate **65%**.
- **$10K ETH** — touches $10,000 by Dec. 31, 2029; current thesis estimate **35%**.

These are subjective thesis estimates, not market-implied probabilities and not financial advice.

## Architecture

- `index.html` — one-page mission-control shell
- `styles.css` — responsive visual system
- `app.js` — rendering, target switching, live-price refresh, fallback behavior, dialogs, history, and change log
- `data/thesis.json` — source of truth for probabilities, catalysts, target paths, evidence, history, and sources
- `scripts/build-static.mjs` — produces the static Sites artifact
- `.openai/hosting.json` — ChatGPT Sites configuration

## Routine thesis updates

Most updates should change only `data/thesis.json`. See `data/README.md` for the field-level checklist. The latest probability-history entry must match the current target probability.

Run:

```bash
npm run check
npm run build
```

Append `?snapshot=1` during local review to verify the stored-price fallback without relying on an external market API.

## Publishing

GitHub is the source repository. ChatGPT Sites is the production publishing surface. GitHub Pages is intentionally not configured.
