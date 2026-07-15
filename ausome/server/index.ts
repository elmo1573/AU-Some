import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import { GoogleGenAI } from "@google/genai";
import { GAME_MODULES, HUB_ROUTES } from "../shared/site-map.js";
import type { AusomeProfile } from "../shared/profile.js";
import { createProfile } from "../shared/profile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.use(express.json());

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "ausome-platform" } },
    })
  : null;

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PROFILES_PATH = path.join(DATA_DIR, "profiles.json");
const JOURNALS_PATH = path.join(DATA_DIR, "journals.json");
const SENSORY_PATH = path.join(DATA_DIR, "sensory.json");
const POSTS_PATH = path.join(DATA_DIR, "posts.json");

type SphereComment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
};

type SpherePost = {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  title: string;
  text: string;
  createdAt: string;
  likes: string[];
  comments: SphereComment[];
};

const DEFAULT_POSTS: SpherePost[] = [
  {
    id: "post_seed_1",
    author: "Ethan Mitchell",
    avatar: "🌟",
    avatarColor: "#C3E6CB",
    title: "Small steps, huge milestones! 🧩",
    text: "Today I managed to complete my morning checklist entirely independently without any extra sensory reminders! It felt structured and calming. Celebrating this win today!",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: [],
    comments: [],
  },
  {
    id: "post_seed_2",
    author: "Sarah Jenkins (Parent)",
    avatar: "🎨",
    avatarColor: "#FFEBB3",
    title: "Our new evening decompression corner works wonders",
    text: "We set up a small sensory fort under the stairs using warm fairy lights, a weighted blanket, and soft noise-canceling headphones for Leo after school. His sensory overload meltdowns have significantly lowered this week. Highly recommend building a tailored safe space!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: [],
    comments: [],
  },
  {
    id: "post_seed_3",
    author: "Dr Nazia Bano",
    avatar: "🌿",
    avatarColor: "#B3D1FF",
    title: "Shifting from Awareness to True Acceptance",
    text: "Neurodiversity is beautiful. It is not about changing how autistic individuals interact with the world, but creating environments that naturally adapt, embrace, and honor those unique ways of experiencing life.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: [],
    comments: [],
  },
  {
    id: "post_seed_4",
    author: "Chloe Zhao",
    avatar: "📚",
    avatarColor: "#E2D4F0",
    title: "Visual mapping tools for college coursework",
    text: "If anyone struggles with massive blocks of text or planning research papers, color-coded mind mapping has changed my life. I break each chapter down into distinct sensory colors, meaning my brain doesn't have to scramble over executive tasks.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: [],
    comments: [],
  },
  {
    id: "post_seed_5",
    author: "Marcus Brody",
    avatar: "🎈",
    avatarColor: "#FFCCE6",
    title: "Shoutout to sensory-friendly grocery store hours!",
    text: "Shoutout to local grocery networks holding quiet hours from 8 AM to 10 AM. Dimmed lighting, no loud overhead speakers, and zero carts clattering. Shopping was peaceful instead of a sensory battle.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: [],
    comments: [],
  },
];

function loadPosts(): SpherePost[] {
  const posts = readJsonFile<SpherePost[] | null>(POSTS_PATH, null);
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    writeJsonFile(POSTS_PATH, DEFAULT_POSTS);
    return [...DEFAULT_POSTS];
  }
  return posts;
}

function readJsonFile<T>(filePath: string, defaultVal: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

function writeJsonFile<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: isProd ? "production" : "development" });
});

function normalizeProfile(raw: Partial<AusomeProfile>): AusomeProfile {
  const base = createProfile(raw);
  return {
    ...base,
    ...raw,
    modules: { ...base.modules, ...(raw.modules || {}) },
    updatedAt: new Date().toISOString(),
  };
}

app.get("/api/profiles", (_req, res) => {
  res.json(readJsonFile<AusomeProfile[]>(PROFILES_PATH, []));
});

app.post("/api/profiles", (req, res) => {
  const updatedProfile = normalizeProfile(req.body);
  const profiles = readJsonFile<AusomeProfile[]>(PROFILES_PATH, []);
  const index = profiles.findIndex((p) => p.id === updatedProfile.id);
  if (index !== -1) {
    profiles[index] = {
      ...profiles[index],
      ...updatedProfile,
      modules: { ...profiles[index].modules, ...updatedProfile.modules },
    };
  } else {
    profiles.push(updatedProfile);
  }
  writeJsonFile(PROFILES_PATH, profiles);
  res.json({ success: true, profile: updatedProfile });
});

app.get("/api/journals", (_req, res) => {
  res.json(readJsonFile(JOURNALS_PATH, []));
});

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
    completed: entry.completed !== undefined ? entry.completed : true,
  });
  writeJsonFile(JOURNALS_PATH, journals);
  res.json({ success: true });
});

app.get("/api/sensory-logs", (_req, res) => {
  res.json(readJsonFile(SENSORY_PATH, []));
});

app.post("/api/sensory-logs", (req, res) => {
  const log = req.body;
  const logs = readJsonFile<any[]>(SENSORY_PATH, []);
  logs.push({
    id: log.id || `sensory_${Date.now()}`,
    date: log.date || new Date().toISOString().split("T")[0],
    time: log.time || new Date().toLocaleTimeString(),
    level: log.level || 1,
    errorCount: log.errorCount || 0,
    triggerReason: log.triggerReason || "Rapid Mismatches",
  });
  writeJsonFile(SENSORY_PATH, logs);
  res.json({ success: true });
});

app.get("/api/posts", (_req, res) => {
  const posts = loadPosts().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(posts);
});

app.post("/api/posts", (req, res) => {
  const { author, avatar, avatarColor, title, text, userId } = req.body || {};
  const body = typeof text === "string" ? text.trim() : "";
  if (!body) {
    res.status(400).json({ error: "Post text is required." });
    return;
  }

  const post: SpherePost = {
    id: `post_${Date.now()}`,
    author: (typeof author === "string" && author.trim()) || "Community Member",
    avatar: (typeof avatar === "string" && avatar) || "✏️",
    avatarColor: (typeof avatarColor === "string" && avatarColor) || "#FFEBB3",
    title: typeof title === "string" ? title.trim() : "",
    text: body,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  };

  const posts = loadPosts();
  posts.unshift(post);
  writeJsonFile(POSTS_PATH, posts);
  res.json({ success: true, post, userId: userId || null });
});

app.post("/api/posts/:id/like", (req, res) => {
  const userId =
    (typeof req.body?.userId === "string" && req.body.userId.trim()) || "guest";
  const posts = loadPosts();
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found." });
    return;
  }

  const liked = post.likes.includes(userId);
  post.likes = liked
    ? post.likes.filter((id) => id !== userId)
    : [...post.likes, userId];
  writeJsonFile(POSTS_PATH, posts);
  res.json({
    success: true,
    liked: !liked,
    likeCount: post.likes.length,
    post,
  });
});

app.post("/api/posts/:id/comments", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    res.status(400).json({ error: "Comment text is required." });
    return;
  }

  const posts = loadPosts();
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found." });
    return;
  }

  const comment: SphereComment = {
    id: `comment_${Date.now()}`,
    author:
      (typeof req.body?.author === "string" && req.body.author.trim()) ||
      "Community Member",
    avatar: (typeof req.body?.avatar === "string" && req.body.avatar) || "💬",
    text,
    createdAt: new Date().toISOString(),
  };

  post.comments.push(comment);
  writeJsonFile(POSTS_PATH, posts);
  res.json({ success: true, comment, post });
});

const MESSAGES_PATH = path.join(DATA_DIR, "messages.json");

const MENTORS = [
  {
    id: "mentor_nazia",
    name: "Dr Nazia Bano",
    role: "Therapist",
    avatar: "🎓",
  },
  {
    id: "mentor_asmi",
    name: "Dr Asmi",
    role: "Therapist",
    avatar: "🧘",
  },
];

type DirectMessage = {
  id: string;
  threadId: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  text: string;
  createdAt: string;
};

app.get("/api/mentors", (_req, res) => {
  res.json(MENTORS);
});

app.get("/api/messages", (req, res) => {
  const userId =
    (typeof req.query.userId === "string" && req.query.userId.trim()) || "guest";
  const mentorId =
    typeof req.query.mentorId === "string" ? req.query.mentorId.trim() : "";
  const all = readJsonFile<DirectMessage[]>(MESSAGES_PATH, []);
  const threadId = mentorId ? `${userId}__${mentorId}` : null;
  const messages = threadId
    ? all
        .filter((m) => m.threadId === threadId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : all.filter((m) => m.fromId === userId || m.toId === userId);
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const mentorId =
    typeof req.body?.mentorId === "string" ? req.body.mentorId.trim() : "";
  const userId =
    (typeof req.body?.userId === "string" && req.body.userId.trim()) || "guest";
  const userName =
    (typeof req.body?.userName === "string" && req.body.userName.trim()) ||
    "Community Member";

  if (!text) {
    res.status(400).json({ error: "Message text is required." });
    return;
  }

  const mentor = MENTORS.find((m) => m.id === mentorId);
  if (!mentor) {
    res.status(404).json({ error: "Mentor not found." });
    return;
  }

  const userMsg: DirectMessage = {
    id: `msg_${Date.now()}`,
    threadId: `${userId}__${mentorId}`,
    fromId: userId,
    fromName: userName,
    toId: mentor.id,
    toName: mentor.name,
    text,
    createdAt: new Date().toISOString(),
  };

  const all = readJsonFile<DirectMessage[]>(MESSAGES_PATH, []);
  all.push(userMsg);
  writeJsonFile(MESSAGES_PATH, all);
  res.json({ success: true, message: userMsg });
});

function offlineAssistantReply(opts: {
  message?: string;
  subject?: string;
  format?: string;
  module?: string;
  triggerContext?: string;
}) {
  const {
    message = "",
    subject = "General",
    format = "Easy Explanation",
    module = "hub",
    triggerContext,
  } = opts;
  const text = message.toLowerCase();

  if (module === "focus" || triggerContext) {
    const gameReplies: Record<string, string> = {
      start: "Let's find the matching cards together. Tap any card to start.",
      halfway: "You are doing a great job. Keep exploring!",
      complete: "Wonderful work! Ready for another adventure?",
      default: "I am right here with you. We can do it!",
    };
    return gameReplies[triggerContext || ""] || gameReplies.default;
  }

  let answer: string;
  if (text.includes("schedule")) {
    answer = "A short schedule can make daily tasks feel more predictable. Choose two, three, or four main tasks for your day.";
  } else if (text.includes("overwhelm") || text.includes("anxious") || text.includes("stress")) {
    answer = "Pause and take one slow breath. Breathe in for four, hold for four, then breathe out for four.";
  } else if (text.includes("activity") || text.includes("game")) {
    answer = "Try a short focus game, calming sensory activity, or gentle walk. You can stop or change the activity anytime.";
  } else {
    answer = `Your question is about ${subject}: ${message || "learning at your own pace"}. The full assistant is temporarily unavailable, so please try again soon.`;
  }

  if (format === "Simplify") {
    return `**Main answer:** ${answer}

Read one sentence at a time, and pause whenever needed.

You can ask for any difficult word to be explained.

In short: **Focus on the main answer shown first.**`;
  }

  if (format === "Bullet Points") {
    return `- **Main answer:** ${answer}

- Ask for any part that needs another explanation.

- **Key Takeaway:** Focus on the main answer shown first.`;
  }

  return answer;
}

function getAssistantFormatRules(format: string) {
  if (format === "Simplify") {
    return `Rewrite the answer in plain, everyday English.
Use 3 to 6 sentences. Keep each sentence between 8 and 15 words.
Explain only one idea at a time.
Replace difficult words with simple words. If a difficult word is necessary, explain it immediately.
Remove filler, unnecessary details, and unrelated information.
Do not use idioms, sarcasm, metaphors, jokes, or figurative language.
Use Markdown bold (**text**) for important words, keywords, numbers, dates, and final answers.
End with one short summary sentence beginning exactly with "In short:".`;
  }

  if (format === "Bullet Points") {
    return `Rewrite the answer as an organized Markdown bullet list, not paragraphs.
Give the main answer in the first bullet.
Group related information naturally. Each bullet must contain only 1 to 3 short sentences.
Order bullets from most important information to supporting details.
Use Markdown bold (**text**) for important words, definitions, numbers, formulas, names, and key facts.
Put each bullet on its own line and leave a blank line between bullets.
End with a final bullet beginning exactly with "**Key Takeaway:**" and summarize the answer in one sentence.`;
  }

  const rules: Record<string, string> = {
    "Very Easy": "Use very simple words and short sentences.",
    "Step by Step": "Explain the answer as a short, numbered sequence.",
    "Summary View": "Give only a concise summary of the answer.",
    "Real Life Example": "Explain clearly and include one concrete real-life example.",
  };
  return rules[format] || "Give a clear answer using short paragraphs.";
}

async function runAssistantChat(opts: {
  message?: string;
  subject?: string;
  format?: string;
  module?: string;
  triggerContext?: string;
}) {
  const {
    message = "",
    subject = "General",
    format = "Easy Explanation",
    module = "hub",
    triggerContext,
  } = opts;

  if (!ai) {
    const answer = offlineAssistantReply(opts);
    return { answer, responseText: answer };
  }

  const isGameBot = module === "focus" || !!triggerContext;
  const systemPrompt = isGameBot
    ? `You are A-U-Bot, a warm, calm, and supportive companion for a child aged 10-14 who has autism.
You are speaking directly to them during a memory matching game.
Rules: short sentences, no pressure, under 2 sentences, warm tone.
Context trigger: ${triggerContext || "general support"}.`
    : `You are AU-SOME Assistant, a calm learning helper for autistic children and their families.
Subject: ${subject}.
Rules: use a supportive tone with no urgency, pressure, or negative framing.
Follow these response-format rules exactly:
${getAssistantFormatRules(format)}
Module context: ${module}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: message || "Hello!",
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.4,
    },
  });

  const answer = response.text || "I'm here with you. Let's keep going gently.";
  return { answer, responseText: answer };
}

app.post("/api/assistant/chat", async (req, res) => {
  try {
    const result = await runAssistantChat(req.body);
    res.json(result);
  } catch (error) {
    console.error("Assistant API Error:", error);
    const fallback = offlineAssistantReply(req.body);
    res.json({
      answer: fallback,
      responseText: fallback,
      offline: true,
    });
  }
});

app.post("/api/au-bot", async (req, res) => {
  const { prompt, triggerContext } = req.body;
  try {
    const result = await runAssistantChat({
      message: prompt,
      triggerContext,
      module: "focus",
    });
    res.json({ responseText: result.responseText });
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({
      error: "Could not fetch AI response.",
      responseText: "You are doing great! Let's match another card.",
    });
  }
});

function sendPublicPage(res: express.Response, filename: string) {
  res.sendFile(path.join(PUBLIC_DIR, filename));
}

app.get(HUB_ROUTES.home, (_req, res) => sendPublicPage(res, "index.html"));
app.get(HUB_ROUTES.games, (_req, res) => sendPublicPage(res, "games.html"));
app.get(HUB_ROUTES.connect, (_req, res) => sendPublicPage(res, "connectsphere.html"));
app.get(HUB_ROUTES.assistant, (_req, res) => sendPublicPage(res, "Au_assistance.html"));

app.get("/homepage.html", (_req, res) => res.redirect(HUB_ROUTES.home));
app.get("/ausome.html", (_req, res) => res.redirect(HUB_ROUTES.home));
app.get("/games.html", (_req, res) => res.redirect(HUB_ROUTES.games));
app.get("/connectsphere.html", (_req, res) => res.redirect(HUB_ROUTES.connect));
app.get("/Au_assistance.html", (_req, res) => res.redirect(HUB_ROUTES.assistant));

for (const mod of GAME_MODULES) {
  const baseWithSlash = `${mod.base}/`;

  if (isProd) {
    const distPath = path.join(ROOT, mod.folder, "dist");
    app.use(mod.base, express.static(distPath, { index: false }));
    app.get(`${mod.base}/*`, (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    app.use(
      mod.base,
      createProxyMiddleware({
        target: `http://127.0.0.1:${mod.port}`,
        changeOrigin: true,
        pathRewrite: (path) => {
          if (path === "/" || path === "") return `${mod.base}/`;
          return `${mod.base}${path.startsWith("/") ? path : `/${path}`}`;
        },
      })
    );
  }

  app.get(mod.base, (_req, res) => res.redirect(baseWithSlash));
}

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AU-SOME platform running at http://localhost:${PORT}`);
  console.log(`  Hub:       ${HUB_ROUTES.home}`);
  console.log(`  Games:     ${HUB_ROUTES.games}`);
  console.log(`  Connect:   ${HUB_ROUTES.connect}`);
  console.log(`  Assistant: ${HUB_ROUTES.assistant}`);
  for (const mod of GAME_MODULES) {
    const note = isProd ? "built dist" : `dev proxy -> :${mod.port}`;
    console.log(`  ${mod.label}: ${mod.base}/ (${note})`);
  }
});
