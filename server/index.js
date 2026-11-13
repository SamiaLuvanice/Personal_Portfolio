// Servidor da API para o deploy alternativo em Docker (docker-compose.yml + nginx).
// Produção é a Vercel (api/contact.ts); ambos usam a MESMA regra de api/_lib/contact.ts,
// carregada direto do TypeScript pelo Node >= 22.18 (remoção de tipos nativa).
import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";
import { handleContact } from "../api/_lib/contact.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

// Mesma origem via nginx (/api → api:3001): não há CORS aberto.
app.use(express.json({ limit: "16kb" }));

function logError(message, error) {
  console.error(message, error instanceof Error ? error.message : String(error));
}

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.all("/api/contact", async (req, res) => {
  if (!resend || !contactToEmail) {
    logError("Configuração ausente", "RESEND_API_KEY/CONTACT_TO_EMAIL");
    return res.status(500).json({ error: "Não foi possível enviar a mensagem" });
  }
  const result = await handleContact(req.method, req.body, {
    logError,
    async sendEmail(email) {
      const { error } = await resend.emails.send({ from: contactFromEmail, to: contactToEmail, ...email });
      if (error) throw new Error(error.message);
    },
  });
  if (result.status === 405) res.setHeader("Allow", "POST");
  return res.status(result.status).json(result.body);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
