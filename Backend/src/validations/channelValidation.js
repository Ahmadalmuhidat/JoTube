import { z } from "zod";

export const updateChannelSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(1000).optional(),
});
