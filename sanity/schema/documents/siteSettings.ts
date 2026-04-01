import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'defaultOGImage', type: 'image' }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [{ type: 'object', fields: [defineField({ name: 'platform', type: 'string' }), defineField({ name: 'url', type: 'url' })] }]
    }),
    defineField({ name: 'footerText', type: 'text' })
  ]
});
