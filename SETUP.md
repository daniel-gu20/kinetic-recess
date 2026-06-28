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

## Content → CMS (currently local, ready to migrate)

Pages render from `src/data/site.ts` so the site works immediately. To move to the
Wix CMS (per spec), create these collections in the dashboard (CMS → Collections) and
swap the imports for `@wix/data` queries:

| Collection          | Fields |
|---------------------|--------|
| `Session`           | gameName, dayOfWeek, startTime, park, neighborhood, sessionType, spotsLeft (number), difficulty, price, blurb, image |
| `CommunityNight`    | gameName, date, park, funder, spotsLeft (number), blurb |
| `Review`            | name, quote, detail |
| `StoryBlock`        | heading, body |
| `CorporateInquiries`| contactName, companyName, email, teamSize, preferredDates, gamePreference, notes, status |

### Corporate booking form

`src/pages/api/corporate-inquiry.ts` inserts into the **`CorporateInquiries`** collection
using `auth.elevate()` (so anonymous visitors can submit). Until that collection exists the
endpoint returns 500 and the form still shows the success state. Once the collection is
created in the dashboard, submissions persist automatically — no code change needed.

## Images

`public/images/*.png` are the floodlit playground photos generated during design. For best
Lighthouse scores, convert them to AVIF/WebP and add responsive `srcset` (spec target:
LCP < 2.5s). The hero uses `fetchpriority="high"`.

## SEO

Per-page JSON-LD is injected via the `jsonLd` prop on `Layout`:
SportsActivityLocation (home, parks), SportsEvent (schedule), Service (corporate),
FAQPage (about).
