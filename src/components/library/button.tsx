"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* =========================================================
   SYSTEM VARIANTS (TOKEN-DRIVEN)
========================================================= */

const variants = {
  cta: `
    bg-accent
    text-[oklch(0.12_0.04_260)]
    shadow-[var(--glow-soft)]
    hover:shadow-[var(--glow-accent)]
  `,

  neon: `
  bg-[oklch(0.85_0.14_190)]
  text-[oklch(0.12_0.04_260)]

  /* base */
  shadow-[0_0_0px_rgba(0,255,180,0)]

  /* hover glow */
  hover:shadow-[0_0_12px_rgba(0,255,180,0.6),0_0_24px_rgba(0,255,180,0.4)]
  
  /* interaction */
  hover:brightness-110

  /* press */
  active:scale-[0.98]
`,

  glass: `
    glass
    text-foreground
    hover:bg-white/[0.06]
  `,

  ghost: `
    bg-transparent
    text-white/70
    hover:text-white
    hover:bg-white/5
  `,

  outline: `
    border border-white/10
    bg-transparent
    hover:bg-white/5
  `,
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
  xl: "h-14 px-10 text-lg",
};

const radiusMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
  default: "rounded-[var(--radius)]",
};

/* =========================================================
   TYPES
========================================================= */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  radius?: keyof typeof radiusMap | "default";

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;

  ripple?: boolean;
  magnetic?: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "cta",
      size = "md",
      radius = "default",
      leftIcon,
      rightIcon,
      loading,
      ripple = true,
      magnetic = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    /* ================= RIPPLE ================= */

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const circle = document.createElement("span");

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      Object.assign(circle.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
        borderRadius: "9999px",
        background: "transparent",
        pointerEvents: "none",
      });

      buttonRef.current.appendChild(circle);

      circle.animate(
        [
          { transform: "scale(0)", opacity: 0.5 },
          { transform: "scale(4)", opacity: 0 },
        ],
        { duration: 600, easing: "ease-out" },
      ).onfinish = () => circle.remove();
    };

    /* ================= MAGNETIC ================= */

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      buttonRef.current.style.setProperty("--mx", `${x * 0.15}px`);
      buttonRef.current.style.setProperty("--my", `${y * 0.2}px`);
    };

    const reset = () => {
      if (!buttonRef.current) return;
      buttonRef.current.style.setProperty("--mx", "0px");
      buttonRef.current.style.setProperty("--my", "0px");
    };

    /* ================= CLICK ================= */

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      props.onClick?.(e);
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={cn(
          /* RESET shadcn styling */
          "border-0 bg-none shadow-none",

          /* CORE */
          "relative overflow-hidden",
          "inline-flex items-center justify-center gap-2",
          radiusMap[radius ?? "default"],
          "font-medium",
          "transition-all duration-300 ease-in-out",
          "hover:-translate-y-px active:translate-y-px",
          "cursor-pointer",

          /* magnetic */
          magnetic && "translate-x-[var(--mx,0)] translate-y-[var(--my,0)]",

          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}

        {!loading && leftIcon && <span>{leftIcon}</span>}

        <span className="truncate">{children}</span>

        {!loading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
