import { z } from "zod";

export const projectInquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(80, "Please keep your name under 80 characters."),
    email: z
      .string()
      .email("Please enter a valid work email.")
      .max(160, "Please keep your email under 160 characters."),
    company: z
      .string()
      .trim()
      .max(120, "Please keep the company name under 120 characters.")
      .optional()
      .default(""),
    brief: z
      .string()
      .trim()
      .min(20, "Please share a little more about the project.")
      .max(3000, "Please keep the project brief under 3,000 characters."),
    website: z.string().max(200).optional().default(""),
    startedAt: z.number().int().positive(),
    submissionId: z.uuid(),
  })
  .strict();

export type ProjectInquiry = z.infer<typeof projectInquirySchema>;
