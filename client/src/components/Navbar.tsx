import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Search, BarChart3, History, LogOut, Menu, X, Target, Sun, Moon, ChartNoAxesCombined } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
    const { user, logout } = useApp();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
        { path: "/analyze", label: "Analyze", icon: <Search size={18} /> },
        { path: "/rank-tracker", label: "Rank Tracker", icon: <Target size={18} /> },
        { path: "/history", label: "History", icon: <History size={18} /> },
    ];

    return (
        <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-lg z-50 border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_20px_-2px_rgba(99,102,241,0.6)] transition-shadow">
                            <ChartNoAxesCombined size={16} className="text-primary" />
                        </div>
                        <span className="text-xl tracking-tight text-foreground font-medium">SiteRank</span>
                    </Link>

                    {/* Desktop nav */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                        isActive(link.path)
                                            ? "bg-accent/10 text-accent font-medium shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center justify-center" aria-label="Toggle theme">
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-border bg-card text-sm hover:border-primary/30 hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)] transition-all">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold shadow-[0_0_10px_-2px_rgba(99,102,241,0.6)]" style={{ color: "var(--background)" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-foreground font-medium">{user.name}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-accent/10 border border-accent/15 text-accent">{user.plan}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="relative px-5 py-2 rounded-full bg-primary text-sm shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_22px_rgba(99,102,241,0.7)] transition-all overflow-hidden group"
                                    style={{ color: "var(--background)" }}
                                >
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle container */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="text-muted-foreground hover:text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-b border-border bg-background origin-top">
                    <div className="px-4 py-3 space-y-1">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-muted rounded-lg border border-border">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(99,102,241,0.6)]" style={{ color: "var(--background)" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                                <div className="py-2 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                                                isActive(link.path) ? "bg-accent/10 text-accent shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-danger hover:bg-danger/10 w-full mt-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="py-2 space-y-2">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium text-foreground text-center rounded-lg hover:bg-muted">
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-3 text-sm font-semibold text-center rounded-lg bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ color: "var(--background)" }}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}