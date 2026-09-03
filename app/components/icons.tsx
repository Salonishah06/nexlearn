import type { SVGProps } from "react";

/*
  nexLearn icon set
  Specs: 24x24 grid · 2px stroke (outline) · rounded line caps · consistent optical balance
*/

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------- Outline icons ---------- */

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

export const PlayCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8 6 4-6 4V8z" />
  </Svg>
);

export const FileTextIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);

export const BookmarkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </Svg>
);

export const BarChartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V10M12 20V4M20 20v-6" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5l2.6 5.35 5.9.86-4.27 4.16 1.01 5.88L12 17.9l-5.25 2.71 1-5.88L3.5 9.57l5.9-.86L12 3.5z" />
  </Svg>
);

export const LevelIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 20v-4M12 20v-9M19 20v-15" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const LoaderIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Svg>
);

export const ExternalLinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </Svg>
);

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </Svg>
);

export const TargetIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
);

export const AccessibilityIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="1.5" />
    <path d="M5 8h14M12 8v6m0 0-3.5 6M12 14l3.5 6" />
  </Svg>
);

/* ---------- Learning-outcome icons (keyed by `learningOutcome.icon`) ---------- */

export const LayersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </Svg>
);

export const WorkflowIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
  </Svg>
);

export const GaugeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 14 16 9" />
    <path d="M4 18a8 8 0 1 1 16 0" />
  </Svg>
);

export const RocketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c3 1.5 5 4.5 5 9 0 2-.5 3.5-1 4.5H8c-.5-1-1-2.5-1-4.5 0-4.5 2-7.5 5-9z" />
    <path d="M8 16c-2 1-3 3-3 5 2 0 4-1 5-3M16 16c2 1 3 3 3 5-2 0-4-1-5-3" />
    <circle cx="12" cy="10" r="1.5" />
  </Svg>
);

export const PuzzleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 4a2 2 0 1 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 1 1 0 4h-1v3a1 1 0 0 1-1 1h-3v1a2 2 0 1 1-4 0v-1H6a1 1 0 0 1-1-1v-3H4a2 2 0 1 1 0-4h1V6a1 1 0 0 1 1-1h4V4z" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const SparklesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4z" />
    <path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z" />
  </Svg>
);

export const CodeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />
  </Svg>
);

/* ---------- Filled variants (subset used in the specimen) ---------- */

function SolidSvg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const BellSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path d="M12 2a6 6 0 0 0-6 6c0 6-3 8-3 8h18s-3-2-3-8a6 6 0 0 0-6-6zm-2 18a2 2 0 0 0 4 0h-4z" />
  </SolidSvg>
);

export const SearchSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path
      fillRule="evenodd"
      d="M10 3a7 7 0 1 0 4.2 12.6l4.1 4.1a1 1 0 0 0 1.4-1.4l-4.1-4.1A7 7 0 0 0 10 3zm-5 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"
      clipRule="evenodd"
    />
  </SolidSvg>
);

export const PlayCircleSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path
      fillRule="evenodd"
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-2 5 6 4-6 4V8z"
      clipRule="evenodd"
    />
  </SolidSvg>
);

export const FileTextSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path d="M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-6zm-3 15H9v-2h1v2zm5 0h-3v-2h3v2zm0-4H9v-2h6v2zm-2-4V4l4 5h-4z" />
  </SolidSvg>
);

export const BookmarkSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z" />
  </SolidSvg>
);

export const BarChartSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path d="M3 10h4v11H3zM10 3h4v18h-4zM17 14h4v7h-4z" />
  </SolidSvg>
);

export const ClockSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path
      fillRule="evenodd"
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm1 4a1 1 0 1 0-2 0v5a1 1 0 0 0 .4.8l3 2.2a1 1 0 0 0 1.2-1.6L13 11.5V7z"
      clipRule="evenodd"
    />
  </SolidSvg>
);

export const UserSolid = (p: IconProps) => (
  <SolidSvg {...p}>
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0 1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
  </SolidSvg>
);
