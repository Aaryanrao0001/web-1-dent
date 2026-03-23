/**
 * app/page.tsx — Dental Cinematic Scroll Landing Page
 *
 * This page renders a single full-viewport cinematic section.
 * The SceneContainer component manages the pinned scroll experience
 * driven by GSAP ScrollTrigger (see hooks/useCinematicTimeline.ts).
 *
 * To swap images: replace files in /public/images/ (1.png–5.png)
 * To update copy:  edit lib/scenes.ts → headline field per scene
 */

import SceneContainer from "@/components/SceneContainer";

export default function Home() {
  return (
    <main>
      <SceneContainer />
    </main>
  );
}
