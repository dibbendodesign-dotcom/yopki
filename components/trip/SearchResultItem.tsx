import Image from "next/image";
import type { HTMLAttributes, ReactNode } from "react";

type SearchResultItemProps = HTMLAttributes<HTMLLIElement> & {
  label: string;
  /** Leading media: a destination photo (`thumbnail`) or an icon (e.g. a location pin). */
  thumbnail?: string;
  icon?: ReactNode;
  /** Highlighted row (DS State=Hover) — driven by pointer and keyboard. */
  active?: boolean;
  selected?: boolean;
};

/** "Search Result Item" — destination row in the search dropdown (listbox option). */
export function SearchResultItem({
  label,
  thumbnail,
  icon,
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
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt=""
          width={28}
          height={28}
          sizes="28px"
          className="size-7 shrink-0 rounded-6 object-cover"
        />
      ) : (
        icon && <span className="flex size-7 shrink-0 items-center justify-center">{icon}</span>
      )}
      {/* DS Label / Small */}
      <span className="truncate text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950">
        {label}
      </span>
    </li>
  );
}
