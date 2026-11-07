import { forwardRef, type InputHTMLAttributes } from "react";
import { CompactButton } from "@/components/ds/CompactButton";
import { Icon } from "@/components/ds/Icon";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  value: string;
  onClear: () => void;
  wrapperClassName?: string;
};

/**
 * "Search Input" — trip-filter search field built from Yopki tokens
 * (candidate for the Yopki library). Search icon, Paragraph/Small text,
 * and a Compact Button that clears the value once there is one.
 * Placeholder colour and focus ring are PROVISIONAL.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onClear, wrapperClassName = "", className = "", placeholder = "Search destinations", ...props },
  ref,
) {
  return (
    <div
      className={`flex w-full items-center gap-2 rounded-10 border border-stroke-soft-200 bg-bg-white-0 py-2.5 pr-2.5 pl-3 shadow-x-small transition-[border-color,box-shadow] focus-within:border-primary-base focus-within:ring-2 focus-within:ring-primary-base/15 ${wrapperClassName}`}
    >
      <Icon src="/trip/search-line.svg" className="text-text-strong-950" />
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className={`min-w-0 flex-1 bg-transparent text-sm leading-5 tracking-[-0.084px] text-text-strong-950 outline-none placeholder:text-text-sub-600 ${className}`}
        {...props}
      />
      {value && (
        <CompactButton
          size="medium"
          label="Clear search"
          onClick={onClear}
          icon={<Icon src="/trip/close-line-18.svg" size={18} />}
        />
      )}
    </div>
  );
});
