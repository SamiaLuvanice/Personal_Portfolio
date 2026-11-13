export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  /** Honeypot: só robôs preenchem (campo escondido no formulário). */
  website?: string;
};

export type ContactSuccess = { ok: true };

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function errorMessage(data: unknown): string | undefined {
  if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
    return data.error;
  }
  return undefined;
}

export const submitContactForm = async (payload: ContactPayload): Promise<ContactSuccess> => {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(errorMessage(data) ?? `Falha ao enviar o formulário de contato (HTTP ${response.status})`);
  }
  if (typeof data !== "object" || data === null || !("ok" in data) || data.ok !== true) {
    throw new Error("Resposta inesperada do servidor de contato");
  }
  return { ok: true };
};
