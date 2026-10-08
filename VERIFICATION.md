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

Automatic push-triggered publication could not be verified: multiple Git pushes and a GitHub API commit did not create new Actions runs, despite the correct push event, active workflow, enabled Actions settings, and production default branch. Manual dispatch does start the workflow successfully. This is a remaining deployment limitation; no account-side cause was established.

The initial live deployment also passed HTTP checks for all ten directly referenced JavaScript/CSS/favicon/CV URLs. The downloaded production CV matched the original SHA-256 above. Live mobile navigation closed its menu, updated the hash, focused the work section, and showed no horizontal overflow or console errors. The desktop hero changed from the name composition to the systems/people statement during an actual wheel scroll.

The responsive enhancement lifecycle was tested after the final refinement: the desktop hero initializes at 180svh, and resizing to mobile removes the enhancement class and returns the hero to a normal 100svh layout.
