"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AboutMetric = {
	label: string;
	value: string;
};

type AboutExperience = {
	role: string;
	company: string;
	period: string;
	description: string[];
};

type AboutContent = {
	eyebrow: string;
	headline: string;
	subtitle: string;
	intro: string;
	metrics: AboutMetric[];
	experiences: AboutExperience[];
};

type ApiAboutResponse = {
	success?: boolean;
	about?: AboutContent;
	message?: string;
};

const getMetricNumber = (value: string) => {
	const match = value.match(/\d+/);
	return match ? Number(match[0]) : 0;
};

const formatMetricValue = (value: string, current: number) => {
	if (value.includes("+")) {
		return `${Math.round(current)}+${value.replace(/[\d+]/g, "").trimStart()}`;
	}

	const suffix = value.replace(/^[\d\s]+/, "");
	return `${Math.round(current)}${suffix}`;
};

const aboutCopy = {
	eyebrow: "About",
	headline: "Frontend Developer building scalable and user-focused web applications.",
	subtitle:
		"Specialized in React and Next.js with hands-on experience delivering production-ready applications through internships and real-world projects.",
	intro:
		"I build interfaces that are precise, performant, and practical, with a strong focus on user experience and maintainability.",
};

const defaultAbout: Pick<AboutContent, "metrics" | "experiences"> = {
	metrics: [
		{ label: "Experience", value: "1+ Years" },
		{ label: "Live Projects", value: "10+" },
		{ label: "Internships", value: "2" },
	],
	experiences: [
		{
			role: "Frontend Developer Intern → Part-Time",
			company: "Nexotech Solutions",
			period: "Apr 2025 — Present",
			description: ["6-month intensive internship focusing on component architecture and responsive design."],
		},
		{
			role: "Frontend Developer Intern",
			company: "WebDzen Technologies",
			period: "Aug 2025 — Sep 2025",
			description: ["Focused on responsive components and UI performance optimization."],
		},
	],
};

const normalizeAbout = (about?: AboutContent | null): Pick<AboutContent, "metrics" | "experiences"> => ({
	metrics: about?.metrics?.length ? about.metrics : defaultAbout.metrics,
	experiences: about?.experiences?.length ? about.experiences : defaultAbout.experiences,
});



export default function About() {
	const sectionRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const metricsRef = useRef<HTMLDivElement>(null);
	const experienceRef = useRef<HTMLDivElement>(null);
	const hasAnimatedMetrics = useRef(false);
	const [content, setContent] = useState<Pick<AboutContent, "metrics" | "experiences">>(defaultAbout);
	const [countedValues, setCountedValues] = useState<string[]>(defaultAbout.metrics.map((metric) => metric.value));

	useEffect(() => {
		const loadAbout = async () => {
			try {
				const response = await fetch("/api/about", { cache: "no-store" });

				if (!response.ok) {
					throw new Error("Failed to load about content");
				}

				const data = (await response.json()) as ApiAboutResponse;
				setContent(normalizeAbout(data.about));
			} catch (loadError) {
				console.error(loadError);
			}
		};

		void loadAbout();
	}, []);

	useEffect(() => {
		setCountedValues(content.metrics.map((metric) => metric.value));
		hasAnimatedMetrics.current = false;
	}, [content.metrics]);

	useEffect(() => {
		if (!sectionRef.current || !contentRef.current) return;

		const ctx = gsap.context(() => {
			const title = contentRef.current?.querySelector("h2");
			if (title) {
				gsap.fromTo(
					title,
					{ opacity: 0, y: 60 },
					{
						opacity: 1,
						y: 0,
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top 70%",
							end: "top 30%",
							scrub: 2,
						},
					}
				);
			}

			const intro = contentRef.current?.querySelector("p:first-of-type");
			if (intro) {
				gsap.fromTo(
					intro,
					{ opacity: 0 },
					{
						opacity: 1,
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top 65%",
							end: "top 25%",
							scrub: 2.5,
						},
					}
				);
			}

			const metricsCards = metricsRef.current?.querySelectorAll(".metric-card");
			if (metricsCards && metricsCards.length > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: metricsRef.current,
						start: "top 72%",
						end: "top 45%",
						scrub: 2.2,
						onEnter: () => {
							if (hasAnimatedMetrics.current) return;
							hasAnimatedMetrics.current = true;

							content.metrics.forEach((metric, index) => {
								const counter = { value: 0 };
									const targetValue = getMetricNumber(metric.value);
								gsap.to(counter, {
										value: targetValue,
									duration: 2.2,
									delay: index * 0.12,
									ease: "power2.out",
									onUpdate: () => {
										setCountedValues((current) => {
											const nextValues = [...current];
												nextValues[index] = formatMetricValue(metric.value, counter.value);
											return nextValues;
										});
									},
								});
							});
						},
					},
				});

				metricsCards.forEach((card, index) => {
					tl.fromTo(
						card,
						{ opacity: 0, y: 50, scale: 0.85 },
						{ opacity: 1, y: 0, scale: 1, duration: 0.6 },
						index * 0.15
					);
				});
			}

			const expItems = experienceRef.current?.querySelectorAll(".exp-item");
			if (expItems && expItems.length > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: experienceRef.current,
						start: "top 72%",
						end: "top 35%",
						scrub: 2,
					},
				});

				expItems.forEach((item, index) => {
					tl.fromTo(
						item,
						{ opacity: 0, y: -50 },
						{ opacity: 1, y: 0, duration: 0.6 },
						index * 0.12
					);
				});
			}

			const rightPanel = contentRef.current?.querySelector(".rounded-3xl");
			if (rightPanel) {
				gsap.fromTo(
					rightPanel,
					{ opacity: 0, scale: 0.9, y: 40 },
					{
						opacity: 1,
						scale: 1,
						y: 0,
						scrollTrigger: {
							trigger: sectionRef.current,
							start: "top 68%",
							end: "top 28%",
							scrub: 2.3,
						},
					}
				);
			}
		});

		return () => ctx.revert();
	}, [content]);

	return (
		<section
			ref={sectionRef}
			id="about"
			className="relative isolate scroll-mt-28 overflow-hidden px-4 py-20 text-white sm:px-7 lg:px-10"
		>
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
					<span className="h-2 w-2 rounded-full bg-[#6d81ff]" />
					{aboutCopy.eyebrow}
				</div>

				<div ref={contentRef} className="grid gap-10 lg:grid-cols-2">
					<div className="space-y-6">
						<div className="space-y-3">
							<p className="text-sm uppercase tracking-[0.2em] text-white/60">Sreyes V</p>
							<h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
									{aboutCopy.headline}
							</h2>
						</div>

							<p className="max-w-xl text-base text-white/70 sm:text-lg">{aboutCopy.subtitle}</p>
							<p className="max-w-xl text-base text-white/60 sm:text-lg">{aboutCopy.intro}</p>

						<div ref={metricsRef} className="grid grid-cols-3 gap-4 pt-4">
							{content.metrics.map((item, index) => (
								<div
									key={`${item.label}-${index}`}
									className="metric-card rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center"
								>
									<p className="text-2xl font-bold tracking-tight">{countedValues[index] ?? item.value}</p>
									<p className="text-xs uppercase tracking-wider text-white/60">{item.label}</p>
								</div>
							))}
						</div>

						<div className="pt-4">
							<a
								href="/about"
								target="_blank"
								className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20"
							>
								View Full Profile
							</a>
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/60">Experience</p>

						<div ref={experienceRef} className="space-y-4">
							{content.experiences.map((item, index) => (
								<div
									key={`${item.role}-${index}`}
									className="exp-item border-b border-white/10 pb-4 last:border-none"
								>
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-medium text-white">{item.role}</p>
											<p className="text-sm text-white/60">{item.company}</p>
										</div>
										<p className="whitespace-nowrap text-xs text-white/50">{item.period}</p>
									</div>
									<ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-400">
										{item.description.map((point, pointIndex) => (
											<li key={`${item.role}-${pointIndex}`}>{point}</li>
										))}
									</ul>
								</div>
							))}
						</div>

						<a
							href="/about"
							target="_blank"
							className="mt-6 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
						>
							View more →
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}