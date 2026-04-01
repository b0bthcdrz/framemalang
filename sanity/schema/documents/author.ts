import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'photo', type: 'imageWithAlt' }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({
      name: 'social',
      type: 'array',
      of: [{ type: 'object', fields: [defineField({ name: 'platform', type: 'string' }), defineField({ name: 'url', type: 'url' })] }]
    })
  ]
});
