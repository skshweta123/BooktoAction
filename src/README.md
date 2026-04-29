# Source Folder Structure

This app follows a corporate-style layout with clear boundaries.

- `app/`: app-level composition and wiring
  - `providers/`
  - `routes/`
- `features/`: business/domain feature modules
  - `book-to-action/`
    - `components/`, `screens/`, `hooks/`, `types/`, `data/`, `services/`
- `components/`: shared presentational UI
- `screens/`: app-level/shared screens
- `shared/`: reusable cross-feature modules
  - `constants/`, `types/`, `utils/`
- `data/`: legacy compatibility location
- `services/`: legacy compatibility location

For new code, prefer `features/*`, `shared/*`, and `app/*`.
