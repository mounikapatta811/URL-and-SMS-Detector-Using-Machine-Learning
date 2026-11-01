"""
URL Feature Extraction & Analysis Module for PhishGuard.
Extracts lexical, structural, domain, and heuristic indicators from URLs.
"""

import re
import math
from urllib.parse import urlparse
from typing import Dict, List, Tuple, Any

# Popular URL Shortening Services
SHORTENERS = {
    'bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co', 'is.gd',
    'buff.ly', 'adf.ly', 'bit.do', 'rb.gy', 'cutt.ly', 'shorte.st',
    'tiny.cc', 'bc.vc', 's.id', 'v.gd', 'shorturl.at'
}

# Suspicious or High-Abuse TLDs frequently seen in phishing campaigns
SUSPICIOUS_TLDS = {
    'xyz', 'top', 'work', 'club', 'buzz', 'loan', 'tk', 'ml', 'ga',
    'cf', 'gq', 'click', 'link', 'live', 'info', 'site', 'website',
    'online', 'vip', 'monster', 'icu', 'cam', 'surf', 'rest', 'fit'
}

# Reputable / High-trust TLDs
TRUSTED_TLDS = {'gov', 'edu', 'mil'}

# Suspicious keywords frequently embedded in phishing URLs
PHISHING_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'account', 'update',
    'banking', 'secure', 'security', 'ebayisapi', 'webscr', 'confirm',
    'confirmation', 'wallet', 'password', 'support', 'billing', 'bill',
    'authenticate', 'authentication', 'validation', 'service', 'appleid',
    'recovery', 'alert', 'bonus', 'free', 'gift', 'prize', 'refund',
    'suspended', 'unlock', 'redirect', 'portal', 're-verify', 'identity',
    'tax-refund', 'crypto', 'metamask', 'binance', 'coinbase'
]

# Major brands commonly impersonated
TARGETED_BRANDS = [
    'paypal', 'apple', 'google', 'microsoft', 'netflix', 'chase',
    'amazon', 'bankofamerica', 'wellsfargo', 'facebook', 'instagram',
    'whatsapp', 'dropbox', 'dhl', 'fedex', 'usps', 'yahoo', 'outlook',
    'binance', 'coinbase', 'citibank', 'americanexpress'
]


def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy to detect algorithmically generated domains (DGA)."""
    if not text:
        return 0.0
    entropy = 0.0
    length = len(text)
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)


def extract_url_features(url_str: str) -> Dict[str, Any]:
    """
    Parses a URL and extracts both raw numerical features for machine learning
    and high-level indicators for explainable reporting.
    """
    raw_url = url_str.strip()
    if not raw_url:
        raise ValueError("URL cannot be empty")

    # Ensure URL has a scheme for urlparse
    if not re.match(r'^[a-zA-Z]+://', raw_url):
        processed_url = 'http://' + raw_url
        has_explicit_scheme = False
    else:
        processed_url = raw_url
        has_explicit_scheme = True

    parsed = urlparse(processed_url)
    hostname = (parsed.hostname or '').lower()
    path = parsed.path or ''
    query = parsed.query or ''
    netloc = parsed.netloc.lower()

    # Base Metrics
    url_len = len(raw_url)
    hostname_len = len(hostname)
    path_len = len(path)

    # Character counts
    num_dots = raw_url.count('.')
    num_hyphens = raw_url.count('-')
    num_underscores = raw_url.count('_')
    num_slashes = raw_url.count('/')
    num_question = raw_url.count('?')
    num_equal = raw_url.count('=')
    num_at = raw_url.count('@')
    num_ampersand = raw_url.count('&')
    num_percent = raw_url.count('%')
    num_digits = sum(c.isdigit() for c in raw_url)
    num_special = len(re.findall(r'[^a-zA-Z0-9\s]', raw_url))
    digit_ratio = round(num_digits / max(url_len, 1), 4)

    # HTTPS presence
    has_https = 1 if (has_explicit_scheme and raw_url.lower().startswith('https://')) else 0

    # IP Address in host
    ipv4_pattern = r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::\d+)?$'
    has_ip = 1 if re.match(ipv4_pattern, hostname) else 0

    # Subdomains count
    parts = hostname.split('.')
    if has_ip:
        num_subdomains = 0
        tld = 'ip'
    elif len(parts) >= 2:
        tld = parts[-1]
        # Ignore www if first subdomain
        effective_parts = [p for p in parts[:-2] if p != 'www']
        num_subdomains = len(effective_parts)
    else:
        num_subdomains = 0
        tld = parts[0] if parts else ''

    # TLD Risk
    is_suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0
    is_trusted_tld = 1 if tld in TRUSTED_TLDS else 0

    # URL Shortener Detection
    is_shortened = 1 if (hostname in SHORTENERS or any(s in hostname for s in SHORTENERS)) else 0

    # Non-standard port
    has_non_standard_port = 1 if (parsed.port and parsed.port not in (80, 443)) else 0

    # Suspicious keywords
    lowered_url = raw_url.lower()
    matched_keywords = [kw for kw in PHISHING_KEYWORDS if kw in lowered_url]
    keyword_count = len(matched_keywords)

    # Brand Impersonation in Subdomain / Path
    brand_spoofed = None
    for brand in TARGETED_BRANDS:
        # If brand is in subdomain or path, but domain does NOT end with brand.com / brand.tld
        if brand in hostname:
            registered_domain = '.'.join(parts[-2:]) if len(parts) >= 2 else hostname
            if not registered_domain.startswith(brand):
                brand_spoofed = brand
                break
        elif brand in path or brand in query:
            registered_domain = '.'.join(parts[-2:]) if len(parts) >= 2 else hostname
            if not registered_domain.startswith(brand):
                brand_spoofed = brand
                break

    # Shannon Entropy of domain
    entropy = calculate_entropy(hostname)

    # Construct ML feature vector
    feature_vector = [
        url_len,
        num_dots,
        num_hyphens,
        num_underscores,
        num_slashes,
        num_question,
        num_equal,
        num_at,
        num_percent,
        num_digits,
        num_special,
        digit_ratio,
        has_https,
        has_ip,
        num_subdomains,
        is_suspicious_tld,
        is_shortened,
        has_non_standard_port,
        keyword_count,
        1 if brand_spoofed else 0,
        entropy,
        hostname_len
    ]

    feature_names = [
        "url_length",
        "num_dots",
        "num_hyphens",
        "num_underscores",
        "num_slashes",
        "num_question",
        "num_equal",
        "num_at",
        "num_percent",
        "num_digits",
        "num_special_chars",
        "digit_ratio",
        "has_https",
        "has_ip",
        "num_subdomains",
        "is_suspicious_tld",
        "is_shortened",
        "has_non_standard_port",
        "keyword_count",
        "has_brand_spoof",
        "entropy",
        "hostname_length"
    ]

    # Explainable Indicators Construction
    indicators = []
    heuristic_penalty = 0

    if has_ip:
        indicators.append({
            "title": "Raw IP Address Host",
            "severity": "High",
            "desc": f"Host is configured as an IP address ({hostname}) rather than a legitimate domain name."
        })
        heuristic_penalty += 35

    if num_at > 0:
        indicators.append({
            "title": "@ Symbol Redirection",
            "severity": "High",
            "desc": "Contains '@' character which browsers use to ignore preceding credentials and redirect."
        })
        heuristic_penalty += 30

    if brand_spoofed:
        indicators.append({
            "title": f"Targeted Brand Impersonation ({brand_spoofed.capitalize()})",
            "severity": "High",
            "desc": f"Impersonates official brand '{brand_spoofed}' in subdomains or URL path on an unrelated host."
        })
        heuristic_penalty += 30

    if is_suspicious_tld:
        indicators.append({
            "title": f"High-Abuse TLD (.{tld})",
            "severity": "High",
            "desc": f"Top-Level Domain '.{tld}' exhibits high historical correlation with malicious infrastructure."
        })
        heuristic_penalty += 20

    if is_shortened:
        indicators.append({
            "title": "URL Shortener Masking",
            "severity": "Medium",
            "desc": f"Employs shortener service ({hostname}) to disguise the ultimate destination URL."
        })
        heuristic_penalty += 20

    if not has_https:
        indicators.append({
            "title": "Missing HTTPS Encryption",
            "severity": "Medium",
            "desc": "Connection transmits unencrypted plaintext (HTTP) susceptible to interception."
        })
        heuristic_penalty += 15

    if num_subdomains >= 3:
        indicators.append({
            "title": f"Excessive Subdomain Stacking ({num_subdomains} levels)",
            "severity": "Medium",
            "desc": "Excessive subdomain hierarchy commonly used to bury true domain identity on mobile devices."
        })
        heuristic_penalty += 15

    if keyword_count >= 2:
        matched_str = ", ".join(matched_keywords[:4])
        indicators.append({
            "title": f"Credential Harvest Trigger Words ({matched_str})",
            "severity": "Medium",
            "desc": f"Embedded sensitive action words: {matched_str}."
        })
        heuristic_penalty += 15

    if entropy > 4.2 and not has_ip:
        indicators.append({
            "title": f"High Domain Entropy ({entropy})",
            "severity": "Medium",
            "desc": "High character randomness suggesting Domain Generation Algorithm (DGA) or machine generation."
        })
        heuristic_penalty += 10

    if url_len > 85:
        indicators.append({
            "title": f"Abnormally Long URL ({url_len} chars)",
            "severity": "Low",
            "desc": "Unusually long URL structure often designed to push deceptive parameters out of browser view."
        })
        heuristic_penalty += 5

    # Safe indicators if clean
    if not indicators:
        indicators.append({
            "title": "Clean Lexical Profile",
            "severity": "Low",
            "desc": "No abnormal character distributions or suspicious keyword anomalies detected."
        })
        if has_https:
            indicators.append({
                "title": "Secure HTTPS Protocol",
                "severity": "Low",
                "desc": "Standard encrypted transport protocol active."
            })
        if is_trusted_tld:
            indicators.append({
                "title": f"Authoritative TLD (.{tld})",
                "severity": "Low",
                "desc": "Registered under restricted institutional top-level domain."
            })

    # Actionable Recommendations
    recommendations = []
    if heuristic_penalty >= 30:
        recommendations.append("DO NOT enter any passwords, payment details, or personal information on this page.")
        recommendations.append("Close the browser tab immediately and avoid downloading any files.")
        recommendations.append("Navigate to the service by typing the official known address directly into your browser.")
        if brand_spoofed:
            recommendations.append(f"Report this spoofed domain directly to {brand_spoofed.capitalize()} Security and APWG.")
    else:
        recommendations.append("Verify the domain matches the expected company or organization.")
        recommendations.append("Ensure your browser displays a valid, secure certificate padlock icon.")
        recommendations.append("Always verify multi-factor authentication (MFA) prompts before confirming logins.")

    return {
        "raw_url": raw_url,
        "hostname": hostname,
        "tld": tld,
        "feature_vector": feature_vector,
        "feature_dict": dict(zip(feature_names, feature_vector)),
        "indicators": indicators,
        "heuristic_penalty": min(heuristic_penalty, 100),
        "recommendations": recommendations,
        "brand_spoofed": brand_spoofed
    }

