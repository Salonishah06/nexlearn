import Link from "next/link";
import { Button } from "../components/button";
import { SearchInput } from "../components/input";
import { CourseSummaryCard } from "../components/course-summary-card";
import { ArrowRightIcon, StarIcon } from "../components/icons";
import { sanityFetch, COURSES_QUERY } from "@/sanity/lib/index";

const equalizer = [
  [38, 62, 48, 84, 58, 34, 72, 46],
  [52, 30, 66, 44, 88, 56, 40, 70],
];

export default async function Home() {
  const courses = await sanityFetch({
    query: COURSES_QUERY,
    tags: ["course"],
  });

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 pb-12 pt-12 text-center sm:px-6 sm:pb-14 sm:pt-20">
          <span className="rounded-full border border-neutral-200 bg-surface px-4 py-1.5 text-small font-semibold uppercase tracking-[0.16em] text-primary-500 shadow-sm">
            Intelligent Learning
          </span>
          <h1 className="mt-7 font-display text-[32px] font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-[52px] sm:leading-[1.1] lg:text-[60px]">
            Search your learning in plain English.
          </h1>
          <p className="mt-5 max-w-[520px] text-body sm:text-body-lg text-neutral-500">
            nexLearn understands what you want to learn and finds the exact lessons
            across all your courses.
          </p>
          <Button
            variant="primary"
            className="mt-8 h-12 px-6 sm:mt-9"
            iconRight={<ArrowRightIcon size={18} />}
          >
            Explore Courses
          </Button>
          <div role="search" className="mt-8 w-full max-w-[760px]">
            <SearchInput
              aria-label="Search your learning"
              placeholder="Ask anything about your learning…"
              shortcut="⌘ K"
              className="h-14 rounded-lg pl-12 pr-16 text-body sm:h-16 sm:pl-14 sm:pr-20 sm:text-body-lg"
            />
          </div>
        </div>
      </section>

      {/* All Courses */}
      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h2 className="font-display text-[24px] font-bold text-neutral-900 sm:text-[28px]">
            All Courses
          </h2>
          <Link
            href="/courses"
            className="inline-flex shrink-0 items-center gap-1.5 text-body font-medium text-primary-500 transition-colors hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-body-lg"
          >
            View all courses
            <ArrowRightIcon size={16} />
          </Link>
        </div>
        {courses.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseSummaryCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-body text-neutral-500">
            No courses published yet.
          </p>
        )}
      </section>

      {/* Cadence note + decorative equalizer */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 px-5 pb-8 text-center sm:gap-4 sm:px-6 sm:pb-10">
          <span className="hidden h-px w-12 bg-neutral-200 sm:block" />
          <span className="inline-flex items-center gap-2 text-body text-neutral-700">
            <StarIcon size={18} className="shrink-0 text-primary-500" />
            New courses and lessons added every week.
          </span>
          <span className="hidden h-px w-12 bg-neutral-200 sm:block" />
        </div>
        <div
          aria-hidden="true"
          className="flex h-28 w-full items-end justify-center gap-6 sm:h-40 sm:gap-24"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 25%, transparent)",
            maskImage: "linear-gradient(to top, black 25%, transparent)",
          }}
        >
          {equalizer.map((group, g) => (
            <div key={g} className="flex h-full items-end gap-1.5 sm:gap-4">
              {group.map((height, i) => (
                <div
                  key={i}
                  className="w-4 rounded-t-sm bg-gradient-to-t from-primary-400 to-primary-200/10 sm:w-10"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
