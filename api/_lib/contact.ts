// Regra do contato, sem dependência de HTTP nem de SDKs: quem chama (a função da
// Vercel em api/contact.ts ou o servidor Docker em server/index.js) injeta o envio
// de e-mail. O prefixo "_" impede a Vercel de expor este arquivo como rota.
// Só usa sintaxe de tipos apagável, para rodar também no Node 22 sem build.
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactEmail = {
  replyTo: string;
  subject: string;
  html: string;
};

export type ContactDeps = {
  sendEmail: (email: ContactEmail) => Promise<void>;
  logError: (message: string, error: unknown) => void;
};

export type ContactResult = {
  status: 200 | 400 | 405 | 500;
  body: Record<string, unknown>;
};

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function buildEmailHtml({ name, email, message }: ContactInput): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Novo contato pelo portfólio</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mensagem:</strong><br />${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function parseBody(body: unknown): unknown {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

function isHoneypotFilled(raw: unknown): boolean {
  return typeof raw === "object" && raw !== null && "website" in raw && typeof raw.website === "string" && raw.website.trim() !== "";
}

export async function handleContact(method: string | undefined, body: unknown, deps: ContactDeps): Promise<ContactResult> {
  if (method !== "POST") return { status: 405, body: { error: "Método não permitido" } };

  const raw = parseBody(body);
  // Honeypot: campo que pessoas não veem. Se veio preenchido, é robô; responde
  // sucesso para não ensinar o robô a contornar, e não envia nada.
  if (isHoneypotFilled(raw)) return { status: 200, body: { ok: true } };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: "Dados inválidos", fields: Object.keys(parsed.error.flatten().fieldErrors) },
    };
  }
  const input = parsed.data;

  try {
    await deps.sendEmail({ replyTo: input.email, subject: `Novo contato - ${input.name}`, html: buildEmailHtml(input) });
  } catch (error) {
    deps.logError("Falha ao enviar e-mail de contato", error);
    return { status: 500, body: { error: "Não foi possível enviar a mensagem" } };
  }
  return { status: 200, body: { ok: true } };
}
