import * as THREE from "three";

export function dampEased(
  current: number,
  target: number,
  lambda: number,
  delta: number
): number {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}

export function remapProgress(
  value: number,
  start: number,
  end: number
): number {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}