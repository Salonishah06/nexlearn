import {BlockElementIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A module is an embedded object inside a course, not its own document
 * (AGENTS.md §8). "Module 5" / "Lesson 5.1" are derived from order, not stored.
 */
export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'lesson'}],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', lessons: 'lessons'},
    prepare({title, lessons}) {
      const count = Array.isArray(lessons) ? lessons.length : 0
      return {
        title: title || 'Untitled module',
        subtitle: `${count} lesson${count === 1 ? '' : 's'}`,
      }
    },
  },
})
