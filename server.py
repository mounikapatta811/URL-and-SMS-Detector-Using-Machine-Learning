"""
PhishGuard REST API & Web Application Server.
Powered by Starlette ASGI, Uvicorn, and Machine Learning pipelines.
"""

import os
import sys

# Ensure root package is in python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import json
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.responses import JSONResponse, HTMLResponse, Response, PlainTextResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from database.db import (
    init_db,
    insert_scan,
    get_scans,
    get_scan_by_id,
    delete_scan,
    clear_all_scans,
    get_statistics,
    export_scans_data
)
from ml.predictor import (
    predict_url,
    predict_sms,
    get_models_metadata
)

# Initialize database schema on startup
init_db()

STATIC_DIR = os.path.join(ROOT_DIR, "static")


# ==========================================
# API Handlers
# ==========================================

async def index(request):
    """Serves the main single page web application."""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(f.read())
    return HTMLResponse("<h1>PhishGuard Server Running. UI file missing.</h1>")


async def health_check(request):
    """Returns application and model health status."""
    return JSONResponse({
        "status": "healthy",
        "service": "PhishGuard Cybersecurity Engine",
        "version": "1.0.0",
        "models_active": True,
        "database": "SQLite connected"
    })


async def scan_url_endpoint(request):
    """
    POST /api/scan-url
    Body: {"url": "https://example.com"}
    Analyzes URL features, runs ML classification, and persists scan result.
    """
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    url_str = data.get("url", "").strip()
    if not url_str:
        return JSONResponse({"error": "Field 'url' is required"}, status_code=400)

    try:
        prediction = predict_url(url_str)
        # Store in database
        saved_scan = insert_scan(
            scan_type="url",
            input_content=prediction["input_content"],
            result=prediction["result"],
            risk_score=prediction["risk_score"],
            confidence=prediction["confidence"],
            model_name=prediction["model_name"],
            indicators=prediction["indicators"],
            explanation=prediction["explanation"],
            recommendations=prediction["recommendations"],
            features=prediction["features"]
        )
        prediction["id"] = saved_scan["id"]
        prediction["created_at"] = saved_scan["created_at"]
        return JSONResponse(prediction)
    except Exception as e:
        return JSONResponse({"error": f"URL analysis failed: {str(e)}"}, status_code=500)


async def scan_sms_endpoint(request):
    """
    POST /api/scan-sms
    Body: {"text": "URGENT: Your bank card..."}
    Preprocesses text with NLP, runs TF-IDF vectorization + ML model, and saves result.
    """
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "Invalid JSON body"}, status_code=400)

    text_str = data.get("text", "").strip()
    if not text_str:
        return JSONResponse({"error": "Field 'text' is required"}, status_code=400)

    try:
        prediction = predict_sms(text_str)
        # Store in database
        saved_scan = insert_scan(
            scan_type="sms",
            input_content=prediction["input_content"],
            result=prediction["result"],
            risk_score=prediction["risk_score"],
            confidence=prediction["confidence"],
            model_name=prediction["model_name"],
            indicators=prediction["indicators"],
            explanation=prediction["explanation"],
            recommendations=prediction["recommendations"],
            features=prediction["features"]
        )
        prediction["id"] = saved_scan["id"]
        prediction["created_at"] = saved_scan["created_at"]
        return JSONResponse(prediction)
    except Exception as e:
        return JSONResponse({"error": f"SMS analysis failed: {str(e)}"}, status_code=500)


async def get_history_endpoint(request):
    """
    GET /api/history?page=1&limit=20&type=url|sms|all&status=safe|phishing|all&search=...
    """
    params = request.query_params
    page = max(int(params.get("page", 1)), 1)
    limit = min(max(int(params.get("limit", 20)), 1), 100)
    offset = (page - 1) * limit

    scan_type = params.get("type", "all")
    result_filter = params.get("status", "all")
    search = params.get("search", "")

    history_data = get_scans(
        limit=limit,
        offset=offset,
        scan_type=scan_type,
        result=result_filter,
        search=search
    )
    history_data["page"] = page
    history_data["total_pages"] = (history_data["total"] + limit - 1) // limit if limit else 1

    return JSONResponse(history_data)


async def get_single_scan_endpoint(request):
    """GET /api/history/{id}"""
    scan_id = int(request.path_params.get("id"))
    scan = get_scan_by_id(scan_id)
    if not scan:
        return JSONResponse({"error": "Scan record not found"}, status_code=404)
    return JSONResponse(scan)


async def delete_scan_endpoint(request):
    """DELETE /api/history/{id}"""
    scan_id = int(request.path_params.get("id"))
    success = delete_scan(scan_id)
    if not success:
        return JSONResponse({"error": "Scan record not found or already deleted"}, status_code=404)
    return JSONResponse({"success": True, "message": f"Scan #{scan_id} deleted successfully"})


async def clear_history_endpoint(request):
    """POST /api/history/clear"""
    deleted_count = clear_all_scans()
    return JSONResponse({
        "success": True,
        "message": f"All scan history cleared ({deleted_count} records removed)"
    })


async def get_stats_endpoint(request):
    """GET /api/stats"""
    stats = get_statistics()
    return JSONResponse(stats)


async def export_endpoint(request):
    """
    GET /api/export?format=json|csv
    """
    fmt = request.query_params.get("format", "json").lower()
    data = export_scans_data(fmt)
    if fmt == "csv":
        return Response(
            content=data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=phishguard_scans.csv"}
        )
    else:
        return Response(
            content=data,
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=phishguard_scans.json"}
        )


async def get_sample_data_endpoint(request):
    """GET /api/sample-data"""
    samples = {
        "urls": [
            {
                "title": "Apple ID Phishing (Subdomain Impersonation)",
                "category": "Brand Spoofing",
                "url": "https://appleid.apple.com.verify-login-update.xyz/account",
                "expected": "PHISHING",
                "desc": "Uses apple brand in multiple subdomains on an untrusted .xyz domain."
            },
            {
                "title": "Raw IP Host with Port & Login Trap",
                "category": "Credential Harvester",
                "url": "http://192.168.1.105:8080/paypal/login.php?cmd=_login-submit",
                "expected": "PHISHING",
                "desc": "Hosts an unencrypted credential form directly on a raw IP address."
            },
            {
                "title": "Chase Bank Security Masked Shortener",
                "category": "URL Shortener Bait",
                "url": "http://bit.ly/chase-urgent-verify-account",
                "expected": "PHISHING",
                "desc": "Hides target login destination behind a bit.ly link."
            },
            {
                "title": "Official GitHub Linux Repository",
                "category": "Safe Developer Resource",
                "url": "https://github.com/torvalds/linux",
                "expected": "SAFE",
                "desc": "Standard legitimate open source project repository with verified SSL."
            },
            {
                "title": "Official Wikipedia Computer Security",
                "category": "Safe Educational Site",
                "url": "https://en.wikipedia.org/wiki/Computer_security",
                "expected": "SAFE",
                "desc": "Official Wikipedia encyclopedia entry."
            },
            {
                "title": "Official Chase Banking Portal",
                "category": "Legitimate Bank",
                "url": "https://www.chase.com/personal/banking",
                "expected": "SAFE",
                "desc": "Authentic Chase banking home page."
            }
        ],
        "sms": [
            {
                "title": "Bank Account Suspension Threat",
                "category": "Financial Smishing",
                "text": "URGENT: Your Chase checking account has been temporarily locked due to suspicious activity. Verify identity within 24 hours at http://chase-secure-reactivate.xyz/login to restore access.",
                "expected": "PHISHING",
                "desc": "Manufactured panic + fake bank account lockout threat."
            },
            {
                "title": "Postal Package Delivery Redirection Fee",
                "category": "Delivery Scam",
                "text": "USPS Notice: Your package #US94829184 cannot be delivered due to an incorrect street address. Please update your details here: https://bit.ly/usps-redelivery-fee within 12h or package will be returned.",
                "expected": "PHISHING",
                "desc": "Pretext of failed package delivery with short link credit card fee trap."
            },
            {
                "title": "Fake $5,000 Retailer Lottery Prize",
                "category": "Prize Scam",
                "text": "Congratulations! You won $5,000 Walmart gift card in our customer appreciation draw. Claim your cash voucher today at http://walmart-winner-claim.club before midnight!",
                "expected": "PHISHING",
                "desc": "Unsolicited lottery reward promising cash prize voucher."
            },
            {
                "title": "Fraudulent OTP Code Solicitation",
                "category": "OTP Theft",
                "text": "Security Alert: Unauthorized transfer of $1,250.00 initiated. If you did not make this request, reply immediately with your 6-digit confirmation code to cancel.",
                "expected": "PHISHING",
                "desc": "Social engineering attempt to trick victim into sending their 2FA code."
            },
            {
                "title": "Legitimate Google 2FA Code",
                "category": "Legitimate Verification",
                "text": "Your Google verification code is 849201. Never share this code with anyone. We will never call or text asking for it.",
                "expected": "SAFE",
                "desc": "Standard automated two-factor passcode with security warning."
            },
            {
                "title": "Personal Conversational Text",
                "category": "Personal",
                "text": "Hi Mom, I will be home by 7 PM for dinner tonight. See you soon!",
                "expected": "SAFE",
                "desc": "Casual everyday communication without links or coercion."
            }
        ]
    }
    return JSONResponse(samples)


async def get_models_info_endpoint(request):
    """GET /api/models-info"""
    meta = get_models_metadata()
    return JSONResponse(meta)


# ==========================================
# Routes & Middleware
# ==========================================

routes = [
    Route("/", endpoint=index, methods=["GET"]),
    Route("/api/health", endpoint=health_check, methods=["GET"]),
    Route("/api/scan-url", endpoint=scan_url_endpoint, methods=["POST"]),
    Route("/api/scan-sms", endpoint=scan_sms_endpoint, methods=["POST"]),
    Route("/api/history", endpoint=get_history_endpoint, methods=["GET"]),
    Route("/api/history/clear", endpoint=clear_history_endpoint, methods=["POST"]),
    Route("/api/history/{id:int}", endpoint=get_single_scan_endpoint, methods=["GET"]),
    Route("/api/history/{id:int}", endpoint=delete_scan_endpoint, methods=["DELETE"]),
    Route("/api/stats", endpoint=get_stats_endpoint, methods=["GET"]),
    Route("/api/export", endpoint=export_endpoint, methods=["GET"]),
    Route("/api/sample-data", endpoint=get_sample_data_endpoint, methods=["GET"]),
    Route("/api/models-info", endpoint=get_models_info_endpoint, methods=["GET"]),
    Mount("/static", app=StaticFiles(directory=STATIC_DIR), name="static")
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

if __name__ == "__main__":
    print("=" * 60)
    print("  PHISHGUARD – CYBERSECURITY ML DETECTION SERVER")
    print("  Host: http://127.0.0.1:8000")
    print("=" * 60)
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)

