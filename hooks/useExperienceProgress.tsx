"use client";

import { useEffect, useState } from "react";

export function useExperienceProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      const value = max <= 0
        ? 0
        : window.scrollY / max;

      setProgress(Math.min(1, Math.max(0, value)));

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  return progress;
}