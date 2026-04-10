"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  triggerMode?: 'auto' | 'scroll';
  scrollStep?: number;
  onCardClick?: (idx: number) => void;
  onActiveCardChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-6 md:top-1/2 left-1/2 rounded-xl border border-white bg-black transform-3d will-change-transform backface-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number, yPercent: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  triggerMode = 'auto',
  scrollStep = 180,
  onCardClick,
  onActiveCardChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const [isMobile, setIsMobile] = useState(false);

  const config = useMemo(
    () =>
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05
          }
        : {
            ease: 'power1.inOut',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2
          },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const isSwappingRef = useRef(false);
  const pendingSwapStepsRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const accumulatedScrollRef = useRef(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);
    return () => mediaQuery.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    const total = refs.length;
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
    pendingSwapStepsRef.current = 0;
    refs.forEach((r, i) =>
      placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount, isMobile ? 0 : -50)
    );
    onActiveCardChange?.(order.current[0] ?? 0);

    const runOneSwap = (direction: 1 | -1 = 1) => {
      if (order.current.length < 2 || isSwappingRef.current) return;

      const [front, ...rest] = order.current;
      const tl = gsap.timeline();
      tlRef.current = tl;
      isSwappingRef.current = true;

      if (direction === 1) {
        const elFront = refs[front].current!;

        tl.to(elFront, {
          y: '+=500',
          duration: config.durDrop,
          ease: config.ease
        });

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
          const el = refs[idx].current!;
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
          tl.set(el, { zIndex: slot.zIndex }, 'promote');
          tl.to(
            el,
            {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              duration: config.durMove,
              ease: config.ease
            },
            `promote+=${i * 0.15}`
          );
        });

        const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
        tl.call(
          () => {
            gsap.set(elFront, { zIndex: backSlot.zIndex });
          },
          undefined,
          'return'
        );
        tl.to(
          elFront,
          {
            x: backSlot.x,
            y: backSlot.y,
            z: backSlot.z,
            duration: config.durReturn,
            ease: config.ease
          },
          'return'
        );

        tl.eventCallback('onComplete', () => {
          order.current = [...rest, front];
          onActiveCardChange?.(order.current[0] ?? 0);
          isSwappingRef.current = false;

          if (pendingSwapStepsRef.current !== 0) {
            const nextDirection: 1 | -1 = pendingSwapStepsRef.current > 0 ? 1 : -1;
            pendingSwapStepsRef.current -= nextDirection;
            runOneSwap(nextDirection);
          }
        });
        return;
      }

      const back = order.current[order.current.length - 1];
      const others = order.current.slice(0, -1);
      const elBack = refs[back].current!;

      tl.to(elBack, {
        y: '-=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('demote', `-=${config.durDrop * config.promoteOverlap}`);
      others.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'demote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `demote+=${i * 0.15}`
        );
      });

      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `demote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elBack, { zIndex: frontSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elBack,
        {
          x: frontSlot.x,
          y: frontSlot.y,
          z: frontSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.eventCallback('onComplete', () => {
        order.current = [back, ...others];
        onActiveCardChange?.(order.current[0] ?? 0);
        isSwappingRef.current = false;

        if (pendingSwapStepsRef.current !== 0) {
          const nextDirection: 1 | -1 = pendingSwapStepsRef.current > 0 ? 1 : -1;
          pendingSwapStepsRef.current -= nextDirection;
          runOneSwap(nextDirection);
        }
      });
    };

    const queueSwaps = (steps: number, direction: 1 | -1) => {
      if (steps <= 0) return;

      pendingSwapStepsRef.current += steps * direction;
      if (!isSwappingRef.current) {
        const nextDirection: 1 | -1 = pendingSwapStepsRef.current > 0 ? 1 : -1;
        pendingSwapStepsRef.current -= nextDirection;
        runOneSwap(nextDirection);
      }
    };

    if (triggerMode === 'scroll') {
      lastScrollYRef.current = window.scrollY;
      accumulatedScrollRef.current = 0;

      const onScroll = () => {
        const nextY = window.scrollY;
        const delta = nextY - lastScrollYRef.current;
        lastScrollYRef.current = nextY;

        if (Math.abs(delta) < 1) return;

        accumulatedScrollRef.current += delta;
        const absAccumulated = Math.abs(accumulatedScrollRef.current);
        if (absAccumulated < scrollStep) return;

        // Strict scroll stepping: trigger one swap per threshold crossing.
        // This avoids rapid multi-step jumps from momentum scroll.
        const direction: 1 | -1 = delta > 0 ? 1 : -1;
        accumulatedScrollRef.current = 0;
        queueSwaps(1, direction);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        tlRef.current?.kill();
        isSwappingRef.current = false;
      };
    }

    runOneSwap();
    intervalRef.current = window.setInterval(runOneSwap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(runOneSwap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
        isSwappingRef.current = false;
      };
    }
    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
      isSwappingRef.current = false;
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    triggerMode,
    scrollStep,
    refs,
    childArr.length,
    config,
    onActiveCardChange,
    isMobile
  ]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="relative perspective-[900px] overflow-visible"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
