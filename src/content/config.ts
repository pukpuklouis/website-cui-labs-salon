import { defineCollection, z } from 'astro:content';

// Define the schema for the blog collection
const blogCollection = defineCollection({
  type: 'content', // 'content' for Markdown/MDX files
  schema: z.object({
    title: z.string(),
    pubDate: z.date(), // Publication date
    description: z.string().optional(), // Short summary for previews
    author: z.string().optional().default('Admin'), // Default author if not specified
    image: z.object({
      url: z.string().optional(), // URL for the main image
      alt: z.string().optional() // Alt text for the image
    }).optional(),
    tags: z.array(z.string()).optional(), // Array of tags
    categories: z.array(z.string()).optional(), // Array of categories
    featured: z.boolean().default(false), // Optional flag for featured posts
    // Add other fields as needed, e.g., draft status
    // draft: z.boolean().optional().default(false), 
  }),
});

// Export a `collections` object to register the collection(s)
export const collections = {
  'blog': blogCollection,
  // Add other collections here if needed in the future
};