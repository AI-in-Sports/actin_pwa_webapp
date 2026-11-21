# Changelog

All notable changes to this project are listed here.

## [0.2.1] - 2026-11-20

- Serve the member app as a SPA (`ssr: false`). The auth store is persisted in
  localStorage by a client-only plugin, so a server render of `/home` ran the
  auth middleware without a token and failed with
  `TypeError: this.$persist is not a function` (HTTP 500).
- Guard the home report fetch so a failed `/report/get/latest` leaves the page
  empty instead of throwing.

## [0.2.0] - 2026-11-20

- Nuxt 4: app code moved to `app/`, the shared layer is `@ai-in-sports/actin-pwa-layer` 2.0.2.
- Tailwind CSS 4 through the layer's CSS-first theme; the local `tailwind.config.js` is gone.
- `jalaali-js` 2 (named/namespace imports only) and Pinia 4 with
  `pinia-plugin-persistedstate` 4.
- Production image: `.github/workflows/docker-publish.yml` builds and pushes it on every
  merge to `main`; `docker_compose.prod.yml` pulls the published image.
- Fix the Docker build running out of memory by raising the Node heap, and lower the
  build's memory use by moving the design system into the layer.

## [0.1.0] - 2026-11-13

- Add CI and take the registry token out of .npmrc ([#2](https://github.com/AI-in-Sports/actin_pwa_webapp/pull/2))
- Let pilot users claim mirror results on the scan page ([#1](https://github.com/AI-in-Sports/actin_pwa_webapp/pull/1))
