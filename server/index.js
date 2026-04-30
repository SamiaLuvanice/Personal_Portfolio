import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize email config
const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!resend || !contactToEmail) {
      console.error("Missing email configuration");
      return res.status(500).json({ error: "Missing email config" });
    }

    try {
      await resend.emails.send({
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
    } catch (emailError) {
      console.error("Email error:", emailError);
      return res.status(500).json({ error: "Failed to send message" });
    }

    res.json({ ok: true, message: "Contact message sent successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
