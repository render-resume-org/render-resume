# Smart Chat Resume Editor – Context Refactor Plan

## Current Architecture (High-level)
- `components/smart-chat/resume-editor-preview.tsx` hosts a large stateful component:
  - Owns resume source state (`unified` + `optimized`) and preview state (`previewOps`, `previewDiffs`, `isPreviewing`)
  - Handles patch ops normalization, virtual resume projection, accept/reject, inline edits, zoom/pan
  - Exposes props to `ResumePreview` to render highlight/diff
- Problems:
  - State and logic are monolithic, hard to test and reuse
  - Cross-cutting concerns (diff builder, virtual projector, path utils) live in component body
  - Preview “insert” editing required special handling dispersed across the file
  - Tight coupling increases risk when adding new sections/fields

## Target Architecture
- Introduce `ResumeEditorProvider` context that centralizes:
  - Source state: `unified`, `optimized`, persistence helpers
  - Preview state: `previewOps`, `previewDiffs`, `isPreviewing`
  - APIs: `dispatchPreviewOps`, `acceptPreview`, `rejectPreview`, `handleInlineChange`, `getPreviewedResume`
  - Utilities (exported):
    - `normalizePath`, `getByPath`, `setByPathSafe`, `computeInsertTargetPath`, `resolveNeighborIndexIfNeeded`
    - `buildPreviewDiffs`, `projectVirtualResume`
- `ResumeEditorPreview` becomes a thin view/container consuming the context APIs

## Design Principles
- Single source of truth via Context; no duplication between view and model
- Keep reusable pure functions separate and exported for testability
- Ensure insert/remove/set preview semantics are consistent and isolated
- Strong type safety; no `any` or `unknown` for domain values

## Refactor Plan
1. Create `components/smart-chat/context/resume-editor-context.tsx`
   - Provider with internal state and React hooks for zoom/pan kept in the view layer
   - Export hooks: `useResumeEditor`, `usePreviewState`
   - Export pure helpers for path and diff operations
2. Move logic from `resume-editor-preview.tsx` into the context:
   - Inline change handling with array guards and preview-only edit routing
   - PatchOps event handling, normalization, diff building
   - Virtual resume projection
   - Accept/Reject flows
3. Refactor `components/smart-chat/resume-editor-preview.tsx` to use the context APIs and focus on UI (ZoomToolbar and rendering `ResumePreview`)
4. Verify highlight inheritance remains intact (already in `components/preview/resume-preview.tsx`)
5. Run lints and fix issues

## Out of Scope (future)
- Extract zoom/pan into its own small hook
- Unit tests for helpers


