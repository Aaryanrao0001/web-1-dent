# web-1-dent — Dental Cinematic Scroll Experience

A CRED Garage–style, pinned cinematic landing page for dental practices built with **Next.js**, **GSAP ScrollTrigger**, and **Tailwind CSS**.

## Overview

Scroll position maps 1:1 to camera progression across 5 scenes. No timers, no autoplay — the user controls the cinematic.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

| File | Responsibility |
|---|---|
| `app/page.tsx` | Root page — composes the cinematic section |
| `components/SceneContainer.tsx` | Pinned wrapper; mounts images + text, invokes timeline hook |
| `components/SceneImages.tsx` | Renders 5 absolute full-viewport image layers (`.img1`–`.img5`) |
| `components/OverlayText.tsx` | Renders 5 scene headline blocks (`.text1`–`.text5`) |
| `hooks/useCinematicTimeline.ts` | All GSAP + ScrollTrigger logic; cleanup on unmount |
| `lib/scenes.ts` | **Single source of truth** — image paths, copy, z-index, scale targets |
| `styles/cinema.css` | Positional/structural styles only (no CSS animations) |

## Swapping Assets

Replace files in `public/images/` keeping the same names:

| File | Scene | Subject |
|---|---|---|
| `public/images/1.png` | Hero | Clinic hallway |
| `public/images/2.png` | Chair | Treatment chair |
| `public/images/3.png` | Tools | Instrument close-up |
| `public/images/4.png` | Veneers | Veneer process |
| `public/images/5.png` | Smile | Final smile result |

Images should be **16:9**, minimum 1920×1080 px, ≤500 KB each (WebP recommended).

## Updating Copy

Edit the `headline` field in `lib/scenes.ts` for each scene.

