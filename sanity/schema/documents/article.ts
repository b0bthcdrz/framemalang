import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'status', type: 'string', options: { list: ['draft', 'published', 'archived'] }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
    defineField({ name: 'hashtags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'mainImage', type: 'imageWithAlt' }),
    defineField({ name: 'excerpt', type: 'text', validation: (Rule) => Rule.required().max(180) }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'seo', type: 'seo' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false })
  ]
});
