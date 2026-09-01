import {BookIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A course is the top-level content document. Its modules are embedded objects
 * (see `moduleType`). Total duration and lesson/module counts are derived at
 * query time, never stored (AGENTS.md §8).
 */
export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'marketing', title: 'Marketing', default: true},
    {name: 'curriculum', title: 'Curriculum'},
    {name: 'meta', title: 'Meta'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'marketing',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'marketing',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      group: 'marketing',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'marketing',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
    }),
    defineField({
      name: 'level',
      type: 'string',
      group: 'marketing',
      options: {
        list: [
          {title: 'Beginner', value: 'Beginner'},
          {title: 'Intermediate', value: 'Intermediate'},
          {title: 'Advanced', value: 'Advanced'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'price',
      type: 'number',
      group: 'marketing',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'popular',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      group: 'meta',
      description: 'Display-only figure.',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What you'll learn",
      type: 'array',
      group: 'marketing',
      of: [defineArrayMember({type: 'learningOutcome'})],
    }),
    defineField({
      name: 'instructor',
      type: 'reference',
      group: 'marketing',
      to: [{type: 'instructor'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'marketing',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({type: 'module'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      instructor: 'instructor.name',
      level: 'level',
    },
    prepare({title, media, instructor, level}) {
      return {
        title,
        media,
        subtitle: [level, instructor].filter(Boolean).join(' · ') || undefined,
      }
    },
  },
})
