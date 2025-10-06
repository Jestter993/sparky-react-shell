import { z } from 'zod';

/**
 * Validation schema for feedback forms
 * Ensures all user input is properly validated before processing
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
    .max(255, "Email must be less than 255 characters"),
  
  message: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be less than 5000 characters"),
  
  marketingConsent: z.boolean().optional().default(false)
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Sanitizes text for safe HTML email rendering
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
