// Função serverless da Vercel: POST /api/contact. Só adapta HTTP e monta o envio
// de e-mail a partir das variáveis de ambiente; a regra fica em _lib/contact.ts.
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleContact, type ContactDeps } from "./_lib/contact.js";

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function logError(message: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(message, detail);
}

function buildDeps(): ContactDeps | null {
  const resendApiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!resendApiKey || !to) return null;

  const resend = new Resend(resendApiKey);
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  return {
    logError,
    async sendEmail(email) {
      const { error } = await resend.emails.send({ from, to, ...email });
      if (error) throw new Error(error.message);
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const deps = buildDeps();
  if (!deps) {
    logError("Configuração ausente", "RESEND_API_KEY/CONTACT_TO_EMAIL");
    return res.status(500).json({ error: "Não foi possível enviar a mensagem" });
  }
  const result = await handleContact(req.method, req.body, deps);
  if (result.status === 405) res.setHeader("Allow", "POST");
  return res.status(result.status).json(result.body);
}
