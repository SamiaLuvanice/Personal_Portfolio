import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

const RESET_DELAY_MS = 2000;

/**
 * Endereço de e-mail com ação de copiar (spec 0007). Cobre quem não tem programa de e-mail
 * configurado, caso em que o `mailto:` falha sem aviso.
 */
const CopyEmailButton = ({ email }: { email: string }) => {
  const [state, setState] = useState<CopyState>("idle");
  // Muda a cada cópia: o nó do anúncio é recriado e o leitor de tela repete o aviso.
  const [announcement, setAnnouncement] = useState(0);
  const addressRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number>();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const selectAddress = () => {
    const selection = window.getSelection();
    if (addressRef.current && selection) selection.selectAllChildren(addressRef.current);
  };

  const copy = async () => {
    window.clearTimeout(timerRef.current);
    try {
      if (!navigator.clipboard) throw new Error("Área de transferência indisponível");
      await navigator.clipboard.writeText(email);
      if (!mountedRef.current) return;
      setState("copied");
      setAnnouncement((count) => count + 1);
      timerRef.current = window.setTimeout(() => setState("idle"), RESET_DELAY_MS);
    } catch {
      if (!mountedRef.current) return;
      setState("error");
      selectAddress();
    }
  };

  const copied = state === "copied";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground md:text-base">
        <span ref={addressRef} className="select-all [overflow-wrap:anywhere]">
          {email}
        </span>
        <button
          type="button"
          aria-label="Copiar e-mail"
          onClick={copy}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface-dark))]"
        >
          {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p role="status" className={state === "error" ? "text-sm text-muted-foreground" : "sr-only"}>
        {copied && <span key={announcement}>E-mail copiado</span>}
        {state === "error" && "Não foi possível copiar. Copie o endereço manualmente."}
      </p>
    </div>
  );
};

export default CopyEmailButton;
