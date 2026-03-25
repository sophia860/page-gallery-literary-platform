# Bug Report and Audit Checklist — The Page Gallery Journal

**Site:** thepagegalleryjournal.com
**Date:** March 25, 2026
**Prepared for:** Development Team

---

## 1. HOMEPAGE / NAVIGATION BUGS

### 1.1 — "Drafts" link misdirects to Editor Studio

**Where:** Homepage — clicking "Drafts" (or whatever the CTA is labelled)

**Expected:** Should take writers to their own drafts/work-in-progress area

**Actual:** Takes the user to the Editor Studio / editorial dashboard, which is an admin-only space

**Fix:** The "Drafts" link on the public-facing site needs its `href` changed to point to a user drafts page (e.g. `/my-drafts` or `/garden?tab=drafts`), not `/editor-studio`

**Severity:** Critical — breaks core writer workflow

---

### 1.2 — Leaving Editor Studio navigates to the Garden, not the Homepage

**Where:** Editor Studio — clicking the back arrow (←) or "leave" action

**Expected:** Should return to the homepage (`/`)

**Actual:** Navigates to the Garden (`/garden`)

**Fix:** Update the back-arrow link in the Editor Studio header component to point to `/` instead of `/garden`

**Severity:** Minor — inconvenient but not blocking

---

### 1.3 — Light/daylight mode toggle does nothing

**Where:** Anywhere on the site — the theme toggle button (sun/moon icon, bottom-right)

**Expected:** Should switch the site to a light colour scheme

**Actual:** Nothing visually changes; the site stays in dark mode

**Fix:** Audit the theme toggle logic in the client code. Likely either:
- The CSS variables for the light theme are missing/identical to dark, or
- The toggle isn't applying a class/attribute to the `<html>` or `<body>` element

**Severity:** Major — impacts accessibility and user preference

---

## 2. EDITOR STUDIO — FUNCTIONAL BUGS

### 2.1 — Creating a Thread fails silently

**Where:** Editor Studio → Threads tab → New Thread form

**Expected:** Thread is created and appears in the list

**Actual:** Nothing happens; thread does not appear; no error shown to the user

**Fix:** Check the `POST /api/editorial/threads` endpoint. Likely causes:
- (a) The `editorial_threads` table doesn't exist or the `created_by_editor_id` foreign key is failing
- (b) The frontend isn't sending the correct payload
- (c) The auth token isn't being passed

Check browser console Network tab for the HTTP response.

**Severity:** Critical — core editor functionality is broken

---

### 2.2 — Creating a Task fails silently

**Where:** Editor Studio → Tasks tab → New Task form (visible in screenshot with "d" filled in)

**Expected:** Task is created, assigned to an editor, and visible in the task board

**Actual:** Clicking "CREATE" does nothing; task does not appear; "No tasks found" persists

**Fix:** Same debugging approach as 2.1. Check `POST /api/editorial/tasks`. Verify:
- The `editorial_tasks` table exists
- The request body matches what the backend expects (title, description, assignedEditorId, etc.)

**Severity:** Critical — core editor functionality is broken

---

### 2.3 — Garden Walk tab shows "Submit Work" — wrong direction

**Where:** Editor Studio → Garden Walk tab → "+ SUBMIT WORK" button

**Expected:** The Editor Studio is for editors. This tab should show incoming submissions from writers, not a form for editors to submit their own work

**Actual:** Shows a "Submit Work" button as if the editor is a writer

**Fix:** Remove or hide the "+ SUBMIT WORK" button from the Editor Studio's Garden Walk view. This tab should be a **read-only review queue** that displays submissions from the `garden_walk_submissions` table, with options for editors to leave feedback, accept, or reject

**Severity:** Major — confusing UX, wrong mental model

---

## 3. EDITOR STUDIO — UX / VISION ISSUES

### 3.1 — The Editor Studio doesn't feel like Trello/Notion/Teams

**Current state:** Flat list views with minimal interactivity; no drag-and-drop, no Kanban columns, no real-time presence, no inline editing

**Vision:** An all-in-one editorial workspace combining task management (Trello), document notes (Notion), and team chat (Teams)

**Recommendations:**

#### Tasks
- Implement a **Kanban board** with draggable columns (Inbox → In Progress → Review → Done)
- The `board_column` field already exists in the schema — wire it up to a drag-and-drop UI (e.g. `@dnd-kit` or `react-beautiful-dnd`)

#### Threads
- Make threads feel like a **Slack/Teams channel** — show real-time messages, typing indicators, and editor avatars

#### Inbox
- Should aggregate notifications: new submissions, flag alerts, task assignments, thread mentions

#### Overview dashboard
- Show at-a-glance stats that are **actionable** — clickable cards that navigate to filtered views

#### General
- Add keyboard shortcuts, breadcrumbs, a command palette (Cmd+K), and a sidebar that persists across tabs

**Severity:** Enhancement — would significantly improve editor experience

---

## 4. THE GARDEN — CONTENT & PUBLISHING BUGS

### 4.1 — Every piece published in the Garden appears on the Journal

**Where:** `/journal` page

**Expected:** The Journal is a curated publication. Only editorially approved pieces should appear there. Writers should aspire to be selected.

**Actual:** Every single piece that anyone publishes in the Garden automatically appears on the Journal

**Fix:** The Journal page query needs a filter. Only writings where `status = 'published_to_journal'` (or an equivalent editorial approval flag) should appear on `/journal`.

- Garden writings should have a separate status like `'published_to_garden'`
- The `writings` table likely needs a `published_to_journal` boolean or a `publication_target` enum column

**Severity:** Critical — undermines the entire editorial vision

---

### 4.2 — The Garden is not "cleaned up"

**Where:** `/garden` page

**Expected:** A clean, curated, browsable space for community writing

**Actual:** Cluttered, unclear layout; unclear what each section/piece is; not inviting for return visits

**Fix:** Full UX redesign of the Garden page:
- Clear section headers and descriptions
- Visual hierarchy (featured pieces vs. recent vs. by genre)
- Card-based layout with cover images, author names, genre tags, and word counts
- Filtering and sorting (by genre, date, popularity)
- Clear CTAs ("Read", "Appreciate", "Send a Letter")

**Severity:** Major — impacts user retention and engagement

---

### 4.3 — No social features in the Garden

**Where:** `/garden` and individual writing pages

**Expected:** Community engagement features that make people come back

**Actual:** No visible social layer

**Suggestions for social features:**

1. **Appreciations** (the table already exists) — show a heart/leaf count on each piece, with a list of who appreciated it
2. **Letters** (table exists) — allow readers to send private letters to authors about their work
3. **Reading circles** (tables exist) — let users form small groups to read and discuss together
4. **Pollination** (table exists) — a "cross-pollination" feature where the system pairs two writers to exchange feedback
5. **Marginalia** — public or private annotations on a piece (like Medium highlights)
6. **Follow/Grove connections** (tables exist) — let users follow each other and see a feed of new work from people they follow
7. **Seed packets** (table exists) — gift-like interactions where you can send an encouraging "seed" to another writer
8. **Weekly digest / "What's Blooming"** — a curated email or homepage section highlighting the best new work

**Severity:** Major — missing core engagement features

---

## 5. ACCESSIBILITY & THEME AUDIT

### 5.1 — Light mode is broken (see 1.3 above)

### 5.2 — Colour contrast (dark mode)

**Audit:** All text against WCAG 2.1 AA standards
- Minimum 4.5:1 for normal text
- Minimum 3.1:1 for large text

**Issue:** The muted grey text on the dark background may not pass contrast checks

**Severity:** Major — accessibility compliance issue

---

### 5.3 — Keyboard navigation

**Questions to audit:**
- Can every interactive element be reached via Tab?
- Are focus states visible?
- Can modals/dialogs be closed with Escape?

**Severity:** Major — accessibility requirement

---

### 5.4 — Screen reader compatibility

**Questions to audit:**
- Are all buttons/links labelled with `aria-label` where the visual label is an icon?
- Do form inputs have associated `<label>` elements?
- Are dynamic content changes (toast notifications, new list items) announced via `aria-live` regions?

**Severity:** Major — accessibility requirement

---

## 6. FULL SITE AUDIT CHECKLIST

Run through each of these systematically. For every item, record:
- What you tested
- Expected result
- Actual result
- Severity (critical/major/minor)
- Suggested fix

### Navigation & Routing

- [ ] Click every link on the homepage — does each go to the correct destination?
- [ ] Click the back arrow on every sub-page — does it go where expected?
- [ ] Test all nav bar links (logged in vs. logged out)
- [ ] Test direct URL access to `/editor-studio`, `/garden`, `/journal`, `/garden-walk` — are auth guards working?
- [ ] Test 404 handling — navigate to `/nonexistent-page`

### Authentication & Authorisation

- [ ] Can a non-editor access `/editor-studio`? (Should be blocked)
- [ ] Can a logged-out user access protected pages?
- [ ] Does login/logout work correctly?
- [ ] After login, are you redirected to the right page?

### Editor Studio — Every Tab

- [ ] **Overview:** Do the stats (New to Garden, Available for Editorial, etc.) show correct numbers? Are they clickable?
- [ ] **Garden Stream:** Does it load? Does it show writings?
- [ ] **Greenhouse:** Does it load? What does it show?
- [ ] **Requests:** Does it load? Can you see submission call responses?
- [ ] **Issues:** Does it load? Can you create/edit issues?
- [ ] **Flagged:** Does it load? Can you review/resolve flags?
- [ ] **Inbox:** Does it load? What notifications appear?
- [ ] **Threads:** Can you create a thread? Can you post messages in a thread? Do messages persist on refresh?
- [ ] **Garden Walk:** Does it show incoming submissions (not a submit form)? Can you leave feedback?
- [ ] **Tasks:** Can you create a task? Can you assign it to another editor? Does it appear in the list? Can you change its status? Can you delete it?

### The Garden (public)

- [ ] Does the garden page load without errors?
- [ ] Is each writing piece clearly presented (title, author, genre, excerpt)?
- [ ] Can you click into a piece and read it?
- [ ] Can you appreciate a piece? Does the count update?
- [ ] Can you send a letter to the author?
- [ ] Is there any way to filter, sort, or search?
- [ ] Is the layout responsive on mobile?

### The Journal (public)

- [ ] Does the journal only show editorially approved pieces?
- [ ] Or does it show everything from the garden? (BUG if yes)
- [ ] Is there an editorial approval workflow that gates journal publication?

### API Endpoints (test directly in browser or curl)

- [ ] `GET /api/garden-walk` — returns `[]` or submissions array, not an error
- [ ] `GET /api/editorial/threads` — returns threads, not an error
- [ ] `GET /api/editorial/tasks` — returns tasks, not an error
- [ ] `GET /api/editorial/flags` — returns flags, not an error
- [ ] `POST /api/editorial/threads` — creates a thread (test with valid body)
- [ ] `POST /api/editorial/tasks` — creates a task
- [ ] Check every `POST`/`PATCH`/`DELETE` endpoint for correct validation and error handling

### Visual / UX

- [ ] Toggle light/dark mode — does it work?
- [ ] Check text contrast in both modes
- [ ] Check responsiveness at 320px, 768px, 1024px, 1440px widths
- [ ] Check loading states — are there spinners/skeletons, or does content just pop in?
- [ ] Check empty states — do they show helpful messages and CTAs?
- [ ] Check error states — what happens if the API is down?

### Performance

- [ ] Run Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- [ ] Check for console errors on every page
- [ ] Check Network tab for failed API requests on every page

---

## 7. CRITICAL PRIORITIES

Focus on these first:

1. **Fix thread/task creation in the Editor Studio** (bugs 2.1, 2.2) — core functionality is broken
2. **Fix the Garden Walk tab** (bug 2.3) — should be a review queue, not a submission form
3. **Separate Garden publishing from Journal publishing** (bug 4.1) — the entire editorial vision depends on this
4. **Fix the light mode toggle** (bug 1.3) — accessibility issue
5. **Fix the misdirected "Drafts" link** (bug 1.1) — breaks core writer workflow

---

## 8. NOTES FOR DEVELOPER

- All database table names mentioned (e.g., `editorial_threads`, `editorial_tasks`, `garden_walk_submissions`, `writings`) are based on the existing schema
- For bugs related to API endpoints, check both frontend request payloads and backend validation/error handling
- For UX issues, consider the user journey: writers want to write and share; editors want to curate and collaborate; readers want to discover and engage
- The social features mentioned in section 4.3 are already in the database schema but not yet implemented in the UI

---

**End of report.**
