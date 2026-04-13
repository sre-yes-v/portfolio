"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Project = {
  _id: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  image: string;
  homeImage: string;
  demoUrl: string;
  showHomeScreen: boolean;
};

const hasLiveLink = (demoUrl: string) => demoUrl.trim().length > 0;

type ProjectsApiResponse = {
  success: boolean;
  projects: Project[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const switchLockedRef = useRef(false);
  const switchUnlockTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = (await response.json()) as ProjectsApiResponse;
        setProjects(data.projects || []);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load projects right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, []);

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

      {error ? (
        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
            {error}
          </div>
        </section>
      ) : loading ? (
        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </section>
      ) : (
      <>
      {/* MOBILE LIST (no hover/reflow) */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:hidden">
        <div className="space-y-5">
          {projects.map((project, index) => (
            <article
              key={project._id || `${project.name}-${index}`}
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

                {hasLiveLink(project.demoUrl) ? (
                  <Link
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm transition hover:bg-blue-500/30"
                  >
                    Live Demo
                  </Link>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
                    Work in Progress
                  </span>
                )}
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
                key={project._id || `${project.name}-${index}`}
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
                      {hasLiveLink(project.demoUrl) ? (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm transition hover:bg-blue-500/30"
                        >
                          Visit Live Site
                        </Link>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
                          Work in Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      </>
      )}
    </main>
  );
}