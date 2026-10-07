"use client";
import * as React from "react";
import type { Slide, Theme } from "@/lib/types";
import { img } from "@/lib/image-cache";

export function shade(hex: string, percent: number) {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const amt = Math.round((255 * percent) / 100);
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function themeGradient(theme: Theme, inverted?: boolean) {
  if (inverted) {
    return `linear-gradient(160deg, ${theme.bgAlt} 0%, ${shade(theme.bgAlt, -8)} 100%)`;
  }
  return `linear-gradient(160deg, ${theme.bg} 0%, ${shade(theme.bg, -6)} 100%)`;
}

export function resolveBackgroundCss(slide: Slide, theme: Theme): {
  background: string;
  imageUrl?: string;
  imageFit: "cover" | "contain";
  overlay: number;
  hideBlobs: boolean;
  inverted: boolean;
} {
  const inverted = !!slide.inverted;
  const bg = slide.background;
  const mode = bg?.mode || "theme";
  const hideBlobs = !!bg?.hideBlobs;
  const overlay = typeof bg?.overlay === "number" ? Math.max(0, Math.min(1, bg.overlay)) : 0;

  if (mode === "solid" && bg?.solid) {
    return { background: bg.solid, imageFit: "cover", overlay, hideBlobs, inverted };
  }
  if (mode === "gradient" && bg?.gradient) {
    const angle = typeof bg.gradient.angle === "number" ? bg.gradient.angle : 160;
    const from = bg.gradient.from || theme.bg;
    const to = bg.gradient.to || shade(from, -12);
    return {
      background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
      imageFit: "cover",
      overlay,
      hideBlobs,
      inverted,
    };
  }
  if (mode === "image" && bg?.image) {
    const imageUrl = bg.image.startsWith("data:") ? bg.image : img(bg.image);
    return {
      background: themeGradient(theme, inverted),
      imageUrl,
      imageFit: bg.imageFit === "contain" ? "contain" : "cover",
      overlay: overlay || 0.35,
      hideBlobs: hideBlobs || true,
      inverted,
    };
  }
  return {
    background: themeGradient(theme, inverted),
    imageFit: "cover",
    overlay: 0,
    hideBlobs,
    inverted,
  };
}

function Blob({
  cW,
  color,
  x,
  y,
  size,
  opacity = 0.4,
}: {
  cW: number;
  color: string;
  x: number;
  y: number;
  size: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        aspectRatio: "1 / 1",
        background: color,
        borderRadius: "50%",
        filter: `blur(${cW * 0.06}px)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

export function SlideBackground({
  slide,
  cW,
  theme,
}: {
  slide: Slide;
  cW: number;
  cH: number;
  theme: Theme;
}) {
  const resolved = resolveBackgroundCss(slide, theme);
  const inverted = resolved.inverted;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: resolved.background,
        color: inverted ? theme.fgAlt : theme.fg,
      }}
    >
      {resolved.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved.imageUrl}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: resolved.imageFit,
            pointerEvents: "none",
          }}
        />
      )}
      {resolved.overlay > 0 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(0,0,0,${resolved.overlay})`,
            pointerEvents: "none",
          }}
        />
      )}
      {!resolved.hideBlobs && (
        <>
          <Blob cW={cW} color={theme.accent} x={-15} y={-10} size={55} opacity={inverted ? 0.25 : 0.32} />
          <Blob cW={cW} color={theme.accent} x={70} y={75} size={45} opacity={inverted ? 0.18 : 0.25} />
        </>
      )}
    </div>
  );
}

export function featureGraphicBackgroundStyle(slide: Slide, theme: Theme) {
  const custom = slide.background && slide.background.mode !== "theme";
  if (!custom) {
    return {
      background: `linear-gradient(135deg, ${theme.bgAlt} 0%, ${shade(theme.bgAlt, -10)} 50%, ${theme.accent} 200%)`,
      imageUrl: undefined as string | undefined,
      imageFit: "cover" as const,
      overlay: 0,
      hideBlobs: false,
    };
  }
  const r = resolveBackgroundCss(slide, theme);
  return {
    background: r.background,
    imageUrl: r.imageUrl,
    imageFit: r.imageFit,
    overlay: r.overlay,
    hideBlobs: r.hideBlobs,
  };
}
