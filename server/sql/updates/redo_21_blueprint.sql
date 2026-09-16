WITH
plan AS (
    SELECT $redesign$
{
  "id": 21,
  "title": "Jane Doe - Blueprint",
  "resumeStyling": {
    "fontFamily": "Arial, Helvetica, sans-serif",
    "color": "#28323C",
    "backgroundColor": "#FFFFFF"
  },
  "sections": [
    {
      "type": "header",
      "styling": {
        "backgroundColor": "#2446A0",
        "color": "#FFFFFF"
      },
      "layout": {
        "display": "grid",
        "grid": {
          "columns": 1
        },
        "padding": {
          "top": "0rem",
          "bottom": "0.65rem"
        }
      }
    },
    {
      "type": "skills",
      "styling": {
        "backgroundColor": "#F3F6FC",
        "color": "#28323C"
      },
      "layout": {
        "display": "grid",
        "grid": {
          "columns": 2
        },
        "padding": {
          "top": "0.15rem",
          "bottom": "0.15rem"
        }
      }
    }
  ],
  "fields": [
    {
      "type": "header",
      "label": "Name",
      "align": "left",
      "marks": {
        "fontSizeOffset": 17,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#FFFFFF"
      }
    },
    {
      "type": "header",
      "label": "Title",
      "align": "left",
      "marks": {
        "fontSizeOffset": 0.5,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#FFFFFF"
      }
    },
    {
      "type": "header",
      "label": "Contact",
      "align": "left",
      "marks": {
        "fontSizeOffset": -0.5,
        "lineHeightOffset": 0,
        "bold": false,
        "color": "#EDF2FF"
      }
    },
    {
      "type": "skills",
      "label": "Frontend",
      "align": "left",
      "marks": {
        "fontSizeOffset": 0,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#2446A0"
      },
      "position": 0
    },
    {
      "type": "skills",
      "label": "Backend",
      "align": "left",
      "marks": {
        "fontSizeOffset": 0,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#2446A0"
      },
      "position": 2
    },
    {
      "type": "skills",
      "label": "Delivery",
      "align": "left",
      "marks": {
        "fontSizeOffset": 0,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#2446A0"
      },
      "position": 4
    },
    {
      "type": "skills",
      "label": "Quality",
      "align": "left",
      "marks": {
        "fontSizeOffset": 0,
        "lineHeightOffset": 0,
        "bold": true,
        "color": "#2446A0"
      },
      "position": 6
    },
    {
      "type": "skills",
      "label": "Frontend tools",
      "align": "left",
      "marks": {
        "fontSizeOffset": -0.5,
        "lineHeightOffset": 0,
        "bold": false,
        "color": "#36465C"
      },
      "position": 1
    },
    {
      "type": "skills",
      "label": "Backend tools",
      "align": "left",
      "marks": {
        "fontSizeOffset": -0.5,
        "lineHeightOffset": 0,
        "bold": false,
        "color": "#36465C"
      },
      "position": 3
    },
    {
      "type": "skills",
      "label": "Delivery tools",
      "align": "left",
      "marks": {
        "fontSizeOffset": -0.5,
        "lineHeightOffset": 0,
        "bold": false,
        "color": "#36465C"
      },
      "position": 5
    },
    {
      "type": "skills",
      "label": "Quality tools",
      "align": "left",
      "marks": {
        "fontSizeOffset": -0.5,
        "lineHeightOffset": 0,
        "bold": false,
        "color": "#36465C"
      },
      "position": 7
    }
  ]
}
$redesign$::jsonb AS data
),
target AS MATERIALIZED (
    SELECT r.id, r.title
    FROM resumes r CROSS JOIN plan p
    WHERE r.id = (p.data->>'id')::integer
      AND r.user_id = 1
      AND r.title = p.data->>'title'
    FOR UPDATE OF r
),
section_plan AS (
    SELECT item AS patch
    FROM plan p CROSS JOIN LATERAL jsonb_array_elements(p.data->'sections') AS a(item)
),
field_plan AS (
    SELECT item AS patch
    FROM plan p CROSS JOIN LATERAL jsonb_array_elements(p.data->'fields') AS a(item)
),
owned_sections AS MATERIALIZED (
    SELECT s.* FROM sections s
    JOIN columns c ON c.id = s.column_id JOIN target t ON t.id = c.resume_id
),
owned_fields AS MATERIALIZED (
    SELECT f.*, s.type AS section_type
    FROM fields f JOIN subsections sub ON sub.id = f.subsection_id
    JOIN owned_sections s ON s.id = sub.section_id
),
field_changes AS MATERIALIZED (
    SELECT f.*, fp.patch,
        (SELECT string_agg(leaf.item->>'text', ' ' ORDER BY node.ordinality, leaf.ordinality)
         FROM jsonb_array_elements(f.value::jsonb) WITH ORDINALITY AS node(item, ordinality)
         CROSS JOIN LATERAL jsonb_array_elements(node.item->'children')
             WITH ORDINALITY AS leaf(item, ordinality)) AS flat_text
    FROM owned_fields f JOIN field_plan fp
      ON fp.patch->>'type' = f.section_type AND fp.patch->>'label' = f.label
),
validation AS MATERIALIZED (
    SELECT EXISTS (SELECT 1 FROM target)
      AND NOT EXISTS (
          SELECT 1 FROM section_plan sp
          WHERE (SELECT count(*) FROM owned_sections s WHERE s.type = sp.patch->>'type') <> 1
      )
      AND NOT EXISTS (
          SELECT 1 FROM field_plan fp
          WHERE (SELECT count(*) FROM owned_fields f
                 WHERE f.section_type = fp.patch->>'type' AND f.label = fp.patch->>'label') <> 1
      )
      AND NOT EXISTS (
          SELECT 1 FROM field_changes fc
          WHERE jsonb_array_length(fc.value::jsonb) = 0
             OR EXISTS (
                 SELECT 1 FROM jsonb_array_elements(fc.value::jsonb) AS node(item)
                 WHERE node.item->>'type' IS DISTINCT FROM 'paragraph'
                    OR jsonb_array_length(node.item->'children') = 0
                    OR EXISTS (
                        SELECT 1 FROM jsonb_array_elements(node.item->'children') AS leaf(item)
                        WHERE jsonb_typeof(leaf.item->'text') IS DISTINCT FROM 'string'
                    )
             )
             OR (COALESCE((fc.patch->>'metric')::boolean, false)
                 AND COALESCE(btrim(regexp_replace(fc.flat_text, '[[:space:]]+', ' ', 'g'))
                     !~ '^[0-9][^ ]* .+', true))
      )
      AND (
          (SELECT (data->>'id')::integer FROM plan) <> 21
          OR (
              (SELECT count(*) FROM owned_fields WHERE section_type = 'skills') = 8
              AND (SELECT count(*) FROM subsections sub
                   JOIN owned_sections s ON s.id = sub.section_id WHERE s.type = 'skills') = 1
          )
      ) AS ok
),
updated_resume AS (
    UPDATE resumes r
    SET styling = (r.styling::jsonb || (p.data->'resumeStyling'))::json,
        layout = jsonb_set(r.layout::jsonb, '{gap}',
            COALESCE(r.layout::jsonb->'gap', '{}'::jsonb) ||
            '{"vertical":"0.4rem","subsection":"0.6rem","field":"0.13rem"}'::jsonb)::json,
        updated_at = CURRENT_TIMESTAMP
    FROM target t, plan p, validation v
    WHERE r.id = t.id AND v.ok
    RETURNING r.id, r.title
),
updated_sections AS (
    UPDATE sections s
    SET label = COALESCE(sp.patch->>'label', s.label),
        value = CASE WHEN sp.patch ? 'value' THEN (sp.patch->'value')::json ELSE s.value END,
        styling = CASE WHEN sp.patch ? 'styling'
            THEN ((s.styling::jsonb - 'border') || (sp.patch->'styling'))::json ELSE s.styling END,
        layout = CASE WHEN sp.patch ? 'layout'
            THEN (s.layout::jsonb || (sp.patch->'layout'))::json ELSE s.layout END,
        updated_at = CURRENT_TIMESTAMP
    FROM owned_sections owned, section_plan sp, validation v
    WHERE s.id = owned.id AND sp.patch->>'type' = owned.type AND v.ok
    RETURNING s.id
),
updated_fields AS (
    UPDATE fields f
    SET position = COALESCE((fc.patch->>'position')::integer, f.position),
        layout = CASE WHEN fc.patch ? 'position'
            THEN ((f.layout::jsonb - 'grid') || jsonb_build_object(
                'startNewRow', (fc.patch->>'position')::integer % 2 = 0))::json
            ELSE f.layout END,
        value = CASE WHEN COALESCE((fc.patch->>'metric')::boolean, false) THEN
            jsonb_build_array(
                jsonb_build_object('type','paragraph','textAlign','center','children',jsonb_build_array(
                    jsonb_build_object('text',split_part(mt.text, ' ', 1),
                        'fontSizeOffset',5,'lineHeightOffset',0,'bold',true,'color','#A64E35'))),
                jsonb_build_object('type','paragraph','textAlign','center','children',jsonb_build_array(
                    jsonb_build_object('text',substr(mt.text, length(split_part(mt.text, ' ', 1)) + 2),
                        'fontSizeOffset',-0.5,'lineHeightOffset',0,'color','#68584F')))
            )::json
        ELSE (
            SELECT jsonb_agg(
                node.item
                || CASE WHEN fc.patch ? 'align'
                    THEN jsonb_build_object('textAlign', fc.patch->>'align') ELSE '{}'::jsonb END
                || jsonb_build_object('children', (
                    SELECT jsonb_agg(
                        leaf.item || COALESCE(fc.patch->'marks', '{}'::jsonb)
                        || CASE WHEN COALESCE((fc.patch->>'normalizeSpaces')::boolean, false)
                            THEN jsonb_build_object('text', regexp_replace(
                                leaf.item->>'text', '[[:space:]]{2,}', ' / ', 'g')) ELSE '{}'::jsonb END
                        ORDER BY leaf.ordinality)
                    FROM jsonb_array_elements(node.item->'children')
                        WITH ORDINALITY AS leaf(item, ordinality)
                )) ORDER BY node.ordinality
            )::json
            FROM jsonb_array_elements(f.value::jsonb) WITH ORDINALITY AS node(item, ordinality)
        ) END,
        updated_at = CURRENT_TIMESTAMP
    FROM field_changes fc
    CROSS JOIN LATERAL (SELECT btrim(regexp_replace(fc.flat_text, '[[:space:]]+', ' ', 'g')) AS text) mt
    CROSS JOIN validation v
    WHERE f.id = fc.id AND v.ok
    RETURNING f.id
)
SELECT (p.data->>'id')::integer AS resume_id,
       CASE WHEN v.ok THEN 'Updated'
            ELSE 'Not updated: check resume ID, owner 1, original title, and expected template structure'
       END AS status,
       (SELECT count(*) FROM updated_resume) AS resumes_updated,
       (SELECT count(*) FROM updated_sections) AS sections_updated,
       (SELECT count(*) FROM updated_fields) AS fields_updated
FROM plan p CROSS JOIN validation v
