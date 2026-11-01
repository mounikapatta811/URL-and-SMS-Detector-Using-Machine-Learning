"""
Database module for PhishGuard.
Manages SQLite storage for scan history, threat analytics, and exports.
"""

import sqlite3
import json
import os
import csv
import io
from datetime import datetime
from typing import Dict, List, Any, Optional

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "phishguard.db")


def get_db_connection() -> sqlite3.Connection:
    """Creates a database connection with dictionary-like row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes the database schema if tables do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_type TEXT NOT NULL,          -- 'url' or 'sms'
        input_content TEXT NOT NULL,      -- URL string or SMS text
        result TEXT NOT NULL,             -- 'SAFE' or 'PHISHING'
        risk_score REAL NOT NULL,         -- 0.0 to 100.0
        confidence REAL NOT NULL,         -- 0.0 to 100.0
        model_name TEXT NOT NULL,         -- Model used (e.g. 'RandomForest Classifier')
        indicators_json TEXT NOT NULL,    -- JSON list of detected indicators
        explanation TEXT NOT NULL,        -- Human-friendly explanation
        recommendations TEXT NOT NULL,    -- Security recommendations
        features_json TEXT,               -- Extracted numerical / NLP features
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_scans_type ON scans(scan_type);
    """)
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_scans_result ON scans(result);
    """)
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_scans_created ON scans(created_at);
    """)

    conn.commit()
    conn.close()

    # Seed demo data if table is brand new and empty
    seed_demo_scans_if_empty()


def insert_scan(
    scan_type: str,
    input_content: str,
    result: str,
    risk_score: float,
    confidence: float,
    model_name: str,
    indicators: List[Dict[str, Any]],
    explanation: str,
    recommendations: List[str],
    features: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Inserts a new scan result into the database."""
    conn = get_db_connection()
    cursor = conn.cursor()

    indicators_str = json.dumps(indicators)
    recommendations_str = json.dumps(recommendations)
    features_str = json.dumps(features or {})

    cursor.execute("""
    INSERT INTO scans (
        scan_type, input_content, result, risk_score, confidence,
        model_name, indicators_json, explanation, recommendations, features_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        scan_type,
        input_content,
        result,
        round(risk_score, 1),
        round(confidence, 1),
        model_name,
        indicators_str,
        explanation,
        recommendations_str,
        features_str
    ))

    scan_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()

    return format_scan_row(row)


def get_scan_by_id(scan_id: int) -> Optional[Dict[str, Any]]:
    """Retrieves a single scan by its primary key ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()
    return format_scan_row(row) if row else None


def get_scans(
    limit: int = 50,
    offset: int = 0,
    scan_type: Optional[str] = None,
    result: Optional[str] = None,
    search: Optional[str] = None
) -> Dict[str, Any]:
    """Retrieves paginated scans with optional filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM scans WHERE 1=1"
    count_query = "SELECT COUNT(*) as count FROM scans WHERE 1=1"
    params = []

    if scan_type and scan_type.lower() != 'all':
        query += " AND scan_type = ?"
        count_query += " AND scan_type = ?"
        params.append(scan_type.lower())

    if result and result.upper() != 'ALL':
        query += " AND result = ?"
        count_query += " AND result = ?"
        params.append(result.upper())

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query += " AND (input_content LIKE ? OR explanation LIKE ?)"
        count_query += " AND (input_content LIKE ? OR explanation LIKE ?)"
        params.extend([search_pattern, search_pattern])

    # Count total matching rows
    cursor.execute(count_query, params)
    total_count = cursor.fetchone()['count']

    # Retrieve rows
    query += " ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?"
    retrieval_params = list(params)
    retrieval_params.extend([limit, offset])

    cursor.execute(query, retrieval_params)
    rows = cursor.fetchall()
    conn.close()

    return {
        "items": [format_scan_row(r) for r in rows],
        "total": total_count,
        "limit": limit,
        "offset": offset
    }


def delete_scan(scan_id: int) -> bool:
    """Deletes a scan record by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def clear_all_scans() -> int:
    """Clears all scan records."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans")
    count = cursor.rowcount
    conn.commit()
    conn.close()
    return count


def get_statistics() -> Dict[str, Any]:
    """Calculates comprehensive analytics for the cybersecurity dashboard."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total Scans
    cursor.execute("SELECT COUNT(*) as total FROM scans")
    total_scans = cursor.fetchone()['total']

    # URL Scans
    cursor.execute("SELECT COUNT(*) as count FROM scans WHERE scan_type = 'url'")
    total_urls = cursor.fetchone()['count']

    # SMS Scans
    cursor.execute("SELECT COUNT(*) as count FROM scans WHERE scan_type = 'sms'")
    total_sms = cursor.fetchone()['count']

    # Phishing detected
    cursor.execute("SELECT COUNT(*) as count FROM scans WHERE result = 'PHISHING'")
    phishing_count = cursor.fetchone()['count']

    # Safe detected
    cursor.execute("SELECT COUNT(*) as count FROM scans WHERE result = 'SAFE'")
    safe_count = cursor.fetchone()['count']

    # Threat Rate Percentage
    threat_rate = round((phishing_count / total_scans * 100), 1) if total_scans > 0 else 0.0

    # Average Risk Score
    cursor.execute("SELECT AVG(risk_score) as avg_risk FROM scans")
    avg_risk_row = cursor.fetchone()
    avg_risk = round(avg_risk_row['avg_risk'], 1) if avg_risk_row and avg_risk_row['avg_risk'] else 0.0

    # Phishing breakdown by type
    cursor.execute("""
    SELECT scan_type, COUNT(*) as count 
    FROM scans 
    WHERE result = 'PHISHING' 
    GROUP BY scan_type
    """)
    phishing_by_type = {row['scan_type']: row['count'] for row in cursor.fetchall()}

    # Recent 7 activity dates
    cursor.execute("""
    SELECT substr(created_at, 1, 10) as scan_date,
           SUM(CASE WHEN result = 'PHISHING' THEN 1 ELSE 0 END) as phishing,
           SUM(CASE WHEN result = 'SAFE' THEN 1 ELSE 0 END) as safe
    FROM scans
    GROUP BY substr(created_at, 1, 10)
    ORDER BY scan_date DESC
    LIMIT 7
    """)
    daily_stats = [dict(row) for row in cursor.fetchall()]
    daily_stats.reverse()

    # Top indicator frequencies
    cursor.execute("SELECT indicators_json FROM scans WHERE result = 'PHISHING'")
    indicator_counts = {}
    for row in cursor.fetchall():
        try:
            indicators = json.loads(row['indicators_json'])
            for ind in indicators:
                title = ind.get('title') or ind.get('name') or "Suspicious Pattern"
                indicator_counts[title] = indicator_counts.get(title, 0) + 1
        except Exception:
            continue

    sorted_indicators = sorted(indicator_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    top_indicators = [{"name": k, "count": v} for k, v in sorted_indicators]

    conn.close()

    return {
        "total_scans": total_scans,
        "total_urls": total_urls,
        "total_sms": total_sms,
        "phishing_count": phishing_count,
        "safe_count": safe_count,
        "threat_rate": threat_rate,
        "avg_risk": avg_risk,
        "phishing_by_type": phishing_by_type,
        "daily_stats": daily_stats,
        "top_indicators": top_indicators
    }


def export_scans_data(format_type: str = "json") -> str:
    """Exports all scan records as JSON or CSV formatted string."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    formatted_items = [format_scan_row(r) for r in rows]

    if format_type.lower() == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "ID", "Scan Type", "Input Content", "Result", "Risk Score (%)",
            "Confidence (%)", "Model", "Explanation", "Timestamp"
        ])
        for item in formatted_items:
            writer.writerow([
                item['id'],
                item['scan_type'],
                item['input_content'],
                item['result'],
                item['risk_score'],
                item['confidence'],
                item['model_name'],
                item['explanation'],
                item['created_at']
            ])
        return output.getvalue()
    else:
        return json.dumps(formatted_items, indent=2)


def format_scan_row(row: sqlite3.Row) -> Dict[str, Any]:
    """Helper to deserialize JSON fields in a SQLite row."""
    if not row:
        return {}
    d = dict(row)
    try:
        d['indicators'] = json.loads(d.get('indicators_json') or '[]')
    except Exception:
        d['indicators'] = []
    try:
        d['recommendations'] = json.loads(d.get('recommendations') or '[]')
    except Exception:
        d['recommendations'] = []
    try:
        d['features'] = json.loads(d.get('features_json') or '{}')
    except Exception:
        d['features'] = {}
    return d


def seed_demo_scans_if_empty():
    """Seeds realistic initial scans to populate the dashboard on first launch."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM scans")
    cnt = cursor.fetchone()['cnt']
    if cnt > 0:
        conn.close()
        return

    demo_items = [
        (
            'url',
            'https://appleid.apple.com.verify-login-update.xyz/account',
            'PHISHING',
            96.5,
            98.2,
            'Random Forest Ensemble',
            json.dumps([
                {"title": "High-Risk Domain TLD", "severity": "High", "desc": "Domain uses '.xyz' known for high cyber abuse rates."},
                {"title": "Excessive Subdomains", "severity": "High", "desc": "Brand impersonation in multiple subdomains (appleid.apple.com)."},
                {"title": "Credential Harvest Keywords", "severity": "High", "desc": "Contains 'verify', 'login', 'update', 'account'."}
            ]),
            "Domain employs brand spoofing using Apple trademarks in subdomains on an untrusted TLD to trick users into revealing credentials.",
            json.dumps(["Never enter credentials on non-apple.com domains", "Verify domain WHOIS", "Enable Two-Factor Authentication"]),
            json.dumps({"url_length": 58, "num_dots": 4, "has_https": 1, "is_shortened": 0})
        ),
        (
            'url',
            'https://github.com/torvalds/linux',
            'SAFE',
            3.2,
            99.1,
            'Random Forest Ensemble',
            json.dumps([
                {"title": "Legitimate TLD (.com)", "severity": "Low", "desc": "Reputable top level domain."},
                {"title": "Valid HTTPS Security", "severity": "Low", "desc": "Standard secure protocol detected."},
                {"title": "Standard Path Structure", "severity": "Low", "desc": "No redirection or credential traps found."}
            ]),
            "Official GitHub repository link. Standard lexical features, clean domain reputation, and legitimate SSL encryption.",
            json.dumps(["Safe to proceed", "Ensure browser lock icon shows GitHub Inc."]),
            json.dumps({"url_length": 34, "num_dots": 1, "has_https": 1, "is_shortened": 0})
        ),
        (
            'sms',
            'URGENT: Your Chase checking account has been temporarily locked due to suspicious activity. Verify identity within 24 hours at http://chase-secure-reactivate.xyz/login to restore access.',
            'PHISHING',
            97.8,
            99.0,
            'TF-IDF + Random Forest Classifier',
            json.dumps([
                {"title": "Urgent Threat Tactics", "severity": "High", "desc": "Uses panic words: 'URGENT', 'locked', 'within 24 hours'."},
                {"title": "Banking Impersonation", "severity": "High", "desc": "Poses as Chase Bank requiring immediate authentication."},
                {"title": "Suspicious HTTP Link", "severity": "High", "desc": "Contains unencrypted link pointing to suspicious .xyz domain."}
            ]),
            "Classic smishing social engineering attack. Attackers manufacture artificial urgency and threaten account lockout to steal bank login credentials.",
            json.dumps(["Do not click the link", "Call the official number on the back of your card", "Forward SMS to 7726 (SPAM)"]),
            json.dumps({"urgency_score": 0.95, "banking_trigger": 1, "link_detected": 1})
        ),
        (
            'sms',
            'Your Google verification code is 849201. Never share this code with anyone. We will never call or text asking for it.',
            'SAFE',
            2.5,
            98.5,
            'TF-IDF + Random Forest Classifier',
            json.dumps([
                {"title": "Legitimate 2FA Pattern", "severity": "Low", "desc": "Includes security notice warning not to share code."},
                {"title": "No Malicious Hyperlinks", "severity": "Low", "desc": "Message contains no external redirection links."},
                {"title": "Standard OTP Format", "severity": "Low", "desc": "Short, objective numeric code delivery."}
            ]),
            "Genuine automated two-factor authentication message with explicit user safety disclaimers.",
            json.dumps(["Use code only in official Google login prompts", "Never share this code over phone or chat"]),
            json.dumps({"urgency_score": 0.05, "banking_trigger": 0, "link_detected": 0})
        ),
        (
            'url',
            'http://192.168.1.105:8080/paypal/login.php?cmd=_login-submit',
            'PHISHING',
            98.9,
            99.4,
            'Random Forest Ensemble',
            json.dumps([
                {"title": "Raw IP Address Host", "severity": "High", "desc": "Uses raw IP address instead of registered domain name."},
                {"title": "Unencrypted HTTP", "severity": "High", "desc": "Transmits data in plaintext without SSL certificate."},
                {"title": "PayPal Phishing Parameters", "severity": "High", "desc": "Mimics PayPal webscr / login endpoints on custom port."}
            ]),
            "Raw IP host running an unencrypted login phishing kit impersonating PayPal services.",
            json.dumps(["Block IP address immediately", "Do not submit sensitive credentials", "Report to PayPal Anti-Phishing"]),
            json.dumps({"url_length": 62, "num_dots": 4, "has_ip": 1, "has_https": 0})
        ),
        (
            'sms',
            'USPS Notice: Your package #US94829184 cannot be delivered due to an incorrect street address. Please update your details here: https://bit.ly/usps-redelivery-fee within 12h or package will be returned.',
            'PHISHING',
            95.4,
            97.8,
            'TF-IDF + Random Forest Classifier',
            json.dumps([
                {"title": "Delivery Scam Impersonation", "severity": "High", "desc": "Impersonates postal service with fake package alert."},
                {"title": "URL Shortener Masking", "severity": "High", "desc": "Hides final destination behind bit.ly URL shortener."},
                {"title": "Artificial Deadline", "severity": "Medium", "desc": "Pressures user with 'within 12h' package return threat."}
            ]),
            "High-volume smishing scam impersonating postal carriers designed to harvest credit card numbers under the guise of a small redelivery fee.",
            json.dumps(["Delete the SMS immediately", "Track packages only on official USPS.com website", "Do not pay redelivery fees"]),
            json.dumps({"urgency_score": 0.88, "banking_trigger": 0, "link_detected": 1})
        ),
        (
            'url',
            'https://www.wikipedia.org/wiki/Computer_security',
            'SAFE',
            1.8,
            99.5,
            'Random Forest Ensemble',
            json.dumps([
                {"title": "Verified Non-Profit Domain", "severity": "Low", "desc": "Legitimate .org educational resource."},
                {"title": "Valid HTTPS Security", "severity": "Low", "desc": "Standard secure connection."},
                {"title": "Clean Lexical Structure", "severity": "Low", "desc": "No deceptive brand or obfuscation techniques."}
            ]),
            "Clean authoritative domain with flawless reputation, valid SSL, and transparent Wikipedia article path.",
            json.dumps(["Safe to browse", "No security actions required"]),
            json.dumps({"url_length": 48, "num_dots": 2, "has_https": 1, "is_shortened": 0})
        )
    ]

    for item in demo_items:
        cursor.execute("""
        INSERT INTO scans (
            scan_type, input_content, result, risk_score, confidence,
            model_name, indicators_json, explanation, recommendations, features_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, item)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")

