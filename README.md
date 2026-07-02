# CV & Cover Letter Template Builder

A modern single-page application for creating, customizing, and exporting professional CVs and matching cover letters. Built with React, TypeScript, and Tailwind CSS v4.

## Features

- **8 Template Pairs** — Executive Classic, Modern Minimal, Creative Professional, Corporate Blue, Minimalist White, Tech Innovator, Elegant Serif, Bold Statement (each CV has a matching cover letter)
- **Full CRUD Editor** — Add, edit, reorder, and remove sections (work experience, education, skills, certifications, languages, projects, custom sections)
- **Customization** — 12 color presets, 16 Google Fonts, font size/spacing controls, single/two-column layout, accent styles (lines/dots/shapes/borders/geometric), skills proficiency display (text/bars/stars/circles), dark/light mode
- **Export** — PDF export (CV, cover letter, or both combined), browser printing, JSON import/export
- **Advanced** — ATS score checker, document version manager, auto-save, session recovery
- **Dark Mode** — Class-based dark toggle with Tailwind v4 custom variant (`@custom-variant dark`)

## Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript (Vite 8) |
| Styling | Tailwind CSS v4 + @tailwindcss/vite |
| State | Zustand |
| Drag & Drop | react-dnd |
| Export | html2canvas + jspdf |
| Fonts | @fontsource (Google Fonts) |
| Animation | framer-motion |
| Icons | lucide-react |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── App.tsx                        # View routing + dark mode class toggle
├── main.tsx                       # Entry point
├── index.css                      # Tailwind CSS v4 + custom dark variant
├── types/index.ts                 # TypeScript interfaces
├── store/useStore.ts              # Zustand store (CRUD state)
├── data/templates.ts              # 8 template pair definitions
├── hooks/useAutoSave.ts           # Auto-save & session recovery
├── components/
│   ├── ui/                        # Navbar, CustomizationPanel, Toast, ATS, VersionManager
│   ├── gallery/TemplateGallery.tsx
│   ├── editor/                    # Editor, CoverLetterEditor, previewRenderers
│   ├── preview/Preview.tsx        # Export page with html2canvas + jspdf
│   └── layout/Sidebar.tsx         # Navigation sidebar
└── plan.md                        # Implementation plan & status
```

## Requirements

- Node.js 20+
- npm

## License

MIT
