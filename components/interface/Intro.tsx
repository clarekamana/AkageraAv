"use client";

interface Props {
  progress: number;
}

export function Intro({ progress }: Props) {
  const opacity = Math.max(
    0,
    1 - progress * 8
  );

  return (
    <section
      className="intro"
      style={{ opacity }}
    >
      <div className="eyebrow">
        AKAGERA AVIATION
      </div>

      <h1>
        RWANDA
        <br />
        <em>FROM ABOVE.</em>
      </h1>

      <div className="scroll">
        SCROLL TO FLY
        <span>↓</span>
      </div>
    </section>
  );
}