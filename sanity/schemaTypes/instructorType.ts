import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const instructorType = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of expertise',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'bio',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'photo', expertise: 'expertise'},
    prepare({title, media, expertise}) {
      return {
        title,
        media,
        subtitle: Array.isArray(expertise) ? expertise.join(', ') : undefined,
      }
    },
  },
})
