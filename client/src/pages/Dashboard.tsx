/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, ArrowRightIcon, HeartPlus, GlobeIcon, TrendingUpIcon } from "lucide-react";
import AnalysesCard from "../components/AnalysesCard";
import { useApp } from "../context/AppContext";

interface AnalysisSummary {
    _id: string;
    url: string;
    overallScore: number;
    status: string;
    createdAt: string;
    categories: {
        seo: number;
        performance: number;
        accessibility: number;
        bestPractices: number;
    };
}

export default function Dashboard() {
    const { user, api } = useApp();
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecent = async () => {
        try {
            const res = await api.get("/api/analysis/list?limit=6");
            if (res.data.success) {
                setAnalyses(res.data.analyses);
            }
        } catch (err) {
            console.error("Failed to fetch analyses:", err);
        }
        setLoading(false);
    };

    const handleAnalyze = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (url.trim()) {
            navigate(`/analyze?url=${encodeURIComponent(url)}`);
        }
    };

    const completedAnalyses = analyses.filter((a) => a.status === "completed");
    const avgScore = completedAnalyses.length ? Math.round(completedAnalyses.reduce((sum, a) => sum + a.overallScore, 0) / completedAnalyses.length) : 0;
    // const totalIssues = completedAnalyses.length;

    const getScoreClass = (s: number) => {
        if (s >= 80) return "score-good";
        if (s >= 50) return "score-medium";
        return "score-poor";
    };

    useEffect(() => {
        (async () => await fetchRecent())();
    }, []);

    return (
        <div className="relative min-h-screen pt-16 md:pt-24 bg-background overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-20 left-1/4 w-125 h-75 bg-primary/10 blur-[130px] rounded-full -z-1 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-1">
                        Welcome back, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Analyze websites and boost your SEO performance.</p>
                </div>

                {/* Quick Analyze */}
                <form onSubmit={handleAnalyze} className="mb-10" style={{ animationDelay: "100ms" }}>
                    <div className="border border-primary/20 rounded-full p-2 flex items-center gap-2 max-w-2xl shadow-[0_0_25px_-8px_rgba(99,102,241,0.35)] focus-within:border-primary/50 focus-within:shadow-[0_0_35px_-5px_rgba(99,102,241,0.55)] transition-all duration-300">
                        <div className="flex items-center gap-3 flex-1 px-3">
                            <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter a URL to analyze..." className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-3" id="dashboard-url-input" />
                        </div>
                        <button type="submit" className="relative bg-primary px-5 py-3 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-all shrink-0 flex items-center gap-2 shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] overflow-hidden group" style={{ color: "var(--background)" }} id="dashboard-analyze-btn">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                            Analyze
                            <ArrowRightIcon size={16} />
                        </button>
                    </div>
                </form>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="relative glass rounded-2xl p-5 flex items-center gap-4 border border-border hover:border-primary/30 hover:shadow-[0_0_25px_-8px_rgba(99,102,241,0.3)] transition-all duration-300 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                            <GlobeIcon size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{analyses.length}</p>
                            <p className="text-xs text-muted-foreground">Total Scans</p>
                        </div>
                    </div>
                    <div className="relative glass rounded-2xl p-5 flex items-center gap-4 border border-border hover:border-primary/30 hover:shadow-[0_0_25px_-8px_rgba(99,102,241,0.3)] transition-all duration-300 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                            <TrendingUpIcon size={22} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${getScoreClass(avgScore)}`}>{avgScore}</p>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                    </div>
                    <div className="relative glass rounded-2xl p-5 flex items-center gap-4 border border-border hover:border-accent/30 hover:shadow-[0_0_25px_-8px_rgba(99,102,241,0.3)] transition-all duration-300 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                            <HeartPlus size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{user?.plan === "free" ? `${5 - (user?.analysisCount || 0)}` : "∞"}</p>
                            <p className="text-xs text-muted-foreground">Scans Left Today</p>
                        </div>
                    </div>
                </div>

                {/* Recent Analyses */}
                <div style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-foreground">Recent Analyses</h2>
                        {analyses.length > 0 && (
                            <Link to="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowRightIcon size={14} />
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-30">
                            <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : analyses.length === 0 ? (
                        <div className="relative glass rounded-2xl p-12 text-center border border-border overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
                            <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                                <SearchIcon size={26} className="text-primary" />
                            </div>
                            <h3 className="relative text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
                            <p className="relative text-sm text-muted-foreground mb-6">Enter a URL above to run your first SEO analysis.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analyses.map((a) => (
                                <AnalysesCard key={a._id} analysis={a} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}