/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Plus, RefreshCw, Trash2, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Loader2, X, Search, Globe, AlertCircle, Eye, EyeOff, Filter, ArrowUpDown } from "lucide-react";
import { useApp } from "../context/AppContext";

interface KeywordItem {
    _id: string;
    keyword: string;
    url: string;
    domain: string;
    currentPosition: number | null;
    currentPage: number | null;
    bestPosition: number | null;
    positionChange: number;
    active: boolean;
    lastChecked: string | null;
    status: string;
    competitors: { position: number; url: string; domain: string; title: string; snippet: string }[];
}

export default function RankTracker() {
    const { api } = useApp();

    const [keywords, setKeywords] = useState<KeywordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState("");
    const [refreshing, setRefreshing] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const fetchKeywords = async () => {
        try {
            const res = await api.get("/api/rank/list");
            if (res.data.success) {
                setKeywords(res.data.keywords);
            }
        } catch (err) {
            console.error("Failed to fetch keywords:", err);
        }
        setLoading(false);
    };

    const handleAdd = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newKeyword.trim() || !newUrl.trim()) return;

        setAdding(true);
        setAddError("");
        try {
            const res = await api.post("/api/rank/add", {
                keyword: newKeyword.trim(),
                url: newUrl.trim(),
            });
            if (res.data.success) {
                setKeywords((prev) => [res.data.tracking, ...prev]);
                setNewKeyword("");
                setNewUrl("");
                setShowAddModal(false);

                // Poll for completion
                const id = res.data.tracking._id;
                const pollInterval = setInterval(async () => {
                    try {
                        const check = await api.get(`/api/rank/${id}`);
                        if (check.data.tracking.status !== "checking") {
                            clearInterval(pollInterval);
                            setKeywords((prev) => prev.map((k) => (k._id === id ? check.data.tracking : k)));
                        }
                    } catch (error: any) {
                        console.error(error);
                    }
                }, 3000);
            }
        } catch (err: any) {
            setAddError(err.response?.data?.message || "Failed to add keyword");
        }
        setAdding(false);
    };

    const handleRefresh = async (id: string) => {
        setRefreshing(id);
        try {
            await api.post(`/api/rank/${id}/refresh`);
            // Update status to checking
            setKeywords((prev) => prev.map((k) => (k._id === id ? { ...k, status: "checking" } : k)));

            // Poll for completion
            const pollInterval = setInterval(async () => {
                try {
                    const check = await api.get(`/api/rank/${id}`);
                    if (check.data.tracking.status !== "checking") {
                        clearInterval(pollInterval);
                        setKeywords((prev) => prev.map((k) => (k._id === id ? check.data.tracking : k)));
                        setRefreshing(null);
                    }
                } catch (error: any) {
                    console.error(error);
                }
            }, 3000);
        } catch (err) {
            console.error("Refresh failed:", err);
            setRefreshing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this keyword tracking?")) return;
        setDeleting(id);
        try {
            await api.delete(`/api/rank/${id}`);
            setKeywords((prev) => prev.filter((k) => k._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
        setDeleting(null);
    };

    const handleToggle = async (id: string) => {
        try {
            const res = await api.put(`/api/rank/${id}/toggle`);
            if (res.data.success) {
                setKeywords((prev) => prev.map((k) => (k._id === id ? { ...k, active: res.data.tracking.active } : k)));
            }
        } catch (err) {
            console.error("Toggle failed:", err);
        }
    };

    const getPositionBadge = (pos: number | null) => {
        if (pos === null) return { text: "Not Ranked", class: "text-muted-foreground bg-muted/50" };
        if (pos <= 3) return { text: `#${pos}`, class: "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30" };
        if (pos <= 10) return { text: `#${pos}`, class: "text-primary bg-primary/15 border border-primary/30" };
        if (pos <= 20) return { text: `#${pos}`, class: "text-accent bg-accent/15 border border-accent/30" };
        return { text: `#${pos}`, class: "text-danger bg-danger/15 border border-danger/30" };
    };

    const getChangeIndicator = (change: number) => {
        if (change > 0) return { icon: <TrendingUp size={14} />, text: `+${change}`, class: "text-emerald-500" };
        if (change < 0) return { icon: <TrendingDown size={14} />, text: `${change}`, class: "text-danger" };
        return { icon: <Minus size={14} />, text: "0", class: "text-muted-foreground" };
    };

    const getPositionGlow = (pos: number | null) => {
        if (pos === null) return "rgba(148,163,184,0.25)";
        if (pos <= 3) return "rgba(16,185,129,0.4)";
        if (pos <= 10) return "rgba(99,102,241,0.4)";
        if (pos <= 20) return "rgba(245,158,11,0.4)";
        return "rgba(239,68,68,0.4)";
    };

    let processedData = [...keywords];

    if (searchQuery) {
        processedData = processedData.filter((k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || k.domain.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (statusFilter !== "all") {
        if (statusFilter === "active") {
            processedData = processedData.filter((k) => k.active === true);
        } else if (statusFilter === "paused") {
            processedData = processedData.filter((k) => k.active === false);
        }
    }

    processedData.sort((a: any, b: any) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        } else if (sortBy === "rank_asc") {
            return (a.currentPosition || 999) - (b.currentPosition || 999);
        } else if (sortBy === "rank_desc") {
            return (b.currentPosition || 0) - (a.currentPosition || 0);
        } else if (sortBy === "change") {
            return (b.positionChange || 0) - (a.positionChange || 0);
        }
        return 0;
    });

    useEffect(() => {
        (async () => await fetchKeywords())();
    }, []);

    return (
        <div className="relative min-h-screen pt-16 md:pt-24 bg-background overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-20 left-1/4 w-125 h-75 bg-primary/10 blur-[130px] rounded-full -z-1 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-100 h-75 bg-primary/5 blur-[120px] rounded-full -z-1 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
                            <span className="gradient-text">Rank Tracker</span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">Track your keyword rankings on Google — updated daily.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="relative bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 self-start shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] overflow-hidden group"
                        id="add-keyword-btn"
                        style={{ color: "var(--background)" }}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                        <Plus size={18} />
                        Track Keyword
                    </button>
                </div>

                {/* Filters Row */}
                <div className="mb-8 flex flex-col md:flex-row gap-3" style={{ animationDelay: "100ms" }}>
                    <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1 focus-within:border-primary/40 focus-within:shadow-[0_0_20px_-6px_rgba(99,102,241,0.5)] transition-all">
                        <Search size={18} className="text-muted-foreground" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search keywords or domains..." className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1" id="rank-search-input" />
                    </div>

                    <div className="flex gap-3">
                        <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-primary/30 transition-all">
                            <Filter size={16} className="text-muted-foreground" />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="all" className="bg-background">
                                    All Status
                                </option>
                                <option value="active" className="bg-background">
                                    Active
                                </option>
                                <option value="paused" className="bg-background">
                                    Paused
                                </option>
                            </select>
                        </div>
                        <div className="glass border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-primary/30 transition-all">
                            <ArrowUpDown size={16} className="text-muted-foreground" />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer">
                                <option value="newest" className="bg-background">
                                    Newest First
                                </option>
                                <option value="rank_asc" className="bg-background">
                                    Highest Ranked
                                </option>
                                <option value="rank_desc" className="bg-background">
                                    Lowest Ranked
                                </option>
                                <option value="change" className="bg-background">
                                    Biggest Gain
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Keywords Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-30">
                        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : processedData.length === 0 ? (
                    <div className="relative glass border border-border rounded-2xl p-12 text-center overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                            <Target size={26} className="text-primary" />
                        </div>
                        <h3 className="relative text-lg font-semibold text-foreground mb-2">No keywords tracked yet</h3>
                        <p className="relative text-sm text-muted-foreground mb-6">Add your first keyword and URL to start tracking your Google rankings.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="relative bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)]"
                            style={{ color: "var(--background)" }}
                        >
                            Track Your First Keyword
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ animationDelay: "200ms" }}>
                        {processedData.map((kw, idx) => {
                            const posBadge = getPositionBadge(kw.currentPosition);
                            const change = getChangeIndicator(kw.positionChange);
                            const glow = getPositionGlow(kw.currentPosition);

                            return (
                                <div
                                    key={kw._id}
                                    className={`relative glass border border-border rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden ${!kw.active ? "opacity-50" : ""}`}
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 35px -12px ${glow}`)}
                                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                                >
                                    {/* Ambient corner glow */}
                                    <div
                                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: glow, filter: "blur(40px)" }}
                                    ></div>

                                    {/* Light sweep on hover */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

                                    <div className="relative flex items-start gap-4">
                                        {/* Rank badge */}
                                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                                            {kw.status === "checking" ? (
                                                <div className="w-16 h-16 rounded-xl glass border border-primary/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                                                    <Loader2 size={24} className="text-primary animate-spin" />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold ${posBadge.class}`}
                                                    style={{ boxShadow: `0 0 15px -4px ${glow}` }}
                                                >
                                                    {kw.currentPosition ? `#${kw.currentPosition}` : "—"}
                                                </div>
                                            )}
                                            {kw.status === "completed" && kw.currentPosition && (
                                                <div className={`flex items-center gap-1 text-xs font-medium ${change.class}`}>
                                                    {change.icon}
                                                    {change.text}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link to={`/rank/${kw._id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors block truncate">
                                                "{kw.keyword}"
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Globe size={12} className="text-muted-foreground shrink-0" />
                                                <span className="text-sm text-muted-foreground truncate">{kw.domain}</span>
                                                {kw.currentPage && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">Page {kw.currentPage}</span>}
                                            </div>
                                            {kw.lastChecked && (
                                                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                                    <Clock size={10} />
                                                    {new Date(kw.lastChecked).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    {kw.status === "completed" && (
                                        <div className="relative grid grid-cols-2 gap-2 mt-4">
                                            <div className="text-center rounded-lg py-2 bg-muted/30">
                                                <p className="text-sm font-bold text-primary">{kw.bestPosition || "—"}</p>
                                                <p className="text-[10px] text-muted-foreground">Best Position</p>
                                            </div>
                                            <div className="text-center rounded-lg py-2 bg-muted/30">
                                                <p className="text-sm font-bold text-accent">{kw.competitors?.length || 0}</p>
                                                <p className="text-[10px] text-muted-foreground">Competitors</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="relative flex items-center gap-1.5 mt-4 pt-3 border-t border-border">
                                        <Link
                                            to={`/rank/${kw._id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 hover:shadow-[0_0_15px_-4px_rgba(99,102,241,0.5)] transition-all"
                                        >
                                            <ExternalLink size={14} />
                                            View Details
                                        </Link>
                                        <button onClick={() => handleRefresh(kw._id)} disabled={refreshing === kw._id || kw.status === "checking"} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all disabled:opacity-30" title="Refresh Ranking">
                                            <RefreshCw size={16} className={refreshing === kw._id ? "animate-spin" : ""} />
                                        </button>
                                        <button
                                            onClick={() => handleToggle(kw._id)}
                                            className={`p-2 rounded-lg hover:bg-muted transition-all ${kw.active ? "text-success hover:text-success" : "text-muted-foreground hover:text-foreground"}`}
                                            title={kw.active ? "Pause Tracking" : "Resume Tracking"}
                                        >
                                            {kw.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => handleDelete(kw._id)} disabled={deleting === kw._id} className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-50" title="Delete">
                                            {deleting === kw._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative bg-background border border-primary/20 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)] overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/15 blur-[60px] rounded-full pointer-events-none"></div>

                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">Track New Keyword</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setAddError("");
                                }}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {addError && (
                            <div className="relative mb-4 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2 shadow-[0_0_20px_-8px_rgba(239,68,68,0.4)]">
                                <AlertCircle size={16} className="shrink-0" />
                                {addError}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="relative space-y-4">
                            <div>
                                <label htmlFor="modal-keyword" className="block text-sm font-medium text-foreground mb-1.5">
                                    Keyword
                                </label>
                                <div className="relative group">
                                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        id="modal-keyword"
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        placeholder='e.g., "best seo tools"'
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal-url" className="block text-sm font-medium text-foreground mb-1.5">
                                    Website URL
                                </label>
                                <div className="relative group">
                                    <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        id="modal-url"
                                        type="text"
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        placeholder="e.g., example.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                                <p>💡 We'll search Google for your keyword, find your website's position (up to page 5), and track it daily.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="relative w-full py-3 rounded-xl bg-primary font-semibold text-sm text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] overflow-hidden group"
                                style={{ color: "var(--background)" }}
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                                {adding ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Target size={18} />
                                        Start Tracking
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}