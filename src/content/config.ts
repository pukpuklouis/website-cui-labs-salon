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

/**
 * Social media links schema reused for stylist data
 */
const socialMediaLinksSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  // Add other potential social media platforms as needed
});

/**
 * Schema for a single stylist object
 */
const stylistSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  specialty: z.string(),
  yearsExperience: z.number(),
  profileImagePath: z.string(),
  socialMediaLinks: socialMediaLinksSchema,
  availability: z.string(),
  featuredServices: z.array(z.string()),
});

/**
 * Define the 'stylistbio' data collection, which is an array of stylist objects
 */
const stylistbioCollection = defineCollection({
  type: 'data',
  schema: z.array(stylistSchema),
});

/**
 * Schema for a single service object based on services.json
 */
const serviceSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
});

/**
 * Define the 'services' data collection, which is an array of service objects
 */
const servicesCollection = defineCollection({
  type: 'data',
  schema: z.array(serviceSchema),
});

// Export a `collections` object to register the collection(s)
export const collections = {
  'blog': blogCollection,
  'stylistbio': stylistbioCollection,
  'services': servicesCollection,
};