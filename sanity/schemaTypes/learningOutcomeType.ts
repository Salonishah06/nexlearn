import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * One item in a course's "What you'll learn" section.
 * Object type — always embedded in `course.learningOutcomes`.
 */
export const learningOutcomeType = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      description:
        'Icon key the site maps to an icon component (e.g. "target", "code", "rocket").',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
