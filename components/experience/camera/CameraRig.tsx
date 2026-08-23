"use client";

import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import {
  remapProgress,
  easeInOutCubic,
} from "@/lib/math";

interface Props {
  progress: number;
  isReducedMotion: boolean;
}

export function CameraRig({
  progress,
  isReducedMotion,
}: Props) {
  const cameraRef =
    useRef<THREE.PerspectiveCamera>(null);

  const currentLookAt = useRef(
    new THREE.Vector3(0, 1, 0)
  );

  const targetPosition = useRef(
    new THREE.Vector3()
  );

  const targetLookAt = useRef(
    new THREE.Vector3()
  );

  useFrame((_, delta) => {
    const camera = cameraRef.current;

    if (!camera) return;

    // ============================================================
    // REDUCED MOTION
    // ============================================================

    if (isReducedMotion) {
      camera.position.set(0, 3, 10);

      currentLookAt.current.lerp(
        new THREE.Vector3(0, 1, 0),
        Math.min(1, delta * 4)
      );

      camera.lookAt(currentLookAt.current);

      return;
    }

    const position = targetPosition.current;
    const lookAt = targetLookAt.current;

    // ============================================================
    // CAMERA PHASES
    // ============================================================

    if (progress < 0.16) {
      // ----------------------------------------------------------
      // 1. HERO REVEAL
      // ----------------------------------------------------------

      const p = remapProgress(
        progress,
        0,
        0.16
      );

      const e = easeInOutCubic(p);

      position.set(
        THREE.MathUtils.lerp(
          -5.5,
          -3.2,
          e
        ),
        THREE.MathUtils.lerp(
          2.2,
          1.7,
          e
        ),
        THREE.MathUtils.lerp(
          9.5,
          7.2,
          e
        )
      );

      lookAt.set(
        0,
        THREE.MathUtils.lerp(
          0.8,
          1.2,
          e
        ),
        0
      );
    } else if (progress < 0.34) {
      // ----------------------------------------------------------
      // 2. TAKEOFF ORBIT
      // ----------------------------------------------------------

      const p = remapProgress(
        progress,
        0.16,
        0.34
      );

      const e = easeInOutCubic(p);

      const angle = THREE.MathUtils.lerp(
        -0.9,
        1.15,
        e
      );

      const radius = THREE.MathUtils.lerp(
        6.8,
        6.0,
        e
      );

      position.set(
        Math.sin(angle) * radius,
        THREE.MathUtils.lerp(
          1.7,
          2.8,
          e
        ),
        Math.cos(angle) * radius
      );

      lookAt.set(
        0,
        THREE.MathUtils.lerp(
          1.2,
          2.0,
          e
        ),
        0
      );
    } else if (progress < 0.62) {
      // ----------------------------------------------------------
      // 3. SIDE CHASE
      // ----------------------------------------------------------

      const p = remapProgress(
        progress,
        0.34,
        0.62
      );

      const e = easeInOutCubic(p);

      position.set(
        THREE.MathUtils.lerp(
          5.8,
          -5.8,
          e
        ),
        THREE.MathUtils.lerp(
          3.0,
          4.2,
          e
        ),
        THREE.MathUtils.lerp(
          6.0,
          7.5,
          e
        )
      );

      lookAt.set(
        0,
        THREE.MathUtils.lerp(
          2.0,
          2.8,
          e
        ),
        0
      );
    } else if (progress < 0.82) {
      // ----------------------------------------------------------
      // 4. WIDE LANDSCAPE SHOT
      // ----------------------------------------------------------

      const p = remapProgress(
        progress,
        0.62,
        0.82
      );

      const e = easeInOutCubic(p);

      position.set(
        THREE.MathUtils.lerp(
          -5.8,
          -8.5,
          e
        ),
        THREE.MathUtils.lerp(
          4.2,
          5.8,
          e
        ),
        THREE.MathUtils.lerp(
          7.5,
          11.5,
          e
        )
      );

      lookAt.set(
        0,
        THREE.MathUtils.lerp(
          2.8,
          2.2,
          e
        ),
        0
      );
    } else {
      // ----------------------------------------------------------
      // 5. ARRIVAL
      // ----------------------------------------------------------

      const p = remapProgress(
        progress,
        0.82,
        1
      );

      const e = easeInOutCubic(p);

      position.set(
        THREE.MathUtils.lerp(
          -8.5,
          1.5,
          e
        ),
        THREE.MathUtils.lerp(
          5.8,
          2.4,
          e
        ),
        THREE.MathUtils.lerp(
          11.5,
          8.0,
          e
        )
      );

      lookAt.set(
        THREE.MathUtils.lerp(
          0,
          1.0,
          e
        ),
        THREE.MathUtils.lerp(
          2.2,
          1.3,
          e
        ),
        0
      );
    }

    // ============================================================
    // CAMERA MOVEMENT
    // ============================================================

    const positionDamping = 3.2;

    camera.position.x =
      THREE.MathUtils.damp(
        camera.position.x,
        position.x,
        positionDamping,
        delta
      );

    camera.position.y =
      THREE.MathUtils.damp(
        camera.position.y,
        position.y,
        positionDamping,
        delta
      );

    camera.position.z =
      THREE.MathUtils.damp(
        camera.position.z,
        position.z,
        positionDamping,
        delta
      );

    // ============================================================
    // LOOK-AT SMOOTHING
    // ============================================================

    currentLookAt.current.x =
      THREE.MathUtils.damp(
        currentLookAt.current.x,
        lookAt.x,
        4.5,
        delta
      );

    currentLookAt.current.y =
      THREE.MathUtils.damp(
        currentLookAt.current.y,
        lookAt.y,
        4.5,
        delta
      );

    currentLookAt.current.z =
      THREE.MathUtils.damp(
        currentLookAt.current.z,
        lookAt.z,
        4.5,
        delta
      );

    camera.lookAt(
      currentLookAt.current
    );

    // ============================================================
    // CINEMATIC FOV
    // ============================================================

    let targetFov = 42;

    if (
      progress > 0.18 &&
      progress < 0.38
    ) {
      targetFov = 46;
    } else if (
      progress >= 0.62 &&
      progress < 0.82
    ) {
      targetFov = 50;
    } else if (progress >= 0.82) {
      targetFov = 44;
    }

    camera.fov = THREE.MathUtils.damp(
      camera.fov,
      targetFov,
      3,
      delta
    );

    camera.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1.2, 6]}
      fov={42}
      near={0.1}
      far={1000}
    />
  );
}