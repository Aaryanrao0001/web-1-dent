"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * useCinematicTimeline — all GSAP + ScrollTrigger logic.
 *
 * Architecture decisions:
 * - Single GSAP context for safe cleanup on unmount (ctx.revert())
 * - One continuous timeline mapped to a ScrollTrigger scrub
 * - Timeline is divided into 5 equal "scene windows" of 1 unit each
 *   (total duration = 5 units; each scene = 0..1 within its window)
 * - prefers-reduced-motion: timeline is disabled; simple cross-fade shown instead
 *
 * Scene window math:
 *   Total timeline duration = 5 (arbitrary units; maps to scroll distance)
 *   Scene N occupies [N-1, N] on the timeline
 *   e.g. Scene 1 = 0→1, Scene 2 = 1→2, Scene 3 = 2→3 …
 *
 * Text timing within a scene:
 *   "60% through scene" = scene_start + 0.6 × scene_duration
 *   "40% of scene window" = 0.4 units
 */

const SCENE_DURATION = 1; // timeline units per scene
// NUM_SCENES is used as documentation; 5 scenes × 1 unit = 5 total

// Tablet scale reduction (~10% less aggressive) applied to scaleTo values
const TABLET_SCALE_REDUCTION = 0.9;

export function useCinematicTimeline() {
  useEffect(() => {
    // Guard: only run on client
    if (typeof window === "undefined") return;

    // Register ScrollTrigger plugin (safe to call multiple times)
    gsap.registerPlugin(ScrollTrigger);

    // Detect device capabilities
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ─── Reduced-motion fallback ──────────────────────────────────────────
    // Show a simplified static/crossfade presentation preserving content.
    if (prefersReducedMotion) {
      const ctx = gsap.context(() => {
        // Simply show all images in a soft timed sequence (no scroll scrub)
        const images = [".img2", ".img3", ".img4", ".img5"];
        const texts = [".text1", ".text2", ".text3", ".text4", ".text5"];

        // Show text1 immediately
        gsap.set(".text1", { opacity: 1, y: 0 });
        texts.slice(1).forEach((t) => gsap.set(t, { opacity: 0 }));

        images.forEach((img) => gsap.set(img, { opacity: 0 }));

        // Crossfade each scene every 3 seconds for accessibility
        texts.forEach((textSel, i) => {
          const prevImg = `.img${i + 1}`;
          const hasNextScene = i + 2 <= 5;
          const nextImg = hasNextScene ? `.img${i + 2}` : null;
          const prevText = texts[i];
          gsap.to(prevText, {
            opacity: 0,
            delay: 3 * (i + 1),
            duration: 0.8,
          });
          gsap.to(prevImg, {
            opacity: 0,
            delay: 3 * (i + 1),
            duration: 0.8,
          });
          if (nextImg) {
            gsap.fromTo(
              nextImg,
              { opacity: 0 },
              { opacity: 1, delay: 3 * (i + 1), duration: 0.8 }
            );
          }
          gsap.fromTo(
            textSel,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              delay: 3 * (i + 1) + 0.4,
              duration: 0.6,
            }
          );
        });
      });

      return () => ctx.revert();
    }

    // ─── Cinematic scroll timeline ────────────────────────────────────────

    // Enable mobile jitter mitigation
    if (isMobile) {
      ScrollTrigger.normalizeScroll(true);
    }

    // ScrollTrigger scroll distance
    const scrollEnd = isMobile ? "+=4000" : "+=5000";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scene-container",
          start: "top top",
          end: scrollEnd,
          pin: true,
          scrub: true,            // 1:1 scroll-to-timeline; no snap
          anticipatePin: 1,       // prevents flicker on initial pin
          invalidateOnRefresh: true, // recalculates on resize/orientation change
        },
      });

      // Helper: convert scene-local progress [0,1] → absolute timeline position
      const at = (scene: number, localProgress: number) =>
        (scene - 1) * SCENE_DURATION + localProgress * SCENE_DURATION;

      // ── SCENE 1 (timeline 0 → 1) ─────────────────────────────────────
      // img1 scales from 1.0 → 1.3 across scene 1 window
      tl.fromTo(
        ".img1",
        { scale: 1.0 },
        { scale: 1.3, ease: "none" },
        at(1, 0) // "<" = immediately at scene 1 start
      );
      // text1 opacity 1 → 0 during last 40% of scene 1 (60%→100%)
      tl.fromTo(
        ".text1",
        { opacity: 1 },
        { opacity: 0, ease: "none", duration: SCENE_DURATION * 0.4 },
        at(1, 0.6)
      );

      // ── SCENE 2 (timeline 1 → 2) ─────────────────────────────────────
      // img2 fades in at scene 2 start
      tl.fromTo(
        ".img2",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: SCENE_DURATION * 0.15 },
        at(2, 0)
      );
      // img2 scales 1.0 → 1.2 across scene 2 window
      // Tablet: reduce scale target by ~10%
      const img2Scale = isTablet ? 1.2 * TABLET_SCALE_REDUCTION : 1.2;
      tl.fromTo(
        ".img2",
        { scale: 1.0 },
        { scale: img2Scale, ease: "none", duration: SCENE_DURATION },
        at(2, 0)
      );
      // text2: animate in at 60% scene2, then out before scene end
      tl.fromTo(
        ".text2",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: "power2.out", duration: SCENE_DURATION * 0.2 },
        at(2, 0.6)
      );
      tl.to(
        ".text2",
        { opacity: 0, y: -20, ease: "power2.in", duration: SCENE_DURATION * 0.15 },
        at(2, 0.85)
      );

      // ── SCENE 3 (timeline 2 → 3) ─────────────────────────────────────
      // img3 fades in at scene 3 start
      tl.fromTo(
        ".img3",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: SCENE_DURATION * 0.15 },
        at(3, 0)
      );
      // img3 scales 1.0 → 1.4 across scene 3 window
      const img3Scale = isTablet ? 1.4 * TABLET_SCALE_REDUCTION : 1.4;
      tl.fromTo(
        ".img3",
        { scale: 1.0 },
        { scale: img3Scale, ease: "none", duration: SCENE_DURATION },
        at(3, 0)
      );
      // text3: animate in around 60% of scene 3
      tl.fromTo(
        ".text3",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: "power2.out", duration: SCENE_DURATION * 0.2 },
        at(3, 0.6)
      );
      tl.to(
        ".text3",
        { opacity: 0, y: -20, ease: "power2.in", duration: SCENE_DURATION * 0.15 },
        at(3, 0.85)
      );

      // ── SCENE 4 (timeline 3 → 4) ─────────────────────────────────────
      // img4 fades in at scene 4 start
      tl.fromTo(
        ".img4",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: SCENE_DURATION * 0.15 },
        at(4, 0)
      );
      // img4 scales 1.0 → 1.6 across scene 4 window
      const img4Scale = isTablet ? 1.6 * TABLET_SCALE_REDUCTION : 1.6;
      tl.fromTo(
        ".img4",
        { scale: 1.0 },
        { scale: img4Scale, ease: "none", duration: SCENE_DURATION },
        at(4, 0)
      );
      // text4: animate in around 60% of scene 4
      tl.fromTo(
        ".text4",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: "power2.out", duration: SCENE_DURATION * 0.2 },
        at(4, 0.6)
      );
      tl.to(
        ".text4",
        { opacity: 0, y: -20, ease: "power2.in", duration: SCENE_DURATION * 0.15 },
        at(4, 0.85)
      );

      // ── SCENE 5 (timeline 4 → 5) ─────────────────────────────────────
      // img5 fades in at scene 5 start; hold to end
      tl.fromTo(
        ".img5",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: SCENE_DURATION * 0.15 },
        at(5, 0)
      );
      // text5: animate in at ~70% of scene 5; hold to end
      tl.fromTo(
        ".text5",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: SCENE_DURATION * 0.2,
        },
        at(5, 0.7)
      );
      // Hold text5 visible to end (add a zero-change tween to pin the end state)
      tl.to(".text5", { opacity: 1, duration: SCENE_DURATION * 0.1 }, at(5, 0.9));
    });

    // ── Cleanup on unmount ──────────────────────────────────────────────
    return () => {
      ctx.revert(); // kills all tweens + ScrollTriggers created in this context
    };
  }, []);
}

export default useCinematicTimeline;
