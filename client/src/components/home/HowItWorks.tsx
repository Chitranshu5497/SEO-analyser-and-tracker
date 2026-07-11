/* eslint-disable @typescript-eslint/no-explicit-any */
import { homeHowItWorksData } from "../../assets/assets";

export default function HowItWorks() {
    return (
        <section className="relative max-w-5xl md:min-h-[80vh] mx-auto px-4 py-24 overflow-hidden">
            {/* Soft glow behind heading */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-75 h-75 bg-primary/20 blur-[120px] rounded-full -z-1"></div>

            <div className="text-center mb-16 animate-slide-up">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-foreground">
                    How It <span className="gradient-text">Works</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">SiteRank uses advanced browser automation and AI to simulate a real user experience and provide deep SEO insights.</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-27.5 left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-0"></div>

                {homeHowItWorksData.map((step: any, i: number) => (
                    <div key={step.num} className="relative z-10 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="relative bg-card border border-border rounded-2xl p-8 text-center h-full hover:border-primary/50 hover:shadow-[0_0_35px_-5px_rgba(99,102,241,0.35)] hover:-translate-y-1.5 transition-all duration-300 group/step overflow-hidden">
                            {/* Light sweep on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover/step:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                            <div className="text-5xl font-bold text-primary/10 mb-4 group-hover/step:text-primary/25 transition-colors duration-300">{step.num}</div>

                            <div className="relative size-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-primary bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_20px_-3px_rgba(99,102,241,0.4)] group-hover/step:shadow-[0_0_25px_-2px_rgba(99,102,241,0.65)] group-hover/step:border-primary/50 group-hover/step:scale-105 transition-all duration-300">
                                {step.icon}
                            </div>

                            <h3 className="mb-2 text-foreground font-medium">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

                            {/* Glowing bottom accent line on hover */}
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary via-primary/70 to-transparent group-hover/step:w-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}