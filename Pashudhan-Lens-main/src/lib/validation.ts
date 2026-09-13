import { z } from 'zod'

// File validation schema
export const fileSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type),
    'File must be a valid image format (JPEG, PNG, WebP)'
  ),
  name: z.string().min(1, 'File name is required')
})

// API request validation
export const breedIdentificationRequestSchema = z.object({
  images: z.array(z.object({
    base64: z.string().min(1, 'Image data is required'),
    mimeType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, 'Invalid MIME type')
  })).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
  options: z.object({
    includeConfidence: z.boolean().optional().default(true),
    maxResults: z.number().min(1).max(10).optional().default(5),
    includeMetadata: z.boolean().optional().default(true)
  }).optional()
})

// Environment variables validation
// We intentionally do not throw on missing keys at module load. The app
// is shipped in a guest/demo mode that boots without external services:
// Clerk is stubbed (see vite.config.ts alias -> src/lib/clerk-stub.tsx)
// and Gemini uses a placeholder so the UI still mounts. Replace these
// placeholders with real values via Vercel env vars to enable the
// respective integrations.
const PLACEHOLDER_GEMINI_KEY = 'PLACEHOLDER_GEMINI_API_KEY';
const PLACEHOLDER_CLERK_KEY = 'PLACEHOLDER_CLERK_PUBLISHABLE_KEY';

export const envSchema = z.object({
  VITE_GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required')
})

// Validate environment variables at startup, returning placeholders if any
// required key is missing instead of throwing.
export const validateEnv = () => {
  const raw = import.meta.env as Record<string, string | undefined>;
  const result = {
    VITE_GEMINI_API_KEY: raw.VITE_GEMINI_API_KEY || PLACEHOLDER_GEMINI_KEY,
    VITE_CLERK_PUBLISHABLE_KEY: raw.VITE_CLERK_PUBLISHABLE_KEY || PLACEHOLDER_CLERK_KEY,
  };
  try {
    return envSchema.parse(result);
  } catch (error) {
    console.warn(
      '[Pashudhan] Environment validation failed; using placeholder values so the app can still load.',
      error
    );
    return result as z.infer<typeof envSchema>;
  }
}

// Type exports
export type FileValidation = z.infer<typeof fileSchema>
export type BreedIdentificationRequest = z.infer<typeof breedIdentificationRequestSchema>
export type ValidatedEnv = z.infer<typeof envSchema>
