/*
  Brand marks for course tiles.
  Rendered inside a 56x56 rounded tile on the course summary card.
*/

function Tile({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function NextMark() {
  return (
    <Tile className="bg-neutral-900 text-white">
      <span className="text-[22px] font-bold leading-none">N</span>
    </Tile>
  );
}

export function TypeScriptMark() {
  return (
    <Tile className="bg-[#3178C6] text-white">
      <span className="text-[17px] font-bold leading-none tracking-tight">TS</span>
    </Tile>
  );
}

export function DockerMark() {
  return (
    <Tile className="bg-[#E5F2FB]">
      <svg width={34} height={34} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g fill="#2396ED">
          <rect x="3" y="10" width="2.6" height="2.4" rx="0.3" />
          <rect x="6.1" y="10" width="2.6" height="2.4" rx="0.3" />
          <rect x="9.2" y="10" width="2.6" height="2.4" rx="0.3" />
          <rect x="12.3" y="10" width="2.6" height="2.4" rx="0.3" />
          <rect x="6.1" y="7" width="2.6" height="2.4" rx="0.3" />
          <rect x="9.2" y="7" width="2.6" height="2.4" rx="0.3" />
          <rect x="9.2" y="4" width="2.6" height="2.4" rx="0.3" />
          <path d="M22.5 10.4c-.5-.35-1.7-.48-2.6-.3-.12-.85-.6-1.6-1.45-2.27l-.5-.33-.33.5c-.42.64-.56 1.7-.12 2.4.19.32.5.6.86.78-.66.4-1.96.35-6.7.35H1.2l-.05.4c-.17 1.63.24 3.34 1.24 4.6C3.5 18.05 5.4 18.7 8 18.7c5.6 0 9.75-2.58 11.7-7.3.76.02 2.42.01 3.27-1.6.05-.09.18-.35.23-.45l-.13-.09-.24-.16z" />
        </g>
      </svg>
    </Tile>
  );
}
