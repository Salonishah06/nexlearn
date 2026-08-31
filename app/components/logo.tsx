/*
  Vertex mark — an angular "V" formed by two chevrons.
*/

export function VertexMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h9l7 16 7-16h9L24 34h-8L4 6z"
        fill="var(--color-primary-500)"
      />
      <path d="M14 6h6l-3 7-3-7z" fill="var(--color-primary-300)" />
    </svg>
  );
}
