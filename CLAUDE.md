# CLAUDE.md - Nieuwsland.be v3 Fixes

## Read first
- `STYLEGUIDE.md` — Brand colors, typography, UI specs
- `REFERENCE-APP.tsx` — Visual styling reference

## CRITICAL FIXES (v3)

### Header
- Logo needs fixing — check `public/logo/` for updated files. Logo should show "NIEUWS" in Black 900 uppercase + "land" in Light 300 italic orange, with the newspaper icon in a navy rounded square
- Make sure the logo renders correctly, no broken elements

### Section Titles — MORE SPECIFIC, not generic
- ❌ "Best Gelezen" → ✅ "Meest Gelezen"
- ❌ "Nieuws" → ✅ "Nieuws van Vandaag"
- ❌ "Video Gallery" → ✅ "Video Galerij"
- ❌ Multiple "Meer Nieuws" sections → ✅ Only ONE "Meer Nieuws". Other sections must be real categories:
  - "Sportnieuws"
  - "Actualiteit"  
  - "Tech News"
  - "Politiek Nieuws"
  - "Cultuur & Entertainment"

### Video Shorts Section
- Shorts must be PORTRAIT/VERTICAL format (9:16 ratio), NOT landscape or square
- Show tall vertical video thumbnails like TikTok/YouTube Shorts/Instagram Reels
- Aspect ratio: approximately 9:16 (e.g., 180px wide × 320px tall)
- Each thumbnail should have a play button overlay

### Videos Section
- Videos must be PLAYABLE on the homepage — click to play inline
- Options: lightbox/popup player OR inline play (NOT open in new tab/window)
- Use an iframe or HTML5 video player in a modal/lightbox on click
- Section title: "Video Galerij" (not "Video Gallery")

### Newsletter Section (above footer)
- Must be MUCH more prominent, BOLDER, more eye-catching and attractive
- Bigger text, stronger CTA, more visual impact
- Think full-width dark section with large heading

### "Tip de Redactie" Section
- Text: "Tip de redactie: heb je nieuws in jouw buurt? Mail ons via tips@nieuwsland.be"
- Add a BUTTON that opens a popup/modal form to submit a news tip
- Form fields: Naam, Email, Onderwerp, Bericht, optional file upload
- Also show the email address: tips@nieuwsland.be

### Social Media Icons
- Move social media icons to the FOOTER, not next to the newsletter
- Footer should have social icons row (Facebook, X/Twitter, Instagram, LinkedIn, TikTok)

### Footer Structure
- Newsletter bar (full-width, bold, prominent) — email input + "Aanmelden" button
- Then: "Tip de redactie" section with button
- Then: Footer columns with links
- Social media icons in footer area (not in newsletter section)

## Existing specs (keep from v2)
- Brand: Deep Navy #1E3A8A, Action Orange #F97316, Inter font
- Header: De Morgen style with centered logo, date, search+hamburger, category nav
- All text in Dutch
- Mobile responsive
- Mock data with 20+ articles

## After changes
1. Run `npm run build` — must succeed
2. Git commit with message "v3: Fix header, sections, shorts, videos, newsletter, footer"
3. Git push origin main
