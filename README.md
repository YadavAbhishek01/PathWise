# PathWise: AI Learning Roadmap Generator

PathWise turns any topic into a structured, module-by-module learning path. A learner types what they want to learn (for example "React"), picks a level and language, and the app generates a roadmap. Each module's full lesson (explanation, examples, code, practice questions) is generated on demand and cached, and later modules unlock as earlier ones are completed.

Built with the **MERN stack** and the **Google Gemini API**.

---

## Features

- **AI roadmap generation**: 6-12 logically ordered modules per topic, tailored to level (beginner / intermediate / advanced) and language (English / Hinglish).
- **On-demand module content**: a lesson is generated the first time a module is opened, saved to MongoDB, and served from the database afterwards, so Gemini is not called twice for the same module.
- **Prerequisite-based unlocking**: each module lists the modules that must be completed first. Locked modules are disabled in the UI.
- **Progress tracking**: mark modules as complete; the roadmap shows completed, unlocked and locked states in different colours.
- **Syntax-highlighted code snippets** with a copy button.
- **Sidebar of saved roadmaps**: reopen or delete any previous roadmap.
- **Authentication**: signup with email verification, then signin.
- **PDF download** of a module (backend route and frontend button).
- **Resilient AI calls**: automatic retry with backoff, plus a fallback model, when Gemini returns 503 or 429.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, react-hot-toast, lucide-react, react-syntax-highlighter |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (local or Atlas) |
| AI | Google Gemini via `@google/genai` (`gemini-2.5-flash`, fallback `gemini-2.5-flash-lite`) |
| Auth | JWT |
| PDF | pdfkit |

---

## How it works

```
User enters topic + level + language
        │
        ▼
POST create roadmap ──► Gemini returns JSON { modules: [...] } ──► saved in MongoDB (Roadmap)
        │
        ▼
User opens a module
        │
        ├─ content already in DB? ──► return it
        └─ otherwise ──► Gemini generates lesson ──► saved (Module) ──► returned
        │
        ▼
"Mark as complete" ──► module status = completed ──► dependent modules unlock
```

### Data model

**Roadmap** holds the syllabus (lightweight):

```js
{
  userId, topic, level, language,
  modules: [
    { moduleId, title, concept: [String], prerequisiteStep: [Number], status }
  ]
}
```

**Module** holds the full lesson (created on demand):

```js
{
  roadmapId, moduleId, title,
  explanation, examples: [String], codeSnippets: [String],
  practiceQuestions: [String], connectionToNext
}
```

`Module.roadmapId` points to `Roadmap._id`, and `Module.moduleId` matches `Roadmap.modules[].moduleId`.

### Unlock rule

A module is unlocked when it is already completed, has no prerequisites, or every module listed in its `prerequisiteStep` is completed. Status only changes when the user marks that specific module complete. `prerequisiteStep` is only read, never written.

---

## Project structure

```
pathwise/
├── backend/
│   ├── config/          # DB connection
│   ├── controller/      # auth, roadmap, module controllers
│   ├── middelwares/     # auth middleware
│   ├── model/           # User, Roadmap, Module schemas
│   ├── routes/          # User.routes.js, Ai.routes.js
│   ├── service/         # aiService.js (Gemini calls)
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  # Sidebar
        ├── context/     # Auth.context.jsx, Aicontext.jsx
        ├── Layout/      # MainLayout (sidebar + Outlet)
        ├── pages/       # Login, SignUp, Home, RoadmapPage, ModulePage
        ├── Routes/      # PrivateRoute, PublicRoutes
        ├── units/       # axios instance
        ├── App.jsx
        └── main.jsx
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local or MongoDB Atlas)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd pathwise

# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 2. Environment variables

**`backend/.env`**

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_gemini_api_key
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

Add the email credentials your verification-mail setup needs as well.

**`frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:4000/api
```

Variables in Vite must start with `VITE_`, otherwise they are `undefined`.

### 3. Run

```bash
# terminal 1
cd backend
npm run dev        # or: node server.js

# terminal 2
cd frontend
npm run dev
```

Open `http://localhost:5173`.

---

## API overview

Verify these paths against your route files; they are listed here to show the shape of the API.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register and send verification code |
| POST | `/api/auth/verify-email` | Verify email |
| POST | `/api/auth/signin` | Login |
| POST | `/api/ai/create/roadmap` | Generate (or return existing) roadmap |
| GET | `/api/ai/roadmap/:id` | Get one roadmap |
| GET | `/api/ai/:roadmapId/:moduleId` | Get or generate module content |
| PATCH | `/api/ai/:roadmapId/:moduleId/complete` | Mark module complete |
| DELETE | `/api/ai/roadmap/:id` | Delete a roadmap and its modules |
| GET | `/api/ai/:roadmapId/:moduleId/download` | Download module as PDF |

Protected routes expect `Authorization: Bearer <token>`.

Roadmap request body:

```json
{ "topic": "React", "level": "beginner", "language": "english" }
```

---

## Troubleshooting

**`API key should be set when using the Gemini API` or `Could not load the default credentials`**
`GOOGLE_API_KEY` was `undefined` when the Gemini client was created. With ES modules, imports run before `dotenv.config()`. Make this the very first line of `server.js`:

```js
import "dotenv/config";
```

**CORS error mentioning the wildcard `*` and credentials**
Use a specific origin on the backend:

```js
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
```

**503 `This model is currently experiencing high demand`**
Temporary Gemini overload, not a code bug. The service retries with backoff and falls back to `gemini-2.5-flash-lite`. If it persists, try again later.

**Blank roadmap page after refresh**
Context state is lost on refresh. The page must read `id` from the URL and fetch the roadmap in a `useEffect` that depends on `id`.

**Logged out after refresh**
The user object is not restored on app start. See the roadmap below (refresh-token flow).

**PDF downloads but is corrupt**
The Axios request must use `responseType: "blob"`. A plain `<a href>` will not work because the route needs the auth header.

---

## Roadmap

- [ ] Persistent login with httpOnly refresh-token cookie and short-lived access token
- [ ] Logout endpoint and context action
- [ ] Server-side prerequisite check before generating a module
- [ ] Per-snippet language detection for syntax highlighting (bash vs JavaScript)
- [ ] Download the whole roadmap as a single PDF
- [ ] Rename roadmap and delete confirmation modal

---

## License

MIT. Replace with your preferred license.
