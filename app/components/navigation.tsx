import { Fragment } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
} from "./icons";
import { VertexMark } from "./logo";

/*
  Navigation — top bar · breadcrumbs · pagination
*/

export function NavBar() {
  const links = [
    { label: "Courses", active: true },
    { label: "My Learning", active: false },
  ];
  return (
    <nav className="flex items-center gap-8 rounded-lg border border-neutral-200 bg-surface px-5 py-3 shadow-sm">
      <span className="flex items-center gap-2 font-display text-heading-3 font-bold text-neutral-900">
        <VertexMark size={22} />
        Vertex
      </span>
      <ul className="flex items-center gap-6">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href="#"
              aria-current={l.active ? "page" : undefined}
              className={
                l.active
                  ? "text-body-lg font-medium text-primary-500"
                  : "text-body-lg font-medium text-neutral-500 hover:text-neutral-900"
              }
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-body">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item}>
              <li>
                <a
                  href="#"
                  aria-current={last ? "page" : undefined}
                  className={
                    last
                      ? "font-medium text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  }
                >
                  {item}
                </a>
              </li>
              {!last ? (
                <li aria-hidden className="text-neutral-300">
                  <ChevronRightIcon size={14} />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function Pagination({
  pages = [1, 2, 3],
  total = 8,
  current = 1,
}: {
  pages?: number[];
  total?: number;
  current?: number;
}) {
  const cell =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-body font-medium transition-colors";
  return (
    <nav aria-label="Pagination">
      <ul className="flex items-center gap-1">
        <li>
          <button
            className={`${cell} text-neutral-500 hover:bg-neutral-100`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon size={16} />
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              aria-current={p === current ? "page" : undefined}
              className={
                p === current
                  ? `${cell} border border-primary-500 text-primary-500`
                  : `${cell} text-neutral-700 hover:bg-neutral-100`
              }
            >
              {p}
            </button>
          </li>
        ))}
        <li aria-hidden className={`${cell} text-neutral-400`}>
          …
        </li>
        <li>
          <button className={`${cell} text-neutral-700 hover:bg-neutral-100`}>
            {total}
          </button>
        </li>
        <li>
          <button
            className={`${cell} text-neutral-500 hover:bg-neutral-100`}
            aria-label="Next page"
          >
            <ChevronRightIcon size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
