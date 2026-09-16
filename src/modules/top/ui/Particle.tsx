"use client";

import { useEffect, useId, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles, type ISourceOptions } from "@tsparticles/engine";

const PARTICLE_MASK_STYLE = {
  maskImage: "linear-gradient(to top, transparent 0%, transparent 50%, black 100%)",
  WebkitMaskImage: "linear-gradient(to top, transparent 0%, transparent 50%, black 100%)",
};

const PARTICLE_CONFIG: ISourceOptions = {
  fullScreen: { enable: false },
  particles: {
    number: {
      value: 600,
      density: {
        enable: true,
        width: 1024,
        height: 1024,
      },
    },
    color: {
      value: "#ebabef",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: { min: 0.1, max: 8 },
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "bottom",
      straight: false,
      outModes: {
        default: "out",
      },
    },
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      resize: {
        enable: true,
      },
    },
  },
  detectRetina: true,
};

type ParticleProps = {
  className?: string;
};

export default function Particle({ className }: ParticleProps) {
  const particleId = useId().replaceAll(":", "");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadSlim(tsParticles).then(() => {
      if (mounted) {
        setInitialized(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <div className={className} style={PARTICLE_MASK_STYLE}>
      <Particles
        id={`tsparticles-${particleId}`}
        className="h-full w-full"
        options={PARTICLE_CONFIG}
      />
    </div>
  );
}
