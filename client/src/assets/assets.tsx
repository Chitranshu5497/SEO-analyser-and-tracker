/* eslint-disable react-refresh/only-export-components */
import { BarChart3Icon, EyeIcon, ScanSearch, Link, ShieldCheck, Keyboard, TrendingUpIcon, ChartLine } from "lucide-react";

export const homeFeaturesData = [
    {
        icon: <BarChart3Icon size={28} />,
        title: "SEO Score",
        desc: "Get SEO scores analyzing 50+ ranking factors with AI-powered insights.",
    },
    {
        icon: <ChartLine size={28} />,
        title: "Performance",
        desc: "Analyze loading times, page size, and Core Web Vitals to maximize your site speed and SEO score.",
    },
    {
        icon: <ShieldCheck size={28} />,
        title: "Best Practices",
        desc: "Check meta tags, heading structure, image optimization, and technical SEO health.",
    },
    {
        icon: <EyeIcon size={28} />,
        title: "Accessibility",
        desc: "Ensure your site is accessible to all users with alt text, ARIA, and contrast checks.",
    },
    {
        icon: <Keyboard size={28} />,
        title: "Keyword Analysis",
        desc: "Discover top keywords, density analysis, and content optimization opportunities.",
    },
    {
        icon: <TrendingUpIcon size={28} />,
        title: "Actionable Fixes",
        desc: "Get prioritized, actionable recommendations to boost your search rankings and SEO score.",
    },
];

export const homeHowItWorksData = [
    {
        num: "01",
        icon: <Link size={24} />,
        title: "Enter Your URL",
        desc: "Paste any website URL into the analyzer bar to get detailed stats.",
    },
    {
        num: "02",
        icon: <ScanSearch size={24} />,
        title: "AI Scans Your Site",
        desc: "BrowserBase visits your site and Gemini AI analyzes every SEO factor.",
    },
    {
        num: "03",
        icon: <BarChart3Icon size={24} />,
        title: "Get Your Report",
        desc: "Receive a detailed report with scores, issues, and recommendations.",
    },
];

export const homefooterLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", path: "/#features" },
            { label: "Pricing", path: "/#pricing" },
            { label: "API", path: "/api-docs" },
            { label: "Browser Extension", path: "/extension" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", path: "/docs" },
            { label: "Blog", path: "/blog" },
            { label: "SEO Guide", path: "/guide" },
            { label: "Support", path: "/support" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", path: "/about" },
            { label: "Careers", path: "/careers" },
            { label: "Contact", path: "/contact" },
            { label: "Press", path: "/press" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms of Service", path: "/terms" },
            { label: "Cookie Policy", path: "/cookies" },
        ],
    },
];

export const HomeWave = () => (
    <svg className="w-full h-[15vh] min-h-15 max-h-30" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="var(--accent)" opacity="0.05" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="var(--accent)" opacity="0.1" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="var(--accent)" opacity="0.15" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--accent)" opacity="0.2" />
        </g>
    </svg>
);
