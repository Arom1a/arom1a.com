import { z, defineCollection } from "astro:content";

const bookmarkCollection = defineCollection({
  type: "content",
  schema: z.object({}),
});

export const collections = {
  bookmarks: bookmarkCollection,
};
