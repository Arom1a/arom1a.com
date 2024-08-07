import { z, defineCollection } from "astro:content";

const bookmarkCollection = defineCollection({
  type: "content",
  schema: z.object({}),
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    title: z.string(),
    pubDate: z.date(),
    upDate: z.date(),
    category: z.enum(["note", "trivia", "lit", "thought", "review"]),
    lackEnTranslation: z.boolean().optional(),
    lackZhTranslation: z.boolean().optional(),
  }),
});

export const collections = {
  bookmarks: bookmarkCollection,
  blog: blogCollection,
};
