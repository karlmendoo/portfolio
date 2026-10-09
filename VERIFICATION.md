# Redesign verification — 9 October 2026

## Preservation and content

- Original branch `backup/pre-awwwards-redesign` and tag `pre-awwwards-redesign` both retain `804455e2a54bc8546967989a2351797f28620a25`. Both refs are also pushed to GitHub.
- The original experience and interpersonal-skill arrays are unchanged. Their only content-file addition is the exact GitHub profile supplied by the user.
- Original CV and shipped CV have identical SHA-256: `6bd5a43e07e0521c7f39114aaad58fb946b671510394ede62dc4ebb6a5949bc4`.
- Java, HTML, CSS, MongoDB, Docker, and Linux appear in the requested technical categories. No percentages, years, or proficiency levels were added.
- Only the user-selected McGPT and SpotiCraft are featured. Their descriptions and project-specific technologies are based on the public repository source and README.

## Local production artifacts

`npm run typecheck`, `npm run build`, and `npm run verify:export` pass. The static export was built and served at both `/` and `/portfolio/`. Verification checks referenced JavaScript, CSS, fonts, favicon, CV, canonical URL, exact GitHub URLs, anchor destinations, and required content.

Browser checks on the exported site covered widths 1920, 1440, 1280, 1024, 900, 768, 430, 390, and 375 pixels. No horizontal overflow or clipped headings were found. Mobile hero, project art, project descriptions, and contact layout were visually inspected. The 900px tablet fallback uses a sequential hero and hides the cursor.

Interaction checks passed for destination focus and hash updates, the keyboard skip link, mobile menu expansion and Escape closing, native disclosure with Enter, email copying and live success status, and an actual CV download. Fonts loaded locally. Console error/warning checks were clean.

The reduced-motion media branches and CSS fallbacks were reviewed. The connected browser does not expose system-preference emulation, so a native OS reduced-motion rendering test was not available. No-JavaScript HTML contains the complete core content and links; the cinematic hero is enabled only after its enhancement initializes. Performance is not presented as a measured 60fps guarantee.

## GitHub Pages

The initial Actions deployment succeeded on commit `36879fcefbd392281438bfbf10d6d1206dcfa14b`: https://github.com/karlmendoo/portfolio/actions/runs/37844923544

It passed Linux dependency installation, typechecking, static export, artifact verification, upload, and Pages deployment. The live URL returned HTTP 200. The browser confirmed the correct title, canonical URL, fonts, CV prefix, and exact profile/project URLs at `https://karlmendoo.github.io/portfolio/`.

The workflow is configured for pushes to `main` and supports manual dispatch. The final production push retains the same tests and includes the progressive-enhancement fallback refinement. HTTPS is enforced. The `karlmendoo.github.io` repository was not modified.

On 9 October, automatic push-triggered publication could not be verified: multiple Git pushes and a GitHub API commit did not create new Actions runs, despite the correct push event, active workflow, enabled Actions settings, and production default branch. Manual dispatch did start the workflow successfully; no account-side cause was established. The 10 October production push subsequently triggered a successful automatic deployment, as recorded below.

The initial live deployment also passed HTTP checks for all ten directly referenced JavaScript/CSS/favicon/CV URLs. The downloaded production CV matched the original SHA-256 above. Live mobile navigation closed its menu, updated the hash, focused the work section, and showed no horizontal overflow or console errors. The desktop hero changed from the name composition to the systems/people statement during an actual wheel scroll.

The responsive enhancement lifecycle was tested after the final refinement: the desktop hero initializes at 180svh, and resizing to mobile removes the enhancement class and returns the hero to a normal 100svh layout.

## Local clock update

The hero caption now reads `COMPUTER SCIENCE · DATA SCIENCE`. Its topline uses a client-side clock in place of `PERSONAL FIELD NOTES`. `Intl.DateTimeFormat` uses the visitor's browser timezone, with seconds updated every second and the interval cleared on unmount. A consistent initial placeholder prevents static-render hydration mismatches, and the clock has `aria-live="off"` to avoid repeated screen-reader announcements.

Typechecking, the production build, and `/portfolio/` export verification pass. The exported site showed the clock advancing in the browser's Asia/Manila timezone with no console warnings or errors. Desktop and 320px mobile layouts were checked; the narrow layout keeps the clock and volume label on one line without horizontal overflow.

## Pastel-blue and music refinement — 10 October 2026

Before changes, the clean working version at `fe6b1a6e052fdc67ffebab2bbd64a9912c309df5` was preserved in branch `backup/pre-music-redesign` and tag `pre-music-redesign`, locally and on GitHub. Both original Awwwards preservation refs remain at `804455e2a54bc8546967989a2351797f28620a25`. Work is on `codex/pastel-music`.

Core content, projects, technical skills, résumé sections, hero composition, local clock, and recent experience copy are unchanged. The CV SHA-256 still matches the original. Navigation gains Listening; contact becomes section 08. The motion module's only refinement is adding the artwork and controls to its existing row-reveal choreography. Dependencies and Next configuration are unchanged.

The palette uses centralized navy text and pastel-blue surfaces, layered fixed lighting, subtle grain, and coordinated project art. Representative contrast checks measured 12.89:1 for primary text on the blue base, 4.81:1 for secondary text on the darker default ambient blue, and 5.03:1 for blue accent text on the soft blue surface. The changing warm detail color is used for graphical/player accents rather than body text.

### Playback verification

No Oasis recording or official cover was acquired. Local browser QA used a temporary 60-second silent PCM fixture, a second silent test track, and intentionally invalid media/artwork. These fixtures and the temporary playlist entry were removed before the production export; `public/music/` and the final `out/music/` contain only `.gitkeep`.

The actual exported app passed these checks:

- Initial track selection and visible player kept the default blue mood; no autoplay occurred.
- Play activated the mood through successful native `playing` events, and the four variables reached the configured Wonderwall palette.
- Pause returned all four variables to their default blue values and preserved progress. Resume continued from about 29 seconds rather than restarting.
- Music continued after navigating to About, with exactly one audio element. The navigation dock paused it and returned the global atmosphere to blue.
- Keyboard volume, mute/unmute, zero-volume recovery, and seek controls worked. Active seeking resumed through `playing`, not through selection or a seek-completion assumption.
- Seeking to 58 seconds and resuming produced a natural `ended` event at 60 seconds, with the blue palette fully restored.
- Invalid media kept the default mood and a stable retry message. Restoring the fixture and retrying recovered successful playback without reloading the page.
- Paused Previous/Next selection stayed blue. Switching during playback continued with the next source and its actual mood. Volume and mute were preserved.
- Invalid artwork fell back to the original abstract listening-note design with no broken-image icon.

Selection/hover/scroll do not have any path to ambient theme mutation; only playback state drives the controller. Buffering and cancellation transitions are covered by the playback-state checks and reviewed native event handlers. Browser-generated buffering was not forced on the fully local fixture.

The local static server now supports byte ranges; an audio request for bytes 0–43 returned HTTP 206 with 44 bytes. This fixed a local-preview seeking limitation. GitHub Pages supplies production static-file serving.

### Responsive, accessibility, and export checks

The production export was checked at 1920, 1280, 768, 390, and 320px viewport widths; all reported equal document and viewport widths. The player remained within its content column. Desktop playback and the 390px mobile player were visually inspected. The active/paused dock was also checked at 900px: all navigation elements fit without overflow. Mobile moves the dock below the header and adds anchor clearance, keeping it out of portfolio text. The mobile menu closes after navigation. Resizing to mobile removes desktop hero enhancement and the cursor.

Playback, pause, seek, volume, and navigation were exercised with keyboard input. Focus outlines remained visible. Time changes are not live-announced; playback status uses a separate polite status region. Controls use semantic buttons and range inputs with track-specific labels. Previous/Next are disabled with the single production track. The production missing-audio state keeps Play disabled, makes no absent-media request, shows metadata and the artwork placeholder, and stays blue.

Reduced-motion CSS and the theme controller's media-query listener were reviewed: equalizer/artwork animation stops, the mood blend is brief, and preference changes cancel the active mood tween. The connected browser cannot emulate the system preference, so a native reduced-motion rendering test was not available.

Typechecking, `npm run test:music`, production builds, and static-export checks passed. Root-domain and `/portfolio/` exports were verified; the final export uses the real GitHub Pages URL. Checks include all referenced assets, retained facts, anchors, canonical URL, CV, music metadata, no autoplay, custom controls, and matching static/default mood colors. The final silent export has no console warnings or errors. No additional dependency, AudioContext, WebGL workload, or RAF loop was introduced.

### Published verification

The production push at `1bfcbf1d210f182615885cb5c22d6edf960f732e` automatically triggered [Actions run 37958858789](https://github.com/karlmendoo/portfolio/actions/runs/37958858789). Build and deployment completed successfully, including playback-state checks. The live page and CV returned HTTP 200, and the production CV SHA-256 still matched the original.

The browser confirmed Listening navigation, Wonderwall/Oasis metadata, custom placeholder artwork, disabled playback without an audio file, exactly one audio element with no missing-media source, and the default blue mood. The published page had no horizontal overflow at its normal viewport and no console warnings or errors. A production screenshot was saved for delivery.

## Supplied media and footer signature — 10 October 2026

The user's `wonderwall.mp3` and `wonderwall-cover.webp` were copied unchanged into `public/music/`. SHA-256 checks matched both source files to the repository copies. The static build detected both assets; the export references them through `/portfolio/music/`.

Actual browser playback of the supplied MP3 loaded a duration of 4:18, advanced progress, and activated the Wonderwall palette only after successful playback. Pausing preserved progress and returned the global mood to default blue. The album cover loaded through the existing artwork component. The local audio byte-range request returned HTTP 206 and the cover returned HTTP 200 with `image/webp`.

The existing footer now includes “Made with 🩷 & Lenis” below its copyright. Only Lenis is linked; its exact repository URL, `_blank` target, `noopener noreferrer`, and new-tab accessible label were checked. Keyboard Tab reached the link with a visible focus outline. CSS supplies a single gentle heart scale and short underline/arrow transitions; reduced-motion rules disable animation and arrow movement. Native reduced-motion emulation remains unavailable in the connected browser.

The footer was visually checked at 1280, 768, 390, and 320px viewport widths. All reported equal document and viewport widths, the signature stayed on one line, and the smallest mobile layout kept credits and Back to Top on the same row. The footer signature occupies about 15px of line height. No footer redesign or additional JavaScript was introduced.

The playback-state checks, production build/typecheck, and `/portfolio/` static-export verification passed with 22 referenced assets. Browser console warnings and errors were empty. Existing recovery branches and tags were retained.

## Hero statement across devices — 10 October 2026

The statement had been hidden by mobile and reduced-motion CSS, while its only reveal timeline required a viewport at least 1000px wide with hover and a fine pointer. The hero now has an independent `motion-hero` enhancement for viewports at least 600px high with no reduced-motion preference, without a width or pointer restriction. Desktop cursor and project parallax retain their separate device conditions.

The base layout displays the statement in normal flow, so reduced-motion mode, short landscape viewports, and the unenhanced static page retain the content. The enhanced layout overlays it during the name-to-statement scroll transition. Mobile typography scales to fit narrow screens; stable viewport units size the sticky stage.

Browser QA on the actual `/portfolio/` static export confirmed the visible scroll reveal at 390px mobile width, its readable layout at 320px and 768px, and the retained desktop transition at 1280px. Resizing to an 844×390 landscape viewport removed the enhancement and its inline animation styles, leaving the statement visible in normal flow. Document and viewport widths matched throughout. Actual touch hardware and system reduced-motion emulation were unavailable; the pointer-independent query, native-touch Lenis configuration, and reduced-motion/static CSS fallback were reviewed directly.

The production build/typecheck and export checks passed with 22 referenced assets. Hero copy, media files, player, footer signature, and portfolio content were preserved.
