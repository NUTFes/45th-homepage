"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const CREATEJS_SCRIPT_URL = "https://code.createjs.com/1.0.0/createjs.min.js";
const PARTICLE_SCRIPT_URL =
  "https://cdn.rawgit.com/ics-creative/ParticleJS/release/1.0.0/libs/particlejs.min.js";

type ParticleSystem = {
  container: unknown;
  importFromJson: (settings: ParticleSettings) => void;
  update: () => void;
};

type ParticleSettings = {
  bgColor: string;
  width: number;
  height: number;
  emitFrequency: number;
  startX: number;
  startXVariance: number;
  startY: number;
  startYVariance: number;
  initialDirection: number | string;
  initialDirectionVariance: number | string;
  initialSpeed: number;
  initialSpeedVariance: number;
  friction: number;
  accelerationSpeed: number | string;
  accelerationDirection: number;
  startScale: number;
  startScaleVariance: number;
  finishScale: number;
  finishScaleVariance: number;
  lifeSpan: number;
  lifeSpanVariance: number;
  startAlpha: number;
  startAlphaVariance: number;
  finishAlpha: number;
  finishAlphaVariance: number;
  shapeIdList: string[];
  startColor: {
    hue: number | string;
    hueVariance: number | string;
    saturation: number | string;
    saturationVariance: number | string;
    luminance: number | string;
    luminanceVariance: number | string;
  };
  blendMode: boolean;
  alphaCurveType: string;
  VERSION: string;
};

type CreateJsStage = {
  addChild: (child: unknown) => void;
  update: () => void;
};

type CreateJsTicker = {
  framerate: number;
  timingMode: string;
  RAF: string;
  addEventListener: (event: "tick", listener: () => void) => void;
  removeEventListener: (event: "tick", listener: () => void) => void;
};

declare global {
  interface Window {
    createjs?: {
      Stage: new (canvas: HTMLCanvasElement) => CreateJsStage;
      Ticker: CreateJsTicker;
    };
    particlejs?: {
      ParticleSystem: new () => ParticleSystem;
    };
  }
}

const PARTICLE_SETTINGS: ParticleSettings = {
  bgColor: "transparent",
  width: 962,
  height: 431,
  emitFrequency: 50,
  startX: 671.7351443123939,
  startXVariance: 859,
  startY: 457.47511591962905,
  startYVariance: 18,
  initialDirection: 213,
  initialDirectionVariance: "360",
  initialSpeed: 7,
  initialSpeedVariance: 1.9,
  friction: 0.1165,
  accelerationSpeed: 0.0975,
  accelerationDirection: 209.2,
  startScale: 0.36,
  startScaleVariance: 1,
  finishScale: 0.07,
  finishScaleVariance: 1,
  lifeSpan: 249,
  lifeSpanVariance: 332,
  startAlpha: 0.48,
  startAlphaVariance: 0.32,
  finishAlpha: 0.21,
  finishAlphaVariance: 0.5,
  shapeIdList: ["blur_circle"],
  startColor: {
    hue: 242,
    hueVariance: 210,
    saturation: 60,
    saturationVariance: "0",
    luminance: 27,
    luminanceVariance: 100,
  },
  blendMode: true,
  alphaCurveType: "1",
  VERSION: "1.0.0",
};

type ParticleProps = {
  className?: string;
};

export function Particle({ className }: ParticleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedScripts, setLoadedScripts] = useState(0);

  useEffect(() => {
    if (loadedScripts < 2 || !canvasRef.current || !window.createjs || !window.particlejs) {
      return;
    }

    const stage = new window.createjs.Stage(canvasRef.current);
    const particleSystem = new window.particlejs.ParticleSystem();
    stage.addChild(particleSystem.container);
    particleSystem.importFromJson(PARTICLE_SETTINGS);

    const { Ticker } = window.createjs;
    Ticker.framerate = 60;
    Ticker.timingMode = Ticker.RAF;
    const handleTick = () => {
      particleSystem.update();
      stage.update();
    };
    Ticker.addEventListener("tick", handleTick);

    return () => Ticker.removeEventListener("tick", handleTick);
  }, [loadedScripts]);

  const handleScriptReady = () => setLoadedScripts((count) => count + 1);

  return (
    <div className={className}>
      <Script
        id="createjs"
        src={CREATEJS_SCRIPT_URL}
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />
      <Script
        id="particlejs"
        src={PARTICLE_SCRIPT_URL}
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />
      <canvas ref={canvasRef} width={962} height={431} className="h-full w-full" />
    </div>
  );
}
