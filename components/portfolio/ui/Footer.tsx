import React from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/sre-yes-v' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sreyes-v' },
  { label: 'Email', href: 'mailto:sreyesv24@gmail.com' },
  { label: 'Instagram', href: 'https://www.instagram.com/sreyes_v?igsh=MTJocTBjYm11NnFyeA%3D%3D' },
  
];

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 text-white">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(900px 280px at 50% 0%, rgba(109, 129, 255, 0.22), transparent 70%), linear-gradient(180deg, rgba(6, 10, 20, 0.96), rgba(10, 14, 28, 1))',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-7 sm:py-12 lg:px-10 lg:py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_0.9fr] lg:items-start">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                Sreyes V
              </p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Building clean interfaces with motion, clarity, and a dark immersive edge.
              </h2>
              <p className="max-w-lg text-sm leading-6 text-white/70 sm:text-base">
                Frontend developer focused on thoughtful interactions, responsive systems, and polished digital products.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Navigate
              </p>
              <nav aria-label="Footer navigation">
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target='_blank'
                        className="group inline-flex items-center gap-2 text-base font-medium text-white/80 transition-colors hover:text-white"
                      >
                        <span className="h-px w-5 bg-white/20 transition-all group-hover:w-8 group-hover:bg-[#6d81ff]" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Social
              </p>
              <ul className="flex flex-wrap gap-3 lg:flex-col lg:gap-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Sreyes V. All rights reserved.</p>
            <a
              href="mailto:sreyesv24@gmail.com"
              className="inline-flex w-fit items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-[#6d81ff] shadow-[0_0_18px_rgba(109,129,255,0.75)]" />
              sreyesv24@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;