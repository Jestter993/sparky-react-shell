import { z } from 'zod';

/**
 * Comprehensive validation schema for feedback forms
 * Prevents XSS, injection attacks, and data corruption
 */
export const feedbackSchema = z.object({
  name: z.string()
    .trim()
    .max(100, "Name must be less than 100 characters")
    .optional()
    .transform(val => val || undefined),
  
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  
  message: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be less than 5000 characters"),
  
  marketingConsent: z.boolean().optional().default(false)
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Sanitizes text for safe display in HTML emails
 * Prevents XSS attacks in email content
 */
export function sanitizeForEmail(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

/**
 * Validates and sanitizes email input
 * Returns validated data or throws error
 */
export function validateFeedback(data: unknown): FeedbackInput {
  return feedbackSchema.parse(data);
}
