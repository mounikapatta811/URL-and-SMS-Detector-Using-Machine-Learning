"""
PhishGuard Application Launcher.
Performs pre-flight checks, starts the Uvicorn ASGI server, and prints connection details.
"""

import os
import sys
import uvicorn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database.db import init_db
from ml.predictor import get_url_model_bundle, get_sms_model_bundle

def preflight_check():
    print("=" * 65)
    print("  PHISHGUARD: INTELLIGENT PHISHING URL & SMS DETECTOR")
    print("=" * 65)
    print("[*] Checking SQLite Database schema...")
    init_db()
    print("    -> Database initialized & verified.")

    print("[*] Loading Machine Learning Models...")
    url_bundle = get_url_model_bundle()
    sms_bundle = get_sms_model_bundle()

    if url_bundle and "model" in url_bundle:
        print(f"    -> URL Model active: {url_bundle.get('model_name', 'RandomForest')}")
    else:
        print("    [!] Warning: URL model bundle missing. Heuristics fallback active.")

    if sms_bundle and "pipeline" in sms_bundle:
        print(f"    -> SMS Model active: {sms_bundle.get('model_name', 'TF-IDF + RandomForest')}")
    else:
        print("    [!] Warning: SMS model bundle missing. Heuristics fallback active.")

    print("\n[*] Application Ready.")
    print("    URL: http://127.0.0.1:8000")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    preflight_check()
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False, log_level="info")

