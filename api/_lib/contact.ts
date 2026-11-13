// Regra do formulário de contato, sem dependência de HTTP nem de SDKs: o handler em
// api/contact.ts injeta persistência e e-mail. O prefixo "_" impede a Vercel de expor
// este arquivo como rota.
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
  saveMessage: (input: ContactInput) => Promise<void>;
  sendEmail?: (email: ContactEmail) => Promise<void>;
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

export async function handleContact(method: string | undefined, body: unknown, deps: ContactDeps): Promise<ContactResult> {
  if (method !== "POST") return { status: 405, body: { error: "Método não permitido" } };

  const parsed = contactSchema.safeParse(parseBody(body));
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: "Dados inválidos", fields: Object.keys(parsed.error.flatten().fieldErrors) },
    };
  }
  const input = parsed.data;

  try {
    await deps.saveMessage(input);
  } catch (error) {
    deps.logError("Falha ao salvar mensagem de contato", error);
    return { status: 500, body: { error: "Não foi possível enviar a mensagem" } };
  }

  if (deps.sendEmail) {
    try {
      await deps.sendEmail({ replyTo: input.email, subject: `Novo contato - ${input.name}`, html: buildEmailHtml(input) });
    } catch (error) {
      // A mensagem já está salva; o e-mail é só notificação.
      deps.logError("Falha ao enviar e-mail de contato", error);
    }
  }

  return { status: 200, body: { ok: true } };
}
