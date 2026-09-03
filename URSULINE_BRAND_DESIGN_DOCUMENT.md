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

## Temporary class-button schedule (current placeholder)

These are temporary buttons on:
- `app/page.tsx` (homepage)
- `app/sample-lesson/page.tsx` (full hub + placeholders for later per-course pages)

Schedule to include:
1. Study Hall — **Day 4 (AH)**
2. AP CSP — **Rm A207**
3. Calculus — **Rm 118**
4. Calculus H — **Rm 118**
5. AP CSP A — **Rm 118**

## Where the brand is implemented right now

- `app/globals.css` — color tokens + small UA utility styles
- `app/layout.tsx` — font stack updates
- `app/page.tsx` — improved homepage hero + navigation + course buttons
- `app/sample-lesson/page.tsx` — “Sample lesson” hub with course placeholders

