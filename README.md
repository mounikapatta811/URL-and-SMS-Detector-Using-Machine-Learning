# PhishGuard – Intelligent Phishing URL & SMS Detector Using Machine Learning

![PhishGuard Banner](https://img.shields.io/badge/Security-AI%20Powered-06B6D4?style=for-the-badge&logo=shield)
![Python Version](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Scikit--Learn-Random%20Forest%20%7C%20SVM%20%7C%20LR-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Frontend](https://img.shields.io/badge/React%2018-Tailwind%20CSS-61DAFB?style=for-the-badge&logo=react&logoColor=black)

**PhishGuard** is a full-stack, enterprise-grade cybersecurity web application that detects phishing URLs and fraudulent SMS messages (Smishing) in real-time using Machine Learning and Natural Language Processing (NLP). 

The platform analyzes suspicious links and text messages, identifies malicious attack vectors, classifies inputs as **SAFE** or **PHISHING**, calculates calibrated risk scores, and provides transparent, explainable reasoning to end-users and security analysts.

---

## 1. Key System Capabilities

### 🛡️ Phishing URL Detection Engine
- **22 Extracted Features**: Evaluates lexical, domain-level, host architecture, and reputation indicators:
  - Total URL length & domain length
  - Character frequencies: dots (`.`), hyphens (`-`), underscores (`_`), slashes (`/`), question marks (`?`), equals (`=`), ampersands (`&`), percents (`%`)
  - Redirection and credential traps: `@` character detection
  - Raw IP address hosting (IPv4/IPv6 instead of domain name)
  - Non-standard port exposure (e.g. `:8080`, `:8443`)
  - Subdomain stacking depth & brand impersonation in subdomains (e.g., `appleid.apple.com.verify-login.xyz`)
  - Shannon Entropy calculation for domain randomness and DGA detection
  - Top-Level Domain (TLD) risk evaluation (e.g., `.xyz`, `.top`, `.buzz`, `.club`, `.loan`)
  - URL shortener service detection (`bit.ly`, `tinyurl.com`, `t.co`, `is.gd`, `cutt.ly`, etc.)
  - Credential harvest keyword analysis (`login`, `verify`, `banking`, `secure`, `webscr`, `update`, `wallet`, `refund`, etc.)
- **Prediction Outputs**:
  - Binary classification: `SAFE URL` vs `PHISHING URL`
  - Calibrated Risk Score (0% – 100%) with visual radial gauge
  - Confidence Percentage (%)
  - Structured list of detected red flags with High/Medium/Low severity badges
  - AI-generated explanation detailing attack vectors
  - Actionable security advisory checklist

### 💬 SMS Smishing Detection Engine
- **NLP Preprocessing & Feature Extraction**:
  - Text normalization, tokenization, and regex heuristic extraction
  - **Emotional Coercion / Urgency detection**: `URGENT`, `immediately`, `account suspended`, `locked`, `within 24 hours`
  - **Financial / Banking bait**: Impersonations of Chase, Wells Fargo, BofA, Citi, PayPal, IRS
  - **Delivery / Courier scams**: Fake notifications from USPS, FedEx, UPS, DHL demanding redelivery fees
  - **Fake rewards & lotteries**: `$5,000 gift cards`, `congratulations you won`, `unclaimed vouchers`
  - **OTP / Credential harvesting**: Solicitations for 6-digit verification codes, passwords, or PINs
  - **Hyperlink traps**: Masked short links within text messages
  - **Linguistic aggression**: Excessive capitalization (Caps ratio) and currency symbol density
- **Interactive Visualizer**: Highlights detected threat tokens in red/amber with tooltips directly in the message viewer.

### 📊 Threat Analytics & Machine Learning Benchmarks
- **Model Comparison Suite**: Comparative evaluation across:
  - **Random Forest Classifier** (Primary production model)
  - **Logistic Regression**
  - **Support Vector Machine (SVM)**
- Evaluated on Accuracy, Precision, Recall, F1-Score, and 5-Fold Cross-Validation.
- Interactive Chart.js visualizations:
  - Threat distribution donut chart (Phishing vs Safe)
  - Volumetric timeline bar chart
  - Frequency distribution of top identified threat vectors

### 📜 SQLite Audit Trail & Scan History
- Comprehensive scan history table with full-text search, type filtering (`All`, `URL`, `SMS`), and result filtering (`All`, `Phishing`, `Safe`).
- Detailed modal inspector displaying all extracted feature attributes.
- Single-click record deletion and bulk purge.
- **Export Data**: Instant download of scan history as **CSV** or **JSON**.

### 🎓 Cybersecurity Knowledge Center
- Anatomical breakdown of phishing URLs and smishing lures.
- Interactive 3-question cyber awareness quiz with immediate explanations.
- Directory of official incident reporting channels (Carrier `7726`, APWG, FTC, CISA).

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Lucide SVG Icons, Chart.js, HTML5, CSS3 |
| **Backend API** | Python 3.11, Starlette ASGI, Uvicorn, RESTful architecture, CORS |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib, TF-IDF Vectorization, Random Forest, Logistic Regression, SVM |
| **Database** | SQLite3 (`phishguard.db`) with indexed queries |
| **Testing** | Python Unittest (15 comprehensive unit & integration tests) |

---

## 3. Project Structure

```
phishguard/
├── .venv/                      # Python virtual environment
├── data/
│   ├── url_training_data.csv   # Representative dataset of phishing and safe URLs
│   └── sms_training_data.csv   # Representative dataset of smishing and safe SMS
├── database/
│   ├── __init__.py
│   ├── db.py                   # SQLite schema, queries, analytics & demo seeding
│   └── phishguard.db           # SQLite database file
├── ml/
│   ├── __init__.py
│   ├── url_features.py         # 22-dimensional URL feature extraction & heuristics
│   ├── sms_features.py         # NLP text cleaner, token highlighter & heuristics
│   ├── train_models.py         # Model training, CV evaluation & serialization
│   ├── predictor.py            # Unified prediction engine & explainability generator
│   └── trained/
│       ├── url_model.joblib    # Serialized URL Random Forest model
│       ├── sms_model.joblib    # Serialized SMS TF-IDF + Random Forest model
│       └── model_metrics.json  # Benchmarks (RF vs LR vs SVM)
├── static/
│   ├── index.html              # Modern, responsive React SPA container
│   ├── css/
│   │   └── styles.css          # Cyber-glow, radar animations, scanline effects
│   └── js/
│       └── app.js              # React components (Dashboard, URL, SMS, History, Analytics, Guide)
├── server.py                   # Starlette ASGI REST API server
├── run.py                      # One-click launcher with pre-flight diagnostics
├── test_phishguard.py          # Unit & integration test suite (15 tests)
├── requirements.txt            # Python dependencies
└── README.md                   # Complete documentation
```

---

## 4. Getting Started

### Prerequisites
- Python 3.11 installed.

### Installation & Launch

1. **Navigate to the Project Directory**:
   ```powershell
   cd "C:\Users\Ahamed Baig\.gemini\antigravity\scratch\phishguard"
   ```

2. **Run Pre-Flight Checks & Start Server**:
   ```powershell
   & ".\.venv\Scripts\python.exe" run.py
   ```
   Or via Uvicorn:
   ```powershell
   & ".\.venv\Scripts\uvicorn.exe" server:app --host 127.0.0.1 --port 8000
   ```

3. **Open in Browser**:
   Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** to access PhishGuard.

4. **Run Automated Test Suite**:
   ```powershell
   & ".\.venv\Scripts\python.exe" test_phishguard.py
   ```

---

## 5. REST API Documentation

### URL Analysis
- **`POST /api/scan-url`**
  - **Body**: `{"url": "https://appleid.apple.com.verify-login.xyz/account"}`
  - **Response**:
    ```json
    {
      "scan_type": "url",
      "input_content": "https://appleid.apple.com.verify-login.xyz/account",
      "result": "PHISHING",
      "risk_score": 96.5,
      "confidence": 98.2,
      "model_name": "Random Forest Classifier + Heuristic Calibrator",
      "indicators": [
        {
          "title": "Targeted Brand Impersonation (Apple)",
          "severity": "High",
          "desc": "Impersonates official brand 'apple' in subdomains."
        }
      ],
      "explanation": "The URL 'appleid.apple.com.verify-login.xyz' has been classified as a high-risk PHISHING attack vector...",
      "recommendations": [
        "DO NOT enter any passwords, payment details, or personal information on this page.",
        "Close the browser tab immediately and avoid downloading any files."
      ],
      "features": {
        "url_length": 58,
        "num_subdomains": 3,
        "has_https": 1,
        "has_ip": 0,
        "entropy": 4.12
      }
    }
    ```

### SMS Analysis
- **`POST /api/scan-sms`**
  - **Body**: `{"text": "URGENT: Your Chase checking account is locked. Verify at http://bit.ly/chase-fix"}`
  - **Response**:
    ```json
    {
      "scan_type": "sms",
      "result": "PHISHING",
      "risk_score": 98.1,
      "confidence": 99.0,
      "model_name": "TF-IDF + Random Forest Classifier + NLP Behavioral Calibrator",
      "highlighted_spans": [
        {"start": 0, "end": 6, "text": "URGENT", "type": "threat"},
        {"start": 63, "end": 88, "text": "http://bit.ly/chase-fix", "type": "link"}
      ]
    }
    ```

### Additional Endpoints
- `GET /api/history?page=1&limit=20&type=url&status=phishing&search=apple`
- `GET /api/history/{id}`
- `DELETE /api/history/{id}`
- `POST /api/history/clear`
- `GET /api/stats`
- `GET /api/export?format=csv` (or `format=json`)
- `GET /api/sample-data`
- `GET /api/models-info`
- `GET /api/health`

---

## 6. Defensive Security Tips

1. **Check the Registered Domain**: In a URL like `paypal.com.verify-user.top`, the true domain is `verify-user.top`. Everything before it is a subdomain crafted by the attacker.
2. **Never Share OTPs**: Legitimate banks will never send an SMS requesting that you reply with your 6-digit one-time passcode.
3. **Be Wary of Package Delivery Links**: Scammers use fake USPS/FedEx redelivery notices with shortened URLs (`bit.ly`, `tinyurl`) to steal credit card information.
4. **Report Threats**: Forward suspicious SMS to **7726 (SPAM)** and phishing emails to **reportphishing@apwg.org**.

