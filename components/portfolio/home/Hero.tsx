"use client";

import { useCallback } from "react";
import BlurText from "../elements/BlurText";
import ProfileCard from "../elements/ProfileCard";
import TextPressure from "../elements/TextPressure";

const RESUME_FILE_NAME = "Sreyes-V-Resume.pdf";
const RESUME_FILE_PATH = "/Sreyes-V-Resume.pdf";


export default function Hero() {
  const handleDownloadResume = useCallback(() => {
    const link = document.createElement("a");
    link.href = RESUME_FILE_PATH;
    link.download = RESUME_FILE_NAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden px-4 pb-8 pt-10 text-white sm:px-7 lg:px-10"
      style={{
        background:
          "radial-gradient(1100px 650px at 85% 15%, rgba(109, 129, 255, 0.18), transparent 65%), radial-gradient(900px 560px at 10% 85%, rgba(72, 94, 198, 0.2), transparent 70%), var(--page-bg)",
      }}
    >
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full flex-col">
        <div className="relative flex grow flex-col items-center justify-center py-8">
          <div className="pointer-events-none absolute inset-x-0 top-[42%] -translate-y-1/2 text-center">
            <div className="mx-auto h-24 max-w-362.5 opacity-18 sm:h-36 lg:h-100">
              <TextPressure
                text="SREYES"
                flex
                width
                weight
                italic
                stroke={false}
                textColor="#ffffff"
                minFontSize={90}
              />
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col items-center gap-8">
            <ProfileCard
              name="Sreyes V"
              title="Frontend Developer"
              handle="sre-yes-v"
              status="GitHub"
              contactText="Download Resume"
              onContactClick={handleDownloadResume}
              avatarUrl="/hero.png"
              showUserInfo={true}
              enableTilt
              enableMobileTilt={true}
              behindGlowColor="rgba(42,56,92,0.14)"
              innerGradient="linear-gradient(145deg,#06090f,#111827)"
            />

            <div className="max-w-180 text-center">
              <BlurText
                text="An independent creative designer and frontend developer focused on immersive digital products and clean execution."
                delay={50}
                animateBy="words"
                direction="top"
                className="justify-center text-lg font-medium leading-tight text-white/92 sm:text-3xl"
              />
            </div>

            <a
              href={RESUME_FILE_PATH}
              download={RESUME_FILE_NAME}
              className="rounded-xl bg-white px-7 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-transform hover:scale-[1.02]"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}