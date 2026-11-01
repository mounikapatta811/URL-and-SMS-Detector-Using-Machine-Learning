"""
Machine Learning Training Module for PhishGuard.
Generates balanced, representative datasets for URLs and SMS,
trains and benchmarks Random Forest, Logistic Regression, and SVM classifiers,
and serializes the production models with performance metrics.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from ml.url_features import extract_url_features
from ml.sms_features import extract_sms_features, clean_text_for_nlp

DATA_DIR = os.path.join(BASE_DIR, "data")
TRAINED_DIR = os.path.join(BASE_DIR, "ml", "trained")


def build_url_dataset() -> pd.DataFrame:
    """Builds a rich, balanced dataset of real-world phishing and legitimate URLs."""
    phishing_urls = [
        # IP based
        "http://192.168.1.100/paypal-login",
        "http://104.244.42.1/update-account/bank",
        "http://45.33.32.156:8080/secure/chase-auth.html",
        "http://185.190.140.22/apple-id-suspended/login",
        "http://198.51.100.44:443/bofa-verification/index.php",
        "http://203.0.113.88/metamask-wallet-recover",
        "http://172.56.21.90:8000/binance-verify-session",
        "http://192.0.2.146/wellsfargo/signon.jsp",
        # Brand Spoofing in Subdomains
        "https://appleid.apple.com.verify-account.top/login",
        "http://paypal.com.account-update.xyz/webscr?cmd=_login",
        "https://chase.online-security-banking.xyz/auth/verify",
        "http://netflix.account-billing-update.club/signin",
        "http://amazon.com.order-suspended.buzz/ap/signin",
        "https://microsoft.online-office-update.work/login.aspx",
        "http://bankofamerica.secure-mobile-logon.xyz/signon",
        "http://wellsfargo.com.security-alert.loan/login",
        "http://google.com.accounts-verification.tk/ServiceLogin",
        "https://instagram.security-badge-verification.top/confirm",
        "http://facebook.security-policy-violation.xyz/checkpoint",
        "https://dhl.parcel-customs-fee.club/tracking",
        "http://usps.address-reconfirmation.xyz/redelivery",
        "https://fedex.shipment-tracking-update.top/delivery",
        "http://coinbase.wallet-authorization.work/signin",
        "https://binance.security-kyc-update.xyz/user/login",
        "http://citibank.online-access-reactivate.buzz/banking",
        "https://dropbox.file-share-viewer.club/download/doc",
        "http://whatsapp.account-web-verify.xyz/auth",
        "https://yahoo.mail-server-security-upgrade.top/login",
        "http://outlook.365-password-reset.loan/owa",
        # Shortened Phishing URLs
        "http://bit.ly/chase-urgent-verify-account",
        "https://tinyurl.com/paypal-dispute-resolve",
        "http://t.co/claim-free-iphone-bonus",
        "https://is.gd/wells-fargo-alert-update",
        "http://buff.ly/netflix-billing-issue",
        "https://cutt.ly/bank-card-unlock-now",
        "http://rb.gy/usps-package-confirm",
        "https://shorturl.at/secure-login-apple",
        # Obfuscation & Redirection
        "http://google.com@phishing-credential-trap.com/login",
        "http://paypal.com@verify-account-user.xyz/secure",
        "https://microsoft.com@cloud-identity-login.top/auth",
        "http://bankofamerica.com@login-gateway-secure.club/session",
        # High Abuse TLDs & Phishing Keywords
        "https://secure-login-account-update.xyz/verify",
        "http://banking-security-authentication.top/portal",
        "https://wallet-metamask-recovery-seed.club/phrase",
        "http://claim-free-crypto-giveaway.buzz/bonus",
        "https://irs-tax-refund-direct-deposit.work/claim",
        "http://emergency-account-unlock-service.top/auth",
        "https://ebays-safety-protection-center.xyz/signin",
        "http://apple-support-device-locked.club/findmy",
        "https://steam-free-skins-giveaway.loan/login",
        "http://discord-nitro-free-gift-claim.xyz/nitro",
        "https://verify-id-card-social-security.top/form",
        "http://zoom-meeting-security-patch-download.xyz/install",
        "https://docusign-confidential-document-access.top/sign",
        "http://covid19-relief-stimulus-payment.xyz/apply",
        # Excessive Subdomains & Long URLs
        "http://secure.account.billing.verification.portal.chase-login.xyz/update?user=auth&token=928374",
        "https://portal.service.auth.appleid.apple.com.manage-login.top/account/verify",
        "http://www.login.paypal.com.webscr.cmd.login.submit.session.xyz/cgi-bin/webscr",
        "https://online.banking.wellsfargo.verify.identity.security.top/auth?token=auth92837",
        "http://support.account.microsoft.com.office365.authentication.club/login.html",
        # DGA Randomness
        "http://xk91823-asdiuq29381-phishsite.top/login.php",
        "https://a8z9q1m2k3j4l5-verify-banking.xyz/session",
        "http://qwertyuiop123456789-secure-auth.club/portal",
        "https://zxcvbnm0987654321-update-card.buzz/signon",
        # Additional Diverse Phishing Patterns
        "http://chase-bank-verify-phone-number.xyz/sms",
        "https://bofa-card-replacement-request.top/debit",
        "http://update-billing-information-netflix.buzz/plan",
        "https://amazon-prime-membership-cancelled.club/renew",
        "http://walmart-survey-1000-giftcard.work/claim",
        "https://target-shopper-rewards-coupon.xyz/voucher",
        "http://usps-redelivery-tracking-fee.top/pay",
        "https://dhl-express-customs-clearance.buzz/parcel",
        "http://fedex-scheduled-delivery-notice.club/track",
        "https://ups-ground-shipping-failed.loan/address",
        "http://at-t-mobile-bill-credit-refund.xyz/refund",
        "https://verizon-wireless-free-upgrade.top/claim",
        "http://t-mobile-security-account-pin.buzz/verify",
        "https://robinhood-crypto-trading-freeze.club/unlock",
        "http://coinbase-pro-security-lockout.work/support",
        "https://kraken-exchange-kyc-reverification.top/id",
        "http://pancakeswap-airdrop-token-bonus.xyz/claim",
        "https://opensea-nft-free-mint-giveaway.club/connect",
        "http://facebook-meta-copyright-strike.buzz/appeal",
        "https://instagram-influencer-badge-request.xyz/apply",
        "http://twitter-x-premium-refund-portal.top/login",
        "https://linkedin-job-interview-confirmation.club/docs",
        "http://github-security-vulnerability-alert.work/repo",
        "https://gitlab-account-verification-token.xyz/auth",
        "http://heroku-database-maintenance-login.top/app",
        "https://aws-cloud-billing-overdue-notice.buzz/pay",
        "http://azure-microsoft-subscription-expired.xyz/renew",
        "https://google-drive-shared-invoice-pdf.club/file",
        "http://adobe-creative-cloud-license-cancel.top/billing",
        "https://zoom-webinar-speaker-registration.work/join"
    ]

    safe_urls = [
        # Search & Tech Giants
        "https://www.google.com/search?q=cybersecurity+best+practices",
        "https://www.google.com/maps/place/New+York",
        "https://www.google.com/drive/",
        "https://mail.google.com/mail/u/0/#inbox",
        "https://accounts.google.com/signin/v2/identifier",
        "https://github.com/torvalds/linux",
        "https://github.com/microsoft/vscode",
        "https://github.com/python/cpython",
        "https://github.com/facebook/react",
        "https://github.com/pallets/flask",
        "https://github.com/scikit-learn/scikit-learn",
        "https://www.microsoft.com/en-us/windows",
        "https://www.microsoft.com/en-us/microsoft-365",
        "https://azure.microsoft.com/en-us/services/devops/",
        "https://apple.com/iphone-16-pro/specs/",
        "https://support.apple.com/en-us/HT201222",
        "https://developer.apple.com/documentation/",
        "https://amazon.com/dp/B08N5WRWNW",
        "https://amazon.com/gp/help/customer/display.html",
        "https://aws.amazon.com/ec2/",
        "https://aws.amazon.com/s3/",
        # Reference & Knowledge
        "https://en.wikipedia.org/wiki/Computer_security",
        "https://en.wikipedia.org/wiki/Phishing",
        "https://en.wikipedia.org/wiki/Machine_learning",
        "https://en.wikipedia.org/wiki/Support_vector_machine",
        "https://en.wikipedia.org/wiki/Random_forest",
        "https://en.wikipedia.org/wiki/Internet_Protocol",
        "https://stackoverflow.com/questions/50050550/python-feature-extraction",
        "https://stackoverflow.com/questions/tagged/machine-learning",
        "https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
        "https://docs.python.org/3/library/urllib.parse.html",
        "https://docs.python.org/3/tutorial/index.html",
        "https://pypi.org/project/scikit-learn/",
        "https://pypi.org/project/pandas/",
        "https://pypi.org/project/starlette/",
        # News & Media
        "https://www.nytimes.com/section/technology",
        "https://www.bbc.com/news/technology",
        "https://www.theverge.com/tech",
        "https://techcrunch.com/category/startups/",
        "https://www.wired.com/category/security/",
        "https://arstechnica.com/information-technology/",
        "https://www.reuters.com/technology/",
        "https://www.bloomberg.com/technology",
        "https://www.theguardian.com/technology",
        "https://www.wsj.com/news/technology",
        # Education & Government
        "https://www.cisa.gov/resources-tools/all-resources",
        "https://www.cisa.gov/news-events/cybersecurity-advisories",
        "https://www.nist.gov/cyberframework",
        "https://www.fbi.gov/investigate/cyber",
        "https://www.ftc.gov/business-guidance/privacy-security",
        "https://www.mit.edu/research/",
        "https://www.stanford.edu/academics/",
        "https://www.harvard.edu/programs/computer-science/",
        "https://www.ox.ac.uk/admissions/undergraduate",
        "https://www.berkeley.edu/academics/",
        "https://www.cmu.edu/cymer/research/index.html",
        "https://www.loc.gov/collections/",
        "https://www.nasa.gov/missions/",
        "https://www.cdc.gov/flu/about/index.html",
        "https://www.noaa.gov/weather",
        # Banking & Enterprise (Official Verified)
        "https://www.chase.com/personal/banking",
        "https://www.chase.com/personal/credit-cards",
        "https://www.bankofamerica.com/deposits/checking-accounts/",
        "https://www.wellsfargo.com/personal-credit-cards/",
        "https://www.citigroup.com/global/investors",
        "https://www.paypal.com/us/home",
        "https://www.paypal.com/us/webapps/mpp/security/buyer-protection",
        "https://stripe.com/docs/api",
        "https://www.visa.com/content/dam/VCOM/global/support-legal/documents/visa-card-security.pdf",
        "https://www.mastercard.us/en-us/personal/get-support.html",
        # Services & Logistics
        "https://www.usps.com/manage/",
        "https://tools.usps.com/go/TrackConfirmAction_input",
        "https://www.fedex.com/en-us/tracking.html",
        "https://www.dhl.com/global-en/home/tracking.html",
        "https://www.ups.com/track",
        "https://www.linkedin.com/feed/",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.netflix.com/browse",
        "https://www.spotify.com/us/premium/",
        "https://www.reddit.com/r/cybersecurity/",
        "https://twitter.com/explore",
        "https://www.imdb.com/chart/top/",
        "https://www.kaggle.com/datasets",
        "https://huggingface.co/models",
        "https://medium.com/tag/machine-learning",
        "https://sublimehq.com/text",
        "https://code.visualstudio.com/docs",
        "https://slack.com/help/categories/getting-started",
        "https://zoom.us/pricing",
        "https://discord.com/terms"
    ]

    data = []
    for u in phishing_urls:
        data.append({"url": u, "label": 1})  # 1 = Phishing
    for u in safe_urls:
        data.append({"url": u, "label": 0})  # 0 = Safe

    df = pd.DataFrame(data)
    os.makedirs(DATA_DIR, exist_ok=True)
    csv_path = os.path.join(DATA_DIR, "url_training_data.csv")
    df.to_csv(csv_path, index=False)
    print(f"URL dataset created at {csv_path} with {len(df)} samples.")
    return df


def build_sms_dataset() -> pd.DataFrame:
    """Builds a rich, balanced dataset of real-world phishing (smishing) and safe SMS."""
    phishing_sms = [
        # Banking Smishing
        "URGENT: Your Chase checking account has been temporarily locked due to suspicious activity. Verify identity within 24 hours at http://chase-secure-reactivate.xyz/login to restore access.",
        "Wells Fargo Alert: Unusual debit card activity detected on card ending in 4921. Text YES to verify or click http://wellsfargo-fraud-verify.top immediately to freeze card.",
        "Bank of America: Your direct deposit of $2,450.00 is on hold due to missing SSN details. Confirm your account details at http://bofa-verify-deposit.xyz",
        "Citi Security Alert: Your debit card was charged $849.20 at Walmart. If this was not you, unlock your fraud protection at http://citi-dispute-charge.club",
        "PayPal Security: We detected an unauthorized login to your account from Russia. If this wasn't you, secure your account now: http://bit.ly/paypal-secure-check",
        "Security Alert: Your PNC bank card has been suspended due to 3 incorrect PIN entries. Reactivate your access immediately: http://pnc-card-reactivate.buzz",
        "Capital One: Fraud department placed a hold on your card. Call us now or resolve online at http://capitalone-fraud-clear.top",
        # Delivery & Postal Smishing
        "USPS Notice: Your package #US94829184 cannot be delivered due to an incorrect street address. Please update your details here: https://bit.ly/usps-redelivery-fee within 12h or package will be returned.",
        "FedEx: We attempted delivery for parcel 78291048. Nobody was available to sign. Reschedule delivery here: http://fedex-parcel-reschedule.xyz",
        "DHL Express: Your shipment has arrived at our sorting facility but is pending a customs tax payment of $2.40. Pay online at http://dhl-tax-clearance.top",
        "UPS Tracking: Final warning regarding your parcel #UPS-8291. Reschedule delivery today at http://ups-parcel-claim.buzz or item will be discarded.",
        "Postal Service: Delivery failed for package ending in 904. Reconfirm your residential address at http://postal-redelivery-update.club",
        # Fake Rewards & Lotteries
        "Congratulations! You won $5,000 Walmart gift card in our customer appreciation draw. Claim your cash voucher today at http://walmart-winner-claim.club",
        "Amazon Winner: You have been chosen as our 1st place shopper for a free iPhone 15 Pro Max. Claim your reward here before midnight: http://t.co/claim-free-iphone",
        "FREE REWARD: You have $1,250 in unclaimed rewards points expiring tonight. Cash them in now at http://reward-points-cashout.xyz",
        "Dear Customer, you were selected to receive a $500 Target shopping spree voucher. Fill out the claim form at http://target-voucher-gift.top",
        "Congrats! You won 2nd prize in the National Lottery Draw worth $10,000. Text WIN to 58291 or claim at http://national-lottery-winner.buzz",
        # Account Suspensions & Urgency
        "Netflix: Your monthly subscription payment failed. Your account will be terminated within 24 hours. Update your credit card at http://netflix-billing-resolve.top",
        "Apple Support: Your iCloud storage has exceeded limit and photos will be deleted in 48 hours. Upgrade or verify at http://appleid-cloud-resolve.xyz",
        "Microsoft Account Alert: Someone in China accessed your email account. Verify your identity immediately at http://microsoft-verify-account.top",
        "AT&T Alert: Your mobile line is scheduled for disconnection due to an overdue bill of $184.20. Pay immediately at http://att-pay-restore.club",
        "WhatsApp: Your account will be deactivated unless you confirm your phone number at http://whatsapp-verify-user.xyz",
        # Credential & OTP Harvesting
        "Chase Fraud Alert: Did you attempt a transfer of $1,200.00? If NO, reply with the 6-digit OTP passcode we just texted you to cancel it.",
        "Google Security: Unauthorized login attempt detected from IP 192.88.21.1. Send us your 6-digit verification code to protect your account.",
        "Bank Alert: To cancel unauthorized wire transfer of $3,500 to Coinbase, provide your debit card PIN and one-time password.",
        "Facebook Support: Your business page has copyright strikes. Submit your login email and password at http://facebook-meta-appeal.top to prevent deletion.",
        # Government & Tax Smishing
        "IRS Department: You are eligible for an overdue tax refund of $1,840.50. Submit your direct deposit bank account at http://irs-tax-refund-claim.work",
        "DMV Alert: You have an unpaid toll ticket of $65.40 from last week. Pay within 24h to avoid driver license suspension: http://dmv-toll-pay.buzz",
        "Social Security Notice: Your SSN has been flagged for fraudulent activity. Call 800-555-0199 or verify your SSN at http://ssa-verify-portal.xyz",
        "Medicare Update: You are eligible for the new 2026 Medicare rebate check of $900. Verify your Medicare number at http://medicare-rebate-direct.top"
    ]

    safe_sms = [
        # Legitimate 2FA & Verification codes
        "Your Google verification code is 849201. Never share this code with anyone. We will never call or text asking for it.",
        "492019 is your Microsoft authentication code. If you didn't request this, ignore this message.",
        "Your Uber verification code is 3819. Never share this code with anyone.",
        "Your Twitter confirmation code is 819203. It will expire in 10 minutes.",
        "Your WhatsApp code: 928-104. You can also tap on this link to verify your phone: v.whatsapp.com/928104",
        "Instagram security code: 472910. Enter this code to reset your password.",
        "Chase Fraud Alert: Did you spend $24.50 at Trader Joe's? Reply YES if this was you, or NO if unauthorized.",
        "Bank of America Alert: Your scheduled payment of $120.00 to Electric Co has processed successfully.",
        "Wells Fargo: A deposit of $1,850.00 was posted to your checking account on 11/01. Available balance: $3,420.50.",
        # Personal & Conversational Messages
        "Hi Mom, I will be home by 7 PM for dinner tonight. See you soon!",
        "Can you pick up milk, bread, and eggs on your way back from the grocery store?",
        "Hey! Are we still on for lunch tomorrow at 12:30 at the Italian place?",
        "Happy Birthday! Hope you have a fantastic day celebrating with family and friends!",
        "Thanks for helping me with the project today, really appreciate your feedback.",
        "The flight landed safely in Chicago. Heading to baggage claim now.",
        "Good morning team, reminder that our sprint planning meeting starts at 10 AM today.",
        "I sent you the updated PDF report over email. Let me know if you need any adjustments.",
        "Running about 10 minutes late due to traffic on the highway. Sorry about that!",
        "Let me know when you get home so I know you made it safely.",
        # Legitimate Reminders & Updates
        "Your appointment with Dr. Johnson is confirmed for Wednesday, Nov 4 at 2:00 PM. Reply C to confirm or call 555-0144 to reschedule.",
        "Your table for 4 at Blue Harbor Bistro is ready. Please proceed to the host stand.",
        "Walgreens Pharmacy: Your prescription #482910 is ready for pickup at Main Street. Text STOP to opt out.",
        "Your haircut appointment at Salon 42 is scheduled for Saturday at 11:30 AM with Sarah.",
        "Delta flight DL482 to Atlanta is on schedule. Gate B14. Boarding begins at 3:45 PM.",
        "Your library books are due back in 3 days: Clean Code and Python Crash Course. Visit library.city.gov to renew.",
        "Domino's Tracker: Order #92 is out for delivery with driver Mike. Enjoy your meal!",
        "Amazon: Your order #114-8291 has been delivered to your front porch.",
        "Your car service maintenance at Honda City is complete and ready for pickup.",
        "School Notification: High school classes will dismiss 1 hour early tomorrow for teacher conferences."
    ]

    data = []
    for s in phishing_sms:
        data.append({"text": s, "label": 1})  # 1 = Phishing/Smishing
    for s in safe_sms:
        data.append({"text": s, "label": 0})  # 0 = Safe

    df = pd.DataFrame(data)
    os.makedirs(DATA_DIR, exist_ok=True)
    csv_path = os.path.join(DATA_DIR, "sms_training_data.csv")
    df.to_csv(csv_path, index=False)
    print(f"SMS dataset created at {csv_path} with {len(df)} samples.")
    return df


def train_and_evaluate_models():
    """Trains URL and SMS classifiers, benchmarks them, and saves models & metrics."""
    os.makedirs(TRAINED_DIR, exist_ok=True)
    metrics_summary = {}

    # ==========================
    # 1. URL Model Training
    # ==========================
    print("\n--- Training URL Detection Models ---")
    url_df = build_url_dataset()

    X_url = []
    y_url = url_df['label'].values

    for url_str in url_df['url']:
        features = extract_url_features(url_str)
        X_url.append(features['feature_vector'])

    X_url = np.array(X_url)

    X_train_u, X_test_u, y_train_u, y_test_u = train_test_split(
        X_url, y_url, test_size=0.25, random_state=42, stratify=y_url
    )

    # Models to benchmark
    url_candidate_models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42),
        "Logistic Regression": Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, random_state=42))
        ]),
        "Support Vector Machine (SVM)": Pipeline([
            ('scaler', StandardScaler()),
            ('clf', SVC(kernel='rbf', probability=True, random_state=42))
        ])
    }

    url_benchmarks = {}
    best_url_model_name = "Random Forest"
    best_url_f1 = -1
    best_url_pipeline = None

    for name, model in url_candidate_models.items():
        model.fit(X_train_u, y_train_u)
        y_pred = model.predict(X_test_u)

        acc = float(accuracy_score(y_test_u, y_pred))
        prec = float(precision_score(y_test_u, y_pred, zero_division=0))
        rec = float(recall_score(y_test_u, y_pred, zero_division=0))
        f1 = float(f1_score(y_test_u, y_pred, zero_division=0))
        cm = confusion_matrix(y_test_u, y_pred).tolist()

        cv_scores = cross_val_score(model, X_url, y_url, cv=5, scoring='f1')

        url_benchmarks[name] = {
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "cv_mean": round(float(np.mean(cv_scores)) * 100, 2),
            "confusion_matrix": cm
        }
        print(f"URL [{name}] Acc: {acc:.3f}, F1: {f1:.3f}")

        if f1 > best_url_f1 or (f1 == best_url_f1 and name == "Random Forest"):
            best_url_f1 = f1
            best_url_model_name = name
            best_url_pipeline = model

    # Save best URL model
    url_model_path = os.path.join(TRAINED_DIR, "url_model.joblib")
    joblib.dump({
        "model": best_url_pipeline,
        "model_name": best_url_model_name,
        "feature_names": [
            "url_length", "num_dots", "num_hyphens", "num_underscores", "num_slashes",
            "num_question", "num_equal", "num_at", "num_percent", "num_digits",
            "num_special_chars", "digit_ratio", "has_https", "has_ip", "num_subdomains",
            "is_suspicious_tld", "is_shortened", "has_non_standard_port", "keyword_count",
            "has_brand_spoof", "entropy", "hostname_length"
        ]
    }, url_model_path)
    print(f"Best URL Model ({best_url_model_name}) saved to {url_model_path}")

    metrics_summary["url_models"] = {
        "best_model": best_url_model_name,
        "benchmarks": url_benchmarks
    }

    # ==========================
    # 2. SMS Model Training
    # ==========================
    print("\n--- Training SMS Detection Models ---")
    sms_df = build_sms_dataset()

    cleaned_texts = [clean_text_for_nlp(t) for t in sms_df['text']]
    y_sms = sms_df['label'].values

    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(
        cleaned_texts, y_sms, test_size=0.25, random_state=42, stratify=y_sms
    )

    sms_candidate_pipelines = {
        "Random Forest": Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=2500, sublinear_tf=True)),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
        ]),
        "Logistic Regression": Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=2500, sublinear_tf=True)),
            ('clf', LogisticRegression(max_iter=1000, C=1.5, random_state=42))
        ]),
        "Support Vector Machine (SVM)": Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=2500, sublinear_tf=True)),
            ('clf', SVC(kernel='linear', probability=True, random_state=42))
        ])
    }

    sms_benchmarks = {}
    best_sms_model_name = "Logistic Regression"
    best_sms_f1 = -1
    best_sms_pipeline = None

    for name, pipeline in sms_candidate_pipelines.items():
        pipeline.fit(X_train_s, y_train_s)
        y_pred = pipeline.predict(X_test_s)

        acc = float(accuracy_score(y_test_s, y_pred))
        prec = float(precision_score(y_test_s, y_pred, zero_division=0))
        rec = float(recall_score(y_test_s, y_pred, zero_division=0))
        f1 = float(f1_score(y_test_s, y_pred, zero_division=0))
        cm = confusion_matrix(y_test_s, y_pred).tolist()

        cv_scores = cross_val_score(pipeline, cleaned_texts, y_sms, cv=5, scoring='f1')

        sms_benchmarks[name] = {
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "cv_mean": round(float(np.mean(cv_scores)) * 100, 2),
            "confusion_matrix": cm
        }
        print(f"SMS [{name}] Acc: {acc:.3f}, F1: {f1:.3f}")

        if f1 > best_sms_f1 or (f1 == best_sms_f1 and name == "Logistic Regression"):
            best_sms_f1 = f1
            best_sms_model_name = name
            best_sms_pipeline = pipeline

    # Save best SMS model
    sms_model_path = os.path.join(TRAINED_DIR, "sms_model.joblib")
    joblib.dump({
        "pipeline": best_sms_pipeline,
        "model_name": best_sms_model_name
    }, sms_model_path)
    print(f"Best SMS Model ({best_sms_model_name}) saved to {sms_model_path}")

    metrics_summary["sms_models"] = {
        "best_model": best_sms_model_name,
        "benchmarks": sms_benchmarks
    }

    # Save Metrics File
    metrics_path = os.path.join(TRAINED_DIR, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_summary, f, indent=2)
    print(f"Model benchmark metrics saved to {metrics_path}")

    return metrics_summary


if __name__ == "__main__":
    train_and_evaluate_models()
