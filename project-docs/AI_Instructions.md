# AI Development Instructions

This file serves as constraints and rules for future AI Agents maintaining the DevScope codebase. Adhere to these rigidly.

## 1. Coding Standards
- Output strictly in **TypeScript**. Avoid using `any`; define robust interfaces or `zod` schema constraints.
- Prefer functional paradigms: immutability, pure functions, and `const` variables.
- React components must be Function Components utilizing hooks. 

## 2. Folder Conventions
- Keep Monorepo structure decoupled: Web client modifications in `apps/frontend`, API in `apps/backend`, and universally shared types in `packages/shared`.
- Backend domain grouping: Keep models isolated inside `services/`. `controllers/` wrap responses and connect `routes/`.

## 3. Naming Conventions
- React Components: `PascalCase.tsx`.
- Utilities/Services/Hooks: `camelCase.ts`.
- Environment Variables: `UPPER_SNAKE_CASE`.
- Boolean values should be prefixed heavily (e.g. `isLoading`, `hasError`).

## 4. Architecture Rules
- Use dependency injection where possible.
- Never place Github direct interaction logic in the Frontend. All third-party fetching passes strictly through `apps/backend`.

## 5. UI Consistency Rules
- Rely entirely on `tailwind` classes and the `shadcn/ui` abstraction layer. 
- Stick to predefined design tokens within `tailwind.config.ts`.
- Loading states MUST render skeleton outlines, not simple arbitrary spinners.

## 6. API Design Patterns
- Build uniform HTTP JSON responses: 
  `{ "status": "success|fail|error", "data": {}, "message": "..." }`
- Always apply standard HTTP status descriptors (200, 201 for successes, 400 for structural flaws, 404 for missing).

## 7. Error Handling Standards
- Every service action must try/catch.
- Fallback logic should gracefully prevent white-screens of death within React Error Boundaries.
- Downstream timeouts result in specific User-facing messages ("The system took too long to respond.") instead of hard `500`.

## 8. Commit Message Conventions
Must follow standard conventional commits:
- `feat:` for new capabilities.
- `fix:` for functional corrections.
- `docs:` for documentation.
- `refactor:` for code enhancements without logic shifts.
- `chore:` for build tooling / scripts.