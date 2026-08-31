# ETH Thesis — $5K / $10K

A visual, mobile-first Ethereum thesis dashboard tracking two explicit price targets:

- **$5K ETH** — current thesis horizon: Dec. 31, 2027
- **$10K ETH** — current thesis horizon: Dec. 31, 2029

The dashboard is intentionally compact: live ETH price, target probabilities, green/yellow/red catalyst states, and tap-to-open details.

## Architecture

- `index.html` — UI shell
- `styles.css` — responsive visual system
- `app.js` — rendering, target switching, live CoinGecko price refresh
- `data/thesis.json` — all thesis state, probabilities, catalyst scoring, target paths, and source links

## Updating the thesis

Most updates should only require changing `data/thesis.json`.

Each catalyst has separate `$5K` and `$10K` views because the same development can be sufficient for the nearer target but still inadequate for the stretch case.

Example: sustained ETF inflows may be green for $5K, while only yellow for $10K until multi-year institutional allocation is established.

## Forecast interpretation

Probabilities are subjective thesis estimates, not market-implied probabilities and not financial advice.

The $10K thesis deliberately requires stronger evidence of **ETH value capture**, not merely Ethereum ecosystem adoption.
