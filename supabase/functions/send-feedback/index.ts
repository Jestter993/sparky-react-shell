import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, message }: FeedbackRequest = await req.json();

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Email and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Adaptrix Feedback <onboarding@resend.dev>",
      to: ["feedback@adaptrix.app"], // Replace with your actual email
      subject: "New Feedback from Adaptrix Landing Page",
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This message was sent from the Adaptrix landing page feedback form.
        </p>
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