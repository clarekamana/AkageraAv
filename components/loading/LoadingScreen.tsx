"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setHidden(true), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        background: "#F7F5EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.8s ease",
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? "none" : "auto",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          letterSpacing: "0.35em",
          color: "#20603D",
          marginBottom: "16px",
        }}
      >
        AKAGERA AVIATION
      </div>
      <div
        style={{
          fontSize: "20px",
          fontFamily: "'Playfair Display', serif",
          color: "#10231A",
          letterSpacing: "0.15em",
          marginBottom: "32px",
        }}
      >
        RWANDA FROM ABOVE
      </div>
      <div
        style={{
          width: "140px",
          height: "2px",
          background: "#E8E5DC",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: `${progress}%`,
            background: "#00A1DE",
            transition: "width 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}