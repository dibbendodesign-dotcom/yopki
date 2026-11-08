import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * DS 📏 Size: Medium (40) | Small (36).
   * Large (46) is the trip flow CTA size — radius-full, 16px side padding, Label/Small text.
   * Icon (32) is an icon-only round button — 6px padding around a 20px icon (Figma 18:12741).
   */
  size?: "large" | "medium" | "small" | "icon";
  /** DS 🧩 Type / 🏵️ Style: Primary·Filled (default) | Neutral·Stroke (secondary action). */
  variant?: "primary" | "neutral-stroke";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const sizes = {
  large: "h-[46px] px-4 py-2.5 rounded-full",
  medium: "h-10 p-2.5 rounded-10",
  small: "h-9 p-2 rounded-10",
  icon: "size-8 p-1.5 rounded-full",
};

const variants = {
  primary:
    "bg-primary-base text-text-white-0 hover:brightness-95 active:brightness-90 disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:hover:brightness-100",
  "neutral-stroke":
    "border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:text-text-strong-950 disabled:text-text-disabled-300 disabled:hover:bg-bg-white-0",
};

/**
 * DS "Buttons [1.0]".
 * Primary·Filled: primary-base fill, white Label/Small text.
 * Neutral·Stroke: bg/white-0 fill, stroke/soft-200 border, text/sub-600 text.
 * Disabled: text/disabled-300 text, bg/weak-50 fill for Filled (DS State=Disabled).
 * Hover / pressed tints are PROVISIONAL — those DS states weren't inspected.
 */
export function Button({
  size = "medium",
  variant = "primary",
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center justify-center gap-1 overflow-clip text-sm leading-5 font-medium tracking-[-0.084px] transition-[filter,background-color,color] outline-none focus-visible:ring-2 focus-visible:ring-primary-base/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {leftIcon}
      {children != null && <span className="px-1">{children}</span>}
      {rightIcon}
    </button>
  );
}
