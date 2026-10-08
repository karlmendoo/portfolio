# Normand Karol Mendoza — Portfolio

An art-directed, static portfolio built with Next.js, React, TypeScript, GSAP ScrollTrigger, and Lenis. The design uses a transforming typographic hero, a technical index, full-width project panels, and an accessible résumé and contact section. Typography is self-hosted; the page makes no external font requests.

## Development

Run commands from this repository's root (the local `portfolio` directory). Node 24 LTS is recommended.

```bash
npm ci
npm run dev
npm run typecheck
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

The new design is on `redesign/awwwards`; production uses its committed state on `main`. To inspect or run the original without changing production:

```bash
git switch backup/pre-awwwards-redesign
npm ci
npm run dev
```

Return with `git switch redesign/awwwards`. To create a separate recovery checkout, use `git worktree add ../portfolio-original backup/pre-awwwards-redesign` when that branch is not already checked out. The backup retains all original source, configuration, fonts, and CV. Do not delete these preservation refs.

## Content provenance

The supplied `CV_Mendoza (2).pdf` provides personal information, education, organizational responsibilities, interpersonal skills, and the BayLayn 2024 workshop. The supplied experience screenshot adds current FlyRank AI, UST CSS, and Cisco committee roles and refines the CSS logistics dates. The original CV is copied unchanged to `public/normand-karol-mendoza-cv.pdf`.

The redesign brief explicitly supplies `https://github.com/karlmendoo` and Java, HTML, CSS, MongoDB, Docker, and Linux. The technical index uses the requested classifications. Communication, leadership, coordination, and adaptability remain present.

The user selected only these two public projects. Descriptions and project-specific technology labels were checked against their README and implementation on 9 October 2026:

- [McGPT](https://github.com/karlmendoo/mc-gpt): Java / Paper plugin integrating Google Gemini with chat triggers, commands, optional chat context, and cooldowns. Implementation includes `GeminiClient.java`, `AiCommand.java`, and `CooldownManager.java`.
- [SpotiCraft](https://github.com/karlmendoo/spoticraft): Java / Fabric mod using Google OAuth, the YouTube API, and LavaPlayer for in-game audio and playback controls. Implementation includes `YouTubeAuthManager.java`, `LavaPlayerAudioEngine.java`, and `build.gradle`.

Project art is abstract typography, not application screenshots. No repository statistics or unverified achievements are displayed. Newly supplied general skills are not automatically assigned to projects.

## Motion, accessibility, and performance

`components/motion.tsx` owns the Lenis instance and GSAP lifecycle. Lenis runs only on the GSAP ticker, forwards scrolling to ScrollTrigger, and uses native touch scrolling. All event listeners, timelines, triggers, and cursor tweens are cleaned up on unmount. Disclosure changes and font readiness refresh geometry.

Desktop motion includes a sticky hero transformation, differently paced typographic and grid layers in the project art, and section-specific reveals. Mobile uses a sequential composition, a compact menu, and no cursor or pinned hero. Reduced motion disables Lenis, cursor effects, parallax, and entrance animation. The desktop cursor supplements the native pointer and never intercepts input.

The page retains semantic headings, native links and disclosures, visible keyboard focus, a skip link, Escape-closeable navigation, destination focus for anchors, and a live status for email copying. Static HTML keeps all core content and links available without JavaScript.

Latin font subsets limit font downloads. The split-text component adds no library, and no WebGL runtime, animation-frame loop, or continuous background animation is added. Static output verification checks deployment prefixes, referenced assets, anchor destinations, required facts, the CV, and exact GitHub URLs.

## Source map

- `lib/content.ts`: original experience, interpersonal skills, email, and GitHub profile.
- `lib/paths.ts`: deployment-aware public assets and metadata origin.
- `components/hero.tsx`, `technical-skills.tsx`, `projects.tsx`: primary visual sections.
- `components/experience.tsx`, `expertise.tsx`, `education.tsx`: preserved résumé content.
- `components/contact.tsx`: mail link, copy interaction, GitHub, and CV.
- `components/motion.tsx`: centralized animation and scrolling.
- `app/globals.css`: visual system and responsive/reduced-motion compositions.
- `scripts/verify-export.mjs`: production artifact checks.
- `scripts/serve-export.mjs`: local static preview.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Lenis integration](https://github.com/darkroomengineering/lenis), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
