/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, ExternalLink, Search, AlertCircle, Loader2, Filter, ArrowUpDown } from "lucide-react";
import ScoreGauge from "../components/ScoreGauge";
import { useApp } from "../context/AppContext";

interface AnalysisItem {
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

export default function History() {
    const { api } = useApp();

    const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const fetchAnalyses = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/analysis/list?page=${page}&limit=12`);
            if (res.data.success) {
                setAnalyses(res.data.analyses);
                setTotalPages(res.data.pagination.pages);
            }
        } catch (err) {
            console.error("Failed to fetch:", err);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this analysis?")) return;
        setDeleting(id);

        try {
            await api.delete(`/api/analysis/${id}`);
            setAnalyses((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
        }
        setDeleting(null);
    };

    const getScoreClass = (s: number) => {
        if (s >= 80) return "score-good";
        if (s >= 50) return "score-medium";
        return "score-poor";
    };

    const getStatusGlow = (status: string) => {
        if (status === "completed") return "rgba(16,185,129,0.35)";
        if (status === "processing") return "rgba(99,102,241,0.35)";
        return "rgba(239,68,68,0.35)";
    };

    let processedData = [...analyses];

    if (searchQuery) {
        processedData = processedData.filter((a) => a.url.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (statusFilter !== "all") {
        processedData = processedData.filter((a) => a.status === statusFilter);
    }

    processedData.sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "score_high") {
            return b.overallScore - a.overallScore;
        } else if (sortBy === "score_low") {
            return a.overallScore - b.overallScore;
        }
        return 0;
    });

    useEffect(() => {
        (async () => await fetchAnalyses())();
    }, [page]);

    return (
        <div className="relative min-h-screen pt-16 md:pt-24 bg-background overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-20 right-1/4 w-125 h-75 bg-primary/10 blur-[130px] rounded-full -z-1 pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-100 h-75 bg-primary/5 blur-[120px] rounded-full -z-1 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
                            Analysis <span className="gradient-text">History</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">View and manage all your past SEO analyses.</p>
                    </div>
                    <Link
                        to="/analyze"
                        className="relative bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all self-start shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] overflow-hidden group"
                        style={{ color: "var(--background)" }}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                        New Analysis
                    </Link>
                </div>

                {/* Filters Row */}
                <div className="mb-8 flex flex-col md:flex-row gap-3" style={{ animationDelay: "100ms" }}>
                    <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1 focus-within:border-primary/40 focus-within:shadow-[0_0_20px_-6px_rgba(99,102,241,0.5)] transition-all">
                        <Search size={18} className="text-muted-foreground" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by URL..." className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1" id="history-search-input" />
                    </div>

                    <div className="flex gap-3">
                        <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-primary/30 transition-all">
                            <Filter size={16} className="text-muted-foreground" />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="all" className="bg-background">
                                    All Status
                                </option>
                                <option value="completed" className="bg-background">
                                    Completed
                                </option>
                                <option value="processing" className="bg-background">
                                    Processing
                                </option>
                                <option value="failed" className="bg-background">
                                    Failed
                                </option>
                            </select>
                        </div>
                        <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-primary/30 transition-all">
                            <ArrowUpDown size={16} className="text-muted-foreground" />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="newest" className="bg-background">
                                    Newest First
                                </option>
                                <option value="oldest" className="bg-background">
                                    Oldest First
                                </option>
                                <option value="score_high" className="bg-background">
                                    Highest Score
                                </option>
                                <option value="score_low" className="bg-background">
                                    Lowest Score
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-30">
                        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : processedData.length === 0 ? (
                    <div className="relative glass border border-border rounded-2xl p-12 text-center overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                            <Search size={26} className="text-primary" />
                        </div>
                        <h3 className="relative text-lg font-semibold text-foreground mb-2">{searchQuery ? "No matching analyses" : "No analyses yet"}</h3>
                        <p className="relative text-sm text-muted-foreground">{searchQuery ? "Try a different search term." : "Run your first SEO analysis to see it here."}</p>
                    </div>
                ) : (
                    /* Card grid instead of stacked list */
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" style={{ animationDelay: "200ms" }}>
                        {processedData.map((a, idx) => {
                            const glow = getStatusGlow(a.status);
                            const hostname = (() => {
                                try {
                                    return new URL(a.url).hostname;
                                } catch {
                                    return a.url;
                                }
                            })();

                            return (
                                <div
                                    key={a._id}
                                    className="relative glass border border-border rounded-2xl p-5 flex flex-col hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
                                    style={{
                                        animationDelay: `${idx * 60}ms`,
                                        boxShadow: undefined,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 35px -10px ${glow}`)}
                                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                                >
                                    {/* Ambient corner glow, colored by status */}
                                    <div
                                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: glow, filter: "blur(40px)" }}
                                    ></div>

                                    {/* Light sweep on hover */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

                                    {/* Top row: score + status */}
                                    <div className="relative flex items-start justify-between mb-4">
                                        <div className="shrink-0">
                                            {a.status === "completed" ? (
                                                <ScoreGauge score={a.overallScore} size={56} strokeWidth={5} />
                                            ) : a.status === "processing" ? (
                                                <div className="w-14 h-14 rounded-full glass border border-primary/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                                                    <Loader2 size={20} className="text-primary animate-spin" />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-full glass border border-danger/20 flex items-center justify-center">
                                                    <AlertCircle size={20} className="text-danger" />
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                a.status === "completed" ? "bg-success/10 text-success" : a.status === "processing" ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"
                                            }`}
                                        >
                                            {a.status}
                                        </span>
                                    </div>

                                    {/* URL + Meta */}
                                    <div className="relative flex-1 min-w-0 mb-4">
                                        <Link to={`/report/${a._id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block">
                                            {hostname}
                                        </Link>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{a.url}</p>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                                            <Clock size={12} />
                                            {new Date(a.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Category scores */}
                                    {a.status === "completed" && (
                                        <div className="relative grid grid-cols-4 gap-2 mb-4">
                                            {[
                                                { label: "SEO", value: a.categories.seo },
                                                { label: "Perf", value: a.categories.performance },
                                                { label: "A11y", value: a.categories.accessibility },
                                                { label: "BP", value: a.categories.bestPractices },
                                            ].map((c) => (
                                                <div key={c.label} className="text-center rounded-lg py-1.5 bg-muted/30">
                                                    <p className={`text-sm font-bold ${getScoreClass(c.value)}`}>{c.value}</p>
                                                    <p className="text-[10px] text-muted-foreground">{c.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="relative flex items-center gap-2 mt-auto pt-3 border-t border-border">
                                        <Link
                                            to={`/report/${a._id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 hover:shadow-[0_0_15px_-4px_rgba(99,102,241,0.5)] transition-all"
                                        >
                                            <ExternalLink size={14} />
                                            View Report
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(a._id)}
                                            disabled={deleting === a._id}
                                            className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-50 shrink-0"
                                            title="Delete"
                                        >
                                            {deleting === a._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>

                                    {/* Glowing bottom accent line on hover */}
                                    <div
                                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                                        style={{ background: `linear-gradient(to right, ${glow}, transparent)`, boxShadow: `0 0 10px ${glow}` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl glass border border-border text-sm text-foreground disabled:opacity-30 hover:border-primary/30 hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)] transition-all">
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl glass border border-border text-sm text-foreground disabled:opacity-30 hover:border-primary/30 hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)] transition-all">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}