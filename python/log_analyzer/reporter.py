# -*- coding: utf-8 -*-
"""
Module: reporter.py
Purpose: Translates analysis dictionaries into human-readable terminal dashboards 
         and structured Markdown report archives.
"""

import os
from typing import Dict, Any


def print_ansi_dashboard(stats: Dict[str, Any]) -> None:
    """
    Renders an in-depth text-based dashboard inside the system console.
    """
    border = "=" * 80
    section = "-" * 80
    
    print("\n" + border)
    print("                HIGH-PERFORMANCE SYSTEM LOG ANALYZER & INCIDENT RADAR")
    print(border)
    
    # Global metrics
    total_mb = stats['total_bandwidth_bytes'] / (1024 * 1024)
    print(f"📊  Total Entries Processed : {stats['total_requests']:,}")
    print(f"💾  Cumulative Data Served  : {total_mb:.3f} MB")
    print(f"🚨  Security Alerts Raised  : {stats['alerts_count']}")
    
    # Status codes breakdown
    print(section)
    print("📈  HTTP STATUS CODE FREQUENCY DISTRIBUTION")
    print(section)
    for code, count in sorted(stats['status_codes'].items()):
        # Simple ASCII Bar chart visual
        pct = (count / stats['total_requests']) * 100 if stats['total_requests'] > 0 else 0
        bar = "█" * int(pct / 5) if pct >= 5 else "▏"
        print(f"  {code} | {count:6,} ({pct:5.1f}%) | {bar}")
        
    # Top IPs
    print(section)
    print("🌐  TOP DEMANDING NETWORK ENDPOINTS (IP ADDRESSES)")
    print(section)
    for i, (ip, count) in enumerate(stats['top_ips'], 1):
        print(f"  {i}. {ip:15} | Requests: {count:,}")
        
    # Top Endpoints
    print(section)
    print("📂  TOP REQUESTED RESOURCE PATHS (URIs)")
    print(section)
    for i, (uri, count) in enumerate(stats['top_endpoints'], 1):
        print(f"  {i}. {uri[:50]:50} | Hits: {count:,}")
        
    # Security Alert logs
    if stats['alerts']:
        print(section)
        print("🔥  SECURITY ALERT LOG SUMMARY")
        print(section)
        for i, alert in enumerate(stats['alerts'][:10], 1):
            severity = f"[{alert['severity']}]"
            print(f"  {i}. {severity:10} {alert['timestamp']} - IP: {alert['ip']}")
            print(f"     Type  : {alert['type']}")
            print(f"     Info  : {alert['details']}")
            print()
        if len(stats['alerts']) > 10:
            print(f"  [+] ... and {len(stats['alerts']) - 10} additional security events. See full exports.")
            
    print(border + "\n")


def write_markdown_report(stats: Dict[str, Any], filepath: str) -> None:
    """
    Composes a complete Markdown file mapping the results. Useful for sharing with teams.
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("# Security & Operational Performance Audit\n\n")
            f.write("Generated recursively via Python Portfolio Log Analyzer.\n\n")
            
            f.write("## 1. High-Level Metrics\n\n")
            f.write(f"- **Total Records Inspected:** {stats['total_requests']:,}\n")
            total_mb = stats['total_bandwidth_bytes'] / (1024 * 1024)
            f.write(f"- **Cumulative Bandwidth Served:** {total_mb:.3f} MB\n")
            f.write(f"- **Security Event Alerts Raised:** {stats['alerts_count']}\n\n")
            
            f.write("## 2. HTTP Status Codes Breakdown\n\n")
            f.write("| Status Code | Occurrences | Percentage |\n")
            f.write("|-------------|-------------|------------|\n")
            for code, count in sorted(stats['status_codes'].items()):
                pct = (count / stats['total_requests']) * 100 if stats['total_requests'] > 0 else 0
                f.write(f"| `{code}` | {count:,} | {pct:.2f}% |\n")
                
            f.write("\n## 3. High-Traffic Network Hosts\n\n")
            f.write("| Position | Host IP Address | Cumulative Requests |\n")
            f.write("|----------|-----------------|---------------------|\n")
            for i, (ip, count) in enumerate(stats['top_ips'], 1):
                f.write(f"| {i} | `{ip}` | {count:,} |\n")
                
            f.write("\n## 4. Top Requested Host Endpoints\n\n")
            f.write("| Position | Resource URI | Session Hits |\n")
            f.write("|----------|--------------|--------------|\n")
            for i, (uri, count) in enumerate(stats['top_endpoints'], 1):
                f.write(f"| {i} | `{uri}` | {count:,} |\n")
                
            f.write("\n## 5. Security Incident Report Log\n\n")
            if not stats['alerts']:
                f.write("✅ **No anomalous security triggers or malicious request patterns were spotted in these files.**\n")
            else:
                f.write("| Time | Trigger IP | Attack Vector Type | Severity | Incident Details |\n")
                f.write("|------|------------|------------------|----------|------------------|\n")
                for alert in stats['alerts']:
                    f.write(f"| {alert['timestamp']} | `{alert['ip']}` | {alert['type']} | **{alert['severity']}** | {alert['details']} |\n")
                    
            print(f"[+] Output markdown report generated successfully: {filepath}")
    except OSError as e:
        print(f"[-] Error writing Markdown report record: {e}")
