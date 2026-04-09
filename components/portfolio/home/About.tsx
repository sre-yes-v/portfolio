"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
	{ label: "Experience", value: "1+ Years", numValue: 1 },
	{ label: "Live Projects", value: "10+", numValue: 10 },
	{ label: "Internships", value: "2", numValue: 2 },
];

const experience = [
	{
		role: "Frontend Developer Intern → Part-Time",
		company: "Nexotech Solutions",
		period: "Apr 2025 — Present",
	},
	{
		role: "Frontend Developer Intern",
		company: "WebDzen Technologies",
		period: "Aug 2025 — Sep 2025",
	},
];

export default function About() {
	const sectionRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const metricsRef = useRef<HTMLDivElement>(null);
	const experienceRef = useRef<HTMLDivElement>(null);
	const hasAnimatedMetrics = useRef(false);
	const [countedValues, setCountedValues] = useState([0, 0, 0]);

	useEffect(() => {
		if (!sectionRef.current || !contentRef.current) return;

		const ctx = gsap.context(() => {
			// Title smooth fade and rise
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

			// Intro paragraph fade
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

			// Metrics cards - staggered reveal with count animation
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

							metrics.forEach((metric, index) => {
								const counter = { value: 0 };
								gsap.to(counter, {
									value: metric.numValue,
									duration: 2.2,
									delay: index * 0.12,
									ease: "power2.out",
									onUpdate: () => {
										setCountedValues((current) => {
											const nextValues = [...current];
											nextValues[index] = Math.round(counter.value);
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

			// Experience items - staggered slide from top
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

			// Right panel smooth appearance
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
	}, []);

	return (
		<section
			ref={sectionRef}
			id="about"
			className="relative isolate scroll-mt-28 overflow-hidden border-y border-white/10 bg-[#0b1020] px-4 py-20 text-white sm:px-7 lg:px-10"
		>
			{/* Background */}
			<div
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(800px 400px at 10% 20%, rgba(109,129,255,0.18), transparent 70%), radial-gradient(700px 380px at 85% 80%, rgba(67,94,212,0.18), transparent 75%), linear-gradient(180deg, #0b1020 0%, #080d1a 100%)",
				}}
			/>

			<div className="mx-auto max-w-6xl">
				{/* Tag */}
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
					<span className="h-2 w-2 rounded-full bg-[#6d81ff]" />
					About
				</div>

				{/* Main Grid */}
				<div ref={contentRef} className="grid gap-10 lg:grid-cols-2">
					{/* LEFT SIDE */}
					<div className="space-y-6">
						<div className="space-y-3">
							<p className="text-sm uppercase tracking-[0.2em] text-white/60">
								Sreyes V
							</p>

							<h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
								Frontend Developer building scalable and user-focused web applications.
							</h2>
						</div>

						<p className="max-w-xl text-base text-white/70 sm:text-lg">
							Specialized in React and Next.js with hands-on experience delivering production-ready applications through internships and real-world projects.
						</p>

						{/* Metrics */}
						<div ref={metricsRef} className="grid grid-cols-3 gap-4 pt-4">
							{metrics.map((item, index) => (
								<div
									key={item.label}
									className="metric-card rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center"
								>
									<p className="text-2xl font-bold tracking-tight">
										{countedValues[index]}
										{item.value.includes("+") ? "+" : ""}
									</p>
									<p className="text-xs uppercase tracking-wider text-white/60">
										{item.label}
									</p>
								</div>
							))}
						</div>

						{/* CTA */}
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

					{/* RIGHT SIDE */}
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/60">
							Experience
						</p>

						<div ref={experienceRef} className="space-y-4">
							{experience.map((item, index) => (
								<div
									key={index}
									className="exp-item flex items-start justify-between border-b border-white/10 pb-4 last:border-none"
								>
									<div>
										<p className="font-medium">{item.role}</p>
										<p className="text-sm text-white/60">{item.company}</p>
									</div>
									<p className="text-xs text-white/50 whitespace-nowrap">
										{item.period}
									</p>
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