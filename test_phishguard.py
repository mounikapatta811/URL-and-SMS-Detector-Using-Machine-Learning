"""
Unit & Integration Test Suite for PhishGuard.
Tests feature extractors, NLP processors, ML predictors, and database persistence.
"""

import os
import sys
import unittest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.url_features import extract_url_features, calculate_entropy
from ml.sms_features import extract_sms_features, clean_text_for_nlp
from ml.predictor import predict_url, predict_sms, get_models_metadata
from database.db import (
    init_db,
    insert_scan,
    get_scans,
    get_scan_by_id,
    delete_scan,
    get_statistics,
    export_scans_data
)


class TestPhishGuard(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()

    # =======================================================
    # 1. URL Feature Extraction Tests
    # =======================================================
    def test_url_features_phishing_brand_spoof(self):
        url = "https://appleid.apple.com.verify-login-update.xyz/account"
        feat = extract_url_features(url)
        self.assertEqual(feat['tld'], 'xyz')
        self.assertGreaterEqual(feat['feature_dict']['num_subdomains'], 2)
        self.assertEqual(feat['brand_spoofed'], 'apple')
        self.assertGreater(feat['heuristic_penalty'], 30)

    def test_url_features_raw_ip(self):
        url = "http://192.168.1.105:8080/paypal/login.php"
        feat = extract_url_features(url)
        self.assertEqual(feat['feature_dict']['has_ip'], 1)
        self.assertEqual(feat['feature_dict']['has_non_standard_port'], 1)
        self.assertEqual(feat['feature_dict']['has_https'], 0)

    def test_url_features_safe_domain(self):
        url = "https://github.com/torvalds/linux"
        feat = extract_url_features(url)
        self.assertEqual(feat['hostname'], 'github.com')
        self.assertEqual(feat['feature_dict']['has_https'], 1)
        self.assertEqual(feat['feature_dict']['has_ip'], 0)
        self.assertIsNone(feat['brand_spoofed'])
        self.assertLess(feat['heuristic_penalty'], 20)

    def test_entropy_calculation(self):
        low_entropy = calculate_entropy("google.com")
        high_entropy = calculate_entropy("xk91823-asdiuq29381.top")
        self.assertGreater(high_entropy, low_entropy)

    # =======================================================
    # 2. SMS Feature Extraction & NLP Tests
    # =======================================================
    def test_sms_urgency_and_banking(self):
        text = "URGENT: Your Chase checking account has been temporarily locked due to suspicious activity. Verify identity within 24 hours at http://chase-secure-reactivate.xyz/login."
        feat = extract_sms_features(text)
        self.assertEqual(feat['feature_dict']['has_urgency'], 1)
        self.assertEqual(feat['feature_dict']['has_banking'], 1)
        self.assertEqual(feat['feature_dict']['has_link'], 1)
        self.assertGreater(feat['heuristic_penalty'], 40)

    def test_sms_fake_reward(self):
        text = "Congratulations! You won $5,000 Walmart gift card in our customer appreciation draw. Claim your cash voucher today at http://walmart-winner-claim.club"
        feat = extract_sms_features(text)
        self.assertEqual(feat['feature_dict']['has_reward'], 1)
        self.assertEqual(feat['feature_dict']['has_link'], 1)

    def test_sms_delivery_scam(self):
        text = "USPS Notice: Your package #US94829184 cannot be delivered due to an incorrect street address. Please update your details here: https://bit.ly/usps-redelivery-fee"
        feat = extract_sms_features(text)
        self.assertEqual(feat['feature_dict']['has_delivery'], 1)
        self.assertEqual(feat['feature_dict']['has_link'], 1)
        self.assertEqual(feat['feature_dict']['shortened_url'], 1)

    def test_sms_clean_legitimate(self):
        text = "Hi Mom, I will be home by 7 PM for dinner tonight. See you soon!"
        feat = extract_sms_features(text)
        self.assertEqual(feat['feature_dict']['has_link'], 0)
        self.assertEqual(feat['feature_dict']['has_urgency'], 0)
        self.assertEqual(feat['feature_dict']['has_banking'], 0)
        self.assertLess(feat['heuristic_penalty'], 20)

    # =======================================================
    # 3. Predictor End-to-End Classification Tests
    # =======================================================
    def test_predict_phishing_url(self):
        result = predict_url("http://192.168.1.1/wellsfargo/login.php")
        self.assertEqual(result['result'], 'PHISHING')
        self.assertGreaterEqual(result['risk_score'], 50.0)
        self.assertIn("indicators", result)
        self.assertTrue(len(result['indicators']) > 0)

    def test_predict_safe_url(self):
        result = predict_url("https://en.wikipedia.org/wiki/Computer_security")
        self.assertEqual(result['result'], 'SAFE')
        self.assertLess(result['risk_score'], 45.0)

    def test_predict_phishing_sms(self):
        result = predict_sms("URGENT: Your bank debit card is suspended. Call immediately or verify at http://bofa-verify.xyz")
        self.assertEqual(result['result'], 'PHISHING')
        self.assertGreaterEqual(result['risk_score'], 50.0)

    def test_predict_safe_sms(self):
        result = predict_sms("Your appointment with Dr. Johnson is confirmed for Wednesday at 2:00 PM.")
        self.assertEqual(result['result'], 'SAFE')
        self.assertLess(result['risk_score'], 45.0)

    # =======================================================
    # 4. Database Persistence Tests
    # =======================================================
    def test_db_insert_and_retrieve(self):
        scan = insert_scan(
            scan_type="url",
            input_content="https://test-cyber-domain.com",
            result="SAFE",
            risk_score=12.5,
            confidence=95.0,
            model_name="Test Model",
            indicators=[{"title": "Clean test", "severity": "Low", "desc": "OK"}],
            explanation="Test run",
            recommendations=["All safe"],
            features={"test": 1}
        )
        self.assertIsNotNone(scan.get("id"))
        retrieved = get_scan_by_id(scan["id"])
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved["input_content"], "https://test-cyber-domain.com")

        # Clean up
        deleted = delete_scan(scan["id"])
        self.assertTrue(deleted)

    def test_db_statistics(self):
        stats = get_statistics()
        self.assertIn("total_scans", stats)
        self.assertIn("threat_rate", stats)
        self.assertIn("phishing_count", stats)
        self.assertIn("safe_count", stats)

    def test_db_export(self):
        csv_data = export_scans_data("csv")
        self.assertIn("ID,Scan Type,Input Content", csv_data)
        json_data = export_scans_data("json")
        self.assertTrue(json_data.startswith("[") or json_data.startswith("{"))


if __name__ == "__main__":
    unittest.main()

