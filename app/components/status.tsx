import {
  LoaderIcon,
  CheckCircleIcon,
  PlayCircleSolid,
  LockIcon,
} from "./icons";

/*
  Status / Indicators
  In Progress · Completed · Now Playing · Locked
*/

type Status = "in-progress" | "completed" | "now-playing" | "locked";

const config: Record<
  Status,
  { label: string; className: string; icon: React.ReactNode }
> = {
  "in-progress": {
    label: "In Progress",
    className: "text-neutral-500",
    icon: <LoaderIcon size={18} />,
  },
  completed: {
    label: "Completed",
    className: "text-success",
    icon: <CheckCircleIcon size={18} />,
  },
  "now-playing": {
    label: "Now Playing",
    className: "text-primary-500",
    icon: <PlayCircleSolid size={18} />,
  },
  locked: {
    label: "Locked",
    className: "text-neutral-500",
    icon: <LockIcon size={18} />,
  },
};

export function StatusIndicator({ status }: { status: Status }) {
  const { label, className, icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-2 text-body font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
