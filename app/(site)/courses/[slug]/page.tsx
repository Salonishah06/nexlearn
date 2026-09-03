import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  sanityFetch,
  urlFor,
  COURSE_QUERY,
  COURSE_SLUGS_QUERY,
} from "@/sanity/lib/index";
import type { COURSE_QUERY_RESULT } from "@/sanity/lib/sanity.types";
import { Badge } from "@/app/components/badge";
import { Button, ButtonLink } from "@/app/components/button";
import { LearningOutcomeIcon } from "@/app/components/learning-outcome-icon";
import {
  ArrowRightIcon,
  BookmarkIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  LevelIcon,
  UserIcon,
} from "@/app/components/icons";
import { capitalize, formatCount, formatDuration } from "@/app/lib/format";
import { CourseContent } from "./course-content";

type Course = NonNullable<COURSE_QUERY_RESULT>;

async function getCourse(slug: string): Promise<Course | null> {
  return sanityFetch({
    query: COURSE_QUERY,
    params: { slug },
    tags: ["course", `course:${slug}`],
  });
}

export async function generateStaticParams() {
  const slugs = await sanityFetch({ query: COURSE_SLUGS_QUERY });
  return slugs
    .map((s) => s.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.title} — nexLearn`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({
  params,
}: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const modules = course.modules ?? [];
  const moduleCount = course.moduleCount ?? modules.length;
  const totalDuration = formatDuration(course.durationSeconds);
  const students = formatCount(course.studentCount);
  const outcomes = course.learningOutcomes ?? [];
  const firstLessonSlug = modules[0]?.lessons?.[0]?.slug ?? null;

  const contentMeta = [
    `${moduleCount} module${moduleCount === 1 ? "" : "s"}`,
    course.lessonCount
      ? `${course.lessonCount} lesson${course.lessonCount === 1 ? "" : "s"}`
      : null,
    totalDuration || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-6 sm:py-12 lg:px-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-body">
          <li>
            <Link
              href="/courses"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              All Courses
            </Link>
          </li>
          <li aria-hidden="true" className="text-neutral-300">
            <ChevronRightIcon size={14} />
          </li>
          <li aria-current="page" className="font-medium text-neutral-900">
            {course.title}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
        <CourseCover course={course} />

        <div className="flex flex-col">
          {course.popular ? (
            <div className="mb-4">
              <Badge variant="popular">Popular</Badge>
            </div>
          ) : null}

          <h1 className="font-display text-[32px] font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-[44px] sm:leading-[1.1]">
            {course.title}
          </h1>

          {course.summary ? (
            <p className="mt-4 max-w-[46ch] text-body-lg text-neutral-500">
              {course.summary}
            </p>
          ) : null}

          {course.instructor?.name ? (
            <p className="mt-4 text-body text-neutral-500">
              Taught by{" "}
              {course.instructor.slug ? (
                <Link
                  href={`/instructors/${course.instructor.slug}`}
                  className="font-medium text-neutral-900 transition-colors hover:text-primary-500"
                >
                  {course.instructor.name}
                </Link>
              ) : (
                <span className="font-medium text-neutral-900">
                  {course.instructor.name}
                </span>
              )}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {course.level ? (
              <Meta icon={<LevelIcon size={16} />}>{capitalize(course.level)}</Meta>
            ) : null}
            {totalDuration ? (
              <Meta icon={<ClockIcon size={16} />}>{totalDuration}</Meta>
            ) : null}
            <Meta icon={<FileTextIcon size={16} />}>
              {moduleCount} module{moduleCount === 1 ? "" : "s"}
            </Meta>
            {students ? (
              <Meta icon={<UserIcon size={16} />}>{students} students</Meta>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {firstLessonSlug ? (
              <ButtonLink
                href={`/courses/${course.slug}/${firstLessonSlug}`}
                variant="primary"
                iconRight={<ArrowRightIcon size={18} />}
              >
                Start Learning
              </ButtonLink>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              aria-label="Bookmark this course"
              iconLeft={<BookmarkIcon size={18} />}
            >
              Bookmark
            </Button>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      {outcomes.length > 0 ? (
        <section className="mt-12 rounded-lg border border-neutral-200 bg-surface p-6 shadow-sm sm:mt-16 sm:p-8">
          <h2 className="font-display text-[24px] font-bold text-neutral-900 sm:text-[28px]">
            What you&apos;ll learn
          </h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {outcomes.map((outcome, i) => (
              <div key={i} className="flex gap-4">
                <span className="mt-0.5 shrink-0 text-primary-500">
                  <LearningOutcomeIcon name={outcome.icon} size={28} />
                </span>
                <div className="min-w-0">
                  <p className="text-body-lg font-semibold text-neutral-900">
                    {outcome.title}
                  </p>
                  {outcome.description ? (
                    <p className="mt-1 text-body text-neutral-500">
                      {outcome.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Course content */}
      {modules.length > 0 ? (
        <section className="mt-12 sm:mt-16">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[24px] font-bold text-neutral-900 sm:text-[28px]">
              Course Content
            </h2>
            {contentMeta ? (
              <p className="text-small text-neutral-500">{contentMeta}</p>
            ) : null}
          </div>
          <div className="mt-6">
            <CourseContent modules={modules} courseSlug={course.slug ?? slug} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-500">
      <span className="text-neutral-500">{icon}</span>
      {children}
    </span>
  );
}

function CourseCover({ course }: { course: Course }) {
  const initial = course.title?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl bg-neutral-900">
      {course.coverImage?.asset ? (
        <Image
          src={urlFor(course.coverImage)
            .width(760)
            .height(760)
            .fit("crop")
            .auto("format")
            .url()}
          alt={course.coverImage.alt ?? `${course.title} cover`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 420px, 100vw"
          className="object-cover"
          priority
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-display text-[96px] font-bold text-white">
          {initial}
        </span>
      )}
    </div>
  );
}
