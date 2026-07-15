# AU-SOME Platform

Autism-friendly learning hub: games, community, and AI assistance in one site.

## Site map

| URL | Page |
|-----|------|
| `/` | Main hub (login, dashboard) |
| `/games` | Game launcher |
| `/connect` | Connect Sphere community |
| `/assistant` | AI assistant |
| `/play/focus/` | Focus / memory matching game |
| `/play/math/` | Montessori math game |
| `/play/language/` | Language learning game |
| `/play/sensory/` | Sensory learning game |

## Project layout

```
ausome/
  public/           Hub HTML pages (served at /)
  server/           Unified Express server + APIs
  shared/           Route map + profile + hub nav component
  public/shared/    Shared nav (site.css, nav.js) + browser helpers
  focus_module/     React game — memory matching
  math_module/      React game — math
  langauge_module/  React game — language
  sensory_module/   React game — sensory
  data/             Runtime JSON storage (profiles, logs)
```

## Setup

1. Install dependencies once from the repo root:

```bash
npm install
```

2. Copy environment file (optional, for AI):

```bash
copy ausome\.env.example ausome\.env
```

3. Start everything (hub server + all 4 game dev servers):

```bash
npm run dev
```

Open **http://localhost:3000**

## Production

```bash
npm run build
npm run start
```

## APIs (same origin as the site)

- `GET/POST /api/profiles`
- `GET/POST /api/journals`
- `GET/POST /api/sensory-logs`
- `GET/POST /api/posts`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/comments`
- `GET /api/mentors`
- `GET/POST /api/messages`
- `POST /api/assistant/chat`
- `POST /api/au-bot` (legacy alias for focus game)
- `GET /api/health`

The assistant supports response formats including **Simplify** and **Bullet Points**. Choosing a format rewrites the latest answer using plain-language or scan-friendly rules rather than only changing its visual layout.

Legacy HTML filenames redirect automatically (`/games.html` → `/games`, etc.).
