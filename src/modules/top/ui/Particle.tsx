"use client";

import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { useEffect, useRef } from "react";

const PARTICLE_MASK_IMAGE = [
  "linear-gradient(to top, transparent 0%, transparent 50%, black 100%)",
  "linear-gradient(to right, black 0%, black 75%, transparent 100%)",
].join(", ");

const PARTICLE_MASK_STYLE = {
  maskComposite: "intersect",
  maskImage: PARTICLE_MASK_IMAGE,
  WebkitMaskComposite: "source-in",
  WebkitMaskImage: PARTICLE_MASK_IMAGE,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const PARTICLE_CONFIG = {
  fpsLimit: 30,
  fullScreen: false,
  particles: {
    number: {
      value: 600,
      density: {
        enable: true,
        height: 1000,
        width: 1024,
      },
    },
    opacity: {
      value: { min: 0, max: 0.5 },
    },
    paint: {
      color: {
        value: "#ebabef",
      },
      fill: {
        enable: true,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 0, max: 8 },
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "bottom",
    },
  },
} satisfies ISourceOptions;

let particleEnginePromise: Promise<Engine> | undefined;

function getParticleEngine() {
  particleEnginePromise ??= Promise.all([
    import("@tsparticles/engine"),
    import("@tsparticles/basic"),
  ]).then(async ([{ tsParticles }, { loadBasic }]) => {
    await loadBasic(tsParticles);

    return tsParticles;
  });

  return particleEnginePromise;
}

type ParticleProps = {
  className?: string;
};

export function Particle({ className }: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }

    let cancelled = false;
    let container: Container | undefined;
    let visibilityObserver: IntersectionObserver | undefined;

    async function initializeParticles(element: HTMLDivElement) {
      const engine = await getParticleEngine();

      if (cancelled) {
        return;
      }

      const loadedContainer = await engine.load({
        element,
        options: PARTICLE_CONFIG,
      });

      if (cancelled) {
        loadedContainer?.destroy();
        return;
      }

      container = loadedContainer;

      visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          loadedContainer?.play();
        } else {
          loadedContainer?.pause();
        }
      });
      visibilityObserver.observe(element);
    }

    void initializeParticles(element);

    return () => {
      cancelled = true;
      visibilityObserver?.disconnect();
      container?.destroy();
    };
  }, []);

  return (
    <div className={className} style={PARTICLE_MASK_STYLE}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
