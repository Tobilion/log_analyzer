# -*- coding: utf-8 -*-
"""
Module: parser.py
Purpose: Handles regex-based validation and parsing of individual log string lines.
Theory: Utilizes Python's 're' module (regular expressions) compiled at module load time.
        Regex provides a deterministic finite automaton (DFA) state machine to parse unstructured
        text into structured dictionary values in O(L) time where L is the length of the line.
"""

import re
from datetime import datetime
from typing import Dict, Any, Optional

# Compiled Regular Expression for parsing Common Log Format (CLF) or Combined Log Format
# Line example: 192.168.1.50 - - [03/Jun/2026:12:05:40 +0000] "POST /api/login HTTP/1.1" 200 1524 "Mozilla/5.0"
LOG_PATTERN = re.compile(
    r'^(?P<ip>\S+)\s+\S+\s+(?P<user>\S+)\s+\['
    r'(?P<timestamp>[^\]]+)\]\s+"'
    r'(?P<method>[A-Z]+)\s+(?P<request>\S+)\s+[^"]+"\s+'
    r'(?P<status>\d{3})\s+'
    r'(?P<size>\d+|-)\s+"'
    r'(?P<user_agent>[^"]+)"'
)


def parse_log_line(line: str) -> Optional[Dict[str, Any]]:
    """
    Parses a single log line into a structured dictionary.
    
    Why Regular Expressions with Capture Groups Are Optimal:
    -------------------------------------------------------
    Logs are semi-structured text. Simple string splits (using line.split(' ')) break 
    when fields like User-Agent or Request URI contain custom spaces inside quotes.
    
    Regular expressions compile to state machines that find exact matching boundaries 
    safely and yield named grouping dictionary maps directly.
    
    Args:
        line: Raw log line from file.
        
    Returns:
        Dictionary containing keys: 'ip', 'user', 'timestamp', 'datetime', 'method',
        'request', 'status', 'size', 'user_agent' or None if the log line mismatch occurred.
    """
    match = LOG_PATTERN.match(line.strip())
    if not match:
        return None
        
    data = match.groupdict()
    
    # Clean size value (replace "-" with 0)
    if data['size'] == '-':
        data['size_bytes'] = 0
    else:
        try:
            data['size_bytes'] = int(data['size'])
        except ValueError:
            data['size_bytes'] = 0
            
    # Parse timestamp into a proper datetime object for granular temporal analysis
    # Format example: '03/Jun/2026:12:05:40 +0000'
    try:
        ts_str = data['timestamp'].split()[0]  # Strip timezone offset for simplified parsing
        data['datetime'] = datetime.strptime(ts_str, '%d/%b/%Y:%H:%M:%S')
    except (ValueError, IndexError):
        data['datetime'] = None
        
    return data
