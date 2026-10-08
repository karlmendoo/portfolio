# Normand Karol Mendoza — Personal Portfolio

A complete editorial portfolio built with Next.js, React, TypeScript, custom CSS, GSAP ScrollTrigger, and Lenis. All typography is self-hosted. There are no trackers, forms, WebGL resources, or external font requests.

## Run locally

Use Node.js 20.9 or newer (Node 24 LTS recommended).

```bash
cd portfolio
npm install
npm run dev
```

Open the Local URL printed in the terminal. From this project directory:

```bash
npm run typecheck
npm run build
```

`npm run build` produces the complete static website in `out/`. Serve `out/` with any static web server. `npm start` is not used for a static export. The normal development workflow remains `npm run dev`.

## Content and sources

The supplied two-page `CV_Mendoza (2).pdf` is the source for the full name, location, email, degree and school information, organizational responsibilities, interpersonal skills, and BayLayn 2024 workshop. The supplied LinkedIn experience screenshot provides the FlyRank AI internship, CSS Executive Associate role, Cisco Environmental Committee role, and more precise CSS logistics dates. Month ranges are shown directly; relative LinkedIn durations are intentionally omitted.

The CV does not list projects, programming languages, frameworks, technical tool proficiency, social URLs, awards, or certifications. These are omitted rather than invented. The workshop is correctly presented as a seminar/workshop. This website's implementation stack is not presented as the owner's technical skill set. The phone number is not displayed on the page; the downloadable original CV retains its supplied contact details.

- `lib/content.ts`: experience, expertise, email.
- `components/hero.tsx` and `app/page.tsx`: positioning and about copy.
- `components/education.tsx`: education and workshop.
- `components/contact.tsx`: email link and accessible copy interaction.
- `app/globals.css`: palette, typography, responsive compositions, focus and reduced-motion styling.
- `components/motion.tsx`: centralized motion, anchor scrolling and active navigation.
- `public/normand-karol-mendoza-cv.pdf`: original downloadable CV.
- `app/layout.tsx`: SEO, canonical URL, Open Graph and social metadata. Update the origin when hosting elsewhere.

## Motion and accessibility

Lenis uses the GSAP ticker as its only animation clock, calls `ScrollTrigger.update` on scroll, and is destroyed along with its listeners on cleanup. Native touch scrolling remains enabled. Accordions trigger a geometry refresh. Font readiness and browser resizing refresh scroll positions. GSAP matchMedia reverts animations when reduced motion is requested; Lenis is disabled in that state. All content is readable without animation or JavaScript.

The desktop timeline rail is sticky, while mobile uses a sequential composition. Keyboard-accessible native disclosure elements reveal expertise details. Hash links update browser history and move keyboard focus to the destination. Navigation includes a skip link, visible focus styles, active section indicators, and an Escape-closeable mobile menu. Email copying reports success or failure through a live status region.

## Design

Deep forest green, warm white, and muted gold connect every section. Oversized DM Sans typography pairs with Instrument Serif italics. Motion varies by purpose: masked hero lines, a horizontal about reveal, timeline progression, sideways experience entries, a scroll-linked type ribbon, and a clipped contact reveal. No fabricated screenshots or stock project media are used.

## Hosting

The Sites manifest in `.openai/hosting.json` declares `out` as the public static directory. The published Site is private by default. Source and build artifacts are retained locally and can also be hosted on another static provider.

Reference documentation: [Lenis integration](https://github.com/darkroomengineering/lenis), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).
