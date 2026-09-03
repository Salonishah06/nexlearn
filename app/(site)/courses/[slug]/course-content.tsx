"use client";

import { useState } from "react";
import Link from "next/link";
import type { COURSE_QUERY_RESULT } from "@/sanity/lib/sanity.types";
import { ChevronDownIcon, LockIcon, PlayCircleSolid } from "@/app/components/icons";
import { formatDuration } from "@/app/lib/format";

/*
  Course Content — the numbered, timeline-style module accordion.
  Client-only: it just toggles local open/closed state. All data is passed in as
  already-shaped serializable props from the Server Component page.
*/

type Modules = NonNullable<NonNullable<COURSE_QUERY_RESULT>["modules"]>;

const COLLAPSE_AFTER = 6;

export function CourseContent({
  modules,
  courseSlug,
}: {
  modules: Modules;
  courseSlug: string;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const collapsible = modules.length > COLLAPSE_AFTER;
  const visible = collapsible && !showAll ? modules.slice(0, COLLAPSE_AFTER) : modules;

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div>
      <ol className="border-t border-neutral-200">
        {visible.map((module, i) => {
          const isOpen = open.has(i);
          const lessons = module.lessons ?? [];
          const duration = formatDuration(module.durationSeconds);
          const panelId = `module-panel-${i}`;

          return (
            <li
              key={module._key}
              className="relative border-b border-neutral-200"
            >
              {i < visible.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-4 top-[3.25rem] w-px -translate-x-1/2 bg-neutral-200"
                />
              ) : null}
              <div className="relative flex gap-4 py-5 sm:gap-5">
                {/* Left rail: number */}
                <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-surface text-small font-semibold text-neutral-700">
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="group flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-lg font-semibold text-neutral-900">
                        {module.title}
                      </span>
                      {module.summary ? (
                        <span className="mt-1 block text-body text-neutral-500">
                          {module.summary}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 flex shrink-0 items-center gap-3">
                      {duration ? (
                        <span className="text-small text-neutral-500">{duration}</span>
                      ) : (
                        <span className="text-small text-neutral-500">
                          {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                        </span>
                      )}
                      <ChevronDownIcon
                        size={18}
                        className={`text-neutral-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen ? (
                    <ul id={panelId} className="mt-3 space-y-1">
                      {lessons.map((lesson, l) => {
                        const lessonDuration = formatDuration(
                          lesson.durationSeconds,
                          "clock",
                        );
                        return (
                          <li key={lesson._id}>
                            <Link
                              href={`/courses/${courseSlug}/${lesson.slug}`}
                              className="flex items-center gap-3 rounded-sm px-2 py-2 text-body text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span className="shrink-0 text-neutral-500">
                                {lesson.freePreview ? (
                                  <PlayCircleSolid size={16} />
                                ) : (
                                  <LockIcon size={16} />
                                )}
                              </span>
                              <span className="shrink-0 tabular-nums text-small text-neutral-500">
                                {i + 1}.{l + 1}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                {lesson.title}
                              </span>
                              {lesson.freePreview ? (
                                <span className="shrink-0 text-small font-medium text-primary-500">
                                  Free
                                </span>
                              ) : null}
                              {lessonDuration ? (
                                <span className="shrink-0 tabular-nums text-small text-neutral-500">
                                  {lessonDuration}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {collapsible ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-surface px-4 py-2 text-body font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {showAll ? "Show fewer" : `Show all ${modules.length} modules`}
            <ChevronDownIcon
              size={16}
              className={`transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
