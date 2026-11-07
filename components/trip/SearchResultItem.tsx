import Image from "next/image";
import type { HTMLAttributes } from "react";

type SearchResultItemProps = HTMLAttributes<HTMLLIElement> & {
  label: string;
  thumbnail: string;
  /** Highlighted row (DS State=Hover) — driven by pointer and keyboard. */
  active?: boolean;
  selected?: boolean;
};

/** "Search Result Item" — destination row in the search dropdown (listbox option). */
export function SearchResultItem({
  label,
  thumbnail,
  active = false,
  selected = false,
  className = "",
  ...props
}: SearchResultItemProps) {
  return (
    <li
      role="option"
      aria-selected={selected}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-10 p-2 transition-colors ${active ? "bg-bg-weak-50" : ""} ${className}`}
      {...props}
    >
      <Image
        src={thumbnail}
        alt=""
        width={28}
        height={28}
        sizes="28px"
        className="size-7 shrink-0 rounded-6 object-cover"
      />
      {/* DS Label / Small */}
      <span className="truncate text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950">
        {label}
      </span>
    </li>
  );
}
