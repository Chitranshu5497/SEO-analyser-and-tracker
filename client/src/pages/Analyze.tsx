/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon, GlobeIcon, FileSearchIcon, BrainIcon, CheckCircleIcon, AlertCircle, Loader2, ArrowRightIcon } from "lucide-react";
import { useApp } from "../context/AppContext";

const STEPS = [
    { icon: <GlobeIcon size={22} />, label: "Connecting to browser", desc: "Creating cloud browser session..." },
    { icon: <FileSearchIcon size={22} />, label: "Scanning website", desc: "Extracting meta tags, links, images..." },
    { icon: <BrainIcon size={22} />, label: "AI Analysis", desc: "Gemini is analyzing your SEO data..." },
    { icon: <CheckCircleIcon size={22} />, label: "Report Ready", desc: "Your SEO report is complete!" },
];

export default function Analyze() {
    const { api } = useApp();

    const [url, setUrl] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const pollRef = useRef<any>(null);

    const navigate = useNavigate();

    const handleAnalyze = async (submitUrl?: string) => {
        const targetUrl = submitUrl || url;
        if (!targetUrl.trim()) return;

        setError("");
        setAnalyzing(true);
        setCurrentStep(0);

        try {
            // Step 0: Connecting
            setCurrentStep(0);

            const res = await api.post("/api/analysis/analyze", {
                url: targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`,
            });

            if (!res.data.success) {
                throw new Error(res.data.message);
            }

            const id = res.data.analysisId;

            // Step 1: Scanning
            setCurrentStep(1);

            // Poll for completion
            let attempts = 0;
            const maxAttempts = 60; // 2 minutes max

            pollRef.current = setInterval(async () => {
                attempts++;
                if (attempts > maxAttempts) {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setError("Analysis is taking longer than expected. Check your history later.");
                    setAnalyzing(false);
                    return;
                }

                try {
                    const check = await api.get(`/api/analysis/${id}`);
                    const analysis = check.data.analysis;

                    if (analysis.status === "completed") {
                        if (pollRef.current) clearInterval(pollRef.current);
                        setCurrentStep(3);
                        setTimeout(() => navigate(`/report/${id}`), 1000);
                    } else if (analysis.status === "failed") {
                        if (pollRef.current) clearInterval(pollRef.current);
                        setError("Analysis failed. The AI model might be down.");
                        setAnalyzing(false);
                    } else {
                        // Still processing - advance visual steps
                        if (attempts > 5) setCurrentStep(2);
                    }
                } catch {
                    // Ignore polling errors
                }
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to start analysis");
            setAnalyzing(false);
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        handleAnalyze();
    };

    useEffect(() => {
        const prefillUrl = searchParams.get("url");
        if (prefillUrl) {
            (() => setUrl(prefillUrl))();
            // Auto-start if URL is provided
            setTimeout(() => handleAnalyze(prefillUrl), 500);
        }

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    return (
        <div className="relative min-h-screen pt-16 md:pt-24 bg-background overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary/15 blur-[130px] rounded-full -z-1 pointer-events-none"></div>

            <div className="relative max-w-3xl mx-auto px-4 py-12">
                {!analyzing ? (
                    <div>
                        <div className="text-center mb-10 mt-24">
                            <h1 className="text-3xl sm:text-4xl font-medium text-foreground mb-3">
                                Analyze <span className="gradient-text">Any Website</span>
                            </h1>
                            <p className="text-muted-foreground">Enter a URL to get a comprehensive AI-powered SEO audit report.</p>
                        </div>

                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2 max-w-xl mx-auto shadow-[0_0_20px_-8px_rgba(239,68,68,0.4)]">
                                <AlertCircle size={18} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                            <div className="border border-primary/20 rounded-full p-1.5 px-2 flex items-center gap-2 shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] focus-within:border-primary/50 focus-within:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)] transition-all duration-300">
                                <div className="flex items-center gap-3 flex-1 px-3">
                                    <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Enter website URL (e.g., example.com)"
                                        className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-3"
                                        id="analyze-url-input"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="relative bg-primary px-6 py-3 rounded-full flex items-center gap-2 text-primary-foreground text-sm hover:opacity-90 transition-all shrink-0 shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] overflow-hidden group"
                                    id="analyze-submit-btn"
                                    style={{ color: "var(--background)" }}
                                >
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                                    Analyze <ArrowRightIcon className="text-background size-4 shrink-0" />
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Examples:{" "}
                            {["github.com", "stripe.com", "vercel.com"].map((ex, i) => (
                                <span key={ex}>
                                    <button
                                        onClick={() => {
                                            setUrl(ex);
                                        }}
                                        className="text-primary hover:underline"
                                    >
                                        {ex}
                                    </button>
                                    {i < 2 ? ", " : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Analyzing State */}
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-medium text-foreground">Analyzing Your Website</h2>
                            <div className="flex justify-center items-center gap-2 mt-2">
                                <Loader2 size={16} className="text-primary/60 mt-0.5 animate-spin" />
                                <p className="text-muted-foreground sm:text-lg">{url}</p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="max-w-md mx-auto space-y-4">
                            {STEPS.map((step, i) => {
                                const isComplete = i < currentStep;
                                const isCurrent = i === currentStep;
                                const isPending = i > currentStep;

                                return (
                                    <div
                                        key={step.label}
                                        className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 overflow-hidden ${
                                            isCurrent
                                                ? "glass-strong border border-primary/40 shadow-[0_0_30px_-8px_rgba(99,102,241,0.45)]"
                                                : isComplete
                                                ? "glass border border-success/20 opacity-70"
                                                : "glass border border-border opacity-30"
                                        }`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute inset-0 -translate-x-full animate-[shine_2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
                                        )}

                                        <div
                                            className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                                isComplete
                                                    ? "bg-success/15 text-success shadow-[0_0_15px_-4px_rgba(16,185,129,0.5)]"
                                                    : isCurrent
                                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_-3px_rgba(99,102,241,0.7)]"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                            style={isCurrent ? { color: "var(--background)" } : {}}
                                        >
                                            {isComplete ? <CheckCircleIcon size={20} /> : step.icon}
                                        </div>
                                        <div className="relative flex-1">
                                            <p className={`text-sm font-medium ${isPending ? "text-muted-foreground" : "text-foreground"}`}>{step.label}</p>
                                            <p className="text-xs text-muted-foreground">{step.desc}</p>
                                        </div>
                                        {isCurrent && <div className="relative w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-center text-xs text-muted-foreground mt-8">This may take 15-30 seconds depending on the website.</p>
                    </div>
                )}
            </div>
        </div>
    );
}