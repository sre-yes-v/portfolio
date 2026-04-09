"use client";
export default function AboutPage() {
	return (
		<section className="about-page relative isolate overflow-hidden bg-[#030712] px-6 py-24 text-slate-200 sm:py-32 lg:px-8">
			<style jsx global>{`
				@keyframes about-rise {
					from {
						opacity: 0;
						transform: translateY(22px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes about-slide-left {
					from {
						opacity: 0;
						transform: translateX(20px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes about-glow-float {
					0%,
					100% {
						transform: translateY(0) scale(1);
						opacity: 0.8;
					}
					50% {
						transform: translateY(-10px) scale(1.03);
						opacity: 1;
					}
				}

				.about-reveal {
					opacity: 0;
					animation: about-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
				}

				.about-delay-1 { animation-delay: 120ms; }
				.about-delay-2 { animation-delay: 220ms; }
				.about-delay-3 { animation-delay: 320ms; }
				.about-delay-4 { animation-delay: 420ms; }

				.about-card {
					opacity: 0;
					animation: about-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
				}

				.about-timeline-item {
					opacity: 0;
					animation: about-slide-left 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
				}

				.about-float {
					animation: about-glow-float 8s ease-in-out infinite;
				}

				.about-float-slow {
					animation-duration: 11s;
				}
			`}</style>
			{/* Advanced Background Gradient */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div
					className="about-float absolute -top-[10%] left-[5%] h-150 w-150 rounded-full bg-blue-600/10 blur-[120px]"
					style={{ filter: "blur(120px)" }}
				/>
				<div
					className="about-float about-float-slow absolute bottom-[10%] right-[5%] h-125 w-125 rounded-full bg-indigo-500/10 blur-[100px]"
					style={{ filter: "blur(100px)" }}
				/>
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
			</div>

			<div className="mx-auto max-w-7xl">
				{/* HEADER SECTION */}
				<header className="about-reveal mb-20 max-w-3xl space-y-4">
					<div className="about-reveal about-delay-1 flex items-center gap-2">
						<span className="h-px w-8 bg-blue-500"></span>
						<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
							The Portfolio of
						</p>
					</div>

					<h1 className="about-reveal about-delay-2 text-5xl font-bold tracking-tight text-white sm:text-7xl">
						Sreyes V<span className="text-blue-500">.</span>
					</h1>

					<h2 className="about-reveal about-delay-3 text-xl font-medium text-slate-400 sm:text-2xl">
						Frontend Engineer specialized in <span className="text-white">React & Next.js</span>
					</h2>

					<p className="about-reveal about-delay-4 pt-4 text-lg leading-relaxed text-slate-400">
						Currently a BCA student at Sacred Heart College, bridging the gap between academic theory 
						and high-performance production code. I build interfaces that feel as good as they look.
					</p>
				</header>

				{/* CONTENT GRID */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* LEFT SIDE: Narrative & Tech */}
					<div className="about-reveal about-delay-2 space-y-12 lg:col-span-7">
						<div className="group rounded-2xl border border-white/5 bg-white/2 p-8 transition-colors hover:bg-white/4">
							<h3 className="text-sm font-bold uppercase tracking-widest text-white">
								Professional Ethos
							</h3>
							<div className="mt-6 space-y-4 text-slate-400 leading-relaxed">
								<p>
									My approach to development is rooted in <span className="text-white font-medium">clean architecture</span> and 
									user-centric design. I don&apos;t just build components; I craft experiences that are 
									performant, accessible, and maintainable.
								</p>
								<p>
									Having led a team of six on AI-driven projects, I understand that great software 
									is the result of both technical precision and effective team collaboration.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-6">
							{[
								{ label: "Frontend", items: "React, Next.js, TS, Tailwind" },
								{ label: "Core", items: "JS (ES6+), HTML5, CSS3" },
								{ label: "Design", items: "Figma, Framer Motion" },
								{ label: "Tools", items: "Git, Vercel" }
							].map((skill) => (
								<div key={skill.label} className="about-card rounded-xl border border-white/5 bg-white/1 p-5">
									<p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">{skill.label}</p>
									<p className="mt-1 text-sm font-medium text-slate-200">{skill.items}</p>
								</div>
							))}
						</div>
					</div>

					{/* RIGHT SIDE: Career Timeline */}
					<div className="about-reveal about-delay-3 lg:col-span-5">
						<div className="relative rounded-2xl border border-white/10 bg-[#0b1020]/50 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
							<h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-white">
								Career Progression
							</h3>

							<div className="space-y-10">
								{/* Timeline Item 1 */}
								<div className="about-timeline-item relative pl-8">
									<div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
									<div className="absolute left-0.75 top-6 h-full w-0.5 bg-linear-to-b from-blue-500/50 to-transparent" />
									
									<div className="flex flex-col gap-1">
										<span className="text-[10px] font-medium text-blue-400">APR 2025 — PRESENT</span>
										<h4 className="font-semibold text-white">Frontend Developer (Part-Time)</h4>
										<p className="text-sm text-slate-500">Nexotech Solutions</p>
										<ul className="mt-3 space-y-2 text-sm text-slate-400">
											<li className="flex gap-2"><span>•</span> 6-month intensive internship focusing on component architecture and responsive design.</li>
											<li className="flex gap-2"><span>•</span> Transitioned to part-time to lead UI features and API orchestrations for production-ready products.</li>
										</ul>
									</div>
								</div>

								{/* Timeline Item 2 */}
								<div className="about-timeline-item about-delay-1 relative pl-8">
									<div className="absolute left-0 top-1.5 h-2 w-2 rounded-full border border-blue-500 bg-transparent" />
									<div className="absolute left-0.75 top-6 h-full w-0.5 bg-slate-800" />
									
									<div className="flex flex-col gap-1">
										<span className="text-[10px] font-medium text-slate-500 uppercase">Aug 2025 — Sep 2025</span>
										<h4 className="font-semibold text-white">Frontend Intern</h4>
										<p className="text-sm text-slate-500">WebDzen Technologies</p>
										<p className="mt-2 text-sm text-slate-400 italic">Focused on responsive components and UI performance optimization.</p>
									</div>
								</div>

								{/* Education */}
								<div className="about-timeline-item about-delay-2 relative pl-8 pt-4">
									<div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Education</div>
									<h4 className="font-medium text-slate-200">BCA • Sacred Heart College</h4>
									<p className="text-xs text-slate-500 uppercase mt-1">Class of 2027</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
