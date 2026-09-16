WITH
content AS (
    SELECT $resume_data$
[
{"label": "Header", "type": "header", "columnPosition": 0, "showHeading": false, "styling": {"border": {"right": {"display": true, "width": "2px", "height": "100%", "style": "solid", "color": "#BFA47A"}}}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "HEADER", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "John Doe", "fields": [{"label": "First Name", "value": [{"type": "paragraph", "label": "First Name", "children": [{"text": "JOHN", "fontSizeOffset": 13, "lineHeightOffset": 0, "bold": true, "color": "#8B6539"}]}], "styling": {}, "layout": {}}, {"label": "Last Name", "value": [{"type": "paragraph", "label": "Last Name", "children": [{"text": "DOE", "fontSizeOffset": 24, "lineHeightOffset": 0, "bold": true, "color": "#8B6539"}]}], "styling": {}, "layout": {}}, {"label": "Title", "value": [{"type": "paragraph", "label": "Title", "children": [{"text": "Facilities Project Manager", "fontSizeOffset": 0, "lineHeightOffset": 0, "bold": true}]}], "styling": {}, "layout": {}}]}]},
{"label": "Contact", "type": "contact", "columnPosition": 0, "showHeading": true, "styling": {"border": {"right": {"display": true, "width": "2px", "height": "100%", "style": "solid", "color": "#BFA47A"}}}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "CONTACT", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Contact", "fields": [{"label": "Location", "value": [{"type": "paragraph", "label": "Location", "children": [{"text": "Phoenix, AZ", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Email", "value": [{"type": "paragraph", "label": "Email", "children": [{"text": "john.doe@example.com", "fontSizeOffset": -0.5, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Phone", "value": [{"type": "paragraph", "label": "Phone", "children": [{"text": "(602) 555-0118", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Website", "value": [{"type": "paragraph", "label": "Website", "children": [{"text": "johndoe.example.com", "fontSizeOffset": -0.5, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}]}]},
{"label": "Expertise", "type": "skills", "columnPosition": 0, "showHeading": true, "styling": {"border": {"right": {"display": true, "width": "2px", "height": "100%", "style": "solid", "color": "#BFA47A"}}}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "EXPERTISE", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Expertise", "fields": [{"label": "Skill 1", "value": [{"type": "paragraph", "label": "Skill 1", "children": [{"text": "Project scheduling", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Skill 2", "value": [{"type": "paragraph", "label": "Skill 2", "children": [{"text": "Vendor coordination", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Skill 3", "value": [{"type": "paragraph", "label": "Skill 3", "children": [{"text": "Budget tracking", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Skill 4", "value": [{"type": "paragraph", "label": "Skill 4", "children": [{"text": "Excel / CAD / MS Project", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}]}]},
{"label": "Education", "type": "education", "columnPosition": 0, "showHeading": true, "styling": {"border": {"right": {"display": true, "width": "2px", "height": "100%", "style": "solid", "color": "#BFA47A"}}}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "EDUCATION", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Sunridge College", "fields": [{"label": "Degree", "value": [{"type": "paragraph", "label": "Degree", "children": [{"text": "B.S. Construction Management", "fontSizeOffset": 0, "lineHeightOffset": 0, "bold": true}]}], "styling": {}, "layout": {}}, {"label": "School", "value": [{"type": "paragraph", "label": "School", "children": [{"text": "Sunridge College", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}, {"label": "Dates", "value": [{"type": "paragraph", "label": "Dates", "children": [{"text": "2014 - 2018", "fontSizeOffset": -0.5, "lineHeightOffset": 0, "color": "#64717B"}]}], "styling": {}, "layout": {}}]}]},
{"label": "Profile", "type": "summary", "columnPosition": 1, "showHeading": true, "styling": {}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "PROFILE", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Profile", "fields": [{"label": "Summary", "value": [{"type": "paragraph", "label": "Summary", "children": [{"text": "Project manager with 8 years of experience coordinating workplace upgrades and maintenance programs. Keeps vendors, site teams, and stakeholders aligned through clear scope, realistic schedules, and reliable follow-through.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}]}]},
{"label": "Experience", "type": "workHistory", "columnPosition": 1, "showHeading": true, "styling": {}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "EXPERIENCE", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Stonebridge Workspaces", "fields": [{"label": "Job Title", "value": [{"type": "paragraph", "label": "Job Title", "children": [{"text": "Facilities Project Manager", "fontSizeOffset": 1, "lineHeightOffset": 0, "bold": true}]}], "styling": {}, "layout": {}}, {"label": "Company", "value": [{"type": "paragraph", "label": "Company", "children": [{"text": "Stonebridge Workspaces | 2022 - Present", "fontSizeOffset": -0.5, "lineHeightOffset": 0, "color": "#64717B"}]}], "styling": {}, "layout": {}}, {"label": "Description", "value": [{"type": "unordered-list", "children": [{"type": "list-item", "children": [{"text": "Delivered 6 workplace improvement projects with a combined budget of $1.2M.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}, {"type": "list-item", "children": [{"text": "Standardized vendor milestones and reduced schedule overruns by 21%.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}]}], "styling": {}, "layout": {}}]}, {"label": "Desert Alder Group", "fields": [{"label": "Job Title", "value": [{"type": "paragraph", "label": "Job Title", "children": [{"text": "Facilities Coordinator", "fontSizeOffset": 1, "lineHeightOffset": 0, "bold": true}]}], "styling": {}, "layout": {}}, {"label": "Company", "value": [{"type": "paragraph", "label": "Company", "children": [{"text": "Desert Alder Group | 2018 - 2022", "fontSizeOffset": -0.5, "lineHeightOffset": 0, "color": "#64717B"}]}], "styling": {}, "layout": {}}, {"label": "Description", "value": [{"type": "unordered-list", "children": [{"type": "list-item", "children": [{"text": "Coordinated maintenance and move planning across 4 office locations.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}, {"type": "list-item", "children": [{"text": "Introduced asset tracking that cut time spent locating equipment by 35%.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}]}], "styling": {}, "layout": {}}]}]},
{"label": "Selected Project", "type": "projects", "columnPosition": 1, "showHeading": true, "styling": {}, "layout": {"display": "grid", "grid": {"columns": 1}, "padding": {"top": "0rem", "bottom": "0rem"}}, "value": [{"type": "heading", "textAlign": "left", "children": [{"text": "SELECTED PROJECT", "bold": true, "fontSizeOffset": 0, "lineHeightOffset": 0, "color": "#8B6539"}]}], "subsections": [{"label": "Workspace Renewal Program", "fields": [{"label": "Project Title", "value": [{"type": "paragraph", "label": "Project Title", "children": [{"text": "Workspace Renewal Program", "fontSizeOffset": 1, "lineHeightOffset": 0, "bold": true}]}], "styling": {}, "layout": {}}, {"label": "Description", "value": [{"type": "paragraph", "label": "Description", "children": [{"text": "Coordinated phased upgrades for 180 workstations while maintaining access for daily operations.", "fontSizeOffset": 0, "lineHeightOffset": 0}]}], "styling": {}, "layout": {}}]}]}
]
$resume_data$::jsonb AS sections
),
new_resume AS (
    INSERT INTO resumes (
        user_id, source_resume_id, title, styling, layout,
        is_official_template, created_at, updated_at
    )
    VALUES (
        1, NULL, 'Sandstone Rail',
        '{"display": "flex", "fontFamily": "Arial, Helvetica, sans-serif", "fontSize": "11.5px", "lineHeight": 1.3, "color": "#303B44", "backgroundColor": "#FFFFFF"}'::json,
        '{"padding": {"top": "1.5rem", "right": "1.5rem", "bottom": "1.5rem", "left": "1.5rem"}, "gap": {"horizontal": "0.3rem", "vertical": "0.38rem", "subsection": "0.6rem", "field": "0.13rem"}}'::json,
        TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id, title, user_id, is_official_template
),
new_columns AS (
    INSERT INTO columns (resume_id, position, styling, layout, created_at, updated_at)
    SELECT r.id, c.position, '{}'::json, c.layout,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM new_resume r
    CROSS JOIN (VALUES
        (0, '{"width": {"auto": false, "value": "29%"}, "padding": {"top": "0rem", "bottom": "0rem", "left": "0.9rem", "right": "0.9rem"}}'::json),
        (1, '{"width": {"auto": false, "value": "71%"}, "padding": {"top": "0rem", "bottom": "0rem", "left": "0.9rem", "right": "0.9rem"}}'::json)
    ) AS c(position, layout)
    RETURNING id, position
),
section_data AS (
    SELECT (s.ordinality - 1)::integer AS position, s.item
    FROM content
    CROSS JOIN LATERAL jsonb_array_elements(content.sections)
        WITH ORDINALITY AS s(item, ordinality)
),
new_sections AS (
    INSERT INTO sections (
        column_id, label, type, value, show_heading, position,
        styling, layout, created_at, updated_at
    )
    SELECT c.id, s.item->>'label', s.item->>'type',
        (s.item->'value')::json,
        (s.item->>'showHeading')::boolean, s.position,
        (s.item->'styling')::json, (s.item->'layout')::json,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM section_data s
    JOIN new_columns c ON c.position = (s.item->>'columnPosition')::integer
    RETURNING id, position
),
subsection_data AS (
    SELECT s.id AS section_id, (sub.ordinality - 1)::integer AS position, sub.item
    FROM new_sections s
    JOIN section_data d ON d.position = s.position
    CROSS JOIN LATERAL jsonb_array_elements(d.item->'subsections')
        WITH ORDINALITY AS sub(item, ordinality)
),
new_subsections AS (
    INSERT INTO subsections (
        section_id, label, type, position, styling, layout, created_at, updated_at
    )
    SELECT d.section_id, d.item->>'label', s.item->>'type', d.position,
        '{"fontSizeOffset":0,"lineHeightOffset":0}'::json, '{}'::json,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM subsection_data d
    JOIN new_sections n ON n.id = d.section_id
    JOIN section_data s ON s.position = n.position
    RETURNING id, section_id, position
),
new_fields AS (
    INSERT INTO fields (
        subsection_id, label, value, position, styling, layout, created_at, updated_at
    )
    SELECT sub.id, f.item->>'label', (f.item->'value')::json,
        (f.ordinality - 1)::integer,
        '{"fontSizeOffset":0,"lineHeightOffset":0}'::json, COALESCE((f.item->'layout')::json, '{}'::json),
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM new_subsections sub
    JOIN subsection_data d ON d.section_id = sub.section_id AND d.position = sub.position
    CROSS JOIN LATERAL jsonb_array_elements(d.item->'fields')
        WITH ORDINALITY AS f(item, ordinality)
    RETURNING id
)
SELECT id AS resume_id, title, user_id, is_official_template,
       (SELECT count(*) FROM new_fields) AS fields_created
FROM new_resume
