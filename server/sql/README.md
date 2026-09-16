# Resume template preferences

## User feedback: source of truth

The user reviewed these templates in the application. These are explicit judgments,
not inferred scores. Use the approved templates as references for future designs.

| Template | Decision | Existing resume ID |
| --- | --- | --- |
| John Doe - Copper Rail | Keep | Not supplied |
| John Doe - Terminal Minimal | Keep theme, redo presentation | 23 |
| Jane Doe - Plum Studio | Reject | Not supplied |
| Jane Doe - Burgundy Executive | Keep | Not supplied |
| Jane Doe - Terracotta Impact | Keep theme, redo presentation | 24 |
| John Doe - Sage Portfolio | Keep | Not supplied |
| Jane Doe - Blueprint | Keep theme, redo presentation | 21 |
| Jane Doe - Editorial Classic | Keep | Not supplied |
| John Doe - Midnight Sidebar | Keep | Not supplied |
| Jane Doe - Modern Teal | Keep | Not supplied |

All supplied IDs belong to user 1. Rejection is feedback, not an instruction to
delete a database record or remove the original SQL reference.

## How to use this feedback

- Prefer the seven approved designs as starting references. They need, at most,
  small refinements; do not redesign them without a request.
- Preserve variety: the approved set includes single columns, asymmetric columns,
  dark and pale sidebars, serif typography, and sans-serif typography.
- Do not recreate Plum Studio as a default recommendation.
- The user does not want to explain every visual flaw. Make reasonable design
  improvements autonomously and label inferred causes as hypotheses.
- Possible pattern: clear hierarchy and familiar reading order appear successful.
  The rejection of Plum Studio alone does **not** prove that plum, equal columns,
  or project-first content are individually disliked.
- The first Modern Teal was slightly too large; Midnight Sidebar was slightly too
  small. The user is comfortable adjusting font size. New templates have generally
  used 11.5px, but there is no confirmed universal preferred size.
- Preserve existing font-size and margin adjustments when revising an existing
  resume. Rendered screenshots are useful evidence if available, not a prerequisite
  for providing another design or refinement.

## New versions (awaiting user review)

The user changed the requested delivery: create **new resumes** for user 1 using
the redo candidates as references, rather than updating IDs 23, 24, and 21.
Use these new insert files for the current request:

| Insert file | New resume title |
| --- | --- |
| `john_doe_terminal_v2.sql` | John Doe - Terminal Minimal v2 |
| `jane_doe_terracotta_v2.sql` | Jane Doe - Terracotta Impact v2 |
| `jane_doe_blueprint_v2.sql` | Jane Doe - Blueprint v2 |

Each file is one `WITH ... INSERT ... SELECT` statement with no comments or trailing
semicolon, suitable for the Railway query editor. Each run creates a new resume
with database-generated IDs and returns its ID. These files use the original
fictional content, refined presentation, and an 11.5px base font; they do not read
the existing database resumes or copy any edits made only in the application.

## Superseded update proposals

These changes are hypotheses about what will improve the three redo candidates.
They have not yet been approved as successful visual results.

| Update file | Intended improvement |
| --- | --- |
| `updates/redo_23_terminal_minimal.sql` | Sans-serif body for easier reading, monospace identity and stack for the terminal theme, cleaner headings, normalized stack separators. |
| `updates/redo_24_terracotta_impact.sql` | White header with a warm rule, one peach highlight strip, metrics split into centered numbers and captions. |
| `updates/redo_21_blueprint.sql` | Smaller cobalt masthead, more space beneath the header, four category/tool rows instead of interleaved headings and tool cells. |

The original `DO` update blocks produced a syntax error near `LIMIT` in Railway.
They were rewritten as result-producing CTE statements, but the user then requested
new inserts instead. Files under `updates/` are superseded and are not the current
delivery. They check resume ID, owner ID, expected title, and relevant structure,
and return a status without updating records when those checks fail.

The statements update existing records in place, keeping record IDs, resume titles,
body/contact text, and resume-level font sizes and page margins. They modify
presentation, some section headings, skills ordering/separators, and metric formatting.
They neither create nor delete resumes or fields. Running an update again does not
duplicate content. Refresh the editor after running a query; avoid saving an older
open editor state over the changes.

Original insert scripts are historical references. They are not rewritten by these
updates, and may differ from font or content adjustments already made in the app.
SQL data structures have been checked locally; the updates have not been executed
against the user's database or visually reviewed in the application.
