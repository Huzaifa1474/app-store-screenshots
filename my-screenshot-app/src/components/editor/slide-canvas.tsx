"use client";

/**
 * Restores a bootable editor by re-exporting the production canvas from the
 * skill template already in this repository.
 *
 * If your Next.js build rejects imports outside my-screenshot-app/, run:
 *   cp skills/app-store-screenshots/template/src/components/editor/slide-canvas.tsx \
 *      my-screenshot-app/src/components/editor/slide-canvas.tsx
 */
export {
  getCanvas,
  getFrameForDevice,
  getElementTransform,
  DeckCanvas,
} from "../../../../skills/app-store-screenshots/template/src/components/editor/slide-canvas";
