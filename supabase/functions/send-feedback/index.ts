import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const feedbackSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(5000),
  marketingConsent: z.boolean().optional().default(false)
});

// HTML sanitization
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input with Zod
    const validation = feedbackSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input",
          details: validation.error.errors 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const { email, message, name, marketingConsent } = validation.data;
    
    // Rate limiting: max 3 submissions per hour per email
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentSubmissions, error: rateLimitError } = await supabase
      .from('feedback_rate_limits')
      .select('id')
      .eq('email', email)
      .gte('submitted_at', oneHourAgo);

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
    } else if (recentSubmissions && recentSubmissions.length >= 3) {
      console.warn(`Rate limit exceeded for email: ${email}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { 
          status: 429, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Log this submission for rate limiting
    await supabase.from('feedback_rate_limits').insert({ email });

    // Store email in subscribers list if consent given
    if (marketingConsent) {
      await supabase.from("email_subscribers").upsert(
        {
          email,
          source: "feedback_form",
          name,
          message,
          marketing_consent: true,
          subscription_status: "active",
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      );
    }

    // Sanitize for email HTML
    const sanitizedMessage = sanitizeHtml(message);
    const sanitizedName = name ? sanitizeHtml(name) : '';
    
    const emailResponse = await resend.emails.send({
      from: "Adaptrix Feedback <noreply@adaptrix.io>",
      to: ["adaptrixlocalization@outlook.com"],
      subject: "New Feedback from Adaptrix Landing Page",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F8FA; padding: 20px;">
          <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #5A5CFF 0%, #00C9A7 100%); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
              Adaptrix Feedback
            </div>
            <h2 style="color: #0F1117; margin: 0 0 20px 0;">New Feedback Received</h2>
            <div style="background: #F5F8FA; padding: 15px; border-radius: 8px; margin: 20px 0;">
              ${sanitizedName ? `<p style="color: #0F1117; margin: 5px 0;"><strong>Name:</strong> ${sanitizedName}</p>` : ''}
              <p style="color: #0F1117; margin: 5px 0;"><strong>From:</strong> ${email}</p>
              <p style="color: #0F1117; margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
            <div style="margin: 20px 0; padding: 20px; background: #F5F8FA; border-radius: 8px; border-left: 4px solid #5A5CFF;">
              <h3 style="color: #0F1117; margin: 0 0 10px 0;">Message:</h3>
              <p style="white-space: pre-wrap; color: #0F1117; line-height: 1.6; margin: 0;">${sanitizedMessage}</p>
            </div>
            <hr style="margin: 30px 0; border: none; height: 1px; background: #e0e0e0;">
            <p style="color: #888; font-size: 12px; margin: 0; text-align: center;">
              This message was sent from the Adaptrix landing page feedback form.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Feedback email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);