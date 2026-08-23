"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { remapProgress } from "@/lib/math";

interface Props {
  progress: number;
}

function smoothStep(
  value: number,
  start: number,
  end: number
) {
  return THREE.MathUtils.smoothstep(
    value,
    start,
    end
  );
}

function interpolateColor(
  a: string,
  b: string,
  amount: number
) {
  const colorA = new THREE.Color(a);
  const colorB = new THREE.Color(b);

  return colorA.lerp(colorB, amount);
}

export function RwandaWorld({ progress }: Props) {
  const fogRef = useRef<THREE.FogExp2>(null);
  const sunLightRef =
    useRef<THREE.DirectionalLight>(null);

  const groundMaterialRef =
    useRef<THREE.MeshStandardMaterial>(null);

  const mountainMaterialRefs =
    useRef<THREE.MeshStandardMaterial[]>([]);

  const cloudMaterialRefs =
    useRef<THREE.MeshStandardMaterial[]>([]);

  const cloudGroupRef =
    useRef<THREE.Group>(null);

  const worldRef = useRef<THREE.Group>(null);

  // ============================================================
  // CLOUD POSITIONS
  // ============================================================

  const clouds = useMemo(
    () => [
      {
        position: [-18, 9, -25] as [
          number,
          number,
          number
        ],
        scale: 1.7,
      },
      {
        position: [16, 11, -35] as [
          number,
          number,
          number
        ],
        scale: 2.2,
      },
      {
        position: [-30, 15, -55] as [
          number,
          number,
          number
        ],
        scale: 2.8,
      },
      {
        position: [30, 13, -70] as [
          number,
          number,
          number
        ],
        scale: 2.5,
      },
      {
        position: [-8, 18, -90] as [
          number,
          number,
          number
        ],
        scale: 3.2,
      },
      {
        position: [22, 17, -110] as [
          number,
          number,
          number
        ],
        scale: 3.4,
      },
    ],
    []
  );

  // ============================================================
  // MOUNTAINS
  // ============================================================

  const mountains = useMemo(
    () => [
      {
        position: [-45, 4, -90] as [
          number,
          number,
          number
        ],
        scale: [55, 24, 20] as [
          number,
          number,
          number
        ],
      },
      {
        position: [35, 5, -105] as [
          number,
          number,
          number
        ],
        scale: [65, 30, 24] as [
          number,
          number,
          number
        ],
      },
      {
        position: [-5, 7, -135] as [
          number,
          number,
          number
        ],
        scale: [90, 42, 30] as [
          number,
          number,
          number
        ],
      },
      {
        position: [75, 3, -155] as [
          number,
          number,
          number
        ],
        scale: [80, 36, 28] as [
          number,
          number,
          number
        ],
      },
    ],
    []
  );

  // ============================================================
  // SCROLL-DRIVEN ENVIRONMENT
  // ============================================================

  useFrame((_, delta) => {
    const fog = fogRef.current;
    const sun = sunLightRef.current;
    const ground = groundMaterialRef.current;

    if (!fog || !sun || !ground) {
      return;
    }

    // ==========================================================
    // 1. ENVIRONMENT PHASES
    // ==========================================================

    const kigaliToVolcanoes =
      smoothStep(
        progress,
        0.30,
        0.45
      );

    const volcanoesToNyungwe =
      smoothStep(
        progress,
        0.60,
        0.72
      );

    const nyungweToAkagera =
      smoothStep(
        progress,
        0.78,
        0.92
      );

    // ==========================================================
    // 2. FOG COLOR
    // ==========================================================

    const kigaliFog =
      new THREE.Color("#DCE8E5");

    const volcanoFog =
      new THREE.Color("#BFCFD0");

    const nyungweFog =
      new THREE.Color("#B9CDBE");

    const akageraFog =
      new THREE.Color("#E4C7A3");

    const currentFog =
      new THREE.Color();

    if (progress < 0.45) {
      currentFog.copy(
        kigaliFog
      ).lerp(
        volcanoFog,
        kigaliToVolcanoes
      );
    } else if (progress < 0.72) {
      currentFog.copy(
        volcanoFog
      ).lerp(
        nyungweFog,
        volcanoesToNyungwe
      );
    } else {
      currentFog.copy(
        nyungweFog
      ).lerp(
        akageraFog,
        nyungweToAkagera
      );
    }

    fog.color.lerp(
      currentFog,
      delta * 4
    );

    // ==========================================================
    // 3. FOG DENSITY
    // ==========================================================

    let targetFogDensity = 0.012;

    if (
      progress >= 0.38 &&
      progress < 0.68
    ) {
      // Volcanoes = heavy mist

      const mistAmount =
        smoothStep(
          progress,
          0.38,
          0.48
        );

      const mistExit =
        smoothStep(
          progress,
          0.60,
          0.68
        );

      targetFogDensity =
        THREE.MathUtils.lerp(
          0.012,
          0.025,
          mistAmount
        );

      targetFogDensity =
        THREE.MathUtils.lerp(
          targetFogDensity,
          0.012,
          mistExit
        );
    }

    if (
      progress >= 0.68 &&
      progress < 0.82
    ) {
      targetFogDensity = 0.018;
    }

    if (progress >= 0.82) {
      targetFogDensity = 0.009;
    }

    fog.density =
      THREE.MathUtils.damp(
        fog.density,
        targetFogDensity,
        3,
        delta
      );

    // ==========================================================
    // 4. SUN COLOR
    // ==========================================================

    const morningSun =
      new THREE.Color("#FFE3C1");

    const mountainSun =
      new THREE.Color("#DCEAF0");

    const forestSun =
      new THREE.Color("#FFF0D0");

    const sunsetSun =
      new THREE.Color("#FF9B55");

    const targetSun =
      new THREE.Color();

    if (progress < 0.38) {
      targetSun.copy(
        morningSun
      );
    } else if (progress < 0.68) {
      targetSun.copy(
        mountainSun
      );
    } else if (progress < 0.82) {
      targetSun.copy(
        forestSun
      );
    } else {
      const sunsetAmount =
        smoothStep(
          progress,
          0.82,
          1
        );

      targetSun
        .copy(forestSun)
        .lerp(
          sunsetSun,
          sunsetAmount
        );
    }

    sun.color.lerp(
      targetSun,
      delta * 3
    );

    // ==========================================================
    // 5. SUN INTENSITY
    // ==========================================================

    let targetSunIntensity = 2.5;

    if (
      progress >= 0.38 &&
      progress < 0.68
    ) {
      targetSunIntensity = 1.8;
    } else if (
      progress >= 0.68 &&
      progress < 0.82
    ) {
      targetSunIntensity = 2.3;
    } else if (
      progress >= 0.82
    ) {
      targetSunIntensity = 3.0;
    }

    sun.intensity =
      THREE.MathUtils.damp(
        sun.intensity,
        targetSunIntensity,
        3,
        delta
      );

    // ==========================================================
    // 6. GROUND COLOR
    // ==========================================================

    const cityGround =
      new THREE.Color("#526C59");

    const mountainGround =
      new THREE.Color("#3F614B");

    const forestGround =
      new THREE.Color("#244F35");

    const savannaGround =
      new THREE.Color("#806B43");

    const targetGround =
      new THREE.Color();

    if (progress < 0.38) {
      targetGround.copy(
        cityGround
      );
    } else if (progress < 0.68) {
      targetGround.copy(
        mountainGround
      );
    } else if (progress < 0.82) {
      targetGround.copy(
        forestGround
      );
    } else {
      const savannaAmount =
        smoothStep(
          progress,
          0.82,
          1
        );

      targetGround
        .copy(forestGround)
        .lerp(
          savannaGround,
          savannaAmount
        );
    }

    ground.color.lerp(
      targetGround,
      delta * 3
    );

    // ==========================================================
    // 7. MOUNTAIN COLORS
    // ==========================================================

    const mountainColor =
      new THREE.Color();

    if (progress < 0.38) {
      mountainColor.set(
        "#526E5D"
      );
    } else if (progress < 0.68) {
      mountainColor.set(
        "#344D4A"
      );
    } else if (progress < 0.82) {
      mountainColor.set(
        "#234A34"
      );
    } else {
      mountainColor.set(
        "#695B3F"
      );
    }

    mountainMaterialRefs.current.forEach(
      (material) => {
        material.color.lerp(
          mountainColor,
          delta * 2.5
        );
      }
    );

    // ==========================================================
    // 8. CLOUD APPEARANCE
    // ==========================================================

    let cloudOpacity = 0.72;

    if (
      progress >= 0.38 &&
      progress < 0.68
    ) {
      // More clouds around Volcanoes

      cloudOpacity = 0.9;
    } else if (
      progress >= 0.68 &&
      progress < 0.82
    ) {
      // Forest mist

      cloudOpacity = 0.8;
    } else if (
      progress >= 0.82
    ) {
      // Open Akagera sky

      cloudOpacity = 0.45;
    }

    cloudMaterialRefs.current.forEach(
      (material) => {
        material.opacity =
          THREE.MathUtils.damp(
            material.opacity,
            cloudOpacity,
            3,
            delta
          );
      }
    );

    // ==========================================================
    // 9. CLOUD MOVEMENT
    // ==========================================================

    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.x =
        Math.sin(
          progress * Math.PI * 2
        ) * 2;

      cloudGroupRef.current.position.y =
        Math.sin(
          performance.now() * 0.00015
        ) * 0.15;
    }

    // ==========================================================
    // 10. WORLD POSITION
    // ==========================================================

    const worldTravel =
      remapProgress(
        progress,
        0.18,
        1
      );

    if (worldRef.current) {
      const targetZ =
        worldTravel * -80;

      worldRef.current.position.z =
        THREE.MathUtils.damp(
          worldRef.current.position.z,
          targetZ,
          2,
          delta
        );
    }
  });

  return (
    <>
      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <color
        attach="background"
        args={["#BFD5DF"]}
      />

      {/* ====================================================== */}
      {/* ATMOSPHERIC FOG */}
      {/* ====================================================== */}

      <fogExp2
        ref={fogRef}
        attach="fog"
        args={[
          "#DCE8E5",
          0.012,
        ]}
      />

      {/* ====================================================== */}
      {/* SUN */}
      {/* ====================================================== */}

      <directionalLight
        ref={sunLightRef}
        position={[
          100,
          100,
          60,
        ]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[
          2048,
          2048,
        ]}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* ====================================================== */}
      {/* NATURAL SKY LIGHT */}
      {/* ====================================================== */}

      <hemisphereLight
        skyColor="#BFDCE8"
        groundColor="#415A48"
        intensity={1.25}
      />

      <ambientLight
        intensity={0.35}
        color="#DDE8E2"
      />

      {/* ====================================================== */}
      {/* SCROLLING WORLD */}
      {/* ====================================================== */}

      <group ref={worldRef}>
        {/* ==================================================== */}
        {/* MOUNTAINS */}
        {/* ==================================================== */}

        {mountains.map(
          (
            mountain,
            index
          ) => {
            const material =
              mountainMaterialRefs.current[
                index
              ] ??
              new THREE.MeshStandardMaterial(
                {
                  color:
                    "#416653",
                  roughness: 1,
                  metalness: 0,
                  flatShading: false,
                }
              );

            mountainMaterialRefs.current[
              index
            ] = material;

            return (
              <mesh
                key={`mountain-${index}`}
                position={
                  mountain.position
                }
                scale={
                  mountain.scale
                }
                rotation={[
                  0,
                  index * 0.22,
                  0,
                ]}
                material={material}
                receiveShadow
              >
                <sphereGeometry
                  args={[
                    1,
                    32,
                    20,
                  ]}
                />
              </mesh>
            );
          }
        )}

        {/* ==================================================== */}
        {/* CLOUDS */}
        {/* ==================================================== */}

        <group
          ref={
            cloudGroupRef
          }
        >
          {clouds.map(
            (
              cloud,
              index
            ) => {
              const material =
                cloudMaterialRefs.current[
                  index
                ] ??
                new THREE.MeshStandardMaterial(
                  {
                    color:
                      "#FFFFFF",
                    transparent:
                      true,
                    opacity:
                      0.72,
                    roughness: 1,
                    depthWrite:
                      false,
                  }
                );

              cloudMaterialRefs.current[
                index
              ] = material;

              return (
                <group
                  key={`cloud-${index}`}
                  position={
                    cloud.position
                  }
                  scale={
                    cloud.scale
                  }
                >
                  <mesh
                    position={[
                      -1.2,
                      0,
                      0,
                    ]}
                    material={
                      material
                    }
                  >
                    <sphereGeometry
                      args={[
                        1.3,
                        24,
                        16,
                      ]}
                    />
                  </mesh>

                  <mesh
                    position={[
                      0,
                      0.35,
                      0,
                    ]}
                    material={
                      material
                    }
                  >
                    <sphereGeometry
                      args={[
                        1.7,
                        24,
                        16,
                      ]}
                    />
                  </mesh>

                  <mesh
                    position={[
                      1.3,
                      0,
                      0,
                    ]}
                    material={
                      material
                    }
                  >
                    <sphereGeometry
                      args={[
                        1.25,
                        24,
                        16,
                      ]}
                    />
                  </mesh>

                  <mesh
                    position={[
                      0.5,
                      -0.15,
                      0.6,
                    ]}
                    material={
                      material
                    }
                  >
                    <sphereGeometry
                      args={[
                        1.15,
                        24,
                        16,
                      ]}
                    />
                  </mesh>
                </group>
              );
            }
          )}
        </group>

        {/* ==================================================== */}
        {/* GROUND */}
        {/* ==================================================== */}

        <mesh
          position={[
            0,
            -2,
            -70,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          receiveShadow
        >
          <planeGeometry
            args={[
              500,
              500,
              64,
              64,
            ]}
          />

          <meshStandardMaterial
            ref={
              groundMaterialRef
            }
            color="#526C59"
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>
    </>
  );
}