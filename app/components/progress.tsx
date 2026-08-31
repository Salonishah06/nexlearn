/*
  Progress Bar
  Track: neutral-100 · Fill: primary-500 · Rounded full
*/

export function ProgressBar({
  value,
  showLabel = true,
  className = "",
}: {
  value: number;
  showLabel?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-[width] duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel ? (
        <span className="shrink-0 text-body font-medium text-neutral-700">
          {clamped}% complete
        </span>
      ) : null}
    </div>
  );
}
