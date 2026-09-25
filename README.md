# JV Salvaia Personal Trainer

Landing page for **João Victor Salvaia**, a personal trainer based in Jundiaí - SP,
specialised in hypertrophy, biomechanics, in-person training, online consulting
and physical assessment.

The site is a fully static single-page application intended to be published on
Netlify.

- Production: https://jvsalvaiapersonal.netlify.app
- Repository: https://github.com/Everton-Lopes/jvsalvaia-personaltrainer

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4

## Requirements

- Node.js 20+

## Development

1. Install dependencies:

   `npm install`

2. Start the development server:

   `npm run dev`

3. Open the local URL printed by Vite (default: http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run the TypeScript type check (`tsc --noEmit`). |
| `npm run clean` | Remove the `dist/` output directory. |

## Deployment (Netlify)

Netlify builds the static site directly from this repository.

- Build command: `npm run build`
- Publish directory: `dist`

The intended production branch is `main`. No backend, server or runtime
environment is required: the deployed artifact is a pure static site.

## Environment variables

All variables are optional. The site works correctly while they are empty: no
broken UI and no errors. Copy `.env.example` to `.env` locally, or set the values
in Netlify's dashboard. `.env` and `.env.*` are gitignored; only `.env.example`
is committed.

| Variable | Purpose |
| --- | --- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID. Loads gtag only after analytics consent. |
| `VITE_GTM_ID` | Google Tag Manager container ID. Loads GTM only after analytics consent. |
| `VITE_META_PIXEL_ID` | Meta (Facebook) Pixel ID. Loads fbq only after marketing consent. |
| `VITE_GOOGLE_PLACE_ID` | Google Place ID. Adds the business to the LocalBusiness JSON-LD `sameAs`. |
| `VITE_GOOGLE_BUSINESS_PROFILE_ID` | Google Business Profile CID/ID. Adds the profile to the LocalBusiness JSON-LD `sameAs`. |

## Notes

- Tracking tags (GA4, GTM, Meta Pixel) are only injected after explicit LGPD
  consent, controlled by the cookie banner.
- LocalBusiness structured data is injected only when at least one Google ID is
  configured.
