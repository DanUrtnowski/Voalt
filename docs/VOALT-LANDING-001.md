# VOALT-LANDING-001 — static launch proof

Scope: static public-facing information site only; no sign-in, backend, storage, telemetry or user submissions. Does not replace or deploy Voalt-private.

## Cloudflare Pages settings
- Git repo: `DanUrtnowski/Voalt` (the *public showcase* repo, not Voalt-private).
- Framework: None.
- Production branch: `main` (only after PR passes independent QA and is merged).
- Root directory: repository root (default).
- Build command: `exit 0` (or blank if offered).
- Build output directory: `site`.
- Project name: `voalt-landing` (subject to availability).
- Custom domain: `voalt.co`, ONLY after Pages preview review and production deployment validation.

## Release gates
1. PR review: only static files in `site/`, no secrets, no network-dependent assets, no fake functionality.
2. Automated: validate links/paths/HTML, check mobile & desktop viewport, contrast, keyboard and reduced-motion.
3. Preview: verify hosted `*.pages.dev` loads over HTTPS, all assets status 200 and no console errors.
4. Freeze candidate by commit SHA; independent read-only QA; do not alter frozen artifact.
5. Merge approved commit; verify Pages deployment SHA matches; perform two independent read-only production smoke passes.
6. Connect `voalt.co` via Pages > Custom domains and verify apex SSL/DNS, canonical, favicon and robots.

This is an infrastructure smoke test, not a claim of a ready Voalt network. Never publish Voalt-private, pilot DB, authentication secrets or internal research data.
