/** DS "Content Divider [1.0]" — Type=Line Spacing (1px stroke/soft-200, 1.5px block padding). */
export function ContentDivider({ className = "" }: { className?: string }) {
  return (
    <div role="separator" className={`flex w-full items-center py-[1.5px] ${className}`}>
      <div className="h-px flex-1 bg-stroke-soft-200" />
    </div>
  );
}
