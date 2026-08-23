"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { CameraRig } from "../experience/camera/CameraRig";
import { Helicopter } from "./aircraft/Helicopter";
import { RwandaWorld } from "./environments/RwandaWorld";
import { useDeviceQuality } from "@/hooks/useDeviceQuality";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  progress: number;
}

export function ExperienceCanvas({ progress }: Props) {
  const quality = useDeviceQuality();
  const isReducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={quality.dpr}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      shadows={quality.shadows}
    >
      <CameraRig progress={progress} isReducedMotion={isReducedMotion} />

      <Sky
        distance={450000}
        sunPosition={[120, 40, 100]}
        turbidity={4}
        rayleigh={1.2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Provides lighting reflections required for PBR dark metallic paint */}
      <Environment preset="city" />

      <Suspense fallback={null}>
        <RwandaWorld progress={progress} />
        <Helicopter progress={progress} />
      </Suspense>
    </Canvas>
  );
}