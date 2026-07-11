/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeFeaturesData } from "../../assets/assets";

export default function Features() {
    return (
        <section id="features" className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>

            {/* Soft glow behind heading */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-125 h-75 bg-primary/20 blur-[120px] rounded-full -z-1"></div>

            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(var(--primary-rgb,99,102,241),0.15)]">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-5 text-foreground tracking-tight">
                        Get your website <span className="gradient-text">to the top</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
                        Real time SEO analysis powered by real browser rendering and artificial intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {homeFeaturesData.map((f: any, idx: number) => (
                        <div
                            key={f.title}
                            className="relative bg-card border border-border rounded-2xl p-7 hover:border-primary/50 hover:shadow-[0_0_35px_-5px_rgba(var(--primary-rgb,99,102,241),0.35)] hover:-translate-y-1.5 backdrop-blur transition-all duration-300 group overflow-hidden"
                        >
                            {/* Light sweep on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                            {/* Subtle corner number */}
                            <span className="absolute top-5 right-6 text-xs font-medium text-muted-foreground/40">
                                {String(idx + 1).padStart(2, "0")}
                            </span>

                            {/* Icon badge with gradient + glow */}
                            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary mb-5 shadow-[0_0_20px_-3px_rgba(var(--primary-rgb,99,102,241),0.4)] group-hover:shadow-[0_0_25px_-2px_rgba(var(--primary-rgb,99,102,241),0.6)] group-hover:scale-105 transition-all duration-300">
                                {f.icon}
                            </div>

                            <h3 className="text-lg font-medium mb-2.5 text-foreground">
                                {f.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {f.desc}
                            </p>

                            {/* Glowing bottom accent line on hover */}
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary via-primary/70 to-transparent group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary-rgb,99,102,241),0.8)]"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}