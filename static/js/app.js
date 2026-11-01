// PhishGuard Full-Stack React Application
const { useState, useEffect, useRef, useMemo } = React;

// =========================================================================
// SVG Lucide-Style Cyber Icons
// =========================================================================
const IconShield = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const IconShieldAlert = ({ className = "w-5 h-5 text-red-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);

const IconShieldCheck = ({ className = "w-5 h-5 text-emerald-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
    </svg>
);

const IconGlobe = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

const IconMessageSquare = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const IconActivity = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
);

const IconHistory = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 14 14"/>
    </svg>
);

const IconBarChart = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
);

const IconInfo = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
);

const IconAlertTriangle = ({ className = "w-5 h-5 text-amber-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const IconTrash = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

const IconDownload = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const IconCopy = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
);

const IconCheck = ({ className = "w-4 h-4 text-emerald-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const IconRefresh = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
);

const IconLock = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const IconZap = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);

// =========================================================================
// Circular Risk Meter Component
// =========================================================================
function RiskGauge({ score, size = 130, strokeWidth = 10 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    let color = "#10B981"; // Emerald
    let glow = "rgba(16, 185, 129, 0.4)";
    let label = "LOW RISK";

    if (score >= 70) {
        color = "#EF4444"; // Crimson
        glow = "rgba(239, 68, 68, 0.5)";
        label = "CRITICAL";
    } else if (score >= 45) {
        color = "#F59E0B"; // Amber
        glow = "rgba(245, 158, 11, 0.4)";
        label = "ELEVATED";
    }

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#1E293B"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease",
                        filter: `drop-shadow(0 0 8px ${glow})`
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-mono tracking-tight" style={{ color }}>
                    {score}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    {label}
                </span>
            </div>
        </div>
    );
}

// =========================================================================
// Main App Component
// =========================================================================
function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [sampleData, setSampleData] = useState({ urls: [], sms: [] });
    const [modelsInfo, setModelsInfo] = useState(null);
    const [serverConnected, setServerConnected] = useState(true);
    const [toast, setToast] = useState(null);

    // Initial Data Fetch
    const fetchGlobalData = async () => {
        try {
            const [statsRes, samplesRes, modelsRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/sample-data'),
                fetch('/api/models-info')
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (samplesRes.ok) setSampleData(await samplesRes.json());
            if (modelsRes.ok) setModelsInfo(await modelsRes.json());
            setServerConnected(true);
        } catch (err) {
            console.error("API Fetch Error:", err);
            setServerConnected(false);
        }
    };

    useEffect(() => {
        fetchGlobalData();
        const interval = setInterval(fetchGlobalData, 30000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            {/* Header & Navbar */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                            <IconShield className="w-6 h-6 animate-pulse" />
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950"></div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                                    PHISHGUARD
                                </span>
                                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                                    ML v1.0
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono tracking-wider hidden sm:block">
                                Intelligent Phishing URL & SMS Threat Detector
                            </p>
                        </div>
                    </div>

                    {/* Navigation Pills */}
                    <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: IconActivity },
                            { id: 'url', label: 'URL Scanner', icon: IconGlobe },
                            { id: 'sms', label: 'SMS Scanner', icon: IconMessageSquare },
                            { id: 'history', label: 'Scan History', icon: IconHistory },
                            { id: 'analytics', label: 'Threat Analytics', icon: IconBarChart },
                            { id: 'advisor', label: 'Security Guide', icon: IconInfo },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = currentTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setCurrentTab(tab.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-150 ${
                                        isActive
                                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20 font-semibold'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Live Server Indicator */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
                            <span className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`}></span>
                            <span className={serverConnected ? 'text-emerald-400' : 'text-red-400'}>
                                {serverConnected ? 'SYSTEM ACTIVE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation bar */}
                <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-900 bg-slate-950">
                    {[
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'url', label: 'URL Scanner' },
                        { id: 'sms', label: 'SMS Scanner' },
                        { id: 'history', label: 'History' },
                        { id: 'analytics', label: 'Analytics' },
                        { id: 'advisor', label: 'Guide' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
                                currentTab === tab.id
                                    ? 'bg-cyan-500 text-black font-bold'
                                    : 'text-slate-400 bg-slate-900 border border-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-sm font-mono text-cyan-300 animate-bounce">
                    <IconZap className="w-4 h-4 text-cyan-400" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentTab === 'dashboard' && (
                    <DashboardView
                        stats={stats}
                        onNavigate={setCurrentTab}
                        sampleData={sampleData}
                        onRefresh={fetchGlobalData}
                    />
                )}
                {currentTab === 'url' && (
                    <UrlScannerView
                        samples={sampleData.urls || []}
                        onScanComplete={fetchGlobalData}
                        showToast={showToast}
                    />
                )}
                {currentTab === 'sms' && (
                    <SmsScannerView
                        samples={sampleData.sms || []}
                        onScanComplete={fetchGlobalData}
                        showToast={showToast}
                    />
                )}
                {currentTab === 'history' && (
                    <HistoryView
                        showToast={showToast}
                        onHistoryChange={fetchGlobalData}
                    />
                )}
                {currentTab === 'analytics' && (
                    <AnalyticsView
                        stats={stats}
                        modelsInfo={modelsInfo}
                        onRefresh={fetchGlobalData}
                    />
                )}
                {currentTab === 'advisor' && (
                    <SecurityGuideView onNavigate={setCurrentTab} />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
                    <div className="flex items-center space-x-2">
                        <IconShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>PhishGuard Neural Shield Engine &copy; 2026. Machine Learning Cybersecurity Suite.</span>
                    </div>
                    <div className="mt-3 sm:mt-0 flex space-x-6">
                        <span>Random Forest Classifier</span>
                        <span>TF-IDF NLP Vectorizer</span>
                        <span>SQLite Local Persistence</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// =========================================================================
// 1. DASHBOARD VIEW
// =========================================================================
function DashboardView({ stats, onNavigate, sampleData, onRefresh }) {
    const s = stats || {
        total_scans: 0,
        total_urls: 0,
        total_sms: 0,
        phishing_count: 0,
        safe_count: 0,
        threat_rate: 0,
        avg_risk: 0,
        top_indicators: []
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="relative rounded-2xl p-8 overflow-hidden glass-panel border border-slate-800 ambient-glow-cyan">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                            <span>INTELLIGENT CYBERSECURITY AGENT ACTIVE</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Phishing & Smishing Threat Defense
                        </h1>
                        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                            Defend against credential harvesting, fraudulent domains, and smishing attacks with dual ML pipelines. Extracting 22+ URL features and NLP linguistic sentiment to identify cyber threats before damage occurs.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => onNavigate('url')}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5"
                        >
                            <IconGlobe className="w-4 h-4 text-slate-950" />
                            <span>Scan Suspicious URL</span>
                        </button>
                        <button
                            onClick={() => onNavigate('sms')}
                            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-sm flex items-center space-x-2 transition transform hover:-translate-y-0.5"
                        >
                            <IconMessageSquare className="w-4 h-4 text-cyan-400" />
                            <span>Analyze SMS Text</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Total Scans Executed</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <IconActivity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 text-3xl font-extrabold font-mono text-white">{s.total_scans}</div>
                    <div className="mt-1 text-xs text-slate-400 flex items-center space-x-2">
                        <span>{s.total_urls} URLs</span>
                        <span>•</span>
                        <span>{s.total_sms} SMS</span>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-red-400 uppercase tracking-wider">Phishing Threats Detected</span>
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <IconShieldAlert className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 text-3xl font-extrabold font-mono text-red-400">{s.phishing_count}</div>
                    <div className="mt-1 text-xs text-red-400/80 font-mono">
                        {s.threat_rate}% Threat Flag Ratio
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">Safe Inputs Verified</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <IconShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 text-3xl font-extrabold font-mono text-emerald-400">{s.safe_count}</div>
                    <div className="mt-1 text-xs text-emerald-400/80 font-mono">
                        {s.total_scans > 0 ? (100 - s.threat_rate).toFixed(1) : 0}% Safety Index
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Average Risk Score</span>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <IconZap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 text-3xl font-extrabold font-mono text-cyan-300">{s.avg_risk}%</div>
                    <div className="mt-1 text-xs text-slate-400 font-mono">
                        Calibrated Ensemble Score
                    </div>
                </div>
            </div>

            {/* Quick Threat Check Launcher */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* URL Scanner Quick Card */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                <IconGlobe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">URL Phishing Analysis</h3>
                                <p className="text-xs text-slate-400">Subdomains, TLD reputation, entropy & lexical heuristics</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mt-2 mb-4 leading-relaxed">
                            Detects brand impersonation, raw IP hosting, unauthorized port usage, URL shortener redirection, and credential harvesting patterns.
                        </p>
                        <div className="space-y-2 mb-4">
                            <span className="text-xs font-mono text-slate-400 uppercase">One-Click Test Presets:</span>
                            <div className="flex flex-wrap gap-2">
                                {(sampleData.urls || []).slice(0, 3).map((u, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onNavigate('url')}
                                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 transition"
                                    >
                                        {u.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate('url')}
                        className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 font-bold text-sm flex items-center justify-center space-x-2 transition"
                    >
                        <span>Launch URL Scanner</span>
                        <IconChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* SMS Scanner Quick Card */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <IconMessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">SMS Smishing Detection</h3>
                                <p className="text-xs text-slate-400">NLP emotional coercion, banking fraud & fake rewards</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mt-2 mb-4 leading-relaxed">
                            Analyzes psychological urgency triggers ("locked", "suspended"), unsolicited lottery claims, fake parcel delivery notices, and OTP code theft.
                        </p>
                        <div className="space-y-2 mb-4">
                            <span className="text-xs font-mono text-slate-400 uppercase">One-Click Test Presets:</span>
                            <div className="flex flex-wrap gap-2">
                                {(sampleData.sms || []).slice(0, 3).map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onNavigate('sms')}
                                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-300 transition"
                                    >
                                        {m.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate('sms')}
                        className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center space-x-2 transition"
                    >
                        <span>Launch SMS Scanner</span>
                        <IconChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Top Threat Indicators Frequency */}
            {s.top_indicators && s.top_indicators.length > 0 && (
                <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <IconAlertTriangle className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-base text-white">Top Identified Threat Vectors</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400">Frequency Distribution</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {s.top_indicators.map((ind, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                                <span className="text-xs text-slate-200 font-medium truncate pr-2">{ind.name}</span>
                                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                    {ind.count} hits
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Chevron Icon
function IconChevronRight({ className = "w-4 h-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

// =========================================================================
// 2. URL SCANNER VIEW
// =========================================================================
function UrlScannerView({ samples, onScanComplete, showToast }) {
    const [urlInput, setUrlInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStage, setScanStage] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (overrideUrl) => {
        const targetUrl = (overrideUrl || urlInput).trim();
        if (!targetUrl) {
            setError("Please enter or paste a valid website URL to analyze.");
            return;
        }

        setError(null);
        setIsScanning(true);
        setResult(null);

        // Simulation stages for high cyber UX
        setScanStage('Parsing URL & extracting 22 lexical features...');
        setTimeout(() => setScanStage('Checking host IP, TLD reputation & shorteners...'), 350);
        setTimeout(() => setScanStage('Running Random Forest & Heuristic calibrator...'), 700);

        try {
            const res = await fetch('/api/scan-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'URL analysis failed');
            }

            setTimeout(() => {
                setResult(data);
                setIsScanning(false);
                onScanComplete();
                showToast("URL analysis completed successfully!", "success");
            }, 900);
        } catch (err) {
            setError(err.message);
            setIsScanning(false);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setUrlInput(text);
                showToast("Pasted from clipboard!");
            }
        } catch (e) {
            showToast("Clipboard access denied. Please paste manually.", "warning");
        }
    };

    const handleSampleClick = (sampleUrl) => {
        setUrlInput(sampleUrl);
        handleAnalyze(sampleUrl);
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
                    <IconGlobe className="w-3.5 h-3.5" />
                    <span>PHISHING URL ANALYZER</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Inspect Suspicious Website URLs</h2>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    Evaluate domain structure, SSL status, lexical anomalies, and brand spoofing tactics with Random Forest classification.
                </p>
            </div>

            {/* Input Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                {isScanning && <div className="cyber-scanline"></div>}

                <div className="space-y-4">
                    <label className="block text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                        Enter Website URL to Analyze:
                    </label>

                    <div className="relative flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="e.g. https://appleid.apple.com.verify-login.xyz/account or http://192.168.1.1"
                                className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm font-mono outline-none transition"
                                disabled={isScanning}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                            <div className="absolute left-3.5 top-4 text-slate-500">
                                <IconGlobe className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="absolute right-2 top-2 flex space-x-1">
                                {urlInput && (
                                    <button
                                        onClick={() => setUrlInput('')}
                                        className="px-2 py-1.5 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                                        title="Clear input"
                                    >
                                        Clear
                                    </button>
                                )}
                                <button
                                    onClick={handlePaste}
                                    className="px-2.5 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-800/80 rounded border border-slate-700 transition flex items-center space-x-1"
                                    title="Paste from clipboard"
                                >
                                    <IconCopy className="w-3 h-3" />
                                    <span>Paste</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAnalyze()}
                            disabled={isScanning || !urlInput.trim()}
                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-sm font-mono flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                        >
                            {isScanning ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                    <span>ANALYZING...</span>
                                </>
                            ) : (
                                <>
                                    <IconZap className="w-4 h-4 text-slate-950" />
                                    <span>ANALYZE URL</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Progress Bar & Status during Scan */}
                    {isScanning && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center space-x-3 animate-pulse">
                            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-mono text-cyan-300">{scanStage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center space-x-2">
                            <IconAlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Quick Preset Samples */}
                    <div className="pt-2">
                        <span className="text-xs text-slate-400 font-mono block mb-2">Test with Verified Samples:</span>
                        <div className="flex flex-wrap gap-2">
                            {samples.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSampleClick(s.url)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                                        s.expected === 'PHISHING'
                                            ? 'bg-red-950/40 border-red-900/60 text-red-300 hover:border-red-500/60'
                                            : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300 hover:border-emerald-500/60'
                                    }`}
                                >
                                    <span className="mr-1.5">{s.expected === 'PHISHING' ? '🚨' : '🛡️'}</span>
                                    <span>{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Result Card */}
            {result && (
                <div className={`glass-panel p-6 sm:p-8 rounded-2xl border transition-all duration-300 animate-slideUp ${
                    result.result === 'PHISHING' ? 'glass-panel-danger' : 'glass-panel-safe'
                }`}>
                    {/* Top Result Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-6">
                        <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl ${
                                result.result === 'PHISHING'
                                    ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-red-500/20'
                                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
                            }`}>
                                {result.result === 'PHISHING' ? (
                                    <IconShieldAlert className="w-8 h-8 text-red-400" />
                                ) : (
                                    <IconShieldCheck className="w-8 h-8 text-emerald-400" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h3 className={`text-2xl font-black font-mono tracking-tight ${
                                        result.result === 'PHISHING' ? 'text-red-400' : 'text-emerald-400'
                                    }`}>
                                        {result.result === 'PHISHING' ? 'PHISHING THREAT DETECTED' : 'SAFE URL CONFIRMED'}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                                        ID #{result.id || 'LIVE'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono mt-1 break-all">
                                    Target: <span className="text-slate-200">{result.input_content}</span>
                                </p>
                            </div>
                        </div>

                        {/* Circular Gauge */}
                        <div className="flex items-center space-x-6">
                            <RiskGauge score={result.risk_score} size={110} />
                            <div className="text-left font-mono text-xs space-y-1">
                                <div className="text-slate-400">Model Confidence:</div>
                                <div className="text-base font-bold text-white">{result.confidence}%</div>
                                <div className="text-[11px] text-cyan-400">{result.model_name}</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Security Explanation */}
                    <div className="py-5 border-b border-slate-800">
                        <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-2">
                            <IconInfo className="w-4 h-4 text-cyan-400" />
                            <span>Neural Security Explanation</span>
                        </h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                            {result.explanation}
                        </p>
                    </div>

                    {/* Feature Analysis Grid */}
                    {result.features && (
                        <div className="py-5 border-b border-slate-800">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                                Extracted URL Characteristics:
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">URL Length</span>
                                    <span className="text-slate-200 font-bold">{result.features.url_length} chars</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Subdomains</span>
                                    <span className={`font-bold ${result.features.num_subdomains >= 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.num_subdomains} levels
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">HTTPS Protocol</span>
                                    <span className={`font-bold ${result.features.has_https ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {result.features.has_https ? 'Active (SSL)' : 'Missing (Plaintext)'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Raw IP Usage</span>
                                    <span className={`font-bold ${result.features.has_ip ? 'text-red-400' : 'text-slate-200'}`}>
                                        {result.features.has_ip ? 'Yes (Anomalous)' : 'No (Domain)'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Domain Entropy</span>
                                    <span className="text-slate-200 font-bold">{result.features.entropy || 'N/A'}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Special Characters</span>
                                    <span className="text-slate-200 font-bold">{result.features.num_special_chars}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Suspicious Keywords</span>
                                    <span className={`font-bold ${result.features.keyword_count > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.keyword_count} detected
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Shortener Masking</span>
                                    <span className={`font-bold ${result.features.is_shortened ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.is_shortened ? 'Yes (Masked)' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detected Threat Indicators */}
                    {result.indicators && result.indicators.length > 0 && (
                        <div className="py-5 border-b border-slate-800">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                                Detected Security Indicators ({result.indicators.length}):
                            </h4>
                            <div className="space-y-2">
                                {result.indicators.map((ind, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-white">{ind.title}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                    ind.severity === 'High'
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                        : ind.severity === 'Medium'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                }`}>
                                                    {ind.severity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{ind.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                        <div className="pt-5">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3 flex items-center space-x-2">
                                <IconLock className="w-4 h-4 text-cyan-400" />
                                <span>Actionable Defensive Recommendations:</span>
                            </h4>
                            <ul className="space-y-2">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                                        <IconCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// =========================================================================
// 3. SMS SCANNER VIEW
// =========================================================================
function SmsScannerView({ samples, onScanComplete, showToast }) {
    const [smsInput, setSmsInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStage, setScanStage] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (overrideText) => {
        const textToScan = (overrideText || smsInput).trim();
        if (!textToScan) {
            setError("Please enter or paste an SMS text message to analyze.");
            return;
        }

        setError(null);
        setIsScanning(true);
        setResult(null);

        setScanStage('NLP tokenization & cleaning text...');
        setTimeout(() => setScanStage('Scanning urgency, prize & financial vectors...'), 350);
        setTimeout(() => setScanStage('Running TF-IDF + Random Forest Classifier...'), 700);

        try {
            const res = await fetch('/api/scan-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToScan })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'SMS analysis failed');
            }

            setTimeout(() => {
                setResult(data);
                setIsScanning(false);
                onScanComplete();
                showToast("SMS threat analysis complete!", "success");
            }, 900);
        } catch (err) {
            setError(err.message);
            setIsScanning(false);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setSmsInput(text);
                showToast("Pasted SMS from clipboard!");
            }
        } catch (e) {
            showToast("Clipboard access denied.", "warning");
        }
    };

    const handleSampleClick = (text) => {
        setSmsInput(text);
        handleAnalyze(text);
    };

    // Render highlighted message spans
    const renderHighlightedText = () => {
        if (!result || !result.input_content) return null;
        const text = result.input_content;
        const spans = result.highlighted_spans || [];

        if (spans.length === 0) {
            return <span className="text-slate-200">{text}</span>;
        }

        // Sort spans by start index
        const sortedSpans = [...spans].sort((a, b) => a.start - b.start);
        const elements = [];
        let lastIdx = 0;

        sortedSpans.forEach((span, i) => {
            if (span.start > lastIdx) {
                elements.push(
                    <span key={`text-${i}`}>
                        {text.slice(lastIdx, span.start)}
                    </span>
                );
            }
            const isLink = span.type === 'link';
            elements.push(
                <span
                    key={`span-${i}`}
                    className={isLink ? 'link-highlight' : 'threat-highlight'}
                    title={isLink ? 'Suspicious URL vector' : 'Emotional coercion / Phishing trigger'}
                >
                    {text.slice(span.start, span.end)}
                </span>
            );
            lastIdx = Math.max(lastIdx, span.end);
        });

        if (lastIdx < text.length) {
            elements.push(<span key="tail">{text.slice(lastIdx)}</span>);
        }

        return elements;
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono">
                    <IconMessageSquare className="w-3.5 h-3.5" />
                    <span>SMISHING NLP DETECTOR</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Detect Fraudulent SMS Messages</h2>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    Analyze mobile text messages for psychological coercion, fake prizes, courier traps, and credential theft attempts.
                </p>
            </div>

            {/* Input Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                {isScanning && <div className="cyber-scanline"></div>}

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                            Paste or Type SMS Message:
                        </label>
                        <span className="text-xs font-mono text-slate-500">
                            {smsInput.length} chars • {smsInput.trim() ? smsInput.trim().split(/\s+/).length : 0} words
                        </span>
                    </div>

                    <div className="relative">
                        <textarea
                            rows={4}
                            value={smsInput}
                            onChange={(e) => setSmsInput(e.target.value)}
                            placeholder="e.g. URGENT: Your Wells Fargo debit card has been locked. Verify immediately at http://wellsfargo-verify.xyz to restore access..."
                            className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-slate-500 text-sm font-sans outline-none transition resize-none"
                            disabled={isScanning}
                        />
                        <div className="absolute right-3 bottom-3 flex space-x-2">
                            {smsInput && (
                                <button
                                    onClick={() => setSmsInput('')}
                                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800/80 border border-slate-700 transition"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={handlePaste}
                                className="px-2.5 py-1 text-xs text-blue-400 hover:text-blue-300 bg-slate-800/80 rounded border border-slate-700 transition flex items-center space-x-1"
                            >
                                <IconCopy className="w-3 h-3" />
                                <span>Paste</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => handleAnalyze()}
                            disabled={isScanning || !smsInput.trim()}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm font-mono flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20"
                        >
                            {isScanning ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                    <span>ANALYZING SMS...</span>
                                </>
                            ) : (
                                <>
                                    <IconZap className="w-4 h-4 text-slate-950" />
                                    <span>ANALYZE SMS</span>
                                </>
                            )}
                        </button>
                    </div>

                    {isScanning && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center space-x-3 animate-pulse">
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-mono text-blue-300">{scanStage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center space-x-2">
                            <IconAlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Presets */}
                    <div className="pt-2">
                        <span className="text-xs text-slate-400 font-mono block mb-2">Test with Common Real-World Scenarios:</span>
                        <div className="flex flex-wrap gap-2">
                            {samples.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSampleClick(s.text)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                                        s.expected === 'PHISHING'
                                            ? 'bg-red-950/40 border-red-900/60 text-red-300 hover:border-red-500/60'
                                            : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300 hover:border-emerald-500/60'
                                    }`}
                                >
                                    <span className="mr-1.5">{s.expected === 'PHISHING' ? '🚨' : '🛡️'}</span>
                                    <span>{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Result Card */}
            {result && (
                <div className={`glass-panel p-6 sm:p-8 rounded-2xl border transition-all duration-300 animate-slideUp ${
                    result.result === 'PHISHING' ? 'glass-panel-danger' : 'glass-panel-safe'
                }`}>
                    {/* Top Result Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-6">
                        <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl ${
                                result.result === 'PHISHING'
                                    ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-red-500/20'
                                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
                            }`}>
                                {result.result === 'PHISHING' ? (
                                    <IconShieldAlert className="w-8 h-8 text-red-400" />
                                ) : (
                                    <IconShieldCheck className="w-8 h-8 text-emerald-400" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h3 className={`text-2xl font-black font-mono tracking-tight ${
                                        result.result === 'PHISHING' ? 'text-red-400' : 'text-emerald-400'
                                    }`}>
                                        {result.result === 'PHISHING' ? 'SMISHING THREAT DETECTED' : 'SAFE MESSAGE CONFIRMED'}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                                        ID #{result.id || 'LIVE'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono mt-1">
                                    Classification Engine: <span className="text-slate-200">{result.model_name}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <RiskGauge score={result.risk_score} size={110} />
                            <div className="text-left font-mono text-xs space-y-1">
                                <div className="text-slate-400">Confidence:</div>
                                <div className="text-base font-bold text-white">{result.confidence}%</div>
                                <div className="text-[11px] text-blue-400 font-semibold">
                                    {result.result === 'PHISHING' ? 'HIGH RISK ACTION' : 'LEGITIMATE'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Highlighted Text Inspector */}
                    <div className="py-5 border-b border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center space-x-2">
                                <IconMessageSquare className="w-4 h-4 text-cyan-400" />
                                <span>Message Content & NLP Threat Annotations:</span>
                            </h4>
                            <div className="flex items-center space-x-3 text-[11px] font-mono">
                                <span className="flex items-center space-x-1">
                                    <span className="w-2.5 h-2.5 rounded bg-red-500/40 border border-red-500"></span>
                                    <span className="text-red-300">Coercion Lure</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <span className="w-2.5 h-2.5 rounded bg-cyan-500/40 border border-cyan-500"></span>
                                    <span className="text-cyan-300">Link Vector</span>
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm leading-relaxed font-sans">
                            {renderHighlightedText()}
                        </div>
                    </div>

                    {/* AI Security Explanation */}
                    <div className="py-5 border-b border-slate-800">
                        <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-2">
                            <IconInfo className="w-4 h-4 text-cyan-400" />
                            <span>Behavioral & Linguistic Explanation</span>
                        </h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                            {result.explanation}
                        </p>
                    </div>

                    {/* Feature Analysis Grid */}
                    {result.features && (
                        <div className="py-5 border-b border-slate-800">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                                Linguistic & Structural Attributes:
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Word Count</span>
                                    <span className="text-slate-200 font-bold">{result.features.word_count} words</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">External Link</span>
                                    <span className={`font-bold ${result.features.has_link ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.has_link ? 'Detected' : 'None'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Banking Pretext</span>
                                    <span className={`font-bold ${result.features.has_banking ? 'text-red-400' : 'text-slate-200'}`}>
                                        {result.features.has_banking ? 'Yes (Bank Spoof)' : 'No'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Urgency / Panic</span>
                                    <span className={`font-bold ${result.features.has_urgency ? 'text-red-400' : 'text-slate-200'}`}>
                                        {result.features.has_urgency ? 'High Coercion' : 'Normal'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Delivery Trap</span>
                                    <span className={`font-bold ${result.features.has_delivery ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.has_delivery ? 'Yes (Postal Bait)' : 'No'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">OTP Solicitation</span>
                                    <span className={`font-bold ${result.features.has_otp_risk ? 'text-red-400' : 'text-slate-200'}`}>
                                        {result.features.has_otp_risk ? 'Yes (Harvester)' : 'None'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Fake Reward / Prize</span>
                                    <span className={`font-bold ${result.features.has_reward ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {result.features.has_reward ? 'Yes (Lottery Bait)' : 'None'}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-slate-500 block">Caps Ratio</span>
                                    <span className="text-slate-200 font-bold">{Math.round(result.features.caps_ratio * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detected Threat Indicators */}
                    {result.indicators && result.indicators.length > 0 && (
                        <div className="py-5 border-b border-slate-800">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                                Detected Security Red Flags ({result.indicators.length}):
                            </h4>
                            <div className="space-y-2">
                                {result.indicators.map((ind, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-white">{ind.title}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                    ind.severity === 'High'
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                        : ind.severity === 'Medium'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                }`}>
                                                    {ind.severity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{ind.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                        <div className="pt-5">
                            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3 flex items-center space-x-2">
                                <IconLock className="w-4 h-4 text-cyan-400" />
                                <span>Immediate Safety Steps:</span>
                            </h4>
                            <ul className="space-y-2">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                                        <IconCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// =========================================================================
// 4. SCAN HISTORY VIEW
// =========================================================================
function HistoryView({ showToast, onHistoryChange }) {
    const [historyData, setHistoryData] = useState({ items: [], total: 0, page: 1, total_pages: 1 });
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '15',
                type: typeFilter,
                status: statusFilter,
                search: searchQuery
            });

            const res = await fetch(`/api/history?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setHistoryData(data);
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, typeFilter, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchHistory();
    };

    const handleDelete = async (id) => {
        if (!confirm(`Are you sure you want to delete scan record #${id}?`)) return;
        try {
            const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast(`Scan #${id} deleted.`);
                fetchHistory();
                onHistoryChange();
                if (selectedScan && selectedScan.id === id) setSelectedScan(null);
            }
        } catch (e) {
            showToast("Failed to delete record.", "error");
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Are you sure you want to delete ALL scan history? This action cannot be undone.")) return;
        try {
            const res = await fetch('/api/history/clear', { method: 'POST' });
            if (res.ok) {
                showToast("All scan records cleared.");
                fetchHistory();
                onHistoryChange();
                setSelectedScan(null);
            }
        } catch (e) {
            showToast("Failed to clear records.", "error");
        }
    };

    const handleExport = (format) => {
        window.open(`/api/export?format=${format}`, '_blank');
        showToast(`Exporting history as ${format.toUpperCase()}...`);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Audit Trail & Scan History</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                        Persisted records of all URL and SMS security classifications in SQLite.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={fetchHistory}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition"
                    >
                        <IconRefresh className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center space-x-1.5 transition"
                    >
                        <IconDownload className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => handleExport('json')}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center space-x-1.5 transition"
                    >
                        <IconDownload className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-900/60 hover:border-red-500/50 text-red-300 text-xs font-mono flex items-center space-x-1.5 transition"
                    >
                        <IconTrash className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by URL, SMS text, or keyword..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                    <IconGlobe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </form>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="url">URLs Only</option>
                        <option value="sms">SMS Only</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 outline-none"
                    >
                        <option value="all">All Results</option>
                        <option value="PHISHING">Phishing Only</option>
                        <option value="SAFE">Safe Only</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Target Content</th>
                                <th className="px-4 py-3">Classification</th>
                                <th className="px-4 py-3">Risk %</th>
                                <th className="px-4 py-3">Confidence</th>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading scan history...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : historyData.items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                                        No scan records found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                historyData.items.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-slate-900/40 transition">
                                        <td className="px-4 py-3.5 text-slate-400">#{scan.id}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                scan.scan_type === 'url'
                                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                            }`}>
                                                {scan.scan_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 max-w-xs sm:max-w-md truncate text-slate-200">
                                            {scan.input_content}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                scan.result === 'PHISHING'
                                                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                                {scan.result}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-bold">
                                            <span className={scan.risk_score >= 50 ? 'text-red-400' : 'text-emerald-400'}>
                                                {scan.risk_score}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-300">{scan.confidence}%</td>
                                        <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                                            {scan.created_at}
                                        </td>
                                        <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedScan(scan)}
                                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] border border-slate-700 transition"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(scan.id)}
                                                className="px-2 py-1 rounded bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 text-[11px] border border-slate-700 transition"
                                                title="Delete scan"
                                            >
                                                <IconTrash className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {historyData.total_pages > 1 && (
                    <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">
                            Showing page {historyData.page} of {historyData.total_pages} ({historyData.total} total)
                        </span>
                        <div className="flex space-x-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page >= historyData.total_pages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detailed Scan Modal */}
            {selectedScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedScan(null)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                        >
                            ✕
                        </button>

                        <div className="flex items-center space-x-3 mb-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                                selectedScan.result === 'PHISHING'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}>
                                {selectedScan.result}
                            </span>
                            <span className="text-sm font-mono text-slate-400">Scan Audit #{selectedScan.id}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase block">Input Content</span>
                                <div className="p-3 mt-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 break-all select-all">
                                    {selectedScan.input_content}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                                    <span className="text-slate-500 block">Risk Score</span>
                                    <span className="text-lg font-bold text-white">{selectedScan.risk_score}%</span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                                    <span className="text-slate-500 block">Confidence</span>
                                    <span className="text-lg font-bold text-white">{selectedScan.confidence}%</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase block mb-1">AI Explanation</span>
                                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                                    {selectedScan.explanation}
                                </p>
                            </div>

                            {selectedScan.indicators && selectedScan.indicators.length > 0 && (
                                <div>
                                    <span className="text-xs font-mono text-slate-500 uppercase block mb-2">Detected Indicators</span>
                                    <div className="space-y-2">
                                        {selectedScan.indicators.map((ind, i) => (
                                            <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                                                <div className="font-bold text-slate-200">{ind.title}</div>
                                                <div className="text-slate-400 text-[11px] mt-0.5">{ind.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setSelectedScan(null)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// 5. THREAT ANALYTICS VIEW
// =========================================================================
function AnalyticsView({ stats, modelsInfo, onRefresh }) {
    const pieCanvasRef = useRef(null);
    const barCanvasRef = useRef(null);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    const s = stats || {
        phishing_count: 0,
        safe_count: 0,
        daily_stats: []
    };

    // Render Chart.js
    useEffect(() => {
        if (!window.Chart) return;

        // 1. Phishing vs Safe Donut Chart
        if (pieCanvasRef.current) {
            if (pieChartInstance.current) pieChartInstance.current.destroy();

            const ctx = pieCanvasRef.current.getContext('2d');
            pieChartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Phishing Threats', 'Safe Inputs'],
                    datasets: [{
                        data: [s.phishing_count || 1, s.safe_count || 1],
                        backgroundColor: ['#EF4444', '#10B981'],
                        borderColor: '#070B14',
                        borderWidth: 3,
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#94A3B8',
                                font: { family: "'JetBrains Mono', monospace", size: 11 }
                            }
                        }
                    },
                    cutout: '72%'
                }
            });
        }

        // 2. Activity Trends Bar Chart
        if (barCanvasRef.current && s.daily_stats && s.daily_stats.length > 0) {
            if (barChartInstance.current) barChartInstance.current.destroy();

            const labels = s.daily_stats.map(d => d.scan_date.slice(5));
            const phishingData = s.daily_stats.map(d => d.phishing);
            const safeData = s.daily_stats.map(d => d.safe);

            const ctx2 = barCanvasRef.current.getContext('2d');
            barChartInstance.current = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Phishing',
                            data: phishingData,
                            backgroundColor: '#EF4444',
                            borderRadius: 6
                        },
                        {
                            label: 'Safe',
                            data: safeData,
                            backgroundColor: '#10B981',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            grid: { color: 'rgba(51, 65, 85, 0.2)' },
                            ticks: { color: '#94A3B8', font: { family: "'JetBrains Mono', monospace", size: 10 } }
                        },
                        y: {
                            stacked: true,
                            grid: { color: 'rgba(51, 65, 85, 0.2)' },
                            ticks: { color: '#94A3B8', font: { family: "'JetBrains Mono', monospace", size: 10 } }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#94A3B8', font: { family: "'JetBrains Mono', monospace", size: 11 } }
                        }
                    }
                }
            });
        }

        return () => {
            if (pieChartInstance.current) pieChartInstance.current.destroy();
            if (barChartInstance.current) barChartInstance.current.destroy();
        };
    }, [s]);

    const urlBenchmarks = modelsInfo?.url_models?.benchmarks || {};
    const smsBenchmarks = modelsInfo?.sms_models?.benchmarks || {};

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Threat Intelligence & ML Benchmarks</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                    Comparative machine learning performance evaluations across Random Forest, Logistic Regression, and SVM.
                </p>
            </div>

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-base text-white mb-1">Threat Distribution Index</h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">Proportion of flagged malicious inputs vs confirmed safe inputs</p>
                    <div className="h-64 relative flex items-center justify-center">
                        <canvas ref={pieCanvasRef}></canvas>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-base text-white mb-1">Recent Activity Timeline</h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">Daily volumetric scan throughput and threat classification</p>
                    <div className="h-64 relative">
                        <canvas ref={barCanvasRef}></canvas>
                    </div>
                </div>
            </div>

            {/* Model Comparison Table */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-base text-white">Machine Learning Algorithm Benchmarks</h3>
                        <p className="text-xs text-slate-400 font-mono">Trained on curated, balanced datasets with 5-fold cross-validation</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                        Scikit-Learn ML Suite
                    </span>
                </div>

                <div className="space-y-6">
                    {/* URL Models */}
                    <div>
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                            A. URL Phishing Classifiers (22 Lexical & Structural Features)
                        </span>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="px-4 py-2.5">Model Architecture</th>
                                        <th className="px-4 py-2.5">Accuracy</th>
                                        <th className="px-4 py-2.5">Precision</th>
                                        <th className="px-4 py-2.5">Recall</th>
                                        <th className="px-4 py-2.5">F1-Score</th>
                                        <th className="px-4 py-2.5">5-Fold CV Mean</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {Object.entries(urlBenchmarks).map(([name, m]) => (
                                        <tr key={name} className="hover:bg-slate-900/50">
                                            <td className="px-4 py-3 font-bold text-slate-200 flex items-center space-x-2">
                                                <span>{name}</span>
                                                {name === modelsInfo?.url_models?.best_model && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        Active Production
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-cyan-300 font-bold">{m.accuracy}%</td>
                                            <td className="px-4 py-3 text-slate-300">{m.precision}%</td>
                                            <td className="px-4 py-3 text-slate-300">{m.recall}%</td>
                                            <td className="px-4 py-3 text-emerald-400 font-bold">{m.f1_score}%</td>
                                            <td className="px-4 py-3 text-slate-400">{m.cv_mean}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SMS Models */}
                    <div>
                        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block mb-2">
                            B. SMS Smishing Classifiers (TF-IDF N-Gram + NLP Vectors)
                        </span>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="px-4 py-2.5">Model Architecture</th>
                                        <th className="px-4 py-2.5">Accuracy</th>
                                        <th className="px-4 py-2.5">Precision</th>
                                        <th className="px-4 py-2.5">Recall</th>
                                        <th className="px-4 py-2.5">F1-Score</th>
                                        <th className="px-4 py-2.5">5-Fold CV Mean</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {Object.entries(smsBenchmarks).map(([name, m]) => (
                                        <tr key={name} className="hover:bg-slate-900/50">
                                            <td className="px-4 py-3 font-bold text-slate-200 flex items-center space-x-2">
                                                <span>{name}</span>
                                                {name === modelsInfo?.sms_models?.best_model && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        Active Production
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-cyan-300 font-bold">{m.accuracy}%</td>
                                            <td className="px-4 py-3 text-slate-300">{m.precision}%</td>
                                            <td className="px-4 py-3 text-slate-300">{m.recall}%</td>
                                            <td className="px-4 py-3 text-emerald-400 font-bold">{m.f1_score}%</td>
                                            <td className="px-4 py-3 text-slate-400">{m.cv_mean}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 6. SECURITY ADVISOR & EDUCATIONAL VIEW
// =========================================================================
function SecurityGuideView({ onNavigate }) {
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const questions = [
        {
            q: "You receive an SMS from 'USPS' stating: 'Package delivery failed due to address error. Pay $1.50 redelivery at http://bit.ly/usps-redeliver'. What is the safest action?",
            options: [
                "Click the link and pay the small $1.50 fee immediately.",
                "Delete the SMS and track packages directly on the official USPS.com website.",
                "Reply to the message asking for verification.",
                "Forward the link to your friends to check if it's real."
            ],
            correct: 1,
            explanation: "USPS will never text you asking for redelivery fees via shortened bit.ly links. This is a classic smishing scam designed to harvest credit card details."
        },
        {
            q: "A website URL reads: 'https://appleid.apple.com.verify-account-update.xyz/login'. Who owns this domain?",
            options: [
                "Apple Inc., because it starts with 'appleid.apple.com'.",
                "The owner of the registered domain 'verify-account-update.xyz'.",
                "A verified Apple partner authorized on .xyz.",
                "Nobody, it's an automated redirect."
            ],
            correct: 1,
            explanation: "In a URL, the registered domain is the text immediately before the TLD (.xyz). Attackers place trusted brand names in subdomains to trick casual observers."
        },
        {
            q: "Your bank sends an urgent text saying your debit card is blocked and asks you to reply with your 6-digit one-time passcode (OTP). What should you do?",
            options: [
                "Reply with the OTP so your card doesn't get cancelled.",
                "Never share your OTP. Call your bank using the phone number printed on the back of your physical debit card.",
                "Click any link in the SMS to reset your PIN.",
                "Send your account number instead."
            ],
            correct: 1,
            explanation: "Legitimate financial institutions will NEVER ask you to text them your OTP or PIN. Attackers need your OTP to finalize fraudulent transfers."
        }
    ];

    const handleAnswer = (idx) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(idx);
        setShowExplanation(true);
        if (idx === questions[quizIndex].correct) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizIndex(i => (i + 1) % questions.length);
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
                    <IconInfo className="w-3.5 h-3.5" />
                    <span>CYBER DEFENSE KNOWLEDGE CENTER</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">How to Identify Phishing Attacks</h2>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    Cybercriminals use emotional coercion, brand spoofing, and technical obfuscation. Learn the key red flags to protect yourself and your organization.
                </p>
            </div>

            {/* Anatomy of a Phishing URL */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                    <IconGlobe className="w-5 h-5 text-cyan-400" />
                    <span>Anatomy of a Malicious Phishing URL</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed mb-4">
                    <span className="text-slate-500">https://</span>
                    <span className="text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/30" title="Subdomain Spoofing">
                        paypal.com.account-verification
                    </span>
                    <span className="text-slate-500">.</span>
                    <span className="text-red-400 font-bold bg-red-500/10 px-1 py-0.5 rounded border border-red-500/30" title="Actual Registered Malicious Domain">
                        attacker-host.xyz
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="text-cyan-400 bg-cyan-500/10 px-1 py-0.5 rounded border border-cyan-500/30" title="Phishing Endpoint">
                        webscr?cmd=_login-submit
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                        <span className="text-amber-400 font-bold block mb-1">1. Subdomain Deception</span>
                        <p className="text-slate-400">Attackers place brands in subdomains to fool users viewing small screens on smartphones.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                        <span className="text-red-400 font-bold block mb-1">2. Untrusted TLD</span>
                        <p className="text-slate-400">Cheap, high-abuse domains like .xyz, .top, .buzz, or .club are frequently registered for brief scam campaigns.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                        <span className="text-cyan-400 font-bold block mb-1">3. Endpoint Simulation</span>
                        <p className="text-slate-400">Path keywords mimic genuine authentication portals (e.g. webscr, verify, account, billing).</p>
                    </div>
                </div>
            </div>

            {/* Interactive Cyber Awareness Quiz */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <IconZap className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-base text-white">Interactive Phishing Awareness Quiz</h3>
                    </div>
                    <span className="text-xs font-mono text-cyan-300">
                        Question {quizIndex + 1} of {questions.length} • Score: {score}
                    </span>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-slate-100 font-medium">
                        {questions[quizIndex].q}
                    </p>

                    <div className="space-y-2">
                        {questions[quizIndex].options.map((opt, idx) => {
                            let btnStyle = "bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50";
                            if (selectedAnswer !== null) {
                                if (idx === questions[quizIndex].correct) {
                                    btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold";
                                } else if (idx === selectedAnswer) {
                                    btnStyle = "bg-red-950/60 border-red-500 text-red-300";
                                } else {
                                    btnStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-60";
                                }
                            }
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans transition ${btnStyle}`}
                                >
                                    <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                                    <span>{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    {showExplanation && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 animate-fadeIn space-y-2">
                            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">Expert Advisory:</span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {questions[quizIndex].explanation}
                            </p>
                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs font-mono hover:bg-cyan-400 transition"
                                >
                                    Next Question →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Official Reporting Channels */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-base text-white mb-2">Where to Report Phishing & Smishing</h3>
                <p className="text-xs text-slate-400 font-mono mb-4">Official national and global reporting authorities:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-cyan-400 font-bold block">Mobile Carrier Smishing Report</span>
                        <span className="text-slate-400">Forward any fraudulent SMS to </span>
                        <span className="text-white font-bold">7726 (SPAM)</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-cyan-400 font-bold block">Anti-Phishing Working Group (APWG)</span>
                        <span className="text-slate-400">Email malicious links to </span>
                        <span className="text-white font-bold">reportphishing@apwg.org</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-cyan-400 font-bold block">Federal Trade Commission (FTC)</span>
                        <span className="text-slate-400">Submit consumer scam complaints at </span>
                        <span className="text-white font-bold">ReportFraud.ftc.gov</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-cyan-400 font-bold block">CISA Cybersecurity Alert Center</span>
                        <span className="text-slate-400">Government security advisories at </span>
                        <span className="text-white font-bold">cisa.gov/report</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Render React App to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

