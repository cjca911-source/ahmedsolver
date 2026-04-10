import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3000;
const model = process.env.OPENAI_MODEL || "gpt-5";
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
app.post("/api/solve-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!client) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Solve this engineering problem step by step: ${prompt}`
    });

    res.json({
      result: response.output_text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solution: {
      type: "string",
      description: "A clean, student-friendly step-by-step engineering explanation in the same language as the user's prompt."
    },
    structured: {
      type: "object",
      additionalProperties: false,
      properties: {
        topic: {
          type: "string",
          description: "Detected engineering topic, for example Normal Stress, Hooke's Law, Torsion, or Thermal Stress."
        },
        knowns: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              symbol: { type: "string" },
              value: { type: "string" },
              unit: { type: "string" }
            },
            required: ["name", "symbol", "value", "unit"]
          }
        },
        unknown: {
          type: "string",
          description: "The requested or inferred target variable."
        },
        formula: {
          type: "string",
          description: "Primary governing engineering formula used to solve the problem."
        },
        steps: {
          type: "array",
          items: { type: "string" },
          description: "Step-by-step numbered or ordered solution steps."
        }
      },
      required: ["topic", "knowns", "unknown", "formula", "steps"]
    }
  },
  required: ["solution", "structured"]
};

function extractResponseText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  if (!Array.isArray(response.output)) {
    return "";
  }

  const parts = [];

  response.output.forEach(function (item) {
    if (!Array.isArray(item.content)) {
      return;
    }

    item.content.forEach(function (contentItem) {
      if (typeof contentItem.text === "string" && contentItem.text.trim()) {
        parts.push(contentItem.text);
      }
    });
  });

  return parts.join("\n").trim();
}

function buildFallbackPayload(rawText) {
  return {
    solution: rawText || "No solution returned.",
    structured: {
      topic: "",
      knowns: [],
      unknown: "",
      formula: "",
      steps: rawText ? rawText.split("\n").filter(Boolean) : []
    }
  };
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", function (request, response) {
  response.json({
    ok: true,
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: model
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

  if (!client) {
    response.status(500).json({
      error: "OPENAI_API_KEY is missing on the server."
    });
    return;
  }

  try {
    const aiResponse = await client.responses.create({
      model: model,
      reasoning: { effort: "low" },
      input: [
        {
          role: "developer",
          content:
            "You are AhmedSolver, a careful mechanical engineering study assistant for Strength of Materials. " +
            "Read the user problem, detect whether the user writes in English or Arabic, and answer in the same language. " +
            "Extract the known values, identify the unknown variable, choose one appropriate governing formula, " +
            "and produce a clear student-friendly step-by-step solution. " +
            "If the problem statement is incomplete, state reasonable assumptions briefly before solving. " +
            "Return only JSON that matches the required schema."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "engineering_text_solver",
          strict: true,
          schema: responseSchema
        }
      }
    });

    const responseText = extractResponseText(aiResponse);
    let payload;

    try {
      payload = JSON.parse(responseText);
    } catch (parseError) {
      payload = buildFallbackPayload(responseText);
    }

    response.json(payload);
  } catch (error) {
    console.error("OpenAI solve-text error:", error);
    response.status(500).json({
      error: "Failed to analyze the engineering problem."
    });
  }
});

app.use(express.static(__dirname, {
  dotfiles: "ignore"
}));

app.listen(port, function () {
  console.log(`AhmedSolver backend is running on http://localhost:${port}`);
});
