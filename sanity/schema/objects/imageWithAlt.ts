import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with Alt',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string', title: 'Alt text' })
  ]
});
