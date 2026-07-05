# Log Analyzer — Security Log Analysis CLI + Interactive Web Companion

Two parts, one project:

1. **`python/log_analyzer/`** — the core tool: a zero-dependency Python CLI that parses raw server logs (Common/Combined formats), aggregates traffic metrics with stream buffering, and flags security threats — SQL injection patterns, path traversal, and SSH/auth brute-force attempts. Full details in [its README](python/log_analyzer/README.md).
2. **Web companion (this folder)** — a React + TypeScript site that demonstrates the CLI interactively in the browser: simulated terminal runs, a log-analysis and file-finder simulator, and a CS-theory section explaining the underlying concepts (hashing, streaming IO, complexity).

## Run the Python CLI

Requires Python 3.9+ — no packages to install:

```bash
cd python/log_analyzer
python main.py test_server.log
```

The analysis report is written as markdown (see `log_analysis_report.md` for a sample run).

## Run the web companion

Requires Node.js 18+:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. `npm run build` produces a static `dist/` deployable to Netlify, Vercel, or GitHub Pages (no backend or env vars needed).

## Structure

```
python/log_analyzer/   main.py, parser.py, analyzer.py, reporter.py, generator.py
src/                   React app: simulators, terminal previews, CS theory section
```
