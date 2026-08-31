import type { ReactNode } from "react";
import { Badge } from "./badge";
import {
  BarChartIcon,
  ClockIcon,
  BookmarkIcon,
  PlayCircleSolid,
  ArrowUpRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "./icons";

/*
  Cards
  Surface: white · Radius: 16px (lg) · Border: 1px neutral-200 · Shadow: sm → md on hover
*/

function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <span className="text-neutral-500">{icon}</span>
      {children}
    </span>
  );
}

export function CourseCard() {
  return (
    <CardShell>
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-body-lg font-semibold text-white font-display">
          N
        </div>
        <div className="min-w-0">
          <h4 className="text-heading-3 font-semibold text-neutral-900">
            Next.js for Production
          </h4>
          <p className="mt-1 text-body text-neutral-500">
            Build scalable, high-performance web applications with Next.js.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-3">
        <Meta icon={<BarChartIcon size={14} />}>Intermediate</Meta>
        <Meta icon={<ClockIcon size={14} />}>18h 24m</Meta>
        <Meta icon={<BookmarkIcon size={14} />}>12 modules</Meta>
      </div>
    </CardShell>
  );
}

export function LessonVideoCard() {
  return (
    <CardShell>
      <Badge variant="video">Video</Badge>
      <h4 className="mt-3 text-heading-3 font-semibold text-neutral-900">
        Data Fetching in Server Components
      </h4>
      <p className="mt-1 text-body text-neutral-500">
        Learn how to fetch data on the server using async/await and Next.js best
        practices.
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-small text-neutral-500">Lesson 5.1 · 12:45</span>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-small font-medium text-primary-500 hover:text-primary-400"
        >
          <PlayCircleSolid size={14} />
          Watch from 12:45
        </a>
      </div>
    </CardShell>
  );
}

export function LessonCard() {
  return (
    <CardShell>
      <Badge variant="lesson">Lesson</Badge>
      <h4 className="mt-3 text-heading-3 font-semibold text-neutral-900">
        Data Fetching &amp; Caching
      </h4>
      <p className="mt-1 text-body text-neutral-500">
        Explore different data fetching methods in Next.js and how to cache and
        revalidate data for optimal performance.
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-small text-neutral-500">Module 5</span>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-small font-medium text-primary-500 hover:text-primary-400"
        >
          View lesson
          <ArrowUpRightIcon size={14} />
        </a>
      </div>
    </CardShell>
  );
}

export function ResourceCard() {
  return (
    <CardShell>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-700">
          <FileTextIcon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-heading-3 font-semibold text-neutral-900">
            Caching and Revalidation Guide
          </h4>
          <p className="mt-1 text-body text-neutral-500">
            Deep dive into Next.js caching strategies.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-small text-neutral-500">PDF · 1.2 MB</span>
            <a
              href="#"
              aria-label="Open resource"
              className="text-neutral-500 hover:text-primary-500"
            >
              <ExternalLinkIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
