# Notice Board — Reno Platforms Web Development Assignment

A full-stack Notice Board application built with **Next.js (Pages Router)**, **Prisma**, and **TiDB Cloud (MySQL-compatible)**, supporting complete CRUD operations with server-side validation and priority-based sorting.

**Live App:** https://notice-board-reno-dun.vercel.app/
**GitHub Repo:** https://github.com/Tohid4747/notice-board-reno

---

## Features

- Full CRUD (Create, Read, Update, Delete) for notices, all persisted in a hosted MySQL-compatible database via Prisma
- Responsive card-based list view (phone and desktop)
- Urgent notices are sorted to the top using Prisma's `orderBy` (database-level sorting, not client-side), with a visible red "Urgent" badge
- Shared Add/Edit form component used for both creating and updating notices
- Delete requires an explicit confirmation step before removing a notice
- Server-side input validation on every API route — required fields and date validity are enforced in the backend, not just the browser
- Clean, consistent UI built with Tailwind CSS, including a fix to ensure form inputs remain readable in both light and dark system themes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (Pages Router) |
| Database ORM | Prisma (v6) |
| Database | TiDB Cloud (MySQL-compatible, free tier) |
| Hosting | Vercel (Hobby/free tier) |
| Styling | Tailwind CSS |

---

## Folder Structure

```text
notice-board-reno/
│
├── components/
│   ├── ConfirmDialog.js       # Reusable delete confirmation popup
│   ├── NoticeCard.js          # Single notice card (badge, edit/delete actions)
│   └── NoticeForm.js          # Shared create/edit form, used by both new & edit pages
│
├── lib/
│   └── prisma.js               # Prisma client singleton (prevents connection pool exhaustion in dev)
│
├── pages/
│   ├── api/
│   │   └── notices/
│   │       ├── index.js        # GET (list, Urgent-first order) + POST (create, validated)
│   │       └── [id].js         # PUT (update, validated) + DELETE
│   │
│   ├── notices/
│   │   ├── edit/
│   │   │   └── [id].js         # Edit page — fetches existing notice, pre-fills shared form
│   │   └── new.js               # Create page — renders shared form in "create" mode
│   │
│   ├── _app.js
│   ├── _document.js
│   └── index.js                  # Main list page — fetches notices, renders cards, handles delete flow
│
├── prisma/
│   └── schema.prisma             # Notice model + Category/Priority enums, MySQL datasource
│
├── public/                        # Static assets
├── styles/
│   └── globals.css                # Tailwind base styles + light-mode form input fix
│
├── .env                            # DATABASE_URL (not committed — see below)
├── .gitignore
├── package.json
└── README.md
```


---

## Data Model

The `Notice` model (defined in `prisma/schema.prisma`):

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-incremented primary key |
| `title` | String | Required |
| `body` | String | Required, longer text |
| `category` | Enum | `Exam`, `Event`, or `General` |
| `priority` | Enum | `NORMAL` or `URGENT` |
| `publishDate` | DateTime | Required, validated on server |
| `image` | String? | Optional (bonus field, not yet implemented in UI) |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

---

## How to Run the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- A free hosted MySQL-compatible database (e.g., [TiDB Cloud](https://tidbcloud.com), free Serverless tier)

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/Tohid4747/notice-board-reno.git
   cd notice-board-reno
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**

   Create a `.env` file in the project root:

    DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>?sslaccept=strict"

Replace the placeholders with your own TiDB Cloud (or other MySQL-compatible) connection string.

4. **Generate the Prisma client and sync the schema**
```bash
   npx prisma generate
   npx prisma db push
```

5. **Run the development server**
```bash
   npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/notices` | `GET` | Fetch all notices, Urgent-first, newest-first within each group |
| `/api/notices` | `POST` | Create a new notice (server-side validated) |
| `/api/notices/[id]` | `PUT` | Update an existing notice (server-side validated) |
| `/api/notices/[id]` | `DELETE` | Delete a notice by ID |

All routes return appropriate HTTP status codes (`200`, `201`, `400`, `404`, `405`, `500`) and validate required fields and date formats on the server before touching the database.

---

## One Thing I Would Improve With More Time

Given more time, I would implement the **optional image upload feature** for notices (marked as a bonus in the assignment) — likely using a free tier of Cloudinary or a similar service for image hosting, storing just the returned URL in the `image` field that already exists in the schema. This would make the notice board feel more complete for real institutional use (e.g., attaching an event poster or circular scan), and I intentionally left it for last since the assignment marked it explicitly as bonus, prioritizing getting the core CRUD, validation, ordering, and deployment fully solid first.

Additionally, I would add automated tests (e.g., using Jest or Playwright) for the API routes to catch regressions earlier, and consider adding optimistic UI updates on the frontend so create/edit/delete feel instantaneous rather than waiting on a full refetch after each action.

---

## Where and How AI Was Used

AI (Claude) was used extensively and directly throughout this project's development, and I want to be fully transparent about that rather than understate it, since the assignment explicitly permits AI tools and evaluates honesty about their use.

**What AI generated:**
- The Prisma schema (`Notice` model, `Category`/`Priority` enums)
- All API route logic in `pages/api/notices/` — including server-side validation and the Urgent-first `orderBy` sorting logic
- The `lib/prisma.js` Prisma client singleton pattern
- The React components (`NoticeCard`, `NoticeForm`, `ConfirmDialog`) and page files (`pages/index.js`, `pages/notices/new.js`, `pages/notices/edit/[id].js`)
- Step-by-step debugging guidance for a real issue encountered when Prisma 7's newer client generator required driver adapters that caused repeated connection errors — AI recommended and walked through downgrading to Prisma 6, which resolved it cleanly
- The dark-mode form input visibility fix in `globals.css` (`color-scheme: light`)
- This README itself

**What I did:**
- Directed the overall requirements and made architecture decisions (e.g., choosing separate pages over a modal for the Add/Edit form, choosing JavaScript over TypeScript, database provider choice)
- Set up and configured TiDB Cloud, Vercel, and GitHub myself, executing every terminal command and reading through errors
- Tested every feature manually in the browser (create, edit, delete, Urgent sorting, responsiveness, dark mode, incognito access) at each stage and reported back issues as they came up
- Caught and corrected a mistake early on where placeholder test data included messages addressed directly to evaluators, and replaced it with realistic sample notices
- Made the final call on trade-offs (e.g., using `db push` instead of full migration files, given the assignment doesn't require migration history)

In short, AI substantially accelerated development and handled most of the code generation and debugging, while I drove the direction, decisions, testing, and quality control throughout. Given the scope and the strict, detailed requirements in this assignment, this collaborative approach let me focus on understanding *why* each piece works (Prisma's ordering behavior, server-side validation patterns, Next.js Pages Router conventions) rather than just copy-pasting, which I believe reflects well on both the finished product and my ability to work effectively with AI tools — a skill this role itself seems to value, given AI tools are explicitly permitted here.

---

## Submission Checklist

- [x] Live Vercel URL — publicly accessible, no login required
- [x] GitHub repository — public, with real incremental commit history
- [x] Next.js Pages Router used (not App Router)
- [x] Prisma used for all database queries
- [x] Hosted database (TiDB Cloud, free tier)
- [x] All CRUD operations work end-to-end, verified on live deployment
- [x] Server-side validation implemented in all API routes
- [x] Urgent-first ordering done via Prisma `orderBy`
- [x] Delete requires confirmation
- [x] Responsive on phone and desktop
- [x] Only free-tier services used

