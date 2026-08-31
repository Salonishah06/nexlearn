import type { ReactNode } from "react";
import Link from "next/link";
import { LevelIcon, ClockIcon, FileTextIcon } from "./icons";

/*
  Course summary card — catalog / home grid.
  Vertical: brand tile · serif title · description · top-bordered meta row
  pinned to the card bottom so meta aligns across a stretched grid row.
*/

export interface CourseSummary {
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
  mark: ReactNode;
  href: string;
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <span className="text-neutral-500">{icon}</span>
      {children}
    </span>
  );
}

export function CourseSummaryCard({ course }: { course: CourseSummary }) {
  return (
    <Link
      href={course.href}
      className="flex h-full flex-col rounded-lg border border-neutral-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
    >
      {course.mark}
      <h3 className="mt-5 font-display text-[20px] font-semibold leading-snug text-neutral-900">
        {course.title}
      </h3>
      <p className="mt-2 text-body text-neutral-500">{course.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-100 pt-4">
        <Meta icon={<LevelIcon size={14} />}>{course.level}</Meta>
        <Meta icon={<ClockIcon size={14} />}>{course.duration}</Meta>
        <Meta icon={<FileTextIcon size={14} />}>{course.modules}</Meta>
      </div>
    </Link>
  );
}
