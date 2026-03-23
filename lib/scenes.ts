/**
 * lib/scenes.ts — Single source of truth for all scene data.
 * To swap assets: update `imagePath`. To update copy: update `headline`.
 * To change animation targets: update `scaleTo` here and they are read by
 * useCinematicTimeline.ts automatically.
 */

export interface Scene {
  /** Numeric identifier (1-based) */
  id: number;
  /** Public image path — must exist under /public/images/ */
  imagePath: string;
  /** CSS class applied to the <img> element */
  imgClass: string;
  /** CSS class applied to the text overlay element */
  textClass: string;
  /** Scene headline copy */
  headline: string;
  /** z-index for the image layer (img1=1 … img5=5) */
  zIndex: number;
  /** Target scale value at the end of this scene's window */
  scaleTo: number;
}

export const scenes: Scene[] = [
  {
    id: 1,
    imagePath: "/images/1.png",
    imgClass: "img1",
    textClass: "text1",
    headline: "Precision Dentistry. Redefined.",
    zIndex: 1,
    scaleTo: 1.3,
  },
  {
    id: 2,
    imagePath: "/images/2.png",
    imgClass: "img2",
    textClass: "text2",
    headline: "Advanced Treatment Setup",
    zIndex: 2,
    scaleTo: 1.2,
  },
  {
    id: 3,
    imagePath: "/images/3.png",
    imgClass: "img3",
    textClass: "text3",
    headline: "Precision in Every Detail",
    zIndex: 3,
    scaleTo: 1.4,
  },
  {
    id: 4,
    imagePath: "/images/4.png",
    imgClass: "img4",
    textClass: "text4",
    headline: "Crafted for Natural Perfection",
    zIndex: 4,
    scaleTo: 1.6,
  },
  {
    id: 5,
    imagePath: "/images/5.png",
    imgClass: "img5",
    textClass: "text5",
    headline: "Confidence You Can Feel",
    zIndex: 5,
    scaleTo: 1.0, // final scene holds at initial scale
  },
];
