# Official resume templates — September 16, 2026

Ten new, fictional Jane Doe / John Doe resumes. Titles omit the candidate names.

## Run a template

Open one `.sql` file, copy its entire contents into the Railway PostgreSQL query editor, and run it. Each file is one atomic, result-returning insert statement. It creates one complete resume and returns its ID, title, owner, official-template flag, and field count. Each execution creates another new resume.

The queries intentionally contain no comments, `DO` blocks, or trailing semicolon, matching the query format that worked in Railway. They also allow the editor to append a result limit.

## Current schema

- `user_id = 1`; that user must already exist.
- `is_official_template = TRUE`, matching the official-template endpoint filter.
- `source_resume_id = NULL`, because these are original templates rather than copies.
- Database-generated IDs for the resume, columns, sections, subsections, and fields.
- All required JSON, position, and timestamp columns are supplied.
- Requires migrations through `8420c4d1927e` (source resume ID), including `b14e056ad655` (official-template flag).

## Designs

| File | Design | Layout |
| --- | --- | --- |
| [Harbor Ledger](harbor_ledger.sql) | Centered navy masthead, thin divider, and dates aligned opposite roles. | 100% |
| [Graphite Index](graphite_index.sql) | Right-aligned monospace identity with a readable sans-serif body and quiet stack panel. | 100% |
| [Ivory Letterpress](ivory_letterpress.sql) | Warm ivory page, left-aligned serif name, generous editorial spacing, and fine sepia rules. | 100% |
| [Evergreen Margin](evergreen_margin.sql) | Soft green left reference column with the name and work history in the wide right column. | 30% / 70% |
| [Slate Horizon](slate_horizon.sql) | White career column beside a dark slate right sidebar with soft blue section labels. | 68% / 32% |
| [Sandstone Rail](sandstone_rail.sql) | Stacked name in a white identity rail with a sand-colored vertical rule and broad work column. | 29% / 71% |
| [Oxford Brief](oxford_brief.sql) | Centered academic serif masthead, navy rules, balanced role/date rows, and centered supporting headings. | 100% |
| [Atlantic Outline](atlantic_outline.sql) | Open white layout with a fine teal divider separating a narrow right reference column. | 69% / 31% |
| [Nordic Balance](nordic_balance.sql) | Pale blue identity and education panel on the left; skills finish the wide right narrative. | 34% / 66% |
| [Auburn Journal](auburn_journal.sql) | Right-aligned serif masthead, auburn rules, sans-serif narrative, and compact two-column education. | 100% |

## Design references and validation

The approved references are Modern Teal, Midnight Sidebar, Editorial Classic, Sage Portfolio, Terminal Minimal, Copper Rail, and Burgundy Executive. These new designs use fresh fictional profiles and preserve a restrained palette, clear hierarchy, and familiar reading order. All use an editable 11.5px base font.

Checked against the current SQLAlchemy models, official-template route, migrations, and editor layout/rendering code. Static validation covered required columns, Slate node structure, field grid placement, column relationships, generated-ID usage, and official-template settings. The queries have not been executed against a database or visually rendered in the application.
