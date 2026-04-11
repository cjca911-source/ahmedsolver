import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3000;
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const ollamaModel = process.env.OLLAMA_MODEL || "gemma3";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", function (request, response) {
  response.json({
    ok: true,
    provider: "ollama",
    baseUrl: ollamaBaseUrl,
    model: ollamaModel
  });
});

app.post("/api/solve-text", async function (request, response) {
  const prompt = typeof request.body?.prompt === "string" ? request.body.prompt.trim() : "";

  if (!prompt) {
    response.status(400).json({
      error: "Prompt is required."
    });
    return;
  }

  try {
    const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: `You are a mechanical engineering solver. Solve step by step: ${prompt}`,
        stream: false
      })
    });

    let payload = null;

    try {
      payload = await ollamaResponse.json();
    } catch (parseError) {
      response.status(502).json({
        error: "Ollama returned an unreadable response."
      });
      return;
    }

    if (!ollamaResponse.ok) {
      response.status(502).json({
        error: payload && payload.error ? payload.error : "Ollama returned an error."
      });
      return;
    }

    response.json({
      result: payload && typeof payload.response === "string" ? payload.response : ""
    });
  } catch (error) {
    console.error("Ollama solve-text error:", error);
    response.status(503).json({
      error: "Ollama is not reachable. Make sure Ollama is running locally at http://localhost:11434."
    });
  }
});

app.use(express.static(__dirname, {
  dotfiles: "ignore"
}));

app.listen(port, function () {
  console.log(`AhmedSolver backend is running on http://localhost:${port}`);
});
