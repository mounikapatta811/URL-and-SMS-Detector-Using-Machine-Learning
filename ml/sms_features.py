"""
SMS Feature Extraction & NLP Analysis Module for PhishGuard.
Extracts linguistic, emotional coercion, and deceptive indicators from SMS messages.
"""

import re
from typing import Dict, List, Tuple, Any

# Threat Patterns for SMS (Smishing)
URGENCY_PATTERNS = [
    r'\burgent\b', r'\bimmediately\b', r'\baction required\b', r'\baccount suspended\b',
    r'\b24 hours?\b', r'\blocked\b', r'\bblocked\b', r'\bact now\b', r'\bfinal warning\b',
    r'\bfinal notice\b', r'\bcompromised\b', r'\bunauthorized\b', r'\bdeactivated\b',
    r'\brestricted\b', r'\bwithin \d+ (?:hours?|mins?|minutes?|days?)\b', r'\brespond now\b'
]

REWARD_PATTERNS = [
    r'\bwon\b', r'\bwinner\b', r'\blottery\b', r'\bclaim\b', r'\bprize\b', r'\breward\b',
    r'\bgift card\b', r'\bcash prize\b', r'\bcongratulations\b', r'\bcongrats\b',
    r'\bfree\b', r'\bselected for\b', r'\bvoucher\b', r'\bexclusive offer\b',
    r'\$\d+(?:,\d+)?', r'\bbonus\b', r'\bjackpot\b'
]

OTP_CREDENTIAL_PATTERNS = [
    r'\botp\b', r'\bpasscode\b', r'\bpassword\b', r'\bpin\b', r'\bverification code\b',
    r'\bsecurity code\b', r'\b6-digit\b', r'\blogin details\b', r'\bconfirm your pin\b',
    r'\benter your password\b', r'\bsend your code\b', r'\bshare this code\b'
]

BANKING_PATTERNS = [
    r'\bbank\b', r'\bcredit card\b', r'\bdebit card\b', r'\bchecking account\b',
    r'\bchase\b', r'\bwells fargo\b', r'\bbank of america\b', r'\bciti(?:bank)?\b',
    r'\bpaypal\b', r'\bwire transfer\b', r'\bpayment failed\b', r'\brefund\b',
    r'\btax refund\b', r'\birs\b', r'\bbilling department\b', r'\bunrecognized charge\b'
]

DELIVERY_PATTERNS = [
    r'\busps\b', r'\bfedex\b', r'\bups\b', r'\bdhl\b', r'\bpackage delivery\b',
    r'\bparcel\b', r'\binvalid address\b', r'\bredelivery fee\b', r'\btracking number\b',
    r'\bcustoms fee\b', r'\bshipment on hold\b'
]

URL_REGEX = r'(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|link|info|site|online|live|club|me|tk|ml)/[^\s]*)'


def clean_text_for_nlp(text: str) -> str:
    """Preprocesses text for TF-IDF vectorization."""
    if not text:
        return ""
    # Lowercase
    cleaned = text.lower()
    # Replace URLs with token
    cleaned = re.sub(URL_REGEX, ' [url_token] ', cleaned)
    # Replace numbers with token
    cleaned = re.sub(r'\b\d+\b', ' [number_token] ', cleaned)
    # Remove excessive punctuation
    cleaned = re.sub(r'[^a-zA-Z0-9\s\[\]\_]', ' ', cleaned)
    # Normalize whitespaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def extract_sms_features(text: str) -> Dict[str, Any]:
    """
    Analyzes an SMS message for psychological pressure, fake claims,
    embedded suspicious links, and linguistic anomalies.
    """
    raw_text = text.strip()
    if not raw_text:
        raise ValueError("SMS text cannot be empty")

    text_len = len(raw_text)
    words = raw_text.split()
    word_count = len(words)

    # Uppercase analysis (detect shouting/intimidation)
    alpha_chars = [c for c in raw_text if c.isalpha()]
    total_alpha = len(alpha_chars)
    caps_count = sum(1 for c in alpha_chars if c.isupper())
    caps_ratio = round((caps_count / max(total_alpha, 1)), 3)

    # Digits and symbols
    digit_count = sum(1 for c in raw_text if c.isdigit())
    exclamation_count = raw_text.count('!')
    dollar_count = raw_text.count('$')

    # Detect URLs
    detected_urls = re.findall(URL_REGEX, raw_text, flags=re.IGNORECASE)
    has_link = 1 if len(detected_urls) > 0 else 0

    # Pattern matchers
    lowered = raw_text.lower()

    matched_urgency = [p.replace(r'\b', '') for p in URGENCY_PATTERNS if re.search(p, lowered)]
    matched_rewards = [p.replace(r'\b', '') for p in REWARD_PATTERNS if re.search(p, lowered)]
    matched_otp = [p.replace(r'\b', '') for p in OTP_CREDENTIAL_PATTERNS if re.search(p, lowered)]
    matched_banking = [p.replace(r'\b', '') for p in BANKING_PATTERNS if re.search(p, lowered)]
    matched_delivery = [p.replace(r'\b', '') for p in DELIVERY_PATTERNS if re.search(p, lowered)]

    has_urgency = 1 if matched_urgency else 0
    has_reward = 1 if matched_rewards else 0
    has_otp_risk = 1 if matched_otp else 0
    has_banking_risk = 1 if matched_banking else 0
    has_delivery_risk = 1 if matched_delivery else 0

    # Suspicious link characteristics (e.g. shortener or suspicious TLD)
    shortened_in_sms = 0
    for u in detected_urls:
        if any(shortener in u.lower() for shortener in ['bit.ly', 'tinyurl', 't.co', 'is.gd', 'cutt.ly', 'rb.gy']):
            shortened_in_sms = 1
            break

    # Build explainable indicators
    indicators = []
    heuristic_penalty = 0

    if has_urgency:
        urgency_terms = ", ".join(matched_urgency[:3])
        indicators.append({
            "title": "High-Pressure Urgency Tactics",
            "severity": "High",
            "desc": f"Manufactures artificial urgency with coercion phrases: '{urgency_terms}'."
        })
        heuristic_penalty += 30

    if has_banking_risk:
        bank_terms = ", ".join(matched_banking[:3])
        indicators.append({
            "title": "Financial / Banking Bait",
            "severity": "High",
            "desc": f"Impersonates banking institutions or transactions: '{bank_terms}'."
        })
        heuristic_penalty += 25

    if has_reward:
        reward_terms = ", ".join(matched_rewards[:3])
        indicators.append({
            "title": "Unsolicited Prize / Reward Promise",
            "severity": "High",
            "desc": f"Classic bait lure claiming prizes or gifts: '{reward_terms}'."
        })
        heuristic_penalty += 25

    if has_delivery_risk:
        indicators.append({
            "title": "Package Delivery Scam Lure",
            "severity": "High",
            "desc": "Impersonates postal services (USPS, FedEx, DHL) demanding action on fake deliveries."
        })
        heuristic_penalty += 25

    if has_otp_risk:
        indicators.append({
            "title": "Sensitive Verification / OTP Harvesting",
            "severity": "High",
            "desc": "Requests or references one-time passcodes, PINs, or confidential credentials."
        })
        heuristic_penalty += 20

    if has_link:
        url_snippet = detected_urls[0][:35] + ("..." if len(detected_urls[0]) > 35 else "")
        indicators.append({
            "title": "Suspicious External Link Trap",
            "severity": "High" if shortened_in_sms else "Medium",
            "desc": f"Directs target to external link ({url_snippet}){' via masked URL shortener' if shortened_in_sms else ''}."
        })
        heuristic_penalty += 30 if shortened_in_sms else 20

    if caps_ratio > 0.35 and word_count > 4:
        indicators.append({
            "title": f"Excessive Capitalization ({int(caps_ratio * 100)}% Caps)",
            "severity": "Medium",
            "desc": "Shouting / intimidating capitalization pattern frequently used in scam lures."
        })
        heuristic_penalty += 15

    if not indicators:
        indicators.append({
            "title": "Natural Conversational Language",
            "severity": "Low",
            "desc": "No coercion terms, suspicious financial triggers, or malicious short links detected."
        })
        indicators.append({
            "title": "No Untrusted Hyperlinks",
            "severity": "Low",
            "desc": "Message is clean of phishing redirection vectors."
        })

    # Actionable Recommendations
    recommendations = []
    if heuristic_penalty >= 35:
        recommendations.append("NEVER click links in unsolicited text messages.")
        recommendations.append("Do not reply to the SMS, as replying confirms your phone number is active.")
        recommendations.append("Forward this message to 7726 (SPAM) to alert your mobile carrier.")
        recommendations.append("If this claims to be your bank, call the customer support number on the back of your physical card.")
    else:
        recommendations.append("Always verify sender identity before acting on SMS requests.")
        recommendations.append("Legitimate institutions will never ask for your password or OTP over text.")
        recommendations.append("Keep your mobile operating system and anti-malware updated.")

    # Highlighting logic for frontend rendering
    highlighted_spans = []
    for pattern in URGENCY_PATTERNS + REWARD_PATTERNS + BANKING_PATTERNS + DELIVERY_PATTERNS + OTP_CREDENTIAL_PATTERNS:
        for match in re.finditer(pattern, raw_text, re.IGNORECASE):
            highlighted_spans.append({
                "start": match.start(),
                "end": match.end(),
                "text": match.group(0),
                "type": "threat"
            })
    for u in detected_urls:
        pos = raw_text.find(u)
        if pos != -1:
            highlighted_spans.append({
                "start": pos,
                "end": pos + len(u),
                "text": u,
                "type": "link"
            })

    return {
        "raw_text": raw_text,
        "cleaned_text": clean_text_for_nlp(raw_text),
        "word_count": word_count,
        "caps_ratio": caps_ratio,
        "has_link": has_link,
        "detected_urls": detected_urls,
        "indicators": indicators,
        "heuristic_penalty": min(heuristic_penalty, 100),
        "recommendations": recommendations,
        "highlighted_spans": highlighted_spans,
        "feature_dict": {
            "text_length": text_len,
            "word_count": word_count,
            "caps_ratio": caps_ratio,
            "has_link": has_link,
            "shortened_url": shortened_in_sms,
            "has_urgency": has_urgency,
            "has_reward": has_reward,
            "has_banking": has_banking_risk,
            "has_delivery": has_delivery_risk,
            "has_otp_risk": has_otp_risk,
            "exclamation_count": exclamation_count,
            "dollar_count": dollar_count
        }
    }

