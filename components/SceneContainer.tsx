"use client";

import React from "react";
import SceneImages from "./SceneImages";
import OverlayText from "./OverlayText";
import { useCinematicTimeline } from "@/hooks/useCinematicTimeline";

/**
 * SceneContainer — the single pinned wrapper for the cinematic experience.
 *
 * Structural rules (from PRD):
 *   - position: relative  (ScrollTrigger pins it; not position:fixed itself)
 *   - height: 100svh / 100vh  (set in cinema.css)
 *   - overflow: hidden    (clips scaled images)
 *
 * This component is intentionally thin — it just mounts the container and
 * delegates animation logic to useCinematicTimeline.
 */
export default function SceneContainer() {
  useCinematicTimeline();

  return (
    <section className="scene-container" aria-label="Cinematic dental journey">
      <SceneImages />
      <OverlayText />
    </section>
  );
}
