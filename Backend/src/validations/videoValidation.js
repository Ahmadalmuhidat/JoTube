import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  videoUrl: z.string().url().optional(), // Optional if uploading
  thumbnailUrl: z.string().url().optional(),
  channelId: z.string().uuid().optional()
});

export const videoIdSchema = z.object({
  videoId: z.string().uuid()
});

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const commentSchema = z.object({
  videoId: z.string().uuid(),
  content: z.string().min(1).max(500)
});
