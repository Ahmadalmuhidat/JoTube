import * as z from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(5000).optional(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  videoFile: z.any().optional(),
  thumbnailFile: z.any().optional(),
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  isPublished: z.boolean(),
});

export type VideoFormValues = z.infer<typeof videoSchema>;


