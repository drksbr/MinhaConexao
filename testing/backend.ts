import { serve, WebSocketHandler } from "bun";
import { statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { file } from "bun";

// Função para servir arquivos estáticos da pasta ./dist
const serveStatic = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    let filePath = join("../frontend/dist/", url.pathname);
    if (url.pathname === "/") {
        filePath = join("../frontend/dist/", "index.html");
    }

    try {
        const staticFile = await file(filePath);
        return new Response(staticFile, { status: 200 });
    } catch (error) {
        return new Response("Arquivo não encontrado", { status: 404 });
    }
};

// Servidor Bun
serve({
    port: 8080, // Servidor escutando na porta 8080
    fetch(req) {
        const url = new URL(req.url);

        // Endpoint de download (retorna o arquivo de 100MB)
        if (url.pathname === "/download" && req.method === "GET") {
            // Caminho para o arquivo de 100MB
            const filePath = join("/tmp/100.0mb.dat");

            try {
                const stats = statSync(filePath);
                return new Response(file(filePath), {
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Content-Length": stats.size.toString(),
                        "Content-Disposition": `attachment; filename="100.0mb.dat"`
                    }
                });
            } catch (error) {
                console.error("Erro ao fornecer o arquivo:", error);
                return new Response("Erro ao fornecer o arquivo", { status: 500 });
            }
        }

        // Endpoint de upload (recebe arquivo no form com nome "file")
        if (url.pathname === "/upload" && req.method === "POST") {
            if (req.headers.get("Content-Type")?.startsWith("multipart/form-data")) {
                const form = req.formData();
                form.then(data => {
                    const file = data.get("file");
                    if (file) {
                        // Aqui descartamos o arquivo sem salvar
                        return new Response("Arquivo recebido e descartado", { status: 200 });
                    }
                    return new Response("Nenhum arquivo encontrado", { status: 400 });
                });
                return new Response("Processando upload...", { status: 202 });
            } else {
                return new Response("Content-Type incorreto. Use multipart/form-data", { status: 400 });
            }
        }

        // Endpoint de ping (HEAD retorna "OK")
        if (url.pathname === "/ping" && req.method === "HEAD") {
            return new Response("OK", { status: 200 });
        }

        // Endpoint de WebSocket Echo (wsping)
        if (url.pathname === "/wsping" && req.headers.get("upgrade") === "websocket") {
            const wsHandler: WebSocketHandler = {
                open(ws) {
                    console.log("WebSocket connection opened");
                },
                message(ws, message) {
                    ws.send(message); // echo a mensagem recebida
                },
                close(ws) {
                    console.log("WebSocket connection closed");
                },
            };
            return wsHandler;
        }

        // Endpoint de requestinfo
        if (url.pathname === "/requestinfo" && req.method === "GET") {
            const resp = {
                "XRealIP": "177.37.144.183",
                "XForwardedSourcePort": "23442",
                "Timestamp": new Date().toUTCString(),
            };

            return new Response(JSON.stringify(resp), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Serve arquivos estáticos da pasta ./dist
        return serveStatic(req);
    },
});
