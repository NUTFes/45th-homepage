"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

const PARTICLE_MASK_STYLE = {
  maskImage: "linear-gradient(to top, transparent 0%, transparent 50%, black 100%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 0%, transparent 50%, black 100%)",
};

const PARTICLE_SCRIPT_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js";

const PARTICLE_CONFIG = {
  particles: {
    number: {
      value: 600,
      density: {
        enable: true,
        value_area: 1024.8809561350947,
      },
    },
    color: {
      value: "#ebabef",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 8,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 368,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "bottom",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "bubble",
      },
      onclick: {
        enable: false,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.5,
        },
      },
      bubble: {
        distance: 400,
        size: 4,
        duration: 0.3,
        opacity: 1,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

type ParticleInstance = {
  pJS: {
    canvas: {
      el: HTMLCanvasElement;
    };
    fn: {
      vendors: {
        destroypJS: () => void;
      };
    };
  };
};

declare global {
  interface Window {
    particlesJS?: (tagId: string, params: typeof PARTICLE_CONFIG) => void;
    pJSDom?: ParticleInstance[];
  }
}

type ParticleProps = {
  className?: string;
};

export function Particle({ className }: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId().replaceAll(":", "");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.particlesJS) {
      return;
    }

    window.particlesJS(containerId, PARTICLE_CONFIG);

    return () => {
      const instance = window.pJSDom?.find(
        ({ pJS }) => pJS.canvas.el.parentElement === containerRef.current,
      );
      instance?.pJS.fn.vendors.destroypJS();
      containerRef.current?.replaceChildren();
    };
  }, [containerId, scriptLoaded]);

  return (
    <div className={className} style={PARTICLE_MASK_STYLE}>
      <Script
        id="particles-js"
        src={PARTICLE_SCRIPT_URL}
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
      />
      <div id={containerId} ref={containerRef} className="h-full w-full" />
    </div>
  );
}
