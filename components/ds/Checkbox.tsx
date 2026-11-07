import Image from "next/image";

type CheckboxProps = {
  checked: boolean;
};

/**
 * DS "Checkbox [1.0]" — visual only (the parent control owns interaction).
 * Off: bg/soft-200 frame + white box; turns bg/sub-300 when its group is hovered.
 * On: DS asset (primary-base fill, white check).
 */
export function Checkbox({ checked }: CheckboxProps) {
  if (checked) {
    return <Image src="/ds/checkbox-checked.svg" alt="" width={20} height={20} className="shrink-0" />;
  }
  return (
    <span aria-hidden className="relative block size-5 shrink-0">
      <span className="absolute top-1/2 left-1/2 size-4 -translate-1/2 rounded-4 bg-bg-soft-200 transition-colors group-hover:bg-bg-sub-300" />
      <span className="absolute top-1/2 left-1/2 size-[13px] -translate-1/2 rounded-[2.6px] bg-bg-white-0 shadow-[0_2px_2px_0_rgba(27,28,29,0.12)]" />
    </span>
  );
}
