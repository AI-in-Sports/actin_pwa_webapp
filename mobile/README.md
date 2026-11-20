# Actin member app (iOS and Android)

The consumer app from the roadmap, built with Tauri v2 mobile. The UI is a Nuxt 4
single-page app (`ssr: false`) on the shared design system in
`@ai-in-sports/actin-pwa-layer` (tokens, `Ds*` components, fonts) and its app-core
(auth store, OTP login). It talks to `actin_pwa_backend` over HTTPS. Desktop builds
exist only for development.

It lives next to the web app, which keeps working unchanged; when the app ships it
replaces the web app's scan (linking) page.

## What a member can do

- **Sign in** with phone and SMS code (the same accounts as the web app, `client=pwa`).
- **Claim a mirror result.** Scan the QR code on the mirror with the phone camera, or
  type the number under it. The app shows the center and tests, then adds the result
  to the account. Centers that only accept their own members send other claims to
  the admin console, and the app says so.
- **See results.** The newest body composition, heart rate and posture result, the
  weight change since the last test, every result by test, and each result's history
  (created by the mirror, re-measured, claimed, corrected by a specialist with the reason).
- **Choose what each center sees.** Per center: which tests, and whether the assigned
  specialists and/or the center admins see them. Stop sharing with one tap. Every
  choice is a new consent record on the server. Categories added later (such as
  `wearables`) are kept when the member changes the mirror toggles.

Backend routes used: `GET /otp/send`, `POST /auth/login`, `GET /auth/info`,
`GET /mirror/v1/link/sessions/:ref`, `POST /mirror/v1/link/sessions/:ref/claim`,
`GET /care/v1/me/measurements[?type=]`, `GET /care/v1/me/measurements/:id/history`,
`GET /care/v1/me/centers`, `PUT|DELETE /care/v1/me/centers/:id/consent`.

## Run it

Prerequisites: Node 22.21+ or 24.11+, pnpm 10, Rust 1.77+. For Android: Android Studio with the SDK and
NDK, `ANDROID_HOME` and `NDK_HOME` set, and `rustup target add aarch64-linux-android
armv7-linux-androideabi i686-linux-android x86_64-linux-android`. For iOS: a Mac with
Xcode and `rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios`.
`@ai-in-sports/actin-pwa-layer` is installed from GitHub Packages, so `NPM_ACTIN_TOKEN`
must be set during install (see the dashboard README).

```bash
pnpm install
pnpm dev                 # UI only, in a browser at http://localhost:3000 (type the mirror code)
pnpm test                # unit tests for utils/app.ts
pnpm typecheck

pnpm android:init        # once: generates src-tauri/gen/android (commit it)
pnpm android:dev         # on a device or emulator, against APP_BACKEND
pnpm android:build       # signed APK/AAB once signing is configured

pnpm ios:init            # once, on a Mac: generates src-tauri/gen/apple (commit it)
pnpm ios:dev
pnpm ios:build
```

`APP_BACKEND` (default `https://api.actinhealth.ir`) is baked in at build time. The
content security policy allows `https://*.actinhealth.ir` and `http://localhost:*`; widen
`connect-src` in `src-tauri/tauri.conf.json` for another backend. The backend's CORS list
must include `tauri://localhost` (iOS) and `http://tauri.localhost` (Android), the same
origins as the desktop dashboard.

After `android:init` / `ios:init`, add the camera permission text the stores require:
`NSCameraUsageDescription` in `gen/apple/actin-app_iOS/Info.plist` (for example
"Actin uses the camera to read the QR code on the mirror"). The barcode-scanner plugin
adds the Android `CAMERA` permission itself.

## Layout

- `app/pages/` sign-in (`index`, `verify`), `results/` list and detail, `claim`, `sharing`;
  `scan/[id]` forwards a mirror QR link to the claim screen.
- `app/utils/app.ts` types and pure helpers (QR parsing, error text, result headlines,
  posture findings, consent body), tested in `tests/`.
- `app/composables/useApi.ts` signed-in `$fetch`; a 401 signs out.
- `app/composables/useScanner.ts` the camera QR reader (phones only).
- `src-tauri/` the shell: keeps the webview on the app's own pages and registers the
  barcode-scanner plugin on Android and iOS.

## Not in this first version

From the roadmap's consumer-app row, still to do: manual metrics, file uploads (lab and
InBody reports), the Xiaomi scale over Bluetooth, plan requests, and wearable sync
(Apple Health / Health Connect, backend in actin_pwa_backend #9). Opening the app from a
mirror QR link (universal links / app links) needs the app identifiers and the
`.well-known` files on app.actinhealth.ir, and store releases need signing keys and
developer accounts.
