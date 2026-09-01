import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A lesson is a document. It does NOT store its parent course — derive that with
 * a reverse reference when needed (AGENTS.md §7/§8).
 */
export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'video', title: 'Video'},
    {name: 'meta', title: 'Meta'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'video',
      description: 'YouTube, Vimeo, or Bunny URL. Played on-site via an embed.',
      validation: (rule) =>
        rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / thumbnail',
      type: 'image',
      group: 'video',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      group: 'meta',
      description: 'Length of the lesson video in seconds. Formatted as mm:ss in the UI.',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      group: 'meta',
      description: 'Display label only — not access control.',
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
      name: 'notes',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      type: 'array',
      group: 'content',
      description: 'Powers the "In this lesson you will" section.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'resources',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'resource'})],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'poster', duration: 'durationSeconds'},
    prepare({title, media, duration}) {
      const mm = typeof duration === 'number' ? Math.floor(duration / 60) : null
      const ss =
        typeof duration === 'number'
          ? String(duration % 60).padStart(2, '0')
          : null
      return {
        title,
        media,
        subtitle: mm !== null ? `${mm}:${ss}` : undefined,
      }
    },
  },
})
