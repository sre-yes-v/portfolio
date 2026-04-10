"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Project = {
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  image: string;
  demoUrl: string;
};

const projects: Project[] = [
  {
    name: "Flarize",
    year: "2025",
    category: "Solar Platform",
    summary:
      "Marketing website focused on trust, conversion, and strong product storytelling.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/flarize-mockup.png",
    demoUrl: "https://example.com",
  },
  {
    name: "AMAI WebApp",
    year: "2025",
    category: "SaaS Dashboard",
    summary:
      "AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "/amai-mockup.jpg",
    demoUrl: "https://example.com",
  },
  {
    name: "Route Academy",
    year: "2026",
    category: "EdTech Experience",
    summary:
      "Learning platform with clear paths, easy enrollment, and progress-oriented design.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    demoUrl: "https://example.com",
  },
    {
    name: "Flarize1",
    year: "2025",
    category: "Solar Platform",
    summary:
      "Marketing website focused on trust, conversion, and strong product storytelling.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/flarize-mockup.png",
    demoUrl: "https://example.com",
  },
  {
    name: "AMAI WebApp1",
    year: "2025",
    category: "SaaS Dashboard",
    summary:
      "AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "/amai-mockup.jpg",
    demoUrl: "https://example.com",
  },
  {
    name: "Route Academy1",
    year: "2026",
    category: "EdTech Experience",
    summary:
      "Learning platform with clear paths, easy enrollment, and progress-oriented design.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    demoUrl: "https://example.com",
  },
    {
    name: "Flarize2",
    year: "2025",
    category: "Solar Platform",
    summary:
      "Marketing website focused on trust, conversion, and strong product storytelling.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/flarize-mockup.png",
    demoUrl: "https://example.com",
  },
  {
    name: "AMAI WebApp2",
    year: "2025",
    category: "SaaS Dashboard",
    summary:
      "AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "/amai-mockup.jpg",
    demoUrl: "https://example.com",
  },
  {
    name: "Route Academy2",
    year: "2026",
    category: "EdTech Experience",
    summary:
      "Learning platform with clear paths, easy enrollment, and progress-oriented design.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    demoUrl: "https://example.com",
  },
    {
    name: "Flarize3",
    year: "2025",
    category: "Solar Platform",
    summary:
      "Marketing website focused on trust, conversion, and strong product storytelling.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/flarize-mockup.png",
    demoUrl: "https://example.com",
  },
  {
    name: "AMAI WebApp3",
    year: "2025",
    category: "SaaS Dashboard",
    summary:
      "AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "/amai-mockup.jpg",
    demoUrl: "https://example.com",
  },
  {
    name: "Route Academy3",
    year: "2026",
    category: "EdTech Experience",
    summary:
      "Learning platform with clear paths, easy enrollment, and progress-oriented design.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    demoUrl: "https://example.com",
  },
  
];

export default function ProjectsPage() {
  const [active, setActive] = useState<number | null>(null);
  const switchLockedRef = useRef(false);
  const switchUnlockTimeoutRef = useRef<number | null>(null);

  const scheduleUnlock = () => {
    if (switchUnlockTimeoutRef.current) {
      window.clearTimeout(switchUnlockTimeoutRef.current);
    }
    switchUnlockTimeoutRef.current = window.setTimeout(() => {
      switchLockedRef.current = false;
      switchUnlockTimeoutRef.current = null;
    }, 260);
  };

  const handleCardEnter = (index: number) => {
    // During reflow expansion, ignore transient pointer crossings into nearby cards.
    if (active !== null && active !== index && switchLockedRef.current) {
      return;
    }

    setActive(index);
    switchLockedRef.current = true;
    scheduleUnlock();
  };

  const handleGridLeave = () => {
    setActive(null);
    switchLockedRef.current = false;
    if (switchUnlockTimeoutRef.current) {
      window.clearTimeout(switchUnlockTimeoutRef.current);
      switchUnlockTimeoutRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (switchUnlockTimeoutRef.current) {
        window.clearTimeout(switchUnlockTimeoutRef.current);
      }
    },
    []
  );

  return (
    <main className="relative min-h-screen bg-[#0a1020] text-white overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(80,130,255,0.25),transparent_60%)]" />

      {/* header */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20">
        <header className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-blue-500" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
              Project Archive
            </p>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            All Projects<span className="text-blue-500">.</span>
          </h1>

          <h2 className="text-xl font-medium text-slate-400 sm:text-2xl">
            A complete archive of <span className="text-white">client work, product builds, and interface experiments</span>.
          </h2>

          <p className="pt-2 text-lg leading-relaxed text-slate-400">
            A curated set of frontend projects focused on design precision, strong UI architecture, and polished interactions.
          </p>
        </header>
      </section>

      {/* MOBILE LIST (no hover/reflow) */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:hidden">
        <div className="space-y-5">
          {projects.map((project, index) => (
            <article
              key={`${project.name}-${index}`}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-100">
                    {project.category}
                  </span>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
                    {project.year}
                  </span>
                </div>
                <h2 className="absolute bottom-4 left-4 right-4 text-2xl font-semibold text-white">
                  {project.name}
                </h2>
              </div>

              <div className="space-y-4 p-4">
                <p className="text-sm leading-relaxed text-zinc-300">{project.summary}</p>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={`${project.name}-${item}`}
                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href={project.demoUrl}
                  target="_blank"
                  className="inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm transition hover:bg-blue-500/30"
                >
                  Live Demo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DESKTOP GRID */}
      <section className="mx-auto hidden max-w-7xl px-5 pb-24 md:block">
        <div
          onMouseLeave={handleGridLeave}
          className="
            grid gap-6
            grid-cols-2
            md:grid-cols-3
            auto-rows-[200px]
          "
        >
          {projects.map((project, index) => {
            const isActive = active === index;
            const column = index % 3;
            const expandedPlacement =
              column === 0
                ? "md:col-span-2 md:col-start-1 md:row-span-2"
                : column === 1
                ? "md:col-span-2 md:col-start-2 md:row-span-2"
                : "md:col-span-1 md:col-start-3 md:row-span-2";

            return (
              <article
                key={`${project.name}-${index}`}
                onMouseEnter={() => handleCardEnter(index)}
                className={`
                  relative overflow-hidden rounded-3xl
                  border border-white/10
                  bg-white/5 backdrop-blur-xl
                  
                  transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${isActive ? `${expandedPlacement} z-20` : ""}
                  ${active !== null && !isActive ? "opacity-40" : ""}
                `}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700"
                  style={{ backgroundImage: `url(${project.image})` }}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                <div
                  className={`
                    absolute bottom-4 left-4 right-4
                    transition-all duration-400
                    ${isActive ? "opacity-0 translate-y-4" : "opacity-100"}
                  `}
                >
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {project.name}
                  </h2>
                </div>

                <div
                  className={`
                    absolute inset-0 p-6 flex flex-col justify-end
                    transition-all duration-500
                    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  `}
                >
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        {project.category}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        {project.year}
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold">
                      {project.name}
                    </h2>

                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={`${project.name}-${item}`}
                          className="text-[10px] uppercase px-2 py-1 rounded-full bg-white/10 border border-white/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        className="inline-block text-sm px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/40 hover:bg-blue-500/30 transition"
                      >
                        Live Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}