# Kinetic Recess — build notes

Cinematic "After Dark Athletics" site for an adult playground-recess league in Toronto.
Astro + React islands on Wix Headless, Tailwind v4.

## Run

```bash
npm run dev       # local dev at http://localhost:4321
npx wix build     # production build
npx wix release   # deploy → prints the live *.wix-site-host.com URL
```

## Structure

```
src/
  data/site.ts            ← all content (sessions, community nights, reviews, FAQ, parks, story)
  styles/global.css       ← Tailwind v4 @theme: palette, fonts, scrims, chalk utilities
  layouts/Layout.astro    ← <head>, fonts, SEO + JSON-LD, header/footer/sticky-bar
  components/             ← Header, Footer, MobileStickyBar, SessionCard, ChalkDivider
  pages/                  ← index, sessions, schedule, community, corporate, about, parks
  pages/api/corporate-inquiry.ts  ← POST endpoint for the booking form (@wix/data)
public/images/            ← self-hosted playground photography (from Stitch generations)
```

## Design system

- **Fonts:** Anton (display, all-caps), Archivo Narrow (body/UI), Caveat (chalk accent).
- **Palette:** midnight navy `#11192e` (primary), warm chalk-paper `#fdf9ea` (background),
  high-vis chalk yellow `#ffe74c` (secondary/CTA), near-black footer.
- Sharp corners, photography-first, navy scrims for text legibility over images.
- `prefers-reduced-motion` snaps chalk-draw animations to their final state.

## CMS collections

Form submissions persist to two Wix CMS collections (created via the Data SDK,
visible in the dashboard under CMS → Collections):

| Collection           | Fields |
|----------------------|--------|
| `Reservations`       | name, email, sessionName, sessionDay, sessionTime, park, partySize, type, status |
| `CorporateInquiries` | contactName, companyName, email, teamSize, preferredDates, gamePreference, notes, status |

- `src/pages/api/reservation.ts` → inserts into `Reservations` (the "Grab a spot" / "Save my spot" modal).
- `src/pages/api/corporate-inquiry.ts` → inserts into `CorporateInquiries`.
- Both use `auth.elevate()` so anonymous visitors can write while the collections stay private.

**Display content** (sessions, community nights, reviews, FAQ, parks, story) still renders
from `src/data/site.ts`. To make it editable in the CMS, create matching collections
(`Session`, `CommunityNight`, `Review`, `StoryBlock`) and swap the imports for `@wix/data` queries.

### Emails (Wix Automations — no code)

Submissions are captured but don't email yet. In the dashboard → **Automations → New**:

1. **Confirmation:** Trigger = *Wix CMS → item created* in `Reservations` → Action = *Send email*
   to the item's `email` field. Repeat for `CorporateInquiries`.
2. **Team notification:** same trigger → *Send email notification* to your team inbox.

No API keys needed; deliverability is handled by Wix.

## Images

`public/images/*.webp` are the floodlit playground photos (resized + compressed from the
original PNGs, ~9.5MB → ~450KB total). The hero uses `fetchpriority="high"`; cards lazy-load.

## SEO

Per-page JSON-LD is injected via the `jsonLd` prop on `Layout`:
SportsActivityLocation (home, parks), SportsEvent (schedule), Service (corporate),
FAQPage (about).
