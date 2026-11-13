import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { existsSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => ApiResponse;
};

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (raw === "") return undefined;
  if (!req.headers["content-type"]?.includes("application/json")) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function toApiResponse(res: ServerResponse): ApiResponse {
  const api = res as ApiResponse;
  api.status = (code) => {
    api.statusCode = code;
    return api;
  };
  api.json = (data) => {
    api.setHeader("Content-Type", "application/json; charset=utf-8");
    api.end(JSON.stringify(data));
    return api;
  };
  return api;
}

/**
 * Serve as funções de api/*.ts no `npm run dev` com a mesma assinatura (req, res) da
 * Vercel, para que o desenvolvimento local use o mesmo código da produção.
 */
function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const name = url.pathname.replace(/^\/+|\/+$/g, "");
        const file = path.resolve(__dirname, "api", `${name}.ts`);
        if (!/^[a-z0-9-]+$/i.test(name) || !existsSync(file)) return next();
        try {
          const body = await readBody(req);
          const mod = await server.ssrLoadModule(file);
          const request = Object.assign(req, { body, query: Object.fromEntries(url.searchParams) });
          await mod.default(request, toApiResponse(res));
        } catch (error) {
          if (error instanceof Error) server.ssrFixStacktrace(error);
          next(error);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Disponibiliza o .env (inclusive variáveis sem prefixo VITE_) às funções em dev.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
    process.env[key] ??= value;
  }
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), vercelApiDev()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
