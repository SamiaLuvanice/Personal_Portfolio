import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing env vars:", { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      return res.status(500).json({ error: "Missing Supabase config" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to save message" });
    }

    // Send email if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    if (resendApiKey && contactToEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const emailResult = await resend.emails.send({
          from: contactFromEmail,
          to: contactToEmail,
          replyTo: email,
          subject: `Novo contato - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Novo contato pelo portfólio</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mensagem:</strong><br />${message.replace(/\n/g, "<br />")}</p>
            </div>
          `,
        });
        console.log("Email sent:", emailResult);
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    } else {
      console.warn("Resend not configured:", { hasApiKey: !!resendApiKey, hasEmail: !!contactToEmail });
    }

    res.status(200).json({ ok: true, message: "Contact message saved successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
