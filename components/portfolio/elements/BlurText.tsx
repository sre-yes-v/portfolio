"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type BlurState = {
  filter: string;
  opacity: number;
  y: number;
};

type BlurStep = Partial<BlurState>;

type BlurTextProps = {
  text?: string;
  highlightText?: string;
  highlightClassName?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: BlurState;
  animationTo?: BlurStep[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (from: BlurState, steps: BlurStep[]): Record<string, Array<string | number>> => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes: Record<string, Array<string | number>> = {};

  keys.forEach((k) => {
    const baseValue = from[k as keyof BlurState];
    keyframes[k] = [baseValue, ...steps.map((s) => s[k as keyof BlurStep] ?? baseValue)];
  });

  return keyframes;
};

function BlurText({
  text = "",
  highlightText,
  highlightClassName = "font-bold text-[#b9c6ff]",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  const normalizedHighlightWords = useMemo(
    () => (highlightText ? highlightText.split(" ").filter(Boolean) : []),
    [highlightText],
  );

  const renderedElements = useMemo(() => {
    if (animateBy !== "words" || normalizedHighlightWords.length === 0) {
      return elements.map((segment) => ({ text: segment, highlighted: false }));
    }

    const tokens = text.split(" ");
    const highlightLength = normalizedHighlightWords.length;
    const matches: Array<{ text: string; highlighted: boolean }> = [];

    for (let index = 0; index < tokens.length; ) {
      const slice = tokens.slice(index, index + highlightLength);
      const matchesHighlight =
        slice.length === highlightLength &&
        slice.every((word, sliceIndex) => word === normalizedHighlightWords[sliceIndex]);

      if (matchesHighlight) {
        slice.forEach((word) => matches.push({ text: word, highlighted: true }));
        index += highlightLength;
      } else {
        matches.push({ text: tokens[index], highlighted: false });
        index += 1;
      }
    }

    return matches;
  }, [animateBy, elements, normalizedHighlightWords, text]);

  useEffect(() => {
    if (!ref.current) return;

    const observedEl = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(observedEl);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(observedEl);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo<BlurState>(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo<BlurStep[]>(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap" }}>
      {renderedElements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            className={`inline-block will-change-[transform,filter,opacity] ${segment.highlighted ? highlightClassName : ""}`.trim()}
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            }}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment.text === " " ? "\u00A0" : segment.text}
            {animateBy === "words" && index < renderedElements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
}

export default BlurText;
