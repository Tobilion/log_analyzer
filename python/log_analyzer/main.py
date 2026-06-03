#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module: main.py
Purpose: Main controller entrance for python duplicate & log analyzer.
         Instantiates the file parsing streams, computes stats,
         and directs Markdown or visual stdout print instructions.
"""

import os
import sys

# Relative package imports highlighting cohesive modular designs
from parser import parse_log_line
from analyzer import LogAnalyzer
from reporter import print_ansi_dashboard, write_markdown_report
from generator import generate_mock_log


def main() -> None:
    """CLI loop controller."""
    print("======================================================================")
    print("         SYSTEM SECURITY LOG ANALYZER & INCIDENT DETECTOR CLI         ")
    print("======================================================================")

    # Automatically generate test logging files if none exist in standard path
    target_logfile = 'test_server.log'
    if not os.path.exists(target_logfile):
        print(f"[!] Log file '{target_logfile}' not found. Generating dummy test logs automatically...")
        generate_mock_log(target_logfile, 120)

    # Prompt user or read from direct system arguments
    if len(sys.argv) > 1:
        log_path = sys.argv[1]
    else:
        log_path = input(f"Enter path to web/security log file [Default: {target_logfile}]: ").strip()
        if not log_path:
            log_path = target_logfile

    if not os.path.exists(log_path):
        print(f"[-] Error: Specific path '{log_path}' does not exist on this system.")
        sys.exit(1)

    print(f"\n[+] Ingesting targets file: {log_path}")
    print("[+] Compiling Regular Expressions...")
    print("[+] Executing memory-efficient stream processing...")

    analyzer = LogAnalyzer(brute_force_threshold=4)
    skipped_lines = 0

    try:
        # Buffer-by-buffer line stream to support small memory overhead profiles
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
        
        # Display polished ASCII dashboard
        print_ansi_dashboard(stats)

        if skipped_lines > 0:
            print(f"⚠️  Note: Skipped {skipped_lines} lines that could not be verified in the selected Log format.\n")

        # Automatically export report files
        report_out = 'log_analysis_report.md'
        write_markdown_report(stats, report_out)
        
    except KeyboardInterrupt:
        print("\n[-] Log analysis cancelled by terminal manager.")
        sys.exit(0)
    except OSError as e:
        print(f"[-] Severe System IO Error during read stream: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
