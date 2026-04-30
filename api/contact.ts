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
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

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

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    if (!resendApiKey || !contactToEmail) {
      console.error("Missing Resend config:", { hasApiKey: !!resendApiKey, hasEmail: !!contactToEmail });
      return res.status(500).json({ error: "Missing email config" });
    }

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
      return res.status(500).json({ error: "Failed to send message" });
    }

    res.status(200).json({ ok: true, message: "Contact message sent successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
