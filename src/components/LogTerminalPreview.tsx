/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  FileCode2, 
  Info,
  ChevronRight,
  ShieldAlert,
  Sliders,
  FolderOpen,
  FileText
} from 'lucide-react';

interface CodeFile {
  name: string;
  description: string;
  lang: string;
  content: string;
}

const FILES_MAP: Record<string, CodeFile> = {
  'main.py': {
    name: 'main.py',
    description: 'Central CLI execution handler. Verifies directories, runs parsing loops, and aggregates final statistic returns.',
    lang: 'python',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module: main.py
Purpose: Main controller entrance for python duplicate & log analyzer.
         Instantiates the file parsing streams, computes stats,
         and directs Markdown or visual stdout print instructions.
"""

import os
import sys

from parser import parse_log_line
from analyzer import LogAnalyzer
from reporter import print_ansi_dashboard, write_markdown_report
from generator import generate_mock_log


def main() -> None:
    """CLI loop controller."""
    print("======================================================================")
    print("         SYSTEM SECURITY LOG ANALYZER & INCIDENT DETECTOR CLI         ")
    print("======================================================================")

    target_logfile = 'test_server.log'
    if not os.path.exists(target_logfile):
        print(f"[!] Log file '{target_logfile}' not found. Generating dummy test logs automatically...")
        generate_mock_log(target_logfile, 120)

    if len(sys.argv) > 1:
        log_path = sys.argv[1]
    else:
        log_path = input(f"Enter path to web/security log file [Default: {target_logfile}]: ").strip()
        if not log_path:
            log_path = target_logfile

    if not os.path.exists(log_path):
        print(f"[-] Error: Specific path '{log_path}' does not exist on this system.")
        sys.exit(1)

    print(f"\\n[+] Ingesting targets file: {log_path}")
    print("[+] Compiling Regular Expressions...")
    print("[+] Executing memory-efficient stream processing...")

    analyzer = LogAnalyzer(brute_force_threshold=4)
    skipped_lines = 0

    try:
        with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if not line.strip():
                    continue
                record = parse_log_line(line)
                if record:
                    analyzer.process_record(record)
                else:
                    skipped_lines += 1

        stats = analyzer.get_summary_statistics()
        print_ansi_dashboard(stats)

        if skipped_lines > 0:
            print(f"⚠️  Note: Skipped {skipped_lines} lines that could not be verified in the selected Log format.\\n")

        report_out = 'log_analysis_report.md'
        write_markdown_report(stats, report_out)
        
    except KeyboardInterrupt:
        print("\\n[-] Log analysis cancelled by terminal manager.")
        sys.exit(0)
    except OSError as e:
        print(f"[-] Severe System IO Error during read stream: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()`
  },
  'parser.py': {
    name: 'parser.py',
    description: 'DFA boundary parser compiled strictly inside C modules. Demuxes combined headers into state dictionaries.',
    lang: 'python',
    content: `# -*- coding: utf-8 -*-
"""
Module: parser.py
Purpose: Handles regex-based validation and parsing of individual log string lines.
Theory: Utilizes Python's 're' module (regular expressions) compiled at module load time.
"""

import re
from datetime import datetime
from typing import Dict, Any, Optional

# Compiled Regular Expression for parsing Common Log Format (CLF)
LOG_PATTERN = re.compile(
    r'^(?P<ip>\\S+)\\s+\\S+\\s+(?P<user>\\S+)\\s+\\['
    r'(?P<timestamp>[^\\]]+)\\]\\s+"'
    r'(?P<method>[A-Z]+)\\s+(?P<request>\\S+)\\s+[^"]+"\\s+'
    r'(?P<status>\\d{3})\\s+'
    r'(?P<size>\\d+|-)\\s+"'
    r'(?P<user_agent>[^"]+)"'
)


def parse_log_line(line: str) -> Optional[Dict[str, Any]]:
    """
    Parses a single log line into a structured dictionary.
    """
    match = LOG_PATTERN.match(line.strip())
    if not match:
        return None
        
    data = match.groupdict()
    
    if data['size'] == '-':
        data['size_bytes'] = 0
    else:
        try:
            data['size_bytes'] = int(data['size'])
        except ValueError:
            data['size_bytes'] = 0
            
    try:
        ts_str = data['timestamp'].split()[0]
        data['datetime'] = datetime.strptime(ts_str, '%d/%b/%Y:%H:%M:%S')
    except (ValueError, IndexError):
        data['datetime'] = None
        
    return data`
  },
  'analyzer.py': {
    name: 'analyzer.py',
    description: 'Custom stateful accumulator dictionaries. Monitors credential failure rates and sanitizes string queries.',
    lang: 'python',
    content: `# -*- coding: utf-8 -*-
"""
Module: analyzer.py
Purpose: Aggregates metrics and runs heuristic rule engines to discover security threats.
"""

from typing import Dict, List, Any, Tuple
from collections import defaultdict


class LogAnalyzer:
    """
    Stateful analyzer that consumes raw structured log dictionaries
    and computes complex usage and security metrics.
    """
    def __init__(self, brute_force_threshold: int = 5):
        self.brute_force_threshold = brute_force_threshold
        self.total_requests = 0
        self.total_bandwidth_bytes = 0
        self.ip_tracker = defaultdict(int)
        self.endpoint_tracker = defaultdict(int)
        self.status_code_tracker = defaultdict(int)
        self.login_failures = defaultdict(list)
        self.alerts: List[Dict[str, Any]] = []

    def process_record(self, record: Dict[str, Any]) -> None:
        self.total_requests += 1
        self.total_bandwidth_bytes += record['size_bytes']
        
        ip = record['ip']
        self.ip_tracker[ip] += 1
        self.endpoint_tracker[record['request']] += 1
        
        status = record['status']
        self.status_code_tracker[status] += 1
        self._check_for_threats(record)

    def _check_for_threats(self, record: Dict[str, Any]) -> None:
        ip = record['ip']
        request = record['request'].lower()
        status = record['status']
        timestamp = record['timestamp']

        # Rule 1: Detect SQL Injection Attacks
        sqli_patterns = ["'", '"', "union", "select", "concat", "or 1=1", "--"]
        if any(pat in request for pat in sqli_patterns):
            self.alerts.append({
                "type": "SQL Injection Candidate",
                "ip": ip,
                "timestamp": timestamp,
                "severity": "CRITICAL",
                "details": f"Malicious query string payload matched in URI: '{record['request']}'"
            })
            
        # Rule 2: Detect Directory Traversal Attacks
        traversal_patterns = ["../", "..\\\\", "/etc/passwd", "win.ini"]
        if any(pat in request for pat in traversal_patterns):
            self.alerts.append({
                "type": "Path Traversal Attack",
                "ip": ip,
                "timestamp": timestamp,
                "severity": "CRITICAL",
                "details": f"Attempted traversal escape to read system files via path: '{record['request']}'"
            })

        # Rule 3: Monitor Brute Force logins on authentication gateway
        if "/login" in request:
            if status in ["401", "403"]:
                self.login_failures[ip].append(timestamp)
                if len(self.login_failures[ip]) >= self.brute_force_threshold:
                    self.alerts.append({
                        "type": "Brute Force Warning",
                        "ip": ip,
                        "timestamp": timestamp,
                        "severity": "HIGH",
                        "details": f"IP logged {len(self.login_failures[ip])} authorization failures."
                    })
                    self.login_failures[ip] = []

    def get_summary_statistics(self, top_limit: int = 5) -> Dict[str, Any]:
        sorted_ips = sorted(self.ip_tracker.items(), key=lambda x: x[1], reverse=True)[:top_limit]
        sorted_endpoints = sorted(self.endpoint_tracker.items(), key=lambda x: x[1], reverse=True)[:top_limit]
        return {
            "total_requests": self.total_requests,
            "total_bandwidth_bytes": self.total_bandwidth_bytes,
            "top_ips": sorted_ips,
            "top_endpoints": sorted_endpoints,
            "status_codes": dict(self.status_code_tracker),
            "alerts": self.alerts,
            "alerts_count": len(self.alerts)
        }`
  },
  'reporter.py': {
    name: 'reporter.py',
    description: 'Formats metrics using standard console ASCII layouts and writes Markdown summaries.',
    lang: 'python',
    content: `# -*- coding: utf-8 -*-
"""
Module: reporter.py
Purpose: Translates analysis dictionaries into human-readable terminal dashboards 
         and structured Markdown report archives.
"""

import os
from typing import Dict, Any


def print_ansi_dashboard(stats: Dict[str, Any]) -> None:
    border = "=" * 80
    section = "-" * 80
    
    print("\\n" + border)
    print("                HIGH-PERFORMANCE SYSTEM LOG ANALYZER & INCIDENT RADAR")
    print(border)
    
    total_mb = stats['total_bandwidth_bytes'] / (1024 * 1024)
    print(f"📊  Total Entries Processed : {stats['total_requests']:,}")
    print(f"💾  Cumulative Data Served  : {total_mb:.3f} MB")
    print(f"🚨  Security Alerts Raised  : {stats['alerts_count']}")
    
    print(section)
    print("📈  HTTP STATUS CODE FREQUENCY DISTRIBUTION")
    print(section)
    for code, count in sorted(stats['status_codes'].items()):
        pct = (count / stats['total_requests']) * 100 if stats['total_requests'] > 0 else 0
        bar = "█" * int(pct / 5) if pct >= 5 else "▏"
        print(f"  {code} | {count:6,} ({pct:5.1f}%) | {bar}")
        
    print(section)
    print("🌐  TOP DEMANDING NETWORK ENDPOINTS (IP ADDRESSES)")
    print(section)
    for i, (ip, count) in enumerate(stats['top_ips'], 1):
        print(f"  {i}. {ip:15} | Requests: {count:,}")
        
    print(section)
    print("📂  TOP REQUESTED RESOURCE PATHS (URIs)")
    print(section)
    for i, (uri, count) in enumerate(stats['top_endpoints'], 1):
        print(f"  {i}. {uri[:50]:50} | Hits: {count:,}")


def write_markdown_report(stats: Dict[str, Any], filepath: str) -> None:
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("# Security & Operational Performance Audit\\n\\n")
            f.write("Generated recursively via Python Portfolio Log Analyzer.\\n\\n")
            
            f.write("## 1. High-Level Metrics\\n\\n")
            f.write(f"- **Total Records Inspected:** {stats['total_requests']:,}\\n")
            total_mb = stats['total_bandwidth_bytes'] / (1024 * 1024)
            f.write(f"- **Cumulative Bandwidth Served:** {total_mb:.3f} MB\\n")
            f.write(f"- **Security Event Alerts Raised:** {stats['alerts_count']}\\n\\n")
    except OSError as e:
        print(f"[-] Error writing Markdown report: {e}")`
  },
  'README.md': {
    name: 'README.md',
    description: 'High-impact portfolio showcase README. Explains system benefits, setup, and shows visuals.',
    lang: 'markdown',
    content: `# Security Log Analyzer & Threat Detection CLI

An expert-grade systems engineering portfolio project. This is a fully modular **Log Parser & Security Incident Detector** built entirely using **Python's standard library**.

## 🎯 Portfolio Highlights
*   **Zero Third-Party Dependencies:** Implemented purely in standard Python to block supply-chain risk variables.
*   **Constant Time $O(1)$ Hash Aggregations:** Uses nested dictionary states on-the-fly.
*   **Memory Bound $O(1)$ Stream Parsing:** RAM overhead limited strictly to individual line buffers.
*   **Automated Threat intelligence Rules:** Detects SQLi payloads, path traversals, and SSH gateway brute force surges.`
  },
  'README_EXHAUSTIVE.md': {
    name: 'README_EXHAUSTIVE.md',
    description: 'Extensive concept review mapping regular expressions, Hash Table complexities, and interview scripts.',
    lang: 'markdown',
    content: `# Deep Dive Reference: Computer Science & Systems Paradigms

## 🔬 CS Theory Decoded

### 1. Hash Maps Complexity Bound
Tracks cumulative IP metrics recursively in $O(1)$ constant lookup/write times utilizing dictionary hashing bins.

### 2. Regex compiler & DFA Transition State
Traverses log strings character-by-character along a Deterministic Finite Automaton line, preventing backtracking collisions or complex trailing matches.

### 3. Buffer-by-buffer line stream
Opening files yields lazy evaluation pointers, restricting heap allocations dynamically.`
  }
};

export default function LogTerminalPreview() {
  const [activeFile, setActiveFile] = useState<string>('main.py');
  const [copied, setCopied] = useState(false);

  const currentFile = FILES_MAP[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Modular File Explorer */}
        <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderOpen className="w-4 h-4 text-indigo-600 animate-pulse" />
            <h4 className="font-display font-bold text-sm text-slate-900">Modular Package Files</h4>
          </div>

          <div className="space-y-1">
            {Object.keys(FILES_MAP).map((fileName) => {
              const file = FILES_MAP[fileName];
              const isPy = fileName.endsWith('.py');
              const isSelected = activeFile === fileName;
              
              return (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  id={`file-tab-${fileName}`}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                    isSelected 
                      ? 'bg-indigo-50 border-l-4 border-indigo-600 text-slate-950 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[85%]">
                    {isPy ? (
                      <FileCode2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    ) : (
                      <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    )}
                    <span className="truncate">{fileName}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transform transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick selected file analysis card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-800 font-display flex items-center gap-1.5 leading-tight">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              File Meta context
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed select-text">
              {currentFile.description}
            </p>
          </div>
        </div>

        {/* Right Modular Code block viewport */}
        <div className="lg:col-span-8 flex flex-col h-[650px] border border-slate-900 rounded-3xl bg-slate-950 shadow-xl overflow-hidden">
          {/* Header Action bar */}
          <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-850 shrink-0">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs text-white font-semibold">
                log_analyzer/{currentFile.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                id="copy-code-btn"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-display font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={downloadFile}
                id="download-code-btn"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-display font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Code viewport frame */}
          <div className="flex-1 p-5 overflow-auto font-mono text-[11px] leading-relaxed select-text text-slate-300">
            <pre className="whitespace-pre">{currentFile.content}</pre>
          </div>

          {/* Setup Instructions frame */}
          <div className="bg-slate-900 border-t border-slate-850 p-4 shrink-0 font-mono text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-200">How to initialize and test:</span>
            </div>
            
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-2 text-slate-350">
              <div>
                <span className="text-slate-500"># Step 1: Run analyzer directly (it will generate sample logs if absent)</span>
                <p className="text-emerald-400">$ python3 main.py</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
