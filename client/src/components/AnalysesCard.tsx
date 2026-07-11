/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangleIcon, ClockIcon } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import { Link } from "react-router-dom";

export default function AnalysesCard({ analysis }: { analysis: any }) {
    const getScoreClass = (s: number) => {
        if (s >= 80) return "score-good";
        if (s >= 50) return "score-medium";
        return "score-poor";
    };

    return (
        <Link
            key={analysis._id}
            to={`/report/${analysis._id}`}
            className="relative glass border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 group block overflow-hidden"
        >
            {/* Light sweep on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{new URL(analysis.url).hostname}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{analysis.url}</p>
                </div>
                {analysis.status === "completed" ? (
                    <div className="rounded-full group-hover:shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)] transition-shadow duration-300">
                        <ScoreGauge score={analysis.overallScore} size={56} strokeWidth={5} />
                    </div>
                ) : analysis.status === "processing" ? (
                    <div className="w-14 h-14 rounded-full glass border border-primary/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-full glass border border-danger/20 flex items-center justify-center">
                        <AlertTriangleIcon size={18} className="text-danger" />
                    </div>
                )}
            </div>

            {analysis.status === "completed" && (
                <div className="relative grid grid-cols-4 gap-2">
                    {[
                        { label: "SEO", value: analysis.categories.seo },
                        { label: "Perf", value: analysis.categories.performance },
                        { label: "A11y", value: analysis.categories.accessibility },
                        { label: "BP", value: analysis.categories.bestPractices },
                    ].map((c) => (
                        <div key={c.label} className="text-center rounded-lg py-1.5 bg-muted/30">
                            <p className={`text-sm font-medium ${getScoreClass(c.value)}`}>{c.value}</p>
                            <p className="text-[10px] text-muted-foreground">{c.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="relative flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                <ClockIcon size={12} /> {new Date(analysis.createdAt).toLocaleDateString()}
            </div>

            {/* Glowing bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary via-primary/70 to-transparent group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
        </Link>
    );
}