"use client";
import * as React from "react";
import { Layers, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BackgroundMode, Slide, SlideBackground, Theme } from "@/lib/types";
import { themeGradient, shade } from "./background";
import { ScreenshotPicker } from "./screenshot-picker";

const PRESETS: { name: string; bg: SlideBackground }[] = [
  {
    name: "Soft Blue",
    bg: { mode: "gradient", gradient: { from: "#E0F2FE", to: "#BAE6FD", angle: 160 }, hideBlobs: false },
  },
  {
    name: "Sunset",
    bg: { mode: "gradient", gradient: { from: "#FFEDD5", to: "#FDBA74", angle: 135 }, hideBlobs: false },
  },
  {
    name: "Deep Night",
    bg: { mode: "gradient", gradient: { from: "#0F172A", to: "#1E293B", angle: 160 }, hideBlobs: true },
  },
  {
    name: "Mint Fresh",
    bg: { mode: "gradient", gradient: { from: "#D1FAE5", to: "#A7F3D0", angle: 160 }, hideBlobs: false },
  },
  {
    name: "Warm Sand",
    bg: { mode: "gradient", gradient: { from: "#FEF3C7", to: "#FDE68A", angle: 145 }, hideBlobs: false },
  },
  {
    name: "Violet Pop",
    bg: { mode: "gradient", gradient: { from: "#EDE9FE", to: "#C4B5FD", angle: 160 }, hideBlobs: false },
  },
  {
    name: "Pure White",
    bg: { mode: "solid", solid: "#FFFFFF", hideBlobs: true },
  },
  {
    name: "Pure Black",
    bg: { mode: "solid", solid: "#0A0A0A", hideBlobs: true },
  },
];

type Props = {
  slide: Slide;
  theme: Theme;
  onChange: (patch: Partial<Slide>) => void;
  onApplyToAll?: (bg: SlideBackground | undefined, inverted?: boolean) => void;
};

export function BackgroundPanel({ slide, theme, onChange, onApplyToAll }: Props) {
  const bg = slide.background;
  const mode: BackgroundMode = bg?.mode || "theme";
  const inverted = !!slide.inverted;

  function setBg(next: Partial<SlideBackground> | null) {
    if (next === null) {
      onChange({ background: undefined });
      return;
    }
    const merged: SlideBackground = {
      mode: next.mode || mode,
      solid: next.solid ?? bg?.solid,
      gradient: next.gradient ?? bg?.gradient,
      image: next.image ?? bg?.image,
      imageFit: next.imageFit ?? bg?.imageFit,
      overlay: next.overlay ?? bg?.overlay,
      hideBlobs: next.hideBlobs ?? bg?.hideBlobs,
    };
    if (merged.mode === "theme") {
      onChange({ background: undefined });
      return;
    }
    onChange({ background: merged });
  }

  function setMode(m: BackgroundMode) {
    if (m === "theme") {
      setBg(null);
      return;
    }
    if (m === "solid") {
      setBg({
        mode: "solid",
        solid: bg?.solid || theme.bg,
        hideBlobs: bg?.hideBlobs,
      });
      return;
    }
    if (m === "gradient") {
      setBg({
        mode: "gradient",
        gradient: bg?.gradient || {
          from: theme.bg,
          to: shade(theme.bg, -12),
          angle: 160,
        },
        hideBlobs: bg?.hideBlobs,
      });
      return;
    }
    if (m === "image") {
      setBg({
        mode: "image",
        image: bg?.image || "",
        imageFit: bg?.imageFit || "cover",
        overlay: typeof bg?.overlay === "number" ? bg.overlay : 0.35,
        hideBlobs: true,
      });
    }
  }

  const previewStyle = React.useMemo(() => {
    if (mode === "solid" && bg?.solid) return { background: bg.solid };
    if (mode === "gradient" && bg?.gradient) {
      const a = bg.gradient.angle ?? 160;
      return {
        background: `linear-gradient(${a}deg, ${bg.gradient.from} 0%, ${bg.gradient.to} 100%)`,
      };
    }
    if (mode === "image" && bg?.image) {
      return {
        background: themeGradient(theme, inverted),
        backgroundImage: `url(${bg.image})`,
        backgroundSize: bg.imageFit || "cover",
        backgroundPosition: "center",
      };
    }
    return { background: themeGradient(theme, inverted) };
  }, [mode, bg, theme, inverted]);

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Palette className="h-3.5 w-3.5" />
            Background
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Theme, solid, custom gradient, or your own image.
          </p>
        </div>
      </div>

      <div
        className="h-14 w-full overflow-hidden rounded-md border shadow-inner"
        style={previewStyle}
        title="Background preview"
      />

      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">Mode</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as BackgroundMode)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="theme">Theme gradient</SelectItem>
            <SelectItem value="solid">Solid color</SelectItem>
            <SelectItem value="gradient">Custom gradient</SelectItem>
            <SelectItem value="image">Custom image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "solid" && (
        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={bg?.solid || theme.bg}
              className="h-9 w-12 p-1"
              onChange={(e) => setBg({ mode: "solid", solid: e.target.value })}
            />
            <Input
              value={bg?.solid || theme.bg}
              className="h-8 font-mono text-xs"
              onChange={(e) => setBg({ mode: "solid", solid: e.target.value })}
            />
          </div>
        </div>
      )}

      {mode === "gradient" && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">From</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={bg?.gradient?.from || theme.bg}
                  className="h-8 w-10 p-0.5"
                  onChange={(e) =>
                    setBg({
                      mode: "gradient",
                      gradient: {
                        from: e.target.value,
                        to: bg?.gradient?.to || shade(theme.bg, -12),
                        angle: bg?.gradient?.angle ?? 160,
                      },
                    })
                  }
                />
                <Input
                  value={bg?.gradient?.from || theme.bg}
                  className="h-8 font-mono text-[11px]"
                  onChange={(e) =>
                    setBg({
                      mode: "gradient",
                      gradient: {
                        from: e.target.value,
                        to: bg?.gradient?.to || shade(theme.bg, -12),
                        angle: bg?.gradient?.angle ?? 160,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">To</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={bg?.gradient?.to || shade(theme.bg, -12)}
                  className="h-8 w-10 p-0.5"
                  onChange={(e) =>
                    setBg({
                      mode: "gradient",
                      gradient: {
                        from: bg?.gradient?.from || theme.bg,
                        to: e.target.value,
                        angle: bg?.gradient?.angle ?? 160,
                      },
                    })
                  }
                />
                <Input
                  value={bg?.gradient?.to || shade(theme.bg, -12)}
                  className="h-8 font-mono text-[11px]"
                  onChange={(e) =>
                    setBg({
                      mode: "gradient",
                      gradient: {
                        from: bg?.gradient?.from || theme.bg,
                        to: e.target.value,
                        angle: bg?.gradient?.angle ?? 160,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Angle</Label>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {bg?.gradient?.angle ?? 160}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={bg?.gradient?.angle ?? 160}
              onChange={(e) =>
                setBg({
                  mode: "gradient",
                  gradient: {
                    from: bg?.gradient?.from || theme.bg,
                    to: bg?.gradient?.to || shade(theme.bg, -12),
                    angle: Number(e.target.value),
                  },
                })
              }
              className="w-full"
              aria-label="Gradient angle"
            />
          </div>
        </div>
      )}

      {mode === "image" && (
        <div className="space-y-2.5">
          <ScreenshotPicker
            label="Background image"
            value={bg?.image || ""}
            onChange={(v) =>
              setBg({
                mode: "image",
                image: v,
                imageFit: bg?.imageFit || "cover",
                overlay: typeof bg?.overlay === "number" ? bg.overlay : 0.35,
                hideBlobs: true,
              })
            }
          />
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Fit</Label>
            <Select
              value={bg?.imageFit || "cover"}
              onValueChange={(v) =>
                setBg({
                  mode: "image",
                  imageFit: v as "cover" | "contain",
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover (fill)</SelectItem>
                <SelectItem value="contain">Contain (fit)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Dark overlay</Label>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {Math.round((bg?.overlay ?? 0.35) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              step={1}
              value={Math.round((bg?.overlay ?? 0.35) * 100)}
              onChange={(e) =>
                setBg({
                  mode: "image",
                  overlay: Number(e.target.value) / 100,
                })
              }
              className="w-full"
              aria-label="Overlay opacity"
            />
            <p className="text-[10px] text-muted-foreground">
              Helps headlines stay readable on busy photos.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t pt-2">
        <label className="flex cursor-pointer items-center gap-1.5 text-[11px]">
          <input
            type="checkbox"
            checked={inverted}
            onChange={(e) => onChange({ inverted: e.target.checked || undefined })}
            className="rounded"
          />
          Invert theme colors
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-[11px]">
          <input
            type="checkbox"
            checked={!!bg?.hideBlobs}
            onChange={(e) => setBg({ hideBlobs: e.target.checked })}
            className="rounded"
            disabled={mode === "theme"}
          />
          Hide decorative blobs
        </label>
      </div>

      <div className="space-y-1.5 border-t pt-2">
        <Label className="text-[11px] text-muted-foreground">Quick presets</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              title={p.name}
              className="h-8 rounded border transition hover:ring-2 hover:ring-primary/40"
              style={
                p.bg.mode === "solid"
                  ? { background: p.bg.solid }
                  : p.bg.mode === "gradient" && p.bg.gradient
                    ? {
                        background: `linear-gradient(${p.bg.gradient.angle ?? 160}deg, ${p.bg.gradient.from}, ${p.bg.gradient.to})`,
                      }
                    : undefined
              }
              onClick={() => {
                onChange({ background: { ...p.bg }, inverted: undefined });
              }}
            />
          ))}
        </div>
      </div>

      {onApplyToAll && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full text-xs"
          onClick={() => onApplyToAll(slide.background, slide.inverted)}
        >
          <Layers className="h-3.5 w-3.5" />
          Apply background to all screens
        </Button>
      )}
    </div>
  );
}
