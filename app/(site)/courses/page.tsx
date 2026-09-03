import type { Metadata } from "next";
import { sanityFetch, COURSES_QUERY } from "@/sanity/lib/index";
import { CourseSummaryCard } from "@/app/components/course-summary-card";

export const metadata: Metadata = {
  title: "All Courses — nexLearn",
  description: "Browse every course on nexLearn.",
};

export default async function CoursesPage() {
  const courses = await sanityFetch({ query: COURSES_QUERY, tags: ["course"] });

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-6 sm:py-14 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 sm:text-[36px]">
          All Courses
        </h1>
        <p className="text-body text-neutral-500">
          {courses.length} course{courses.length === 1 ? "" : "s"}
        </p>
      </header>

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
    </main>
  );
}
