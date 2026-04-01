import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', type: 'string', title: 'Meta title' }),
    defineField({ name: 'metaDescription', type: 'text', title: 'Meta description' }),
    defineField({ name: 'ogImage', type: 'image', title: 'OG image' }),
    defineField({ name: 'noIndex', type: 'boolean', title: 'No index' })
  ]
});
