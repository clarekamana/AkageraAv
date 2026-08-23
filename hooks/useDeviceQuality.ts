"use client";

import { useEffect, useState } from "react";

export interface QualitySettings {
  isMobile: boolean;
  dpr: number;
  shadows: boolean;
  maxInstances: number;
  postProcessing: boolean;
}

export function useDeviceQuality(): QualitySettings {
  const [quality, setQuality] = useState<QualitySettings>({
    isMobile: false,
    dpr: 1.5,
    shadows: true,
    maxInstances: 120,
    postProcessing: true,
  });

  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;

    const isLowTier = isMobileDevice || memory < 4 || cores < 4;

    setQuality({
      isMobile: isMobileDevice,
      dpr: isLowTier ? 1 : 1.5,
      shadows: !isLowTier,
      maxInstances: isLowTier ? 40 : 120,
      postProcessing: !isLowTier,
    });
  }, []);

  return quality;
}