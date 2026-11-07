type ProgressBarLabelProps = {
  title: string;
  /** 0–100 */
  value: number;
  showPercentage?: boolean;
};

/**
 * DS "Progress Bar Label [1.0]" — 🧩 Type=🔼 On Top, ⬇️ Show Bottom=Off,
 * composed with "Progress Bar [1.0]" + "Progress Bar Line [1.0]" (🎨 Orange).
 */
export function ProgressBarLabel({ title, value, showPercentage = true }: ProgressBarLabelProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full items-start gap-1.5">
        <p className="min-w-0 flex-1 text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950">
          {title}
        </p>
        {showPercentage && (
          <p className="shrink-0 text-xs leading-4 text-text-sub-600">{pct}%</p>
        )}
      </div>
      <div
        role="progressbar"
        aria-label={title}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-1.5 w-full overflow-clip rounded-full bg-bg-soft-200"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-state-warning-base transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
