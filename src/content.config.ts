import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.mdx" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    pubDate: z.date(),
    upDate: z.date(),
    category: z.enum(["note", "trivia", "lit", "thought", "review"]),
    hidden: z.boolean().optional(),
  }),
});

export const collections = { blog };
