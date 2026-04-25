# Release Readiness Checklist (iOS + Android)

Use this as a pass/fail list before marketplace submission.

## 1) Product and Feature Readiness

- [ ] Core flows work on real devices
- [ ] Framework/Plan/Mistakes/Ideas/Summary tabs validated for multiple books/goals
- [ ] Multi-goal (up to 3) outputs verified
- [ ] Error states are user-friendly

## 2) Authentication Decision

- [ ] Decision made: ship with auth or no-auth MVP
- [ ] If auth enabled: production-grade auth active (not in-memory mock)
- [ ] Session persistence and logout tested
- [ ] Password reset flow tested (recommended)

## 3) App Metadata

- [ ] Final app name selected
- [ ] Store short and long descriptions finalized
- [ ] Keywords selected (App Store optimization)
- [ ] Category selected (Productivity or Education)
- [ ] Support URL and contact email live
- [ ] Privacy policy URL live

## 4) Legal and Compliance

- [ ] Privacy policy reflects actual data practices
- [ ] Terms of service published (recommended)
- [ ] Apple privacy questionnaire completed accurately
- [ ] Google Play data safety form completed accurately
- [ ] Copyright and usage rights reviewed for source materials

## 5) Branding and Media Assets

- [ ] Final app icon provided
- [ ] Splash screen finalized
- [ ] Store screenshots captured for required device classes
- [ ] Feature graphic and promo assets prepared (Play Store)

## 6) Technical Build Readiness

- [ ] `app.json` identifiers are production values (no placeholders)
- [ ] Version and build numbering strategy defined
- [ ] EAS project configured and credentials verified
- [ ] Production env variables configured securely
- [ ] Staging and production configs separated

## 7) Quality and Stability

- [ ] Tested on at least one recent iPhone and one recent Android
- [ ] Slow network behavior tested
- [ ] Offline and reconnect behavior tested
- [ ] Crash monitoring integrated (Sentry/Crashlytics)
- [ ] No high-severity runtime errors in logs

## 8) Performance and UX

- [ ] Cold start time acceptable
- [ ] Result tab transitions smooth
- [ ] No blocking white/blank screens
- [ ] Accessibility basics validated (contrast, text scaling, touch targets)

## 9) Submission Pipeline

- [ ] Android AAB built and uploaded to internal test
- [ ] iOS build uploaded to TestFlight
- [ ] Internal QA signoff complete
- [ ] Release notes prepared
- [ ] Support and incident response plan ready

## 10) Post-Launch Controls

- [ ] Crash-free session monitoring dashboard configured
- [ ] Analytics events validated
- [ ] Feedback collection channel active
- [ ] Rollback/fix process documented

## 11) Recommended Pre-Launch Sequence

1. Freeze feature scope
2. Run full regression on real devices
3. Build Android/iOS release candidates
4. Test in Play Internal + TestFlight
5. Fix blocking issues
6. Submit for review
7. Roll out in phases
