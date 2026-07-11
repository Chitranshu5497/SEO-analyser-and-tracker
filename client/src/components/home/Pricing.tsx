import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Pricing() {
    return (
        <section id="pricing" className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>

            {/* Soft glow behind heading */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-105 h-75 bg-primary/20 blur-[120px] rounded-full -z-1"></div>

            <div className="max-w-5xl w-full mx-auto px-4">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
                        Pricing
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-foreground tracking-tight">
                        Simple <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Start free. Upgrade when you're ready to scale up.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-center">
                    {/* Free */}
                    <div className="relative bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

                        <h3 className="text-xl font-semibold mb-1 text-foreground">Free</h3>
                        <p className="text-sm text-muted-foreground mb-4">For casual, one-off checks</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {["5 analyses per day", "Full SEO report", "Keyword analysis", "Issue detection", "Export results"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/register"
                            className="block w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-center text-sm font-medium hover:bg-primary/15 hover:border-primary/40 transition-all"
                        >
                            Get Started Free
                        </Link>

                        {/* Glowing bottom accent line on hover */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary via-primary/70 to-transparent group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                    </div>

                    {/* Pro */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border-2 border-primary/50 overflow-hidden shadow-[0_0_45px_-8px_rgba(99,102,241,0.4)] md:scale-105 hover:shadow-[0_0_55px_-5px_rgba(99,102,241,0.55)] hover:-translate-y-1 transition-all duration-300 group">
                        {/* Ambient glow inside card */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

                        {/* Light sweep */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-xs font-medium shadow-[0_0_15px_rgba(99,102,241,0.6)]" style={{ color: "var(--background)" }}>
                            Most Popular
                        </div>

                        <h3 className="text-xl font-semibold mb-1 text-foreground">Pro</h3>
                        <p className="text-sm text-muted-foreground mb-4">For agencies and power users</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold gradient-text">$19</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {["Unlimited analyses", "Priority processing", "Competitor analysis", "Historical tracking", "API access", "Email reports"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="w-full py-3 rounded-xl bg-primary text-center text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] hover:opacity-95 transition-all"
                            style={{ color: "var(--background)" }}
                        >
                            Upgrade to Pro
                        </button>

                        {/* Glowing bottom accent line on hover */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary via-primary/70 to-transparent group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}