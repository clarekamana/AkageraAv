"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { remapProgress } from "@/lib/math";

const MODEL_PATH = "/models/akagera-aw139.glb";

interface Props {
  progress: number;
}

export function Helicopter({ progress }: Props) {
  const rootGroup = useRef<THREE.Group>(null);

  const mainRotorRef = useRef<THREE.Object3D | null>(null);
  const tailRotorRef = useRef<THREE.Object3D | null>(null);

  const gltf = useGLTF(MODEL_PATH);

  useLayoutEffect(() => {
    const scene = gltf.scene;

    if (!scene) return;

    let mainRotor: THREE.Object3D | null = null;
    let tailRotor: THREE.Object3D | null = null;

    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        const materials: THREE.Material[] = Array.isArray(
          object.material
        )
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            if (material.map) {
              material.map.colorSpace = THREE.SRGBColorSpace;
              material.map.needsUpdate = true;
            }

            material.envMapIntensity = 1.5;
            material.needsUpdate = true;
          }
        });
      }

      if (object.name === "Empty001") {
        mainRotor = object;
      }

      if (object.name === "Empty003") {
        tailRotor = object;
      }
    });

    mainRotorRef.current = mainRotor;
    tailRotorRef.current = tailRotor;

    console.log("=================================");
    // console.log("🚁 HELICOPTER BLENDER RIG");
    // console.log("Main Rotor:", mainRotor?.name ?? "NOT FOUND");
    // console.log("Tail Rotor:", tailRotor?.name ?? "NOT FOUND");
    console.log("=================================");
  }, [gltf.scene]);

  useFrame((_, delta) => {
    const root = rootGroup.current;

    if (!root) return;

    const takeoffPhase = remapProgress(
      progress,
      0.18,
      0.32
    );

    const cruisePhase = remapProgress(
      progress,
      0.32,
      0.85
    );

    const landingPhase = remapProgress(
      progress,
      0.85,
      0.98
    );

    const maxAltitude = 3.8;

    let targetY = 0;

    if (progress < 0.18) {
      targetY = 0;
    } else if (progress < 0.85) {
      targetY = takeoffPhase * maxAltitude;
    } else {
      targetY = (1 - landingPhase) * maxAltitude;
    }

    const airborneWeight =
      Math.sin(progress * Math.PI);

    const hoverBob =
      Math.sin(performance.now() * 0.0025) *
      0.08 *
      airborneWeight;

    targetY += hoverBob;

    root.position.y = THREE.MathUtils.damp(
      root.position.y,
      targetY,
      2.8,
      delta
    );

    let targetPitch = 0;
    let targetRoll = 0;

    if (
      progress > 0.22 &&
      progress < 0.35
    ) {
      targetPitch = 0.12;
    } else if (
      cruisePhase > 0 &&
      cruisePhase < 1
    ) {
      targetPitch = 0.07;

      targetRoll =
        Math.sin(
          progress * Math.PI * 5
        ) * 0.08;
    } else if (landingPhase > 0) {
      targetPitch =
        -0.06 * (1 - landingPhase);
    }

    root.rotation.x = THREE.MathUtils.damp(
      root.rotation.x,
      targetPitch,
      2.2,
      delta
    );

    root.rotation.z = THREE.MathUtils.damp(
      root.rotation.z,
      -targetRoll,
      2.2,
      delta
    );

    let rpmProgress = 0;

    if (progress < 0.85) {
      rpmProgress = remapProgress(
        progress,
        0.05,
        0.25
      );
    } else {
      rpmProgress =
        1 -
        remapProgress(
          progress,
          0.92,
          1.0
        ) *
          0.7;
    }

    rpmProgress = THREE.MathUtils.clamp(
      rpmProgress,
      0,
      1
    );

    const mainRotorSpeed =
      rpmProgress * 42;

    const tailRotorSpeed =
      mainRotorSpeed * 1.4;

    const mainRotor = mainRotorRef.current;

    if (mainRotor) {
      mainRotor.rotation.x +=
        mainRotorSpeed * delta;
    }

    const tailRotor = tailRotorRef.current;

    if (tailRotor) {
      tailRotor.rotation.x +=
        tailRotorSpeed * delta;
    }
  });

  return (
    <group
      ref={rootGroup}
      position={[0, 0, 0]}
      dispose={null}
    >
      <primitive
        object={gltf.scene}
        scale={1.8}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);