import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini AI Client (Telemetry User-Agent set to 'aistudio-build')
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Ensure database directories exist
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PROFILES_PATH = path.join(DATA_DIR, "profiles.json");
const JOURNALS_PATH = path.join(DATA_DIR, "journals.json");
const SENSORY_PATH = path.join(DATA_DIR, "sensory.json");

// Helper to read JSON safely
function readJsonFile<T>(filePath: string, defaultVal: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

// Helper to write JSON safely
function writeJsonFile<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// API: Get all profiles
app.get("/api/profiles", (req, res) => {
  const profiles = readJsonFile(PROFILES_PATH, []);
  res.json(profiles);
});

// API: Save or Update profile
app.post("/api/profiles", (req, res) => {
  const updatedProfile = req.body;
  const profiles = readJsonFile<any[]>(PROFILES_PATH, []);
  
  const index = profiles.findIndex(p => p.id === updatedProfile.id);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updatedProfile };
  } else {
    profiles.push(updatedProfile);
  }
  
  writeJsonFile(PROFILES_PATH, profiles);
  res.json({ success: true, profile: updatedProfile });
});

// API: Get Progress Journals (for parent dashboard)
app.get("/api/journals", (req, res) => {
  const journals = readJsonFile(JOURNALS_PATH, []);
  res.json(journals);
});

// API: Log Progress Journal entry
app.post("/api/journals", (req, res) => {
  const entry = req.body;
  const journals = readJsonFile<any[]>(JOURNALS_PATH, []);
  journals.push({
    id: entry.id || `journal_${Date.now()}`,
    date: entry.date || new Date().toISOString().split("T")[0],
    sessionTime: entry.sessionTime || 0,
    level: entry.level || 1,
    rapidErrors: entry.rapidErrors || 0,
    sensoryTrigger: entry.sensoryTrigger || false,
    pointsEarned: entry.pointsEarned || 0,
    completed: entry.completed !== undefined ? entry.completed : true
  });
  writeJsonFile(JOURNALS_PATH, journals);
  res.json({ success: true });
});

// API: Get sensory overload logs
app.get("/api/sensory-logs", (req, res) => {
  const logs = readJsonFile(SENSORY_PATH, []);
  res.json(logs);
});

// API: Log sensory overload trigger
app.post("/api/sensory-logs", (req, res) => {
  const log = req.body;
  const logs = readJsonFile<any[]>(SENSORY_PATH, []);
  logs.push({
    id: log.id || `sensory_${Date.now()}`,
    date: log.date || new Date().toISOString().split("T")[0],
    time: log.time || new Date().toLocaleTimeString(),
    level: log.level || 1,
    errorCount: log.errorCount || 0,
    triggerReason: log.triggerReason || "Rapid Mismatches"
  });
  writeJsonFile(SENSORY_PATH, logs);
  res.json({ success: true });
});

// API: A-U-Bot Support Companion Powered by Gemini 3.5 Flash
app.post("/api/au-bot", async (req, res) => {
  const { prompt, triggerContext } = req.body;
  
  if (!ai) {
    // Fallback if API key is not yet configured, keeping the game fully operational
    const offlineResponses: Record<string, string> = {
      start: "Let's find the matching cards together. Tap any card to start.",
      halfway: "You are doing a great job. Keep exploring!",
      complete: "Wonderful work! Ready for another adventure?",
      default: "I am right here with you. We can do it!"
    };
    const responseText = offlineResponses[triggerContext] || offlineResponses.default;
    return res.json({ responseText });
  }

  try {
    const systemPrompt = `You are A-U-Bot, a warm, calm, and supportive companion for a child aged 10-14 who has autism. 
You are speaking directly to them during a memory matching game.
Rules for your speech:
1. Respond simply, calmly, and always use short sentences.
2. Never use urgency, pressure, or negative language.
3. Keep your answers under 2 sentences.
4. Speak in a warm, encouraging tone.

Context trigger: ${triggerContext || "general support"}.
Prompt or child input: ${prompt || "Encourage me"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt || "Hi A-U-Bot!",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const responseText = response.text || "You are doing wonderful. Keep playing!";
    res.json({ responseText });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ 
      error: "Could not fetch AI response.", 
      responseText: "You are doing great! Let's match another card." 
    });
  }
});

// Boot Server with Vite integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server connected.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Matching Quest backend server actively running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
