# -*- coding: utf-8 -*-
"""
Module: generator.py
Purpose: Generates clean mock server log files so recruiters or examiners 
         can test the tool's parser and incident features immediately.
"""

import random
from datetime import datetime, timedelta

IPS = [
    "192.168.1.10", "192.168.1.52", "10.0.0.8", "172.16.254.1", 
    "203.0.113.195", "198.51.100.12", "192.0.2.1", "10.0.0.15"
]

ENDPOINTS = [
    "/index.html", "/about.html", "/api/v1/users", "/assets/styles.css",
    "/js/app.js", "/contact.php", "/api/v1/products", "/favicon.ico"
]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/110.0.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) Chrome/110.0.0.0 Safari",
    "curl/7.85.0"
]


def generate_mock_log(filepath: str, lines_count: int = 150) -> None:
    """Generates server logs populated with normal traffic and security triggers."""
    now = datetime.now() - timedelta(hours=12)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        for _ in range(lines_count):
            now += timedelta(seconds=random.randint(1, 45))
            ts_str = now.strftime('%d/%b/%Y:%H:%M:%S +0000')
            
            # 85% Standard requests, 15% custom malicious alerts or failures
            scenario = random.random()
            
            if scenario < 0.82:
                # Normal HTTP Transactions
                ip = random.choice(IPS)
                endpoint = random.choice(ENDPOINTS)
                method = "POST" if "api" in endpoint else "GET"
                status = random.choice(["200", "200", "200", "304", "404"])
                size = str(random.randint(200, 15000))
                ua = random.choice(USER_AGENTS)
            elif scenario < 0.90:
                # SQL Injection Attempt
                ip = "203.0.113.195" # Consistent attacker IP
                payloads = [
                    "/products?id=1' UNION SELECT username, password FROM users --",
                    "/search?term=active' OR '1'='1",
                    "/profile?userId=12; CONCAT(char(115), char(113), char(108))"
                ]
                endpoint = random.choice(payloads)
                method = "GET"
                status = "500" # Database crash
                size = "450"
                ua = "curl/7.85.0 (Security Scanner)"
            elif scenario < 0.95:
                # Directory Traversal Attempt
                ip = "198.51.100.12"
                payloads = [
                    "/static/../../../../../../etc/passwd",
                    "/assets/doc.pdf?file=..\\..\\..\\win.ini",
                    "/etc/passwd"
                ]
                endpoint = random.choice(payloads)
                method = "GET"
                status = "403" # Blocked
                size = "120"
                ua = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0"
            else:
                # Brute Force login attempts
                ip = "192.0.2.1"
                endpoint = "/api/login"
                method = "POST"
                status = "401" # Unauthorized failure
                size = "80"
                ua = "Hydra/9.4 (Auth Bruteforcer)"
                
            log_line = f'{ip} - - [{ts_str}] "{method} {endpoint} HTTP/1.1" {status} {size} "{ua}"\n'
            f.write(log_line)
            
    print(f"[+] Dataset mock log generated successfully: {filepath} ({lines_count} lines)")
if __name__ == '__main__':
    generate_mock_log('test_server.log')
