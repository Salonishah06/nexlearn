import {defineQuery} from 'next-sanity'

/**
 * GROQ queries for the read-only content pages. Each is wrapped in `defineQuery`
 * so Sanity TypeGen can emit a result type (see sanity/lib/sanity.types.ts).
 *
 * Portable Text fields are never text-matched directly — where a plain string is
 * needed (search, previews) a `pt::text(...)` projection is included (AGENTS.md §11).
 */

/* Catalog grid — /courses and the home page. */
export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(popular desc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    "instructor": instructor->{name, "slug": slug.current},
    "category": category->{title, "slug": slug.current},
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
  }
`)

/* Course detail — /courses/[slug]. */
export const COURSE_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[]{icon, title, description},
    "instructor": instructor->{name, "slug": slug.current, photo, expertise, bio},
    "category": category->{title, "slug": slug.current, description},
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds),
    "lessonCount": count(modules[].lessons[]),
    modules[]{
      _key,
      title,
      summary,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        durationSeconds,
        freePreview
      }
    }
  }
`)

/* Lesson page — /courses/[slug]/[lesson]. The parent course is derived by
   reverse reference; "Lesson 5.1"-style labels are computed in the page from
   `course.modules[].lessonIds`. */
export const LESSON_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    poster,
    durationSeconds,
    freePreview,
    studentCount,
    notes,
    "plainNotes": pt::text(notes),
    keyPoints,
    proTip,
    resources[]{type, title, description, url},
    "course": *[_type == "course" && references(^._id)][0]{
      _id,
      title,
      "slug": slug.current,
      "instructor": instructor->{name, "slug": slug.current},
      "modules": modules[]{
        title,
        "lessonIds": lessons[]._ref
      }
    }
  }
`)

/* Instructor page — /instructors/[slug]. */
export const INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(title asc){
      _id,
      title,
      "slug": slug.current,
      coverImage,
      level,
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

/* Instructor index. */
export const INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise
  }
`)

/* Category index. */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

/* generateStaticParams sources. */
export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{"slug": slug.current}
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)]{"slug": slug.current}
`)
