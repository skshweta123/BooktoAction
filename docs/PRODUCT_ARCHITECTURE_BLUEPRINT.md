# Book to Action: Product Architecture Blueprint

## 1) Product Purpose

Book to Action converts book insights into execution-ready outputs for users:
- Frameworks users can apply
- Action plans users can follow
- Mistakes to avoid
- Key ideas
- Summaries

The core product value is not only knowledge compression, but behavior-change support through structured output.

## 2) Current State Architecture (As-Is)

### Client
- Expo React Native app (`App.tsx`) for web/mobile
- Local state-driven flow for login, goal selection, book selection, and result rendering
- Content rendered by tabs with hierarchical formatting styles

### Content Layer
- Static content and generation logic in `src/data/library.ts`
- Book profiles + goal strategy metadata
- Per-goal generation + multi-goal combination synthesis
- Formatting and uniqueness safeguards in code

### Auth
- Active runtime: local in-memory auth (MVP)
- Firebase auth scaffolding present in `src/services/firebaseAuth.ts` but not active in app flow

### Build/Deploy
- Expo/EAS configuration in `app.json` and `eas.json`
- Web and mobile startup scripts in `package.json`

## 3) Core Domain Model

Key entities:
- Book
- Goal
- ResultTab (Framework, Plan, Mistakes, Key Ideas, Summary)
- GoalResult (tab payload)
- BookProfile (thesis, anchors, framework components, base ideas/plans/mistakes)
- GoalStrategy (objective + lead/lag metrics + risks)

## 4) Current Technical Risks

- `App.tsx` remains high-responsibility and should be gradually decomposed.
- Content logic is static-code based; scaling beyond curated sets is operationally difficult.
- No admin quality interface yet.
- Production-grade auth not active.

## 5) Target State Architecture (To-Be)

### 5.1 Frontend
- Keep Expo app for cross-platform delivery
- Introduce service boundaries:
  - `content-engine/` (composition/validation)
  - `auth/` (session and identity flows)
  - `api/` (network client)
  - `ui/components/` (reusable presentational components)

### 5.2 Backend API
- REST or GraphQL API for:
  - book catalog retrieval
  - goal-result generation retrieval
  - user profile/history retrieval
  - admin moderation endpoints

### 5.3 Data Platform
- Postgres for metadata, versions, quality scores, moderation state
- Object storage for large assets/raw files
- Redis for cache hot paths

### 5.4 Content Pipeline
- Ingestion (metadata, source text, tags)
- Structuring (book profile extraction)
- Generation (tab-level content with policy constraints)
- Validation (anchor coverage, similarity thresholds, depth checks)
- Moderation (human approval for low-confidence items)

## 6) AI/ML Role in the System

### AI responsibility
- Enrichment, personalization, variation, style adaptation

### Non-AI responsibility
- Canonical truths (book metadata, approved framework identities)
- Compliance and moderation policy
- deterministic fallback payloads

### Suggested control policy
- AI can enrich; cannot override canonical profile facts.
- Every generated payload must pass validation checks before publish.

## 7) Quality Governance

### Required gates
- Anchor coverage
- Cross-tab duplication threshold
- Structural completeness by tab contract
- Minimum detail depth

### Governance outputs
- Per-book quality score
- Failed check reasons
- Last review owner and timestamp

## 8) Security and Privacy

- Use Firebase Auth or equivalent production auth before broad launch
- Store secrets in env-based config and secure build channels
- Publish clear privacy policy and support contact
- Minimize personal data collection to only required fields

## 9) Refactor Plan (Incremental, Low-Risk)

1. Extract rendering utilities and content service from `App.tsx`
2. Move content engine to dedicated module with tests
3. Introduce typed API interface even before backend launch
4. Enable auth module behind feature flag
5. Add admin quality report generator script

## 10) Academic/Public Documentation Use

This architecture supports publication and research framing in:
- Human-centered AI assistance
- Knowledge-to-action transformation systems
- Controlled generation pipelines with quality gates
- Hybrid deterministic + generative content systems

## 11) Implementation Notes for Current Repo

Immediate files relevant:
- `App.tsx`
- `src/data/library.ts`
- `src/services/firebaseAuth.ts`
- `DEPLOYMENT_RUNBOOK.md`
- `app.json`, `eas.json`, `package.json`

Recommended next artifact:
- `docs/SCALING_PLAN_10K_BOOKS.md`
