import type { ButtonHTMLAttributes, ReactNode } from "react";

type CompactButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Accessible name — compact buttons are icon-only. */
  label: string;
  icon: ReactNode;
  /** DS 📏 Size: Large (20px icon, 2px padding) | Medium (18px icon, 1px padding) */
  size?: "large" | "medium";
};

const sizes = {
  large: "p-0.5",
  medium: "p-px",
};

/**
 * DS "Compact Button [1.0]" — icon-only ghost button, radius-6.
 * Hover / focus tint is PROVISIONAL (hover variant not inspected).
 */
export function CompactButton({ label, icon, size = "large", className = "", ...props }: CompactButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-6 text-text-strong-950 transition-colors outline-none hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-primary-base/30 ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
