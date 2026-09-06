import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialization of Gemini API Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment.");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// LYRIA MUSIC GENERATION ENDPOINT (lyria-3-clip-preview / lyria-3-pro-preview)
app.post("/api/music/generate", async (req: Request, res: Response) => {
  try {
    const {
      prompt = "Futuristic cyberpunk ambient electronic soundtrack for premium personal trainer landing page, atmospheric synths, deep controlled sub-bass, subtle rhythmic pulses, 100% instrumental, no vocal, no singing, loopable, sleek neon soundscape.",
      modelType = "clip", // 'clip' (lyria-3-clip-preview, up to 30s) or 'pro' (lyria-3-pro-preview)
    } = req.body || {};

    const model =
      modelType === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

    const ai = getGeminiClient();

    // Generate music stream using Lyria model
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: prompt,
    });

    let audioBase64 = "";
    let lyricsOrNotes = "";
    let mimeType = "audio/wav";

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyricsOrNotes) {
          lyricsOrNotes = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({
        success: false,
        error: "Nenhum fluxo de áudio foi retornado pelo modelo Lyria.",
      });
    }

    return res.json({
      success: true,
      model,
      mimeType,
      audioBase64,
      notes: lyricsOrNotes,
    });
  } catch (error: any) {
    console.error("Erro na geração de trilha sonora via Lyria:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Falha ao gerar trilha sonora com IA.",
    });
  }
});

async function startServer() {
  // Vite dev middleware vs Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
