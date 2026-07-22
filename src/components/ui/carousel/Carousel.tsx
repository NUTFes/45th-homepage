"use client";

import AutoScroll, { type AutoScrollType } from "embla-carousel-auto-scroll";
import Autoplay, { type AutoplayType } from "embla-carousel-autoplay";
import useEmblaCarousel, {
  type EmblaViewportRefType,
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

import type {
  CarouselAutoPlayOption,
  CarouselAutoScrollOption,
  CarouselWheelGesturesOption,
} from "@/components/ui/carousel/types";

type CarouselRootProps = {
  ariaLabel: string;
  autoPlay?: CarouselAutoPlayOption;
  autoScroll?: CarouselAutoScrollOption;
  children: ReactNode;
  className?: string;
  loop?: boolean;
  navigationStep?: "single" | "half-visible";
  options?: Omit<CarouselOptions, "loop">;
  onSelect?: (index: number) => void;
  slideCount?: number;
  wheelGestures?: CarouselWheelGesturesOption;
};

type CarouselViewportProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
};

type CarouselSlideProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  index: number;
  style?: CSSProperties;
};

type CarouselDotsProps = {
  activeDotClassName?: string;
  buttonAriaLabel?: (index: number) => string;
  className?: string;
  dotClassName?: string;
  gap?: number;
  inactiveDotClassName?: string;
  navAriaLabel?: string;
  showWhenSingle?: boolean;
  keys?: string[];
};

type CarouselMotionButtonProps = {
  className?: string;
  pauseLabel?: string;
  playLabel?: string;
};

type CarouselArrowButtonProps = {
  children?: ReactNode;
  className?: string;
  label?: string;
};

type MotionPlugin = AutoplayType | AutoScrollType;
type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;
type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;
type EmblaPlugin = NonNullable<Parameters<typeof useEmblaCarousel>[1]>[number];

type CarouselContextValue = {
  canScrollNext: boolean;
  canScrollPrev: boolean;
  hasMotionControl: boolean;
  isMotionPlaying: boolean;
  next: () => void;
  prev: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  slideCount: number;
  toggleMotion: () => void;
  viewportRef: EmblaViewportRefType;
};

type CarouselRuntimeState = {
  canScrollNext: boolean;
  canScrollPrev: boolean;
  isMotionPlaying: boolean;
  selectedIndex: number;
  slideCount: number;
};

type CarouselRuntimeStateAction = {
  payload: Partial<CarouselRuntimeState>;
  type: "patch";
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

const defaultAutoPlayOption = {
  delay: 4000,
  stopOnInteraction: false,
} as const;

const defaultAutoScrollOption = {
  speed: 1,
  stopOnInteraction: false,
} as const;

const toStableOptionKey = (option: boolean | object | undefined) => {
  if (option === undefined) {
    return "undefined";
  }

  if (typeof option === "boolean") {
    return option ? "true" : "false";
  }

  const entries = Object.entries(option as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  return JSON.stringify(entries);
};

const normalizeAutoPlay = (autoPlay: CarouselAutoPlayOption): Parameters<typeof Autoplay>[0] =>
  typeof autoPlay === "object" ? autoPlay : defaultAutoPlayOption;

const normalizeAutoScroll = (
  autoScroll: CarouselAutoScrollOption,
): Parameters<typeof AutoScroll>[0] =>
  typeof autoScroll === "object" ? autoScroll : defaultAutoScrollOption;

const normalizeWheelGestures = (
  wheelGestures: CarouselWheelGesturesOption,
): Parameters<typeof WheelGesturesPlugin>[0] =>
  typeof wheelGestures === "object" ? wheelGestures : {};

const getMotionPlugins = (emblaApi: EmblaApi | undefined): MotionPlugin[] => {
  if (!emblaApi) {
    return [];
  }

  const plugins = emblaApi.plugins();
  if (!plugins) {
    return [];
  }

  const motionPlugins: MotionPlugin[] = [];

  if (plugins.autoplay) {
    motionPlugins.push(plugins.autoplay);
  }

  if (plugins.autoScroll) {
    motionPlugins.push(plugins.autoScroll);
  }

  return motionPlugins;
};

const initialCarouselRuntimeState: CarouselRuntimeState = {
  canScrollNext: false,
  canScrollPrev: false,
  isMotionPlaying: false,
  selectedIndex: 0,
  slideCount: 0,
};

const carouselRuntimeStateReducer = (
  state: CarouselRuntimeState,
  action: CarouselRuntimeStateAction,
): CarouselRuntimeState => {
  if (action.type === "patch") {
    return { ...state, ...action.payload };
  }

  return state;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  return prefersReducedMotion;
};

export const CarouselRoot = ({
  ariaLabel,
  autoPlay = false,
  autoScroll = false,
  children,
  className,
  loop = true,
  navigationStep = "single",
  options,
  onSelect,
  slideCount: providedSlideCount,
  wheelGestures = false,
}: CarouselRootProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasConfiguredMotion = autoPlay || autoScroll;
  const autoPlayKey = toStableOptionKey(autoPlay);
  const autoScrollKey = toStableOptionKey(autoScroll);
  const wheelGesturesKey = toStableOptionKey(wheelGestures);

  const plugins = useMemo<EmblaPlugin[]>(() => {
    const carouselPlugins: EmblaPlugin[] = [];

    if (autoPlay && !prefersReducedMotion) {
      carouselPlugins.push(Autoplay(normalizeAutoPlay(autoPlay)));
    }

    if (autoScroll && !prefersReducedMotion) {
      carouselPlugins.push(AutoScroll(normalizeAutoScroll(autoScroll)));
    }

    if (wheelGestures) {
      carouselPlugins.push(WheelGesturesPlugin(normalizeWheelGestures(wheelGestures)));
    }

    return carouselPlugins;
  }, [autoPlayKey, autoScrollKey, prefersReducedMotion, wheelGesturesKey]);

  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      ...options,
      loop,
    },
    plugins,
  );

  const [runtimeState, updateRuntimeState] = useReducer(
    carouselRuntimeStateReducer,
    initialCarouselRuntimeState,
  );

  const syncMotionState = useCallback(
    (api?: EmblaApi) => {
      const playing = getMotionPlugins(api ?? emblaApi).some((plugin) => plugin.isPlaying());
      updateRuntimeState({ payload: { isMotionPlaying: playing }, type: "patch" });
    },
    [emblaApi],
  );

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const nextIndex = emblaApi.selectedScrollSnap();
    updateRuntimeState({
      payload: {
        canScrollNext: emblaApi.canScrollNext(),
        canScrollPrev: emblaApi.canScrollPrev(),
        selectedIndex: nextIndex,
        slideCount: providedSlideCount ?? emblaApi.scrollSnapList().length,
      },
      type: "patch",
    });
    syncMotionState(emblaApi);
    onSelect?.(nextIndex);
  }, [emblaApi, onSelect, providedSlideCount, syncMotionState]);

  const onEmblaSelectRef = useRef(onEmblaSelect);
  onEmblaSelectRef.current = onEmblaSelect;

  const syncMotionStateRef = useRef(syncMotionState);
  syncMotionStateRef.current = syncMotionState;

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const handleSelect = () => onEmblaSelectRef.current();
    const handleSync = () => syncMotionStateRef.current();

    onEmblaSelectRef.current();

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);
    emblaApi.on("autoplay:play", handleSync);
    emblaApi.on("autoplay:stop", handleSync);
    emblaApi.on("autoScroll:play", handleSync);
    emblaApi.on("autoScroll:stop", handleSync);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
      emblaApi.off("autoplay:play", handleSync);
      emblaApi.off("autoplay:stop", handleSync);
      emblaApi.off("autoScroll:play", handleSync);
      emblaApi.off("autoScroll:stop", handleSync);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollByNavigationStep = useCallback(
    (direction: -1 | 1) => {
      if (!emblaApi) {
        return;
      }

      if (navigationStep === "single") {
        if (direction === -1) {
          emblaApi.scrollPrev();
        } else {
          emblaApi.scrollNext();
        }
        return;
      }

      const visibleSlideCount = emblaApi.slidesInView().length;
      const step = Math.max(1, Math.ceil(visibleSlideCount / 2));
      const target = emblaApi.selectedScrollSnap() + direction * step;

      emblaApi.scrollTo(target);
    },
    [emblaApi, navigationStep],
  );

  const prev = useCallback(() => {
    scrollByNavigationStep(-1);
  }, [scrollByNavigationStep]);

  const next = useCallback(() => {
    scrollByNavigationStep(1);
  }, [scrollByNavigationStep]);

  const toggleMotion = useCallback(() => {
    const motionPlugins = getMotionPlugins(emblaApi);

    if (motionPlugins.length === 0) {
      return;
    }

    if (motionPlugins.some((plugin) => plugin.isPlaying())) {
      motionPlugins.forEach((plugin) => plugin.stop());
      updateRuntimeState({ payload: { isMotionPlaying: false }, type: "patch" });
      return;
    }

    motionPlugins.forEach((plugin) => plugin.play());
    updateRuntimeState({ payload: { isMotionPlaying: true }, type: "patch" });
  }, [emblaApi]);

  const hasMotionControl = hasConfiguredMotion && !prefersReducedMotion;
  const announcedSlideCount = providedSlideCount ?? runtimeState.slideCount;

  const contextValue = useMemo<CarouselContextValue>(
    () => ({
      canScrollNext: runtimeState.canScrollNext,
      canScrollPrev: runtimeState.canScrollPrev,
      hasMotionControl,
      isMotionPlaying: runtimeState.isMotionPlaying,
      next,
      prev,
      scrollTo,
      selectedIndex: runtimeState.selectedIndex,
      slideCount: announcedSlideCount,
      toggleMotion,
      viewportRef,
    }),
    [
      runtimeState.canScrollNext,
      runtimeState.canScrollPrev,
      hasMotionControl,
      runtimeState.isMotionPlaying,
      next,
      prev,
      scrollTo,
      runtimeState.selectedIndex,
      announcedSlideCount,
      toggleMotion,
      viewportRef,
    ],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <section aria-label={ariaLabel} aria-roledescription="carousel" className={className}>
        <span aria-live={runtimeState.isMotionPlaying ? "off" : "polite"} className="sr-only">
          Slide {runtimeState.selectedIndex + 1} of {Math.max(announcedSlideCount, 1)}
        </span>
        {children}
      </section>
    </CarouselContext.Provider>
  );
};

export const CarouselViewport = ({
  children,
  className,
  trackClassName,
}: CarouselViewportProps) => {
  const { viewportRef } = useCarousel();

  return (
    <div className={className} ref={viewportRef}>
      <div className={twMerge("flex h-full touch-pan-y", trackClassName)}>{children}</div>
    </div>
  );
};

export const CarouselSlide = ({
  ariaLabel,
  children,
  className,
  index,
  style,
}: CarouselSlideProps) => {
  const { slideCount } = useCarousel();
  const safeSlideCount = Math.max(slideCount, index + 1);

  return (
    <section
      aria-label={ariaLabel ?? `${index + 1} of ${safeSlideCount}`}
      aria-roledescription="slide"
      className={className}
      style={style}
    >
      {children}
    </section>
  );
};

export const CarouselDots = ({
  activeDotClassName = "bg-main",
  buttonAriaLabel = (index) => `Go to slide ${index + 1}`,
  className = "absolute bottom-xs left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-base/55 px-1 py-1 backdrop-blur-sm",
  dotClassName = "block size-3 rounded-full border border-main transition-colors",
  gap = 12,
  inactiveDotClassName = "bg-transparent",
  navAriaLabel = "Slide navigation",
  showWhenSingle = false,
  keys,
}: CarouselDotsProps) => {
  const { scrollTo, selectedIndex, slideCount } = useCarousel();
  const dotCount = keys?.length ?? slideCount;

  if (dotCount === 0 || (!showWhenSingle && dotCount <= 1)) {
    return null;
  }

  return (
    <nav aria-label={navAriaLabel} className={className} style={{ gap }}>
      {Array.from({ length: dotCount }, (_, index) => (
        <button
          aria-current={index === selectedIndex ? "step" : undefined}
          aria-label={buttonAriaLabel(index)}
          className="inline-flex items-center justify-center rounded-full"
          key={keys?.[index] ?? `carousel-dot-${index}`}
          onClick={() => scrollTo(index)}
          type="button"
        >
          <span
            aria-hidden
            className={twMerge(
              dotClassName,
              index === selectedIndex ? activeDotClassName : inactiveDotClassName,
            )}
          />
        </button>
      ))}
    </nav>
  );
};

export const CarouselMotionButton = ({
  className,
  pauseLabel = "Stop slide rotation",
  playLabel = "Start slide rotation",
}: CarouselMotionButtonProps) => {
  const { hasMotionControl, isMotionPlaying, toggleMotion } = useCarousel();

  if (!hasMotionControl) {
    return null;
  }

  return (
    <button
      aria-label={isMotionPlaying ? pauseLabel : playLabel}
      className={className}
      onClick={toggleMotion}
      type="button"
    >
      {isMotionPlaying ? pauseLabel : playLabel}
    </button>
  );
};

export const CarouselPrevButton = ({
  children,
  className,
  label = "Previous slide",
}: CarouselArrowButtonProps) => {
  const { canScrollPrev, prev } = useCarousel();

  return (
    <button
      aria-label={label}
      className={className}
      disabled={!canScrollPrev}
      onClick={prev}
      type="button"
    >
      {children ?? label}
    </button>
  );
};

export const CarouselNextButton = ({
  children,
  className,
  label = "Next slide",
}: CarouselArrowButtonProps) => {
  const { canScrollNext, next } = useCarousel();

  return (
    <button
      aria-label={label}
      className={className}
      disabled={!canScrollNext}
      onClick={next}
      type="button"
    >
      {children ?? label}
    </button>
  );
};

export const useCarousel = () => {
  const context = use(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within CarouselRoot.");
  }

  return context;
};
