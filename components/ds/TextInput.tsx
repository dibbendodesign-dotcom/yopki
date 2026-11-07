import { forwardRef, useId, type InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/**
 * DS "Text Input [1.0]" — Label [1.0] (Label/Small) above a field with
 * bg/white-0, stroke/soft-200 border, radius-10, x-small shadow,
 * Paragraph/Small text. Focus styling is PROVISIONAL (focus variant not inspected).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, className = "", id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className="w-full rounded-10 border border-stroke-soft-200 bg-bg-white-0 py-2.5 pr-2.5 pl-3 text-sm leading-5 tracking-[-0.084px] text-text-strong-950 shadow-x-small outline-none transition-[border-color,box-shadow] placeholder:text-text-sub-600/60 hover:bg-bg-weak-50 focus:border-primary-base focus:bg-bg-white-0 focus:ring-2 focus:ring-primary-base/15"
        {...props}
      />
    </div>
  );
});
