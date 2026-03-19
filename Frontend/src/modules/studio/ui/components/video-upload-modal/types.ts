import * as z from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(5000).optional(),
  videoUrl: z.string().url("Wait for video to upload"),
  thumbnailUrl: z.string().url("Please upload a thumbnail").optional(),
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  isPublished: z.boolean(),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const DEFAULT_CATEGORIES = [
  { id: "1", name: "Music" },
  { id: "2", name: "Gaming" },
  { id: "3", name: "Education" },
  { id: "4", name: "Entertainment" },
  { id: "5", name: "Technology" },
  { id: "6", name: "Vlogs" },
  { id: "7", name: "News" },
  { id: "8", name: "Sports" },
  { id: "9", name: "Travel" },
  { id: "10", name: "Food" },
  { id: "11", name: "Fashion" },
  { id: "12", name: "Science" },
  { id: "13", name: "History" },
  { id: "14", name: "Art" },
  { id: "15", name: "Education" },
  { id: "16", name: "Health" },
  { id: "17", name: "Finance" },
  { id: "18", name: "Politics" },
  { id: "19", name: "Movies" },
  { id: "20", name: "Podcasts" },
];
