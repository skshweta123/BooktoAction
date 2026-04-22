# Book to Action Deployment Runbook

## Local auth setup (Firebase)

1. Create a Firebase project.
2. Enable **Authentication > Email/Password**.
3. Copy `.env.example` to `.env` and fill all `EXPO_PUBLIC_FIREBASE_*` values.
4. Restart Expo after editing `.env`.

## Phase A: One-time setup

1. Install tools
   - `npm i -g eas-cli`
2. Login to Expo
   - `eas login`
3. Configure project
   - `eas project:init`
4. Copy generated project ID and replace in `app.json`:
   - `expo.updates.url`
   - `expo.extra.eas.projectId`

## Phase B: Verify app identifiers

Update these values in `app.json` if needed:
- iOS bundle identifier: `expo.ios.bundleIdentifier`
- Android package: `expo.android.package`
- Versioning:
  - `expo.version`
  - `expo.ios.buildNumber`
  - `expo.android.versionCode`

## Phase C: Build artifacts

### Android preview APK
- `npm run build:android:preview`

### Android production AAB
- `npm run build:android:prod`

### iOS production IPA
- `npm run build:ios:prod`

## Phase D: Web deployment

1. Build static web output
   - `npm run web:build`
2. Output folder
   - `dist/`
3. Deploy `dist/` to any static host:
   - Vercel
   - Netlify
   - Firebase Hosting

## Phase E: Store submission

### Google Play
1. Create app listing in Play Console
2. Upload AAB from production build
3. Fill:
   - App description
   - Privacy policy URL
   - Data safety form
   - Screenshots / icon / feature graphic
4. Release to internal test first

### Apple App Store
1. Create app in App Store Connect
2. Upload iOS build (EAS submit or Transporter)
3. Fill:
   - Privacy details
   - Age rating
   - Screenshots
   - Support URL
4. Submit for review

## Required product assets checklist

- App icon (1024x1024)
- Splash screen
- Privacy policy URL
- Support contact email
- Terms URL (recommended)
- App description copy
- Screenshots:
  - phone portrait (iOS + Android)
  - web landing screenshot (optional but recommended)

## Notes

- Current login is local-state auth for MVP UX testing.
- Before production launch, replace with Firebase Auth or equivalent.
- Keep `assets/books` as your managed content source for this release.
