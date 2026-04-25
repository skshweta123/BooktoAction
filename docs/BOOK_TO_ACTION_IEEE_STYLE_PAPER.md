# Book to Action: A Cross-Platform Goal-Conditioned Knowledge-to-Execution System with Staged AI Adoption

## Abstract
Book to Action is a cross-platform application that transforms book knowledge into goal-oriented execution outputs. Instead of presenting static summaries, the system maps user-selected goals and books into five structured sections: Summary, Key Ideas, Framework, Action Plan, and Mistakes to Avoid. The deployed MVP uses deterministic runtime serving over curated knowledge structures to ensure reliability, low latency, and release readiness across web, Android, and iOS pipelines. Importantly, the architecture is AI/ML-oriented and staged: the current phase emphasizes controlled serving and representation quality, while post-MVP phases introduce model-assisted generation and personalization. This paper presents the problem framing, architecture, implementation details, release engineering, and an AI/ML roadmap from controlled baseline to scalable adaptive intelligence.

## Keywords
Cross-platform architecture; deterministic runtime serving; AI-ready content engineering; Expo React Native; staged AI adoption; LLM integration roadmap; mobile release engineering.

## 1. Introduction
Knowledge-consumption products frequently optimize for information retrieval but underperform on behavioral execution. Users can read a summary yet still fail to act. Book to Action addresses this execution gap by conditioning content on user intent (goal selection) and rendering operational outputs instead of descriptive-only text. The design objective is to provide reproducible, high-clarity action structures suitable for mobile-first interaction.

The central hypothesis is that a structured goal-conditioned representation can increase practical usability compared to unstructured summary delivery, especially in MVP contexts where controlled runtime quality and speed are prioritized before higher-variance model inference is introduced.

## 2. Problem Statement
Given:
- a selected book `b`
- a selected goal set `G`, where `1 <= |G| <= 3`

Produce:
- `Summary(b, G)`
- `KeyIdeas(b, G)`
- `Framework(b, G)`
- `ActionPlan(b, G)`
- `Mistakes(b, G)`

subject to:
1. low response latency for mobile interaction,
2. inter-section semantic differentiation,
3. readability and practical actionability,
4. cross-platform consistency.

## 3. System Overview
The implementation follows a client-centric controlled architecture in the MVP phase, with deterministic runtime synthesis and AI/ML-oriented knowledge representations.

```text
User Input (book + goals)
        |
        v
Local Synthesis Engine
  - book profiles
  - goal strategies
  - merge rules
  - uniqueness checks
        |
        v
Structured Result Object
  summary | ideas | framework | plan | mistakes
        |
        v
Tabbed Renderer (web/mobile) + TTS for summary
```

## 4. Technical Stack
### 4.1 Application Layer
- Expo + React Native
- TypeScript
- Expo Speech (`expo-speech`)
- Manrope typography via `expo-font` and `@expo-google-fonts/manrope`

### 4.2 Build and Release
- EAS Build profiles for Android/iOS
- Remote app version source + auto-increment strategy
- Web export via `expo export --platform web`

### 4.3 Hosting and Delivery
- Vercel for production web hosting
- EAS-generated Android AAB artifacts
- iOS artifact pipeline via EAS (Apple account dependent)

### 4.4 Configuration and Environment
- `app.json`: app identity, EAS project linkage, updates URL, platform IDs
- `.env`: Firebase public configuration values
- `eas.json`: production build strategy and version behavior

## 5. Data and Synthesis Model (MVP)
The core content model uses typed structures:
- goal taxonomy (`GoalId`)
- book metadata (`Book`)
- sectioned result container (`GoalResult`)

Each book contains a profile with:
- thesis
- framework components
- base ideas
- weekly plan primitives
- mistakes primitives
- semantic anchors

Goal strategy metadata introduces:
- objective
- lead metric
- lag metric
- weekly priority
- risk pattern

The synthesis algorithm composes book profile + goal strategy into section outputs, then applies:
1. anchor coverage enforcement,
2. inter-tab lexical similarity checks,
3. section-specific style shaping,
4. multi-goal merge logic,
5. optional per-book/goal overrides for quality correction.

## 6. Runtime Flow
1. User selects goals and a book on Home.
2. Selection validation enforces 1 to 3 goals.
3. App enters loading state.
4. Local synthesis engine generates a `GoalResult`.
5. Result view renders tabbed sections.
6. Summary tab supports optional text-to-speech playback.

## 7. AI/ML Framing
### 7.1 Current MVP
The MVP intentionally avoids runtime LLM inference in the user request path. This is a controlled baseline using deterministic transformation rules for serving. However, the system is not AI-disconnected: it already applies AI/ML-aligned content engineering through semantic anchors, section differentiation constraints, and structured synthesis policies. The correct characterization is deterministic runtime serving with AI-ready architecture.

Rationale:
- stable quality under release pressure,
- low operational cost,
- reproducible outputs for QA and auditing,
- reduced latency variability.

### 7.2 Future ML-Enhanced Architecture
Planned architecture is hybrid:

```text
Tier 1: Deterministic serving
  - cached/validated high-frequency book-goal pairs

Tier 2: AI generation + personalization
  - offline LLM generation for missing pairs
  - quality scoring and editorial validation
  - user-level ranking/personalization
  - guarded online inference for edge cases
```

Future ML components may include:
- embedding-based retrieval for thematic relevance,
- ranking models for action-plan prioritization,
- prompt-chained generation with schema constraints,
- confidence-gated output promotion.

## 8. MVP vs Scalable Phase
### MVP Characteristics
- deterministic runtime serving with AI-ready content structures
- low latency and low cost
- manual override-based quality correction
- minimal infrastructure complexity

### Scalable Phase Characteristics
- cloud-hosted versioned content graph
- model-assisted generation and personalization
- content ops workflow (review, scoring, release gating)
- telemetry-driven optimization and A/B evaluation

## 9. Release Engineering Status
Completed:
- Android AAB generation via EAS
- web deployment pipeline via Vercel
- production IDs and EAS linkage
- privacy/support pages and URLs
- screenshot asset preparation flow

In progress/external:
- iOS release completion pending Apple Developer enrollment and credential flow.

## 10. Security, Privacy, and Compliance Notes
- public support and privacy policy endpoints are available
- environment variables externalized from source
- production signing and versioning configured through EAS
- app-store metadata and assets prepared for submission workflows

## 11. Evaluation Strategy
Suggested evaluation dimensions:
1. reliability (build success rate, crash/latency indicators),
2. content quality (coherence, uniqueness, actionability),
3. utility outcomes (session completion, tab engagement, repeat usage).

For future ML rollout, measure deterministic baseline vs model-augmented variants under controlled experiments.

## 12. Conclusion
Book to Action demonstrates a practical staged path from controlled deterministic serving in MVP to AI-enhanced scale. The current architecture intentionally prioritizes reproducibility, usability, and release feasibility, while preserving clear migration paths to model-assisted generation and personalization. This strategy reduces deployment risk and establishes measurable baselines before introducing higher-variance inference systems.

