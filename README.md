# Normand Karol Mendoza — Portfolio

An art-directed, static portfolio built with Next.js, React, TypeScript, GSAP ScrollTrigger, and Lenis. The pastel-blue design retains the transforming typographic hero, technical index, full-width project panels, résumé, and contact section. A personal music player adds warm ambient light only during successful playback. Typography is self-hosted; the page makes no external font requests.

## Development

Run commands from this repository's root (the local `portfolio` directory). Node 24 LTS is recommended.

```bash
npm ci
npm run dev
npm run typecheck
npm run test:music
npm run build
npm run verify:export
npm run preview
```

`npm run build` exports the website to `out/`. `npm run preview` serves that export at `http://127.0.0.1:3001/`. This local QA server is not needed in production. GitHub Pages serves HTML, CSS, JavaScript, fonts, and the CV directly.

`npm run format` formats the source. The lockfile pins dependency versions for reproducible installs.

## GitHub Pages

The workflow at `.github/workflows/deploy.yml` installs dependencies, typechecks, builds, verifies the exported assets and content, uploads `out/`, and deploys it. It runs on pushes to `main` and can be started manually in Actions.

In the repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The production branch is `main`. The default repository URL is `https://karlmendoo.github.io/portfolio/`.

The `configure-pages` action supplies the real deployment base path and URL. These become `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` at build time. Next's `basePath` prefixes generated JavaScript and CSS; `assetPath()` prefixes public files, including the CV and favicon. Hash navigation stays within the current deployment path. All repository and profile links are absolute GitHub URLs.

Deployment verification note (10 October 2026): the production push for the pastel/music refinement automatically started [the Pages workflow](https://github.com/karlmendoo/portfolio/actions/runs/37958858789), and both build and deployment succeeded. Automatic publication is now verified. Manual publication remains available through **Actions → Deploy portfolio to GitHub Pages → Run workflow → main**; both modes run the same checks.

### Test a repository subpath locally

PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/portfolio'
$env:NEXT_PUBLIC_SITE_URL = 'https://karlmendoo.github.io/portfolio'
npm run build
npm run verify:export
npm run preview
```

Open `http://127.0.0.1:3001/portfolio/`. Stop the preview before rebuilding it with a different base path.

For a root deployment, remove the base-path environment variable and set the desired canonical URL before building:

```powershell
Remove-Item Env:NEXT_PUBLIC_BASE_PATH -ErrorAction SilentlyContinue
$env:NEXT_PUBLIC_SITE_URL = 'https://your-domain.example'
npm run build
npm run verify:export
npm run preview
```

### Custom domain

Configure the real domain in **Settings → Pages → Custom domain**, follow GitHub's DNS instructions, and enable HTTPS. If retaining a domain file in source, put the actual hostname in `public/CNAME`. Do not put a placeholder domain there. The Pages action derives the correct root base path and canonical URL from the configured domain; no source rewrite is needed.

The existing `.openai/hosting.json` also retains compatibility with the original private Sites deployment. Build at the root with that Site's URL when publishing there. It does not change GitHub Pages settings.

## Original version and recovery

The pre-redesign portfolio is preserved at commit `804455e2a54bc8546967989a2351797f28620a25` in both:

- Branch `backup/pre-awwwards-redesign`
- Tag `pre-awwwards-redesign`

The version immediately before the pastel/music refinement is preserved at `fe6b1a6e052fdc67ffebab2bbd64a9912c309df5` in branch `backup/pre-music-redesign` and tag `pre-music-redesign`, locally and on GitHub. This retains the dark Awwwards design, local clock, and revised experience introduction. The new refinement is on `codex/pastel-music`; production uses its committed state on `main`. The earlier `redesign/awwwards` branch is retained.

To inspect or run the original without changing production:

```bash
git switch backup/pre-awwwards-redesign
npm ci
npm run dev
```

Return with `git switch main`. To inspect the pre-music version, use `git switch backup/pre-music-redesign`. To create a separate recovery checkout, use `git worktree add ../portfolio-original backup/pre-awwwards-redesign` when that branch is not already checked out. To restore a version to production without rewriting history, create a normal revert commit or a reviewed restoration commit on `main`, then run the Pages workflow. Do not delete preservation refs or force-push recovery changes.

## Music player

The featured listening note is **Wonderwall — Oasis**. The recording and album cover supplied by the user are included at the paths below. Playback starts only after an explicit Play action. If a media file is removed, the static build automatically restores the complete silent state or original artwork placeholder, without missing-file requests or a false playing state.

### Add authorized media

Place files you are authorized to publish at:

- `public/music/wonderwall.mp3`
- `public/music/wonderwall-cover.webp`

Then rebuild and deploy. `lib/music-assets.ts` checks file availability during the static build and passes the result to the client. It does not require a runtime server. Missing artwork uses the built-in placeholder; a cover that fails to decode also falls back. Actual playback remains available without a cover. Failed audio playback displays a quiet retry state and retains the blue atmosphere.

All URLs use `assetPath()` and work under `/portfolio/`, at the domain root, or with a custom domain. Audio uses `preload="none"` and never autoplays; the first explicit Play action fetches it. Artwork is lazy-loaded. Audio files can be large, so use a suitably compressed, browser-compatible format.

### How to change “what I’m feeling”

1. Edit `tracks` in `lib/music.ts`; keep every `id` unique.
2. Add the track title, artist, mood, audio path, cover path, and four curated mood colors.
3. Place the authorized media in `public/music/` and use paths beginning `/music/` in the configuration.
4. Set `featuredTrackId` to the new track's ID.
5. Rebuild, run the checks, and deploy.

Previous and Next controls enable automatically when there is more than one configured track. Switching during playback attempts to continue with the next track; switching while paused preserves the silent theme. Volume and mute survive track changes, while progress and duration reset.

### Playback and atmosphere

`MusicProvider` owns one stable native audio element outside the scroll sections. React context shares actual playback status, progress, duration, volume, and mute with the main player and navigation dock. Native `timeupdate` events update progress; no new RAF loop or AudioContext is used.

Mood activates on the media element's successful [`playing` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event), with checks for the current source, playback intent, paused/ended state, and available data. A pending or rejected [`play()` promise](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) cannot activate the mood. Pause, end, buffering, seeking while playing, error, and cancellation restore the default palette. Resuming actual playback reactivates the track palette. Selection, artwork visibility, hover, and scroll position never choose the global atmosphere.

`MoodController` blends the four ambient/detail CSS variables over 1.65 seconds, separately from ScrollTrigger choreography. It changes ambient lighting, the scroll progress line, cursor, and small player details. Body text, headings, and navigation colors remain stable. Fast play/pause changes overwrite only the mood tween, starting from its current colors. Reduced-motion mode uses a brief blend and static artwork/equalizer states, including when the preference changes during a transition.

Palettes are manually curated in `lib/music.ts`; automatic artwork color extraction is deliberately omitted. This keeps art direction predictable and avoids an extra dependency or image processing. The default CSS values in `app/globals.css` match `defaultMood` for a complete static first render.

After the first successful playback, scrolling away docks Play/Pause into the navigation. The mobile dock sits below the navigation and adjusts anchor clearance. It disappears while the mobile menu is open. Its visibility never affects playback or the mood.

Run `npm run test:music` for playback state/configuration checks, `npm run build` for typechecking and static export, and `npm run verify:export` for public assets, subpaths, retained content, metadata, and no-autoplay/custom-control checks. Real browser playback checks are recorded in `VERIFICATION.md`.

## Content provenance

The supplied `CV_Mendoza (2).pdf` provides personal information, education, organizational responsibilities, interpersonal skills, and the BayLayn 2024 workshop. The supplied experience screenshot adds current FlyRank AI, UST CSS, and Cisco committee roles and refines the CSS logistics dates. The original CV is copied unchanged to `public/normand-karol-mendoza-cv.pdf`.

The redesign brief explicitly supplies `https://github.com/karlmendoo` and Java, HTML, CSS, MongoDB, Docker, and Linux. The technical index uses the requested classifications. Communication, leadership, coordination, and adaptability remain present.

The user selected only these two public projects. Descriptions and project-specific technology labels were checked against their README and implementation on 9 October 2026:

- [McGPT](https://github.com/karlmendoo/mc-gpt): Java / Paper plugin integrating Google Gemini with chat triggers, commands, optional chat context, and cooldowns. Implementation includes `GeminiClient.java`, `AiCommand.java`, and `CooldownManager.java`.
- [SpotiCraft](https://github.com/karlmendoo/spoticraft): Java / Fabric mod using Google OAuth, the YouTube API, and LavaPlayer for in-game audio and playback controls. Implementation includes `YouTubeAuthManager.java`, `LavaPlayerAudioEngine.java`, and `build.gradle`.

Project art is abstract typography, not application screenshots. No repository statistics or unverified achievements are displayed. Newly supplied general skills are not automatically assigned to projects.

## Motion, accessibility, and performance

`components/motion.tsx` owns the Lenis instance and GSAP lifecycle. Lenis runs only on the GSAP ticker, forwards scrolling to ScrollTrigger, and uses native touch scrolling. All event listeners, timelines, triggers, and cursor tweens are cleaned up on unmount. Disclosure changes and font readiness refresh geometry.

The sticky name-to-statement hero transformation works across screen widths and input types, including native touch scrolling. Its typography scales for phones and tablets. Short landscape viewports (under 600px high), reduced-motion mode, and the unenhanced static page show the statement in normal flow instead of hiding it. Mobile retains its compact menu and has no custom cursor. Project parallax and the supplemental cursor remain desktop effects; reduced motion disables Lenis, cursor effects, parallax, and entrance animation.

The page retains semantic headings, native links and disclosures, visible keyboard focus, a skip link, Escape-closeable navigation, destination focus for anchors, and a live status for email copying. Static HTML keeps all core content and links available without JavaScript.

The footer includes a small “Made with 🩷 & Lenis” signature. Only Lenis links to its GitHub repository, with a new-tab announcement and safe external-link attributes. Hover or keyboard focus reveals an underline and nudges the arrow; the heart gently scales once. Reduced-motion mode keeps these details static. The existing footer name, copyright, and Back to Top layout are retained.

Latin font subsets limit font downloads. The split-text component adds no library, and no WebGL runtime, animation-frame loop, or continuous background animation is added. Static output verification checks deployment prefixes, referenced assets, anchor destinations, required facts, the CV, and exact GitHub URLs.

## Source map

- `lib/content.ts`: original experience, interpersonal skills, email, and GitHub profile.
- `lib/paths.ts`: deployment-aware public assets and metadata origin.
- `components/hero.tsx`, `technical-skills.tsx`, `projects.tsx`: primary visual sections.
- `components/experience.tsx`, `expertise.tsx`, `education.tsx`: preserved résumé content.
- `components/contact.tsx`: mail link, copy interaction, GitHub, and CV.
- `components/motion.tsx`: centralized animation and scrolling.
- `lib/music.ts`, `music-assets.ts`, `playback.ts`: track configuration, build-time media checks, and playback state.
- `components/music-provider.tsx`, `music-player.tsx`: audio engine, mood controller, player, and navigation dock.
- `app/music.css`: ambient lighting and music interface.
- `app/globals.css`: visual system and responsive/reduced-motion compositions.
- `scripts/verify-export.mjs`: production artifact checks.
- `scripts/serve-export.mjs`: local static preview.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Lenis integration](https://github.com/darkroomengineering/lenis), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
