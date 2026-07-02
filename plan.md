# CV & Cover Letter Template Builder — Implementation Plan

## Overview
A fully functional, responsive single-page application (SPA) for browsing, previewing, and editing matching CV and cover letter templates.

---

## Phase 0: Decisions & Rationale

| Decision | Chosen Option | Rationale |
|----------|---------------|-----------|
| **Framework** | Vite + React + TypeScript | Faster dev server, simpler config than Next.js for a client-heavy SPA. No SSR benefits are needed here. |
| **Data Persistence** | Client-side only (localStorage) | Fits the SPA model perfectly. No backend complexity. JSON import/export covers portability. |
| **AI/ATS Features** | Mock/simulated | No external API keys or costs. Heuristic-based ATS scoring. Template-based AI suggestions. |
| **Design** | Modern, clean UI per descriptions | No mockups provided; design will follow the 8 template descriptions exactly. |
| **Package Manager** | npm | Universal compatibility, no assumptions about user environment. |
| **Styling** | Tailwind CSS | As specified; excellent for rapid, consistent UI development. |

---

## CRUD Implementation Strategy

### What is CRUD?
**CRUD** stands for **Create, Read, Update, Delete**. In the context of this application, CRUD operations apply to:
1. **CV Sections** (Work Experience, Education, Skills, etc.)
2. **Cover Letter Sections** (Paragraphs, Headers, etc.)
3. **Individual Entries** within sections (A specific job, degree, or skill)
4. **Custom Sections** (User-defined sections for the CV)
5. **Template Favorites** (User's saved preferences)
6. **Document Versions** (Multiple resume versions)

### How CRUD Maps to the Template Builder

#### Create (C)
- Add a new Work Experience entry
- Insert a new Cover Letter paragraph
- Create a custom section (e.g., "Volunteer Work", "Publications")
- Save a new favorite template
- Add multiple resume versions
- Create new entries in any multi-item section

#### Read (R)
- Display existing CV sections and their data
- Preview template designs
- View the list of available templates
- Read saved documents from localStorage
- Display template matching pairs
- View document versions list

#### Update (U)
- Edit text fields inline (name, job title, descriptions)
- Change template colors, fonts, and spacing
- Reorder sections via drag-and-drop
- Update section visibility (show/hide)
- Modify existing experience, education, or skill entries
- Update theme preferences
- Edit existing document versions

#### Delete (D)
- Remove a Work Experience entry
- Delete a Cover Letter paragraph
- Hide/Remove an entire section
- Remove a favorite template
- Delete a saved document version
- Clear all data (reset)

---

## Component-Level CRUD Design

### 1. Section Management CRUD
Each section in the CV or Cover Letter will be treated as a manageable entity.

**的水平を考えて:
- **header:** name, title, contact info (editable fields)
- **summary:** text block (rich text editable)
- **experience:** list of entries (each entry has title, company, dates, description)
- **education:** list of entries (degree, institution, dates)
- **skills:** list of items (name, proficiency level)
- **custom-sections:** user-defined sections

**CRUD Map:**
| Operation | Action | UI Component | State Change |
|-----------|--------|--------------|--------------|
| Create | Add new entry | "Add Entry" button | Append to section.entries[] |
| Read | Display entries | SectionView component | Read section.entries[] |
| Update | Edit entry inline | Editable field within entry | Update specific entry in array |
| Delete | Remove entry | "Delete" button on entry | Filter out entry from array |

### 2. Entry-Level CRUD (Within Sections)
For sections that contain lists (Experience, Education, Skills), each item is independently manageable.

**Example: Work Experience Entry**
```typescript
interface WorkExperienceEntry {
  id: string; // Unique ID for the entry
  company: string;
  role: string;
  dates: string;
  description: string;
}
// CRUD actions on this entry: Add new, Edit details, Delete entry
```

### 3. Template CRUD
Templates are predefined (Read-only base), but user can:
- Create: Save a customized version of a template as a "new template"
- Read: Browse and select templates
- Update: Modify the currently selected template's customization (colors, fonts)
- Delete: Remove a custom saved template (not default ones)

### 4. Document Version CRUD
Users can save multiple versions of their resume.

**CRUD Map:**
| Operation | Action |
|-----------|--------|
| Create | Save current state as a new named version |
| Read | List all saved versions with name and date |
| Update | Overwrite an existing version with new data |
| Delete | Remove a saved version |

---

## Zustand Store CRUD Integration

The centralized store must support CRUD operations for all data entities.

**Example: CV Section CRUD in Store**
```typescript
interface CVStore {
  // Data
  sections: CVSection[];
  // CRUD Actions
  addSection: (type: SectionType, initialData?: Partial<CVSection>) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, data: Partial<CVSection>) => void;
  reorderSections: (newOrder: string[]) => void;
  // Entry CRUD (e.g., for Work Experience)
  addEntry: (sectionId: string, entry: any) => void;
  updateEntry: (sectionId: string, entryId: string, data: any) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
}
```

---

## UI/UX for CRUD Operations

### Inline Editing (Update)
- Click text to edit (contentEditable or controlled input)
- Rich text toolbar for formatting
- Autosave on blur or after a short delay

### Add & Delete Actions
- **Floating "+" buttons** or **contextual "Add Entry"** links within sections
- **Trash icon / "Remove" button** for deletion with confirmation (to prevent accidental data loss)
- **"Add New Section"** button in the customization panel for creating custom sections

### Drag & Drop (Reorder)
- Drag handles for reordering sections and entries
- Visual indicators during drag (dashed borders, ghost preview)
- Smooth transition animation (using framer-motion)

### Data Persistence
- All CRUD changes auto-save<Data in a> localStorage every 30 seconds
- Manual "Save" button for immediate persistence
- Import/Export JSON for full data CRUD (user can create/modify their data file and import it)

---

## Phase 1: Project Setup & Dependencies (CRUD-Ready)

**Goal:** Initialize the project and install all required dependencies.

**Tasks:**
1. Scaffold project using `npm create vite@latest`
2. Install Tailwind CSS and configure `tailwind.config.js`
3. Install core dependencies:
   `react-dnd`, `react-dnd-html5-backend`, `html2canvas`, `jspdf`, `zustand`, `framer-motion`, `lucide-react`, `@fontsource/*` for Google Fonts, `date-fns`
4. Install dev dependencies:
   `@types/react-dnd`, `@types/jspdf`, `tailwindcss-animate`
5. Set up folder structure with CRUD in mind (Services, Utils, Validators):
   ```
   src/
   ├── components/       # UI components (CRUD Actions, Forms, Lists)
   ├── services/           # Business logic for CRUD operations
   ├── templates/          # Template definitions & rendering
   ├── hooks/              # Custom React hooks (useCRUD, useAutoSave)
   ├── store/              # Zustand state management (CRUD Actions)
   ├── types/              # TypeScript interfaces (CRUD entities)
   ├── utils/              # Helpers (export, storage, validators)
   ├── data/               # Static data (default templates)
   └── styles/             # Global styles & Tailwind config
   ```

---

## Phase 2: Data Models & TypeScript Types

**Goal:** Define all data structures and TypeScript interfaces explicitly for CRUD.

**Tasks:**
1. **Core Types:**
   - `Template` (base properties: id, name, category, colors, fonts, layout, accentStyle)
   - `CVTemplate` & `CoverLetterTemplate` (extend Template)
   - `TemplatePair` (links a CV to its matching Cover Letter)
2. **Content Types (CRUD Entities):**
   - `CVData` (header, summary, experience[], education[], skills[], certifications[], languages[], projects[], references[])
   - `CoverLetterData` (header, date, recipient, salutation, paragraphs[], closing, signature)
   - `CVSection` (id, type, title, entries[], isVisible)
   - `CoverLetterSection` (id, type, content, isVisible)
3. **Editor Types (CRUD State):**
   - `Section` (generic section wrapper for drag-and-drop)
   - `EditorState` (current data, history for undo/redo, selected template)
   - `CustomizationState` (colors, fonts, spacing, layout, theme)
4. **Utility Types:**
   - `ExportFormat` ('pdf', 'docx', 'print', 'json')
   - `ViewMode` ('gallery', 'editor', 'preview', 'match')

---

## Phase 3: CRUD-Ready State Management (Zustand)

**Goal:** Implement global state with explicit CRUD actions for all data entities.

**Tasks:**
1. **Editor Store & CRUD Actions:**
   - `cvData`, `coverLetterData`
   - `selectedTemplateId`
   - **Section CRUD:**
     `addSection(type, data)`, `removeSection(id)`, `updateSection(id, data)`, `reorderSections(newOrder)`
   - **Entry CRUD:**
     `addEntry(sectionId, entry)`, `updateEntry(sectionId, entryId, data)`, `removeEntry(sectionId, entryId)`
   - `undo()`, `redo()` (using Immer or manual history stack)
2. **Customization Store:**
   - `theme` (light/dark)
   - `colors` (primary, secondary, accent)
   - `fonts` (heading, body)
   - `spacing` (lineHeight, paragraphSpacing)
   - `layout` (single/double column)
3. **UI Store:**
   - `viewMode` (gallery/editor/preview/match)
   - `isOnboardingComplete`
   - `toastNotifications[]`
4. **Auto-save Hook:**
   - `useAutoSave()` — persists to `localStorage` every 30 seconds
   - `useSessionRecovery()` — checks for unsaved session on mount

---

## Phase 4: Template System

**Goal:** Define and implement the 8 template pairs.

**Tasks:**
1. **Template Definitions:** Create data files for each of the 8 templates (Executive Classic, Modern Minimal, Creative Professional, Corporate Blue, Minimalist White, Tech Innovator, Elegant Serif, Bold Statement).
2. **Template Engine:**
   - `TemplateRenderer` component — renders a template based on its definition
   - Dynamic font loading via `@fontsource` or Google Fonts API
3. **Template CRUD:**
   - `saveCustomTemplate(name, customization)` (Create)
   - `getDefaultTemplates()` (Read)
   - `updateTemplateSettings(id, customization)` (Update)
   - `deleteCustomTemplate(id)` (Delete)
4. **Preview Generation:**
   - Component that renders a scaled-down preview thumbnail
   - Full-screen preview mode

---

## Phase 5: Core UI Components (with CRUD Actions)

**Goal:** Build the foundational UI components, each supporting CRUD.

**Tasks:**
1. **Layout Components:**
   - `AppLayout` (main layout with navbar)
   - `Navbar` (logo, view toggles, theme toggle, export buttons)
   - `Sidebar` (customization panel + section CRUD controls)
2. **Gallery Components:**
   - `TemplateGallery` (grid of templates)
   - `TemplateCard` (thumbnail, name, quick actions, "Favorite" toggle)
   - `FilterBar` (by color, layout, style)
3. **Editor Components (CRUD Implementation):**
   - `EditorLayout` (split view: editor + preview)
   - `SectionEditor` (inline editing for any section)
     - `InlineEditableField` (text field with on-the-fly editing)
     - `EntryList` (displays and manages list of entries)
     - `EntryItem` (single entry with Edit/Delete actions)
   - `DraggableSection` (react-dnd wrapper for reordering)
   - `RichTextToolbar` (bold, italic, underline, bullets)
   - `AddSectionButton` / `AddEntryButton` (triggers creation)
   - `DeleteConfirmationModal` (prevents accidental deletion)
4. **Preview Components:**
   - `DocumentPreview` (live PDF-like preview)
   - `MatchModeView` (side-by-side CV + Cover Letter)

---

## Phase 6: Editor Functionality (CRUD Implementation)

**Goal:** Implement the editing experience with full CRUD support.

**Tasks:**
1. **Inline Editing (Update):**
   - `contentEditable` or controlled inputs for text fields
   - Rich text handling (bold, italic, underline, lists)
2. **Drag & Drop (Reorder):**
   - `react-dnd` setup with `DndProvider`
   - Section reordering within CV/Cover Letter
   - Entry reordering within lists (e.g., reordering jobs in Work Experience)
3. **Section Management (CRUD):**
   - **Create:** `Add New Section` button → opens modal to choose section type
   - **Read:** Render section with its data
   - **Update:** Edit section title, visibility, or content
   - **Delete:** `Remove Section` button → confirmation modal → remove from state
   - Section-specific forms (e.g., Work Experience entry form)
4. **Entry Management (CRUD within Sections):**
   - **Create:** `Add Entry` button within a section
   - **Read:** Display list of entries
   - **Update:** Click entry to edit inline
   - **Delete:** `Remove` button on entry item
5. **Undo/Redo:**
   - Command pattern or simple state history stack
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
6. **Auto-save:**
   - `setInterval` or `useEffect` debounced save to `localStorage`
   - Visual indicator (save status)

---

## Phase 7: Customization Panel

**Goal:** Build the real-time customization controls that modify template state (Update).

**Tasks:**
1. **Color Pickers:**
   - Primary, Secondary, Accent color inputs
   - Preset color palettes per template
2. **Font Selectors:**
   - Dropdowns for heading and body fonts
   - Live preview of font combinations
3. **Layout Controls:**
   - Single/Two-column toggle
   - Spacing sliders (line height, paragraph spacing)
4. **Theme Toggle:**
   - Light/Dark mode switch
   - Tailwind `dark:` class support
5. **Accent Style:**
   - Grid selector for decorative elements: lines, dots, shapes, borders, circles, geometric
   - Affects section dividers (border style) and section header bullet characters
6. **Skills Display:**
   - Toggle between text, bars (unicode blocks), stars, and circles for skill proficiency indicators

---

## Phase 8: PDF & Export Functionality

**Goal:** Implement all export features.

**Tasks:**
1. **PDF Export:**
   - `html2canvas` to capture DOM elements
   - `jspdf` to generate PDF from canvas images
   - Single page, multi-page, and combined CV+Letter export
2. **Print:**
   - `window.print()` with print-specific CSS
3. **Word Export (Optional):**
   - Generate `.docx` using `docx` library or simple HTML-to-Word conversion
4. **JSON Import/Export (Data CRUD):**
   - Save/load editor state as JSON
5. **Share via Link (Optional):**
   - Encode state in URL hash or query params

---

## Phase 9: Advanced Features

**Goal:** Implement the additional feature requirements.

**Tasks:**
1. **AI Suggestions (Mock):**
   - "Generate Summary" button with pre-written professional summaries
   - "Improve Bullet Points" with templated suggestions
2. **ATS Score Checker:**
   - Simple heuristic check (keyword presence, section completeness)
   - Score display with tips
3. **Template Comparison:**
   - Side-by-side view of two templates
4. **Favorites & Recent (CRUD):**
   - Save/remove favorite templates (Create/Delete)
   - Quick access UI elements (Read)
5. **Document Versions (CRUD):**
   - Save named snapshots of CV data (Create)
   - View list of versions (Read)
   - Overwrite existing version (Update)
   - Delete old versions (Delete)

---

## Phase 10: UX Polish

**Goal:** Add animations, onboarding, and responsive design.

**Tasks:**
1. **Animations:**
   - `framer-motion` for page transitions, section reordering, tooltips
2. **Onboarding:**
   - Step-by-step tour using `react-joyride` or custom solution
   - First-time user detection via `localStorage`
3. **Responsive Design:**
   - Mobile-first Tailwind classes
   - Collapsible sidebar on mobile
   - Touch-friendly drag-and-drop (or fallback reorder buttons)
4. **Loading States:**
   - Skeleton screens for previews
   - Spinners for export operations
5. **Toast Notifications:**
   - Action confirmations (save, export, error)
6. **Keyboard Shortcuts:**
   - Modal displaying available shortcuts (e.g., `?` key)
   - Implement shortcuts for save, undo, redo, export

---

## Phase 11: Testing & Optimization

**Goal:** Ensure stability and performance.

**Tasks:**
1. **Component Testing:**
   - Unit tests for Zustand stores (optional, using Vitest)
   - Component rendering tests (optional)
2. **Responsive Testing:**
   - Test on common breakpoints (mobile, tablet, desktop)
   - Browser compatibility (Chrome, Firefox, Safari, Edge)
3. **Export Testing:**
   - Verify PDF output quality and multi-page breaks
   - Check print styles
4. **Performance:**
   - Optimize re-renders (React.memo, useMemo)
   - Code splitting for large libraries (html2canvas, jspdf)
   - Font loading strategy optimization

---

## Technology Stack Summary

| Category | Technology |
|----------|------------|
| Framework | React + TypeScript (Vite 8) |
| Styling | Tailwind CSS v4 + @tailwindcss/vite |
| State | Zustand |
| Drag & Drop | react-dnd |
| Export | html2canvas + jspdf |
| Fonts | @fontsource (Google Fonts) |
| Animation | framer-motion |
| Icons | lucide-react |

---

## Implementation Status: COMPLETE

### Files Created

```
./
├── vite.config.ts                    # Vite config with React + Tailwind plugins
├── index.html                        # App entry HTML
├── package.json                      # Dependencies & scripts
├── tsconfig.json / tsconfig.*.json   # TypeScript configuration
├── .oxlintrc.json                    # Oxlint linter rules
├── src/
│   ├── App.tsx                       # Main app entry with view routing & .dark class toggling
│   ├── main.tsx                      # Entry point with font imports
│   ├── index.css                     # Tailwind CSS v4 (+ @custom-variant dark class override)
│   ├── types/
│   │   └── index.ts                  # All TypeScript interfaces
│   ├── store/
│   │   └── useStore.ts               # Zustand store with full CRUD
│   ├── data/
│   │   └── templates.ts              # 8 template pairs definition
│   ├── hooks/
│   │   └── useAutoSave.ts            # Auto-save & session recovery
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx            # Navigation with theme toggle, undo/redo
│   │   │   ├── CustomizationPanel.tsx # Color, font, layout controls
│   │   │   ├── ATSScoreChecker.tsx   # ATS compatibility scoring
│   │   │   ├── DocumentVersionManager.tsx # Version save/load/export
│   │   │   └── Toast.tsx             # Toast notification system
│   │   ├── gallery/
│   │   │   └── TemplateGallery.tsx   # Template selection grid
│   │   ├── editor/
│   │   │   ├── Editor.tsx            # CV editor with all CRUD
│   │   │   └── CoverLetterEditor.tsx # Cover letter editor
│   │   ├── preview/
│   │   │   └── Preview.tsx           # PDF export & print with html2canvas + jspdf
│   │   └── layout/
│   │       └── Sidebar.tsx           # Navigation sidebar
│   └── components/editor/
│       └── previewRenderers.tsx      # 8 CV + 8 Cover Letter template renderers
```

### Features Implemented

1. **CRUD Operations** - Full Create, Read, Update, Delete for:
   - Personal info (CV + Cover Letter)
   - Work experience entries
   - Education entries
   - Skills with proficiency levels
   - Certifications
   - Languages with proficiency levels
   - Projects
   - References
   - Custom sections
   - Cover letter paragraphs
   - Document versions

2. **8 Template Pairs** - Executive Classic, Modern Minimal, Creative Professional, Corporate Blue, Minimalist White, Tech Innovator, Elegant Serif, Bold Statement

3. **Customization** - 12 color presets, 16 Google Fonts, font size/spacing controls, single/two-column layout, accent styles (lines/dots/shapes/borders/circles/geometric), proficiency display modes (text/bars/stars/circles), dark/light mode

4. **Export** - PDF export (CV, Cover Letter, or both), Print, JSON import/export

5. **Advanced Features** - ATS score checker, document version manager, auto-save every 30 seconds, session recovery

6. **UX** - Toast notifications, collapsible sections, responsive design, live preview

### Key Fix — Tailwind v4 Dark Mode

The `@tailwindcss/vite` plugin is **required** for Tailwind CSS v4 to process `@custom-variant`, `@theme`, and other directives in Vite. Without it:
- `@custom-variant dark (&:where(.dark, .dark *));` was output verbatim (ignored by browser)
- `dark:` utility classes fell back to `prefers-color-scheme` media query
- The `.dark` class toggle on `<html>` had no effect on Tailwind's dark utilities

**Fix:** Installed `@tailwindcss/vite` and added `tailwindcss()` to `vite.config.ts` plugins before `react()`.

---

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```