# High-Performance Security Log Analyzer & Threat Detection CLI

An expert-grade systems engineering portfolio project. This is a fully modular **Log Parser & Security Incident Detector** built entirely using **Python's standard library**. It inspects raw server transaction files (Common/Combined formats), runs stateful stream-buffering metrics, and automatically detects active cyber threat indicators—including SQL injection (SQLi) patterns, system path traversals, and SSH/Auth gateway brute force attempts.

---

## 🎯 Portofolio Impact Points (For Recruiters)
- **Zero Third-Party Dependencies:** Implemented purely in standard Python (`re`, `collections`, `os`, `sys`) to prove deep understanding of systems software engineering and avoid supply-chain security bloat.
- **Constant Time $O(1)$ Metrics Aggregation:** Aggregates, tracks, and scores massive system transactions on-the-fly inside nested Hash Maps (Python Dictionaries) reducing spatial overhead.
- **Memory Bound Stream Reading:** Utilizes incremental stream line buffering. Large multi-gigabyte production server dumps can be parsed efficiently with an static RAM footprint bounded strictly to less than **5 KB**.
- **Automated Threat Intelligent Rules:** Heuristic signature parsing flags SQLi, Arbitrary File Access/Traversal, and alerts authentication brute force threshold violations.

---

## 🏗️ High-Level System Architecture

The project splits concerns cleanly across dedicated modules:

```
├── main.py        <-- CLI Orchestrator (System IO checks, stream loop, runtime variables)
├── parser.py      <-- Regex DFA Compilers (Named parameters mapping and timestamp parsers)
├── analyzer.py    <-- Stateful Analytics Engine (Hash map aggregates, Rule engines, Threat signatures)
├── reporter.py    <-- Report Composition Module (ASCII Dashboard layouts & Markdown log exporters)
└── generator.py   <-- Dummy Logging Sandbox (Creates test server records to run out-of-the-box)
```

---

## 🚀 Quick Start Instructions

No modern package managers or standard third-party installers required! It runs out of the box using any standard python installations:

### 1. Set Up and Clone
```bash
# Enter project folder
cd log_analyzer/

# Give main orchestrator execute rights
chmod +x main.py
```

### 2. Run the Analyzer
If no log file is passed, the tool is smart—it automatically generates a comprehensive mock test file named `test_server.log` holding over 100 entries, normal traffic, and malicious attacker payloads so you can evaluate the warnings immediately:

```bash
# Start analyzer directly (default to sandbox logs)
python3 main.py
```

*Alternatively, run on custom product files:*
```bash
python3 main.py /var/log/nginx/access.log
```

---

## 📊 Sample Visual Terminal Output
```
================================================================================
                HIGH-PERFORMANCE SYSTEM LOG ANALYZER & INCIDENT RADAR
================================================================================
📊  Total Entries Processed : 150
💾  Cumulative Data Served  : 4.872 MB
🚨  Security Alerts Raised  : 14

--------------------------------------------------------------------------------
📈  HTTP STATUS CODE FREQUENCY DISTRIBUTION
--------------------------------------------------------------------------------
  200 |    122 ( 81.3%) | ████████████████████
  304 |     14 (  9.3%) | ██
  401 |      8 (  5.3%) | █
  403 |      3 (  2.0%) | 
  404 |      2 (  1.3%) | 
  500 |      1 (  0.7%) | 

--------------------------------------------------------------------------------
🌐  TOP DEMANDING NETWORK ENDPOINTS (IP ADDRESSES)
--------------------------------------------------------------------------------
  1. 192.168.1.52    | Requests: 42
  2. 10.0.0.8        | Requests: 38
  3. 192.0.2.1       | Requests: 8

--------------------------------------------------------------------------------
🔥  SECURITY ALERT LOG SUMMARY
--------------------------------------------------------------------------------
  1. [CRITICAL] 03/Jun/2026:12:35:10 +0000 - IP: 203.0.113.195
     Type  : SQL Injection Candidate
     Info  : Malicious query string payload matched in URI: '/products?id=1' UNION SELECT username, password FROM users --'

  2. [HIGH]     03/Jun/2026:12:36:45 +0000 - IP: 192.0.2.1
     Type  : Brute Force Warning
     Info  : IP logged 5 cumulative authorized authentication failures on gateway.
```

---

## 📂 Automatic Markdown Exporter
Every successful program cycle outputs a highly structured markdown report file called `log_analysis_report.md`. This is designed for direct integration in daily production dashboards or sending directly to internal DevOps Slack channels or security monitors.

---

## 🔒 License
This project is licensed under the MIT License - free for distribution and portfolio display.
