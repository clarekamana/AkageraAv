// "use client";

// import { useFrame } from "@react-three/fiber";
// import { useRef } from "react";
// import * as THREE from "three";

// interface Props {
//   progress: number;
// }

// export function RotorSystem({ progress }: Props) {
//   const mainRotor = useRef<THREE.Object3D>(null);
//   const tailRotor = useRef<THREE.Object3D>(null);

//   useFrame((_, delta) => {
//     const rpm = THREE.MathUtils.lerp(
//       0,
//       40,
//       THREE.MathUtils.smoothstep(
//         progress,
//         0.15,
//         0.32
//       )
//     );

//     if (mainRotor.current) {
//       mainRotor.current.rotation.y +=
//         rpm * delta;
//     }

//     if (tailRotor.current) {
//       tailRotor.current.rotation.x +=
//         rpm * 1.4 * delta;
//     }
//   });

//   return null;
// }