from copy import deepcopy
from models import Column, Field, Section, Subsection, db, Resume

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
    "header": "Header",
    "workHistory": "Work History",
    "education": "Education",
    "skills": "Skills",
    "contact": "Contact",
    "summary": "Summary",
    "default": "New Section",
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
    heading = DEFAULT_SECTION_HEADERS.get(
        section_type, DEFAULT_SECTION_HEADERS["default"]
    )

    return [
        {
            "type": "heading",
            "label": section_type,
            "children": [{"text": heading}],
        }
    ]


def create_resume(title, user_id):
    resume = Resume(
        title=title,
        user_id=user_id,
        styling=deepcopy(DEFAULT_RESUME_STYLING),
        layout=deepcopy(DEFAULT_RESUME_LAYOUT),
    )

    db.session.add(resume)
    db.session.flush()

    return resume


def add_column(resume_id, position=0, width="100%"):
    column = Column(
        resume_id=resume_id,
        position=position,
        width=width,
    )

    db.session.add(column)
    db.session.flush()

    return column


def add_section(column_id, section_type, position=0):
    section = Section(
        column_id=column_id,
        label=section_type,
        type=section_type,
        position=position,
        value=build_section_heading_slate_value(section_type),
    )

    db.session.add(section)
    db.session.flush()
    
    subsection = add_subsection(
       section_id=section.id,
       section_type=section_type,
       position=0
    )
    
    db.session.add(subsection)
    db.session.flush()

    return section


def add_subsection(section_id, section_type, position=0):
    subsection = Subsection(
        section_id=section_id,
        label=f"{section_type} Subsection",
        type=section_type,
        position=position,
    )

    db.session.add(subsection)
    db.session.flush()
    
    fields = add_default_fields(
       subsection_id=subsection.id,
       section_type=section_type
    )
    
    for field in fields:
       db.session.add(field)

    db.session.flush()
    return subsection


def add_field(subsection_id, label='New Field', position=0):
    field = Field(
        subsection_id=subsection_id,
        label=label,
        position=position,
        value=build_empty_slate_value(label),
    )

    db.session.add(field)

    return field


def add_default_fields(subsection_id, section_type):
    default_fields = DEFAULT_FIELDS_DICT.get(
        section_type, DEFAULT_FIELDS_DICT["default"]
    )

    fields = []

    for idx, field_label in enumerate(default_fields):
        field = add_field(
            subsection_id=subsection_id,
            field_label=field_label,
            position=idx,
        )
        fields.append(field)

    return fields


def build_resume_with_defaults(title, user_id, sections_data):
    resume = create_resume(title, user_id)

    column = add_column(
        resume_id=resume.id,
        position=0,
        width="100%",
    )

    section_position = 0

    for section_type, should_create in sections_data.items():
        if not should_create:
            continue

        section = add_section(
            column_id=column.id,
            section_type=section_type,
            position=section_position,
        )

        subsection = add_subsection(
            section_id=section.id,
            section_type=section.type,
            position=0,
        )

        add_default_fields(
            subsection_id=subsection.id,
            section_type=section.type,
        )

        section_position += 1

    return resume