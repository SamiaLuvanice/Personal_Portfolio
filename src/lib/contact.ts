export const CONTACT_EMAIL = "samia.luvanice.dev@gmail.com";

const DEFAULT_SUBJECT = "Contato pelo portfólio";
const DEFAULT_BODY = "Olá, Sâmia!\n\nVi seu portfólio e gostaria de falar sobre uma oportunidade.";

/** Link mailto: com assunto e corpo prontos (codificados para qualquer cliente de e-mail). */
export function buildMailtoHref({ subject = DEFAULT_SUBJECT, body = DEFAULT_BODY }: { subject?: string; body?: string } = {}): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
