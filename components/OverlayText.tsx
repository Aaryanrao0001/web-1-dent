"use client";

import React from "react";
import { scenes } from "@/lib/scenes";

/**
 * OverlayText — renders all 5 scene headline blocks.
 *
 * Container is z-index:10, pointer-events:none (set via cinema.css).
 * Each .text{n} block is positioned absolute and targeted by GSAP.
 *
 * Typography sizing:
 *   - Desktop (>=1024px): 48–60px / Light 300
 *   - Tablet  (768–1023px): ~40px
 *   - Mobile  (<768px): ~28px
 *
 * All sizing is done via Tailwind responsive classes so no CSS is needed.
 */
export default function OverlayText() {
  return (
    <div className="overlay-text">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          className={`${scene.textClass} text-white font-light leading-tight`}
          aria-hidden={scene.id !== 1}
        >
          <h2
            className="
              text-[28px]
              sm:text-[40px]
              lg:text-[52px]
              xl:text-[60px]
              font-light
              tracking-tight
              text-white
            "
          >
            {scene.headline}
          </h2>
        </div>
      ))}
    </div>
  );
}
