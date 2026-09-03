# Ursuline Academy (Dedham) — Brand & Design Guide (working copy)

This document stores the Ursuline Academy Dedham brand decisions so we can apply them consistently now and update them later.

## Identity anchors (confirmed)

- School: **Ursuline Academy**
- Abbreviation: **UA**
- Location: **Dedham, Massachusetts**
- School type: independent Catholic college-preparatory school for young women (grades **7–12**)
- Motto: **Serviam** (“**I will serve**”)
- Signature line: **Faith, Courage, & Joy**
- Mascot: **Bear** (Bears)
- Founding year to use for structured data: **1946**

## Color system (implementation approximations)

Official public color names: **Green** and **White**.

Implementation palette used in this repo (approximate digital values; not claimed as official Pantone):

| Token | HEX |
|---|---|
| UA Primary Green | `#356649` |
| UA Deep Evergreen | `#0D5C3D` |
| UA White | `#FFFFFF` |
| UA Lime Accent | `#91C83E` |
| UA Teal Accent | `#226C7D` |
| UA Navy Accent | `#222654` |
| UA Pale Sage | `#EFF5DF` |
| UA Warm Ivory | `#F7F4EC` |
| UA Charcoal | `#202522` |
| UA Soft Gray | `#E9ECEA` |

## Typography guidance (lightweight implementation)

Use:
- Display/editorial: **Cormorant Garamond** (fallback: Georgia)
- Body/interface: **Source Sans 3** (fallback: system sans)

## Voice & messaging (use on headings/buttons)

Tone: warm, confident, joyful, faith-rooted, academically serious, student-centered, service-oriented.

High-value words/phrases to prefer:
**Faith, courage, joy, Serviam, service, purpose, presence, compassion, confidence, curiosity, integrity, belonging, leadership, risk new things**.

## Wordmark safeguards

- Treat Ursuline artwork (crest/shield) as an asset.
- Do not “recreate” the wordmark by typing a matching font.
- Preserve contrast (white on deep evergreen; charcoal on pale backgrounds).

## CSS tokens used by the site

Defined in `app/globals.css`:
- `--ua-green`, `--ua-evergreen`, `--ua-white`
- `--ua-lime`, `--ua-teal`, `--ua-navy`, `--ua-sage`
- `--ua-ivory`, `--ua-charcoal`, `--ua-gray-100`

## Media folders

- Branded (sitewide): `public/media/branded/`
  - `ua-seal.png` — circular seal, **transparent** background
  - `campus-entrance.png`, `campus-students.png` — campus stock
  - `brett-hannan.png` — add Brett’s photo here (homepage shows **BH** initials until then)
- Per class (later): `public/media/classes/{slug}/`

## Class pages + temporary passcodes

Config: `app/lib/courses.ts`  
Routes: `/classes/{slug}/` with a simple passcode popup (`ClassGate`) stored in `sessionStorage`.

| Class | Slug | Temp passcode |
|---|---|---|
| AP CSP (B) | `ap-csp-b` | `CSPB` |
| AP CSP (F) | `ap-csp-f` | `CSPF` |
| Calculus H (D) | `calculus-h-d` | `CALCD` |
| Calculus H (E) | `calculus-h-e` | `CALCE` |
| AP CSA (H) | `ap-csa-h` | `CSAH` |
| Study Hall | `study-hall` | `SH4` |

Each class page has placeholders for **Google Classroom** and **syllabus** (fill URLs in `courses.ts`).

## Homepage actions (placeholders → Google later)

- Live help → Google Meet
- Schedule a meeting → Google Calendar booking
- Anonymous feedback → Google Form survey
- Suggest an academic trip → Google Form
- Suggest an industry expert → Google Form

## Content protection (best effort)

- `ContentGuard` + print CSS: block Ctrl/Cmd+P, soft right-click/select deterrents, blank print stylesheet
- **Honest limit:** iPad/OS screenshots cannot be fully blocked by any website

## Audience / UX notes

- Primary devices: **iPads** and **laptops**
- Tone: fun and relatable for Ursuline high school girls — not over-coded or over-engineered

## Where the brand is implemented right now

- `app/globals.css` — color tokens + print/select deterrents
- `app/layout.tsx` — fonts + `ContentGuard`
- `app/page.tsx` — homepage (Brett block, classes, suggestions, lesson links)
- `app/classes/[slug]/page.tsx` — gated class hubs
- `app/sample-lesson/page.tsx` — sample lesson hub

