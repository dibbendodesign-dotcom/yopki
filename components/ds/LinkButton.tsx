import type { ButtonHTMLAttributes, ReactNode } from "react";

type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

/**
 * DS "Link Buttons [1.0]" — 🏵️ Style=Primary, 📏 Size=Medium (20).
 * Label/Small text in primary-base; Hover state adds the underline
 * (DS has Underline=On variants for hover).
 */
export function LinkButton({ leftIcon, rightIcon, className = "", children, ...props }: LinkButtonProps) {
  return (
    <button
      type="button"
      className={`group flex cursor-pointer items-center justify-center gap-1 rounded-4 text-sm font-medium leading-5 tracking-[-0.084px] text-primary-base outline-none focus-visible:ring-2 focus-visible:ring-primary-base/30 ${className}`}
      {...props}
    >
      {leftIcon}
      <span className="underline-offset-2 group-hover:underline">{children}</span>
      {rightIcon}
    </button>
  );
}
