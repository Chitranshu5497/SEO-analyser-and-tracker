/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartNoAxesCombined } from "lucide-react";
import { homefooterLinks } from "../../assets/assets";
import { SiX, SiInstagram, SiFacebook, SiTwitch } from "@icons-pack/react-simple-icons";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="relative border-t border-border py-12 bg-card text-foreground overflow-hidden">
            {/* Soft glow at the top of footer */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-75 h-50 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
                                <ChartNoAxesCombined size={16} className="text-primary" />
                            </div>
                            <span className="text-xl font-medium">SiteRank</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 w-5/6">Optimize your website for search engines with AI-powered insights and real-time tracking.</p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] transition-all">
                                <SiX size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] transition-all">
                                <SiInstagram size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] transition-all">
                                <SiFacebook size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] transition-all">
                                <SiTwitch size={16} />
                            </a>
                        </div>
                    </div>

                    {homefooterLinks.map((section: any) => (
                        <div key={section.title}>
                            <h3 className="mb-4 text-sm font-medium text-foreground">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link: any) => (
                                    <li key={link.label}>
                                        {link.path.startsWith("/#") ? (
                                            // In-page anchor (e.g. scroll to #features on the home page)
                                            <a href={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                {link.label}
                                            </a>
                                        ) : (
                                            // Real route
                                            <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SiteRank. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute bg-green-500 size-2 rounded-full animate-ping"></div>
                            <div className="bg-green-500 size-1.5 rounded-full"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}