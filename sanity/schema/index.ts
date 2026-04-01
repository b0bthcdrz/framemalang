import { article } from './documents/article';
import { author } from './documents/author';
import { category } from './documents/category';
import { siteSettings } from './documents/siteSettings';
import { imageWithAlt } from './objects/imageWithAlt';
import { seo } from './objects/seo';

export const schemaTypes = [article, author, category, siteSettings, imageWithAlt, seo];
