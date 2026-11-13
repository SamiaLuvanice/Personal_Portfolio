import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "./Contact";

const submitContactForm = vi.hoisted(() => vi.fn());
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("@/lib/contactService", () => ({ submitContactForm }));
vi.mock("sonner", () => ({ toast }));

async function fillAndSubmit() {
  const user = userEvent.setup();
  render(<Contact />);
  await user.type(screen.getByRole("textbox", { name: "Seu nome" }), "Ana");
  await user.type(screen.getByRole("textbox", { name: "Seu email" }), "ana@example.com");
  await user.type(screen.getByRole("textbox", { name: "Sua mensagem" }), "Olá");
  await user.click(screen.getByRole("button", { name: /enviar mensagem/i }));
}

describe("Contact", () => {
  beforeEach(() => {
    submitContactForm.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("envia os dados, avisa sucesso e limpa o formulário", async () => {
    submitContactForm.mockResolvedValue({ ok: true });
    await fillAndSubmit();
    expect(submitContactForm).toHaveBeenCalledWith({ name: "Ana", email: "ana@example.com", message: "Olá" });
    expect(toast.success).toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Seu nome" })).toHaveValue("");
  });

  it("avisa erro e mantém os dados quando o envio falha", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    submitContactForm.mockRejectedValue(new Error("HTTP 500"));
    await fillAndSubmit();
    expect(toast.error).toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Seu nome" })).toHaveValue("Ana");
  });
});
