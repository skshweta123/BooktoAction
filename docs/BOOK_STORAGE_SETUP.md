# Book Storage Setup (100+ Books Ready)

This app is now configured for a scalable PDF strategy:

- **Covers**: local in `assets/covers/`
- **PDFs**: remote-first via `EXPO_PUBLIC_BOOKS_PDF_BASE_URL`, with local fallback paths available

## 1) Covers (what you should do)

- Store all covers in `book-to-action-app/assets/covers/`
- Keep filenames in this format: `Title_Case_With_Underscores.jpg` (current project convention)
- Ensure one cover file per `book.id`

## 2) PDFs (what you should do for launch)

### Recommended

- Upload all book PDFs to cloud storage/CDN under one folder, e.g.:
  - `https://cdn.yourdomain.com/books/Atomic_Habits.pdf`
  - `https://cdn.yourdomain.com/books/The_Art_of_War.pdf`

- Set environment variable in `.env.local`:

```bash
EXPO_PUBLIC_BOOKS_PDF_BASE_URL=https://cdn.yourdomain.com/books
```

### Book metadata

Each book entry uses `pdfFileName`. The app can derive:

- local fallback path: `assets/books/<pdfFileName>`
- remote URL: `<EXPO_PUBLIC_BOOKS_PDF_BASE_URL>/<pdfFileName>`

## 3) Action items for adding new books

1. Add book metadata entry to `src/data/library.ts` with:
   - `id`
   - `title`
   - `author`
   - `pdfFileName`
2. Add cover image to `assets/covers/`
3. Upload PDF to your remote books folder
4. Keep filename exactly same as `pdfFileName`

## 4) Current status checklist

- [x] Covers moved to `assets/covers/`
- [x] App reads covers from `assets/covers/`
- [x] PDF base URL env var scaffolded in `.env.example`
- [x] Library helpers added:
  - `getLocalPdfAssetPath(book)`
  - `getRemotePdfUrl(book)`
  - `getPreferredPdfSource(book)`
