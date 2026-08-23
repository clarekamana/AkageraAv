"use client";

import { useExperienceProgress } from "@/hooks/useExperienceProgress";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { Intro } from "../interface/Intro";
import { Navigation } from "../interface/Navigation";
import { SceneLabel } from "../interface/SceneLabel";
import { LoadingScreen } from "../loading/LoadingScreen";

export function Experience() {
  const progress = useExperienceProgress();

  return (
    <main className="experience">
      <LoadingScreen />
      <Navigation />

      <div className="webgl">
        <ExperienceCanvas progress={progress} />
      </div>

      <Intro progress={progress} />
      <SceneLabel progress={progress} />

      <div className="scroll-space" />
    </main>
  );
}