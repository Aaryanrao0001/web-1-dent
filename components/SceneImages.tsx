"use client";

import React from "react";
import { scenes } from "@/lib/scenes";

/**
 * SceneImages — renders all 5 absolute full-viewport image layers.
 *
 * Each image starts with:
 *   - `.img1` at opacity 1 (hero visible immediately)
 *   - `.img2`–`.img5` at opacity 0 (hidden; revealed by GSAP timeline)
 *
 * CSS class names (img1…img5) are targeted directly by useCinematicTimeline.
 */
export default function SceneImages() {
  return (
    <>
      {scenes.map((scene) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={scene.id}
          src={scene.imagePath}
          alt={scene.headline}
          className={scene.imgClass}
          // Priority load hint for scene 1 (LCP element)
          {...(scene.id === 1 ? { fetchPriority: "high" } : {})}
          draggable={false}
        />
      ))}
    </>
  );
}
