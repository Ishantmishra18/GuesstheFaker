// BtnEnhanced.tsx
// ----------------------------------------------------------------------------------
// A11y‑friendly, variant‑driven React (Next.js‑ready) button built with Tailwind CSS.
// ----------------------------------------------------------------------------------
// • Two built‑in variants (neon & cyber) + ghost fallback
// • Size variants (sm | md | lg)
// • Ref‑forwarding, ARIA disabled semantics, loading spinner
// • Optional animated glow edge for neon variant
// • Uses class‑variance‑authority for tidy variant handling
// • Leverages lucide‑react icons, but accepts any ReactNode icon prop
//
// ⬇️ Drop `cn` helper in @/lib/utils (clsx + tailwind‑merge) if you don’t have one.
// ----------------------------------------------------------------------------------

"use client";

import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
   Variants
   ────────────────────────────────────────────────────────────────────────── */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-lg overflow-hidden font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        neon:
          "px-6 py-3 text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-[0_0_12px_rgba(237,0,255,0.4)] hover:shadow-[0_0_20px_rgba(237,0,255,0.7)]",
        cyber:
          "px-6 py-2 font-mono border-2 border-pink-400 bg-neutral-900 text-pink-400 hover:border-pink-200 hover:text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.8)]",
        ghost: "px-4 py-2 border bg-transparent hover:bg-muted",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "neon",
      size: "md",
    },
  }
);

/* ──────────────────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────────────────── */
export interface BtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  loading?: boolean;
  glow?: boolean; // adds animated edge glow on neon variant
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */
export const Btn = React.forwardRef<HTMLButtonElement, BtnProps>(
  (
    {
      className,
      children,
      icon,
      loading = false,
      variant,
      size,
      glow = true,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-disabled={props.disabled || loading}
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {/* Animated glow background (neon) */}
        {glow && variant === "neon" && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-75 blur-md transition-opacity group-hover:opacity-100"
          />
        )}

        {/* MAIN CONTENT */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
          {children}
          {!loading && variant === "neon" && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </button>
    );
  }
);
Btn.displayName = "Btn";
