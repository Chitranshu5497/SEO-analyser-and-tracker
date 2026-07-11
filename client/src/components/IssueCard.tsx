import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Issue {
    severity: string;
    category: string;
    message: string;
    recommendation: string;
}

export default function IssueCard({ issue }: { issue: Issue }) {
    const [expanded, setExpanded] = useState(false);

    const severityConfig: Record<string, { icon: React.ReactNode; class: string; label: string; glow: string }> = {
        critical: {
            icon: <AlertCircle size={16} />,
            class: "severity-critical",
            label: "Critical",
            glow: "rgba(239,68,68,0.35)",
        },
        warning: {
            icon: <AlertTriangle size={16} />,
            class: "severity-warning",
            label: "Warning",
            glow: "rgba(245,158,11,0.35)",
        },
        info: {
            icon: <Info size={16} />,
            class: "severity-info",
            label: "Info",
            glow: "rgba(99,102,241,0.35)",
        },
    };

    const config = severityConfig[issue.severity] || severityConfig.info;

    return (
        <div
            className="relative glass border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/25 cursor-pointer group"
            style={{ boxShadow: expanded ? `0 0 25px -8px ${config.glow}` : undefined }}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Light sweep on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

            <div className="relative flex items-start gap-3 p-4">
                <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${config.class}`}
                    style={{ boxShadow: `0 0 15px -4px ${config.glow}` }}
                >
                    {config.icon}
                    {config.label}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{issue.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{issue.category}</p>
                </div>
                <div className={`text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>
            {expanded && (
                <div className="relative px-4 pb-4 border-t border-border pt-3">
                    <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
                        <span className="text-primary text-sm mt-0.5">💡</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{issue.recommendation}</p>
                    </div>
                </div>
            )}

            {/* Glowing bottom accent line, colored by severity */}
            <div
                className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
                style={{
                    width: expanded ? "100%" : "0%",
                    background: `linear-gradient(to right, ${config.glow}, transparent)`,
                    boxShadow: `0 0 10px ${config.glow}`,
                }}
            ></div>
        </div>
    );
}