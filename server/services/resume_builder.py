from models import Column, Field, Section, Subsection, db, Resume
from copy import deepcopy

DEFAULT_RESUME_STYLING = {
    "display": "flex",
    "fontSize": "12px",
    "lineHeight": 1.2,
    "color": "rgba(0, 0, 0, 1)",
    "backgroundColor": "rgba(255, 255, 255, 1)",
}

DEFAULT_RESUME_LAYOUT = {
    "padding": {
        "top": "2.5rem",
        "right": "2.5rem",
        "bottom": "2.5rem",
        "left": "2.5rem",
    },
    "gap": {
        "horizontal": "1rem",
        "vertical": "0.5rem",
    },
}

DEFAULT_SECTION_HEADERS = {
    "header": 'Header',
    "workHistory": 'Work History',
    'education': 'Education',
    'skills': 'Skills',
    'contact': 'Contact',
    'summary': 'Summary',
    'default': 'New Section'
}

DEFAULT_FIELDS_DICT = {
    "header": ["Name", "Title"],
    "workHistory": [
        "Job Title",
        "Company",
        "Location",
        "Start/End Dates",
        "Description",
    ],
    "education": [
        "School",
        "Degree",
        "Field of Study",
        "Location",
        "Start/End Dates",
        "Description",
    ],
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "contact": ["Email", "Phone", "Location", "Website", "LinkedIn"],
    "summary": ["Summary"],
    "default": ["Field"],
}


def build_empty_slate_value(field_label):
    return [
        {
            "type": "paragraph",
            "label": field_label,
            "children": [{"text": ""}],
        }
    ]

def build_section_heading_slate_value(section_type):
    return [
        {
            'type': 'heading',
            'label': section_type,
            'children': [{'text': DEFAULT_SECTION_HEADERS[section_type]}]
        }
    ]

def build_resume_with_defaults(title, user_id, sections_data):
    new_resume = Resume(
        title=title,
        user_id=user_id,
        styling=deepcopy(DEFAULT_RESUME_STYLING),
        layout=deepcopy(DEFAULT_RESUME_LAYOUT),
    )
    db.session.add(new_resume)
    db.session.flush()

    new_column = Column(resume_id=new_resume.id, position=0, width="100%")
    db.session.add(new_column)
    db.session.flush()

    section_position = 0

    for section_type, should_create in sections_data.items():
        if not should_create:
            continue

        new_section = Section(
            column_id=new_column.id,
            label=section_type,
            type=section_type,
            position=section_position,
            value=build_section_heading_slate_value(section_type)
        )
        db.session.add(new_section)
        db.session.flush()

        new_subsection = Subsection(
            section_id=new_section.id,
            label=f"{section_type} Subsection",
            type=new_section.type,
            position=0,
        )
        db.session.add(new_subsection)
        db.session.flush()

        default_fields = DEFAULT_FIELDS_DICT.get(
            section_type, DEFAULT_FIELDS_DICT["default"]
        )

        for idx, field_label in enumerate(default_fields):
            new_field = Field(
                subsection_id=new_subsection.id,
                label=field_label,
                position=idx,
                value=build_empty_slate_value(field_label),
            )
            db.session.add(new_field)

        section_position += 1

    return new_resume