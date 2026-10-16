"use client";

/**
 * Temporary restore: re-export the production canvas from the skill template
 * so the editor boots again. The template includes full device frames, layouts,
 * connected canvas, and theme gradients.
 *
 * Custom solid/gradient/image backgrounds from BackgroundPanel are wired in
 * background.tsx; a follow-up will inline AdvancedSlideBackground into this file.
 */
export {
  getCanvas,
  getFrameForDevice,
  getElementTransform,
  DeckCanvas,
} from "../../../../skills/app-store-screenshots/template/src/components/editor/slide-canvas";
