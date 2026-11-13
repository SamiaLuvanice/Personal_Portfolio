// Função serverless da Vercel: POST /api/contact. Só adapta HTTP e monta as
// dependências a partir das variáveis de ambiente; a regra fica em _lib/contact.ts.
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleContact, type ContactDeps } from "./_lib/contact.js";

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function logError(message: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(message, detail);
}

function buildDeps(): ContactDeps | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const deps: ContactDeps = {
    logError,
    async saveMessage(input) {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{ ...input, created_at: new Date().toISOString() }]);
      if (error) throw new Error(`${error.code ?? ""} ${error.message}`.trim());
    },
  };

  const resendApiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (resendApiKey && to) {
    const resend = new Resend(resendApiKey);
    const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
    deps.sendEmail = async (email) => {
      const { error } = await resend.emails.send({ from, to, ...email });
      if (error) throw new Error(error.message);
    };
  }
  return deps;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const deps = buildDeps();
  if (!deps) {
    logError("Configuração ausente", "SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Não foi possível enviar a mensagem" });
  }
  const result = await handleContact(req.method, req.body, deps);
  if (result.status === 405) res.setHeader("Allow", "POST");
  return res.status(result.status).json(result.body);
}
