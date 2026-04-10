"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Send, Sparkles } from "lucide-react";

type IconProps = {
    className?: string;
};

function GithubIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
            <path
                d="M12 3.5a8.5 8.5 0 0 0-2.69 16.56c.42.08.58-.18.58-.4v-1.43c-2.36.51-2.86-1.1-2.86-1.1-.38-.97-.94-1.23-.94-1.23-.77-.53.06-.52.06-.52.85.06 1.3.88 1.3.88.76 1.3 1.99.93 2.48.71.08-.55.3-.93.54-1.14-1.89-.21-3.87-.94-3.87-4.18 0-.92.33-1.67.88-2.25-.09-.22-.38-1.12.08-2.33 0 0 .72-.23 2.36.86a8.1 8.1 0 0 1 4.3 0c1.64-1.09 2.36-.86 2.36-.86.46 1.21.17 2.11.08 2.33.55.58.88 1.33.88 2.25 0 3.25-1.98 3.97-3.87 4.18.31.27.59.79.59 1.59v2.35c0 .22.16.48.59.4A8.5 8.5 0 0 0 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LinkedinIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8.1 10.2V15.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8.1 7.9h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M11.4 15.9v-2.9c0-1.18.72-1.96 1.81-1.96 1.07 0 1.5.7 1.5 1.79v3.07" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InstagramIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="16.7" cy="7.3" r="1" fill="currentColor" />
        </svg>
    );
}

const contactLinks = [
    {
        label: "Email",
        value: "sreyesv.dev@gmail.com",
        href: "mailto:sreyesv.dev@gmail.com",
    },
    {
        label: "Location",
        value: "India / Remote",
        href: "https://maps.google.com",
    },
    // {
    //     Labbel: "Open for",
    //     value: "Freelance & Full-time",
    //     href: "#",
    // }
   
];

const socialLinks = [
    {
        label: "GitHub",
        href: "https://github.com/sre-yes-v",
        Icon: GithubIcon,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/sreyes-v",
        Icon: LinkedinIcon,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/sreyes_v?igsh=MTJocTBjYm11NnFyeA%3D%3D",
        Icon: InstagramIcon,
    },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");
        setFeedback("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Failed to send message");

            setStatus("success");
            setFeedback("Your message has been sent successfully.");
            setForm({ name: "", email: "", message: "" });
        } catch (error) {
            console.error(error);
            setStatus("error");
            setFeedback("Something went wrong. Please try again.");
        }
    };

    return (
        <section
            id="contact"
            className=" relative isolate -scroll-mt-10 overflow-hidden px-4 pb-20 pt-16 text-white sm:px-7 sm:pt-18 lg:px-10 lg:pt-20"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
                    <span className="h-2 w-2 rounded-full bg-[#6d81ff]" />
                    Contact
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                                <Sparkles className="h-3.5 w-3.5 text-[#8ea1ff]" />
                                Let’s connect
                            </div>
                            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                                Have a project in mind? Let’s turn it into something polished.
                            </h2>
                            <div className="mt-6 grid gap-3">
                                {contactLinks.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827]/60 px-4 py-4 transition duration-200 hover:border-white/20 hover:bg-white/8"
                                    >
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</p>
                                            <p className="mt-1 text-sm font-medium text-white/90">{item.value}</p>
                                        </div>
                                        <span className="text-sm text-white/40 transition group-hover:text-white/75">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <Mail className="h-5 w-5 text-[#9aa8ff]" />
                                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/45">Preferred contact</p>
                                <p className="mt-2 text-lg font-medium text-white">Email response within 24h</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                <MapPin className="h-5 w-5 text-[#9aa8ff]" />
                                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/45">Working style</p>
                                <p className="mt-2 text-lg font-medium text-white">Remote & Detail-focused</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Card */}
                    <div
                        id="contact-form"
                        className="flex flex-col rounded-3xl border border-white/10 bg-[#1a2747]/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
                    >
                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold text-white">Send a message</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                                    placeholder="Send Your Thoughts..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="inline-flex w-full items-center justify-center gap-2 cursor-pointer rounded-xl bg-slate-300 px-7 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-transform hover:scale-[1.02]"
                            >
                                {status === "loading" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
                                {status === "loading" ? "Sending..." : "Send message"}
                            </button>

                            {feedback && (
                                <p className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-red-400/20 bg-red-400/10 text-red-200"}`}>
                                    {feedback}
                                </p>
                            )}
                        </form>

                        {/* Social Links using Lucide Icons */}
                        <div className="mt-8 border-t border-white/10 pt-6">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">Connect elsewhere</p>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    >
                                        <link.Icon className="h-4 w-4 text-[#8ea1ff] transition-colors group-hover:text-white" />
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}