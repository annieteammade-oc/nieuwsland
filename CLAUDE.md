# CLAUDE.md - Nieuwsland.be v2 Redesign

## CRITICAL: Read these files first
1. `STYLEGUIDE.md` — Brand colors, typography, UI specs. FOLLOW THIS EXACTLY.
2. `REFERENCE-APP.tsx` — Reference React app showing the exact styling (colors, buttons, fonts, tags). Use this as visual reference for component styling.
3. Logo files are in `public/logo/` (color + white variants, SVG + PNG)

## Design System (from STYLEGUIDE.md)
- **Primary:** Deep Navy #1E3A8A, Action Orange #F97316
- **Neutrals:** Ink Black #0F172A, Slate Gray #64748B, Paper White #F8FAFC
- **Font:** Inter (Google Fonts) — Black 900 uppercase for headings, Light 300 italic for accents
- **Buttons:** rounded-full, slate-900 bg, hover scale-95, orange hover accents
- **Tags/Badges:** Pill shaped (rounded-full), blue-50 bg with blue-700 text, Sparkles icon
- **Animations:** hover scale 1.05, transition-all duration-300, active:scale-95

## Header (De Morgen style)
- **Top bar:** Current date centered above logo, small text
- **Logo:** Centered. Use `/logo/nieuwsland-white.svg` on dark bg, `/logo/nieuwsland-color.svg` on light bg
- **Right side:** Search icon (magnifying glass) + Hamburger menu icon (3 lines)
- **Category nav:** Full-width bar BELOW header with categories spread evenly: België, Wereld, Politiek, Economie, Sport, Tech, Cultuur, Wetenschap, Opinie
- Dark navy background (#1E3A8A) for header area

## Footer (HLN style)
- **Newsletter bar:** Dark navy bg, email input + "Aanmelden" button (orange), social media icons (X, Facebook, Instagram)
- **"Tip de redactie"** section with quote marks
- **4 columns:** 
  - Algemeen: Privacybeleid, Cookiebeleid, Gebruiksvoorwaarden, Vacatures, Adverteren, Partners
  - Service: Contact, FAQ, Klantenservice
  - Meer Nieuwsland: Facebook, Twitter/X, Instagram, Nieuwsbrieven
  - Lokaal Nieuws: Antwerpen, Gent, Brussel, Brugge, Leuven
- Light gray background for link section

## Homepage Layout (TOP TO BOTTOM)
1. **Breaking Banner** — Red banner if breaking news active
2. **Hero Section** — Large featured article with image overlay + 2 smaller articles beside it
3. **News Grid** — 3-column grid with article cards (image + category badge + title + excerpt + time)
4. **Video Shorts Section** — "Bekijk Video's" header, horizontal scroll row of video thumbnails with play button overlay (NYT style)
5. **More News Grid** — Mixed layout: large article left + stacked smaller articles right
6. **Meest Gelezen** — Numbered list (1-10) with small thumbnails, sidebar style but full-width section
7. **Regionaal Section** — DIFFERENT BACKGROUND (dark navy or contrasting color), regional news grid, "Populair op Regio" header
8. **Video Gallery** — Large featured video + 4 smaller video thumbnails beside it (HLN style)
9. **More News Grid** — Another mixed news section
10. **Games Section** — "Spelletjes" header, grid of game cards with retro 80's pixel art style icons. Games: Woordraadsel, Kruiswoord, Memory, Snake, Tetris, Quiz. Each card: retro icon + name + description + "Speel" button. Use pixelated/retro styling.
11. **Sidebar elements** woven throughout: "Net Binnen" (latest breaking), "Best Gelezen" (most read numbered list)

## Article Cards
- Image with category badge overlay (colored pill badge)
- Title (bold, Inter Black)
- Excerpt (2 lines max, slate-500)
- Time ago + source
- Hover: subtle shadow + scale 1.02

## Category Badges
Use STYLEGUIDE colors — pill shaped, each category gets a color:
- België: red-500
- Wereld: blue-600
- Politiek: purple-600
- Economie: green-600
- Sport: orange-500
- Tech: cyan-600
- Cultuur: pink-500
- Wetenschap: teal-600
- Opinie: amber-600
- Regionaal: emerald-600

## Pages
1. **Homepage** (`/`) — As described above
2. **Category page** (`/categorie/[slug]`) — Category header + filtered article grid
3. **Article page** (`/artikel/[slug]`) — Full article with related articles sidebar
4. **Search** (`/zoeken`) — Search bar + results grid

## Tech
- Next.js 15 App Router, TypeScript, Tailwind CSS
- Supabase for data (env vars in .env.local)
- Inter font from Google Fonts
- ISR with revalidate: 300
- ALL text in Dutch (Nederlands)
- Mobile responsive
- SEO meta tags + Open Graph

## Mock Data
Keep using mock data (src/lib/mock-data.ts) but expand it:
- At least 15-20 articles across all categories
- Include some with `is_featured: true`, `is_breaking: true`
- Include video items (with youtube_url or video_url field)
- Include regional articles

## Important
- Do NOT delete existing working code unnecessarily — update/enhance it
- npm run build MUST succeed
- After all changes, commit with message "v2: Full redesign with brand styling"
- Then push to origin main
- The Vercel deployment will auto-trigger on push
