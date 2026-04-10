"use client"

import React, { useMemo, useState } from 'react'
import CardSwap, { Card } from '../elements/CardSwap'

const projectCards = [
  {
    title: 'Flarize',
    tag: 'NextJS + Tailwind + TypeScript',
    year: '2025',
    summary: 'Solar Company Website: A sleek, modern site with interactive elements and a clean design to showcase solar solutions.',
    demoLink: 'https://flarize.com/',
    image:
      "/flarize-mockup.png"
  },
  {
    title: 'AMAI WebApp',
    tag: 'NextJS + Tailwind + TypeScript',
    year: '2025',
    summary: 'AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.',
    demoLink: 'https://amaiapp.ayurveda-amai.org/login?next=%2Fplatform',
    image:
      '/amai-mockup.jpg'
  },
  {
    title: 'Route Academy',
    tag: 'NextJS + Tailwind + TypeScript',
    year: '2026',
    summary: 'Educational Platform: A sleek, modern site with interactive elements and a clean design to showcase educational courses.',
    demoLink: 'https://web.routesacademy.com/',
    image:
      '/route-mockup.jpeg'
  }
]

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardNodes = useMemo(
    () =>
      projectCards.map(card => (
        <Card
          key={card.title}
          customClass="overflow-hidden rounded-3xl border border-white/0 bg-zinc-950 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]"
        >
          <div
            aria-label={card.title}
            role="img"
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.image})`,
              WebkitMaskImage: 'linear-gradient(to bottom, #000 58%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 58%, transparent 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%'
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/10" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5">
            <p className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-sm">
              {card.tag}
            </p>
            <p className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-sm">
              {card.year}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-16 sm:px-8 sm:pb-10">
            <h3 className="max-w-3xl text-3xl font-semibold leading-[1.02] text-white sm:text-4xl md:text-5xl">
              {card.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-200 sm:text-base">{card.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                target='_blank'
              >
                View More
                <span aria-hidden="true">→</span>
              </a>

              <a
                href={card.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-200 px-5 py-2.5 text-sm font-medium text-black backdrop-blur-sm transition hover:scale-[1.02]"
              >
                Visit Live Site
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Card>
      )),
    []
  )

  return (
    <section className="relative" style={{ height: `${projectCards.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-[120%_80%_at_50%_10%] from-sky-500/18 via-transparent to-transparent" />

        <div className="mx-auto flex h-full w-full max-w-6xl flex-col py-8 sm:py-10">
          <div className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#6d81ff]" />
            Selected Work
          </div>

          <div className="absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/35 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-zinc-200 backdrop-blur-sm sm:bottom-8 sm:right-10">
            {activeIndex + 1} / {projectCards.length}
          </div>

          <div className="relative h-full w-full max-w-300 overflow-visible">
            <CardSwap
              width="min(90vw, 1180px)"
              height="min(82vh, 760px)"
              cardDistance={42}
              verticalDistance={30}
              skewAmount={2}
              easing="elastic"
              triggerMode="scroll"
              scrollStep={140}
              onActiveCardChange={setActiveIndex}
            >
              {cardNodes}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects