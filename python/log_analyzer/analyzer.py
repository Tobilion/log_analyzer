# -*- coding: utf-8 -*-
"""
Module: analyzer.py
Purpose: Aggregates metrics and runs heuristic rule engines to discover security threats.
Theory: Implements Map-Reduce-like accumulator dictionaries. Tracks IP frequencies, 
        response statuses, bandwidth drains, and searches for malicious pattern payloads.
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
        
        # O(1) Cumulative Counters & Trackers
        self.total_requests = 0
        self.total_bandwidth_bytes = 0
        
        self.ip_tracker = defaultdict(int)
        self.endpoint_tracker = defaultdict(int)
        self.status_code_tracker = defaultdict(int)
        
        # Security Incident Tracking
        # Tracks login failure attempts per IP to monitor brute-force scans: {ip: [timestamps]}
        self.login_failures = defaultdict(list)
        self.alerts: List[Dict[str, Any]] = []

    def process_record(self, record: Dict[str, Any]) -> None:
        """
        Ingests a single parsed record. Accumulates statistical metadata.
        
        Why This Aggregator is Memory-Efficient:
        ----------------------------------------
        Instead of loading thousands of log elements completely inside a massive database array 
        to count records later, we compute summaries on-the-fly. This keeps the space complexity 
        bounded by the number of *unique* items rather than the raw count of logs scanned.
        """
        self.total_requests += 1
        self.total_bandwidth_bytes += record['size_bytes']
        
        # Increment frequency counters
        ip = record['ip']
        self.ip_tracker[ip] += 1
        self.endpoint_tracker[record['request']] += 1
        
        status = record['status']
        self.status_code_tracker[status] += 1
        
        # Run specialized security heuristics
        self._check_for_threats(record)

    def _check_for_threats(self, record: Dict[str, Any]) -> None:
        """Runs rule checks to flag anomalous, suspicious or payload-injected traffic."""
        ip = record['ip']
        request = record['request'].lower()
        status = record['status']
        method = record['method']
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
            
        # Rule 2: Detect Directory Traversal Attacks (Arbitrary system file access)
        traversal_patterns = ["../", "..\\", "/etc/passwd", "win.ini", "boot.ini"]
        if any(pat in request for pat in traversal_patterns):
            self.alerts.append({
                "type": "Path Traversal Attack",
                "ip": ip,
                "timestamp": timestamp,
                "severity": "CRITICAL",
                "details": f"Attempted traversal escape to read system files via path: '{record['request']}'"
            })

        # Rule 3: Monitor Brute Force logins on authentication gateway endpoints
        # Look for failed login attempts (e.g., status 401 Unauthorized or 403 Forbidden)
        if "/login" in request:
            if status in ["401", "403"]:
                self.login_failures[ip].append(timestamp)
                
                # Check if threshold crossed
                if len(self.login_failures[ip]) >= self.brute_force_threshold:
                    self.alerts.append({
                        "type": "Brute Force Warning",
                        "ip": ip,
                        "timestamp": timestamp,
                        "severity": "HIGH",
                        "details": (f"IP logged {len(self.login_failures[ip])} cumulative "
                                    f"authorized authentication failures on gateway.")
                    })
                    # Clear list to avoid flooding redundant alerts
                    self.login_failures[ip] = []

    def get_summary_statistics(self, top_limit: int = 5) -> Dict[str, Any]:
        """
        Sorts the accumulated dictionary collections to compile reporting lists.
        Complexity: O(K log K) where K is number of unique keys. Negligible since K << Total Logs.
        """
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
        }
