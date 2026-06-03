# Resume Builder — AI Agent Instructions

## Purpose

This repository is a full-stack resume builder application:

* `client/` is a React + Vite frontend using React Router, Redux Toolkit, and Slate.
* `server/` is a Flask backend using SQLAlchemy, Flask-Migrate, Flask-CORS, and blueprints.

## What AI agents should know

* Frontend and backend are separate; changes to one may require coordination with the other.
* The frontend calls the backend API through services in `client/src/services/`.
* Shared fetch behavior is handled in `client/src/lib/fetch.js`.
* Server resume data is normalized into client-side Redux state in `client/src/utils/normalizeResumeFromApi.js`.
* Resume editing relies on Slate rich-text components and Redux state in `client/src/store/`.
* Treat the following behavior as regression-sensitive: Slate rich-text values/rendering, normalized Redux entity relationships and ordering, layout/styling calculations, column-width distribution, resume paper sizing and printing, margin/padding rulers, and immediate editor-preview updates.
* The resume entity hierarchy is: `User → Resume → Column → Section → Subsection → Field`.
* Relationships are one-to-many at each level: each child belongs to one parent, while each parent may contain multiple children.
* Resume content, styling, and layout data are persisted on the backend and normalized into Redux state on the frontend through `client/src/utils/normalizeResumeFromApi.js`.
* When changing persisted resume data structures, coordinate backend defaults/update paths with frontend normalization, Redux state, and rendering logic.
* Existing saved resumes may not contain newly introduced `styling` or `layout` keys; changes must provide safe fallback behavior and/or an intentional migration strategy.
* Backend routes are organized by resource in `server/routes/` and use models from `server/models.py`.
* `server/app.py` configures the Flask application and registers API blueprints.

## Commands

* Frontend dev: from the repository root, run `cd client && npm run dev`
* Frontend build: from the repository root, run `cd client && npm run build`
* Frontend lint: from the repository root, run `cd client && npm run lint`
* Backend dev: from the repository root, run `cd server && source venv/bin/activate && flask run --debug --port=5555`

## Key files/directories

* `client/src/App.jsx` — router setup and site-launch session check
* `client/src/main.jsx` — React entry point and Redux provider
* `client/src/pages/` — main frontend pages that routes render
* `client/src/features/` — primary page features and related components; contains most client-side functionality
* `client/src/store/` — Redux slices and store configuration
* `client/src/lib/fetch.js` — shared frontend fetch behavior
* `client/src/services/` — API wrappers and session helpers
* `client/src/utils/normalizeResumeFromApi.js` — transforms server resume data into normalized Redux-ready client data
* `server/app.py` — Flask application entrypoint and blueprint registration
* `server/config.py` — Flask and database configuration
* `server/routes/` — API endpoints organized by resource
* `server/services/` — backend business logic for constructing and updating resume data
* `server/models.py` — SQLAlchemy data models
* `server/migrations/` — database migration history

## Conventions

* React files use `.jsx` and `type: module` in `client/package.json`.
* ESLint is configured in `client/eslint.config.js` and ignores `dist`.
* Use `BrowserRouter` for client routing and nested routes for account pages.
* Maintain API endpoint paths and persisted payload shapes in sync with frontend service calls, normalization logic, and Redux state.

## Safety / workflow guidance

* For broad changes involving persisted resume data, editor layout, typography, spacing, or styling behavior, inspect the relevant code and ask clarifying questions before modifying files.
* Prefer small, reviewable phases for cross-cutting changes.
* Do not create or run migrations unless explicitly requested.
* Identify manual regression checks for user-facing editor behavior when making functional changes.

## Notes

* There is currently no dedicated test suite in the repository.
* The root `README.md` contains feature notes and project status.
* Prefer keeping documentation links rather than duplicating large existing content.
