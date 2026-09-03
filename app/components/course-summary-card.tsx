import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { COURSES_QUERY_RESULT } from "@/sanity/lib/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { capitalize, formatDuration } from "@/app/lib/format";
import { LevelIcon, ClockIcon, FileTextIcon } from "./icons";

/*
  Course summary card — catalog / home grid.
  Vertical: cover tile · serif title · summary · top-bordered meta row pinned to
  the card bottom so meta aligns across a stretched grid row.
*/

export type CourseSummary = COURSES_QUERY_RESULT[number];

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <span className="text-neutral-500">{icon}</span>
      {children}
    </span>
  );
}

function CoverTile({ course }: { course: CourseSummary }) {
  const initial = course.title?.trim().charAt(0).toUpperCase() ?? "?";
  if (course.coverImage?.asset) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
        <Image
          src={urlFor(course.coverImage)
            .width(128)
            .height(128)
            .fit("crop")
            .auto("format")
            .url()}
          alt={course.coverImage.alt ?? `${course.title} cover`}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-900 font-display text-[22px] font-bold leading-none text-white">
      {initial}
    </div>
  );
}

export function CourseSummaryCard({ course }: { course: CourseSummary }) {
  const duration = formatDuration(course.durationSeconds);
  const moduleCount = course.moduleCount ?? 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex h-full flex-col rounded-lg border border-neutral-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
    >
      <CoverTile course={course} />
      <h3 className="mt-5 font-display text-[20px] font-semibold leading-snug text-neutral-900">
        {course.title}
      </h3>
      {course.summary ? (
        <p className="mt-2 text-body text-neutral-500">{course.summary}</p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-100 pt-4">
        {course.level ? (
          <Meta icon={<LevelIcon size={14} />}>{capitalize(course.level)}</Meta>
        ) : null}
        {duration ? (
          <Meta icon={<ClockIcon size={14} />}>{duration}</Meta>
        ) : null}
        <Meta icon={<FileTextIcon size={14} />}>
          {moduleCount} module{moduleCount === 1 ? "" : "s"}
        </Meta>
      </div>
    </Link>
  );
}
