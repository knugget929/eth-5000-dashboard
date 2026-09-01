# ETH Mission Control — $5K / $10K

A mobile-first personal Ethereum thesis dashboard for two explicit scenarios:

- **$5K ETH** — touches $5,000 by Dec. 31, 2027; current thesis estimate **65%**.
- **$10K ETH** — touches $10,000 by Dec. 31, 2029; current thesis estimate **35%**.

These are subjective analyst estimates, not market-implied probabilities.

## Live dashboard

[Open ETH Mission Control](https://knugget929.github.io/eth-5000-dashboard/)

GitHub Pages publishes the `main` branch. ChatGPT Sites configuration remains in the repository for a possible later move, but it is not the current release surface.

## Data flow

| File | Role | Typical updater |
|---|---|---|
| `data/thesis-policy.json` | Target definitions, catalyst weights, interpretation rules, notification thresholds | Intentional thesis-method change |
| `data/research/latest.json` | Latest sourced observations and market snapshot | Daily research run |
| `data/research/archive/` | Optional dated evidence snapshots | Daily research run |
| `data/evaluation/current.json` | Current catalyst states, scores, probabilities, and decision note | Daily thesis evaluation |
| `data/thesis.json` | Render-ready dashboard payload, history, and change log | Daily thesis evaluation |

The application reads only `data/thesis.json`. The supporting files preserve a lightweight evidence trail without adding a database or backend.

## Personal automation workflow

1. Research current price, ETF flows, staking, regulation, network activity, liquidity, fiscal conditions, and value capture.
2. Save the sourced observations to `data/research/latest.json` and optionally a dated archive file.
3. Compare the evidence with `data/thesis-policy.json`.
4. Update `data/evaluation/current.json` and the render payload in `data/thesis.json` only where the evidence warrants it.
5. Append probability history and a “What changed?” entry when appropriate.
6. Run `npm run check && npm run build`, then commit directly to `main`. GitHub Pages redeploys automatically.
7. Notify only when a catalyst changes color, a probability moves by at least three points, or a thesis-breaking event occurs.

There is no PR or independent-review requirement for this personal dashboard. Git history provides the rollback and audit trail.

## Local commands

```bash
npm run dev
npm run check
npm run build
```

Append `?snapshot=1` to the local or live URL to verify the stored-price fallback.
