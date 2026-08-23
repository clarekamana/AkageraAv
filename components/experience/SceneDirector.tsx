"use client";

import { flightScenes } from "../../data/flightScenes";

export function getCurrentScene(progress: number) {
  return (
    flightScenes.find(
      (scene) =>
        progress >= scene.start &&
        progress <= scene.end
    ) ?? flightScenes[0]
  );
}

export function getSceneProgress(
  progress: number,
  start: number,
  end: number
) {
  return Math.min(
    1,
    Math.max(
      0,
      (progress - start) / (end - start)
    )
  );
}