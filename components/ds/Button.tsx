import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * DS 📏 Size: Medium (40) | Small (36).
   * Large (46) is the trip flow v2 CTA — pill radius, 16px SemiBold label.
   */
  size?: "large" | "medium" | "small";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const sizes = {
  large: "h-[46px] p-2.5 rounded-full text-base font-semibold",
  medium: "h-10 p-2.5 rounded-10 text-sm font-medium leading-5 tracking-[-0.084px]",
  small: "h-9 p-2 rounded-10 text-sm font-medium leading-5 tracking-[-0.084px]",
};

/**
 * DS "Buttons [1.0]" — 🧩 Type=Primary, 🏵️ Style=Filled.
 * Default: primary-base fill, white Label/Small text, radius-10.
 * Disabled: bg/weak-50 fill, text/disabled-300 text (DS State=Disabled).
 * Hover / pressed tint is PROVISIONAL — the DS primary-dark value isn't published.
 */
export function Button({
  size = "medium",
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center justify-center gap-1 overflow-clip bg-primary-base text-text-white-0 transition-[filter,background-color,color] outline-none hover:brightness-95 active:brightness-90 focus-visible:ring-2 focus-visible:ring-primary-base/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:hover:brightness-100 ${sizes[size]} ${className}`}
      {...props}
    >
      {leftIcon}
      <span className="px-1">{children}</span>
      {rightIcon}
    </button>
  );
}
