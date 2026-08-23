"use client";

import {
  getCurrentScene,
} from "../experience/SceneDirector";

interface Props {
  progress: number;
}

export function SceneLabel({
  progress,
}: Props) {
  const scene = getCurrentScene(progress);

  if (!scene.label) return null;

  return (
    <div className="scene-label">
      <span>RWANDA</span>
      <strong>{scene.label}</strong>
    </div>
  );
}