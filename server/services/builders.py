from copy import deepcopy
from models import Column, Field, Section, Subsection, db, Resume

from services.updaters import update_column_widths
from utils.formatting import format_label

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

DEFAULT_COLUMN_LAYOUT = {
    "padding": {
        "top": "0.5rem",
        "bottom": "0.5rem",
        "left": "1rem",
        "right": "1rem",
    },
    "width": {
        "auto": True,
        "value": "100%",
    },
}

# DEFAULT_SECTION_LAYOUT = {
#     'padding': {
#         'top': '0.5rem',
#         'bottom': '0.5rem',
#     }
# }

DEFAULT_SECTION_HEADERS = {
    "header": "Header",
    "workHistory": "Work History",
    "education": "Education",
    "skills": "Skills",
    "contact": "Contact",
    "summary": "Summary",
    "projects": "Projects",
    "custom": "Custom Section",
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
    "projects": ["Project Title", "Company/School", "Link", "Dates", "Description"],
    "custom": ["Custom Field"],
    "default": ["Field"],
}


def build_empty_slate_value(label):
    return [
        {
            "type": "paragraph",
            "label": label,
            "children": [{"text": "", "fontSizeOffset": 0, "lineHeightOffset": 0}],
        }
    ]


def build_section_heading_slate_value(section_type):
    heading = DEFAULT_SECTION_HEADERS.get(
        section_type, DEFAULT_SECTION_HEADERS["default"]
    )

    return [
        {
            "type": "heading",
            "label": format_label(section_type),
            "children": [{"text": heading, "fontSizeOffset": 2, "lineHeightOffset": 0}],
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


def add_column(resume_id, position=0):
    column = Column(
        resume_id=resume_id,
        position=position,
        layout=deepcopy(DEFAULT_COLUMN_LAYOUT),
    )
    
    update_column_widths(resume_id)

    db.session.add(column)
    db.session.flush()

    return column


def add_section(column_id, section_type, position=0):
    section = Section(
        column_id=column_id,
        label=format_label(section_type),
        type=section_type,
        position=position,
        # layout=deepcopy(DEFAULT_SECTION_LAYOUT),
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
        label=f"{format_label(section_type)} Subsection",
        type=section_type,
        position=position,
        styling={'fontSizeOffset': 0, 'lineHeightOffset': 0},
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
        label=format_label(label),
        position=position,
        value=build_empty_slate_value(label),
        styling={'fontSizeOffset': 0, 'lineHeightOffset': 0},
    )

    db.session.add(field)

    return field


def add_default_fields(subsection_id, section_type):
    default_fields = DEFAULT_FIELDS_DICT.get(
        section_type, DEFAULT_FIELDS_DICT["default"]
    )

    fields = []

    for idx, label in enumerate(default_fields):
        field = add_field(
            subsection_id=subsection_id,
            label=label,
            position=idx,
        )
        fields.append(field)

    return fields


def build_resume_with_defaults(title, user_id, sections_data):
    resume = create_resume(title, user_id)

    column = add_column(
        resume_id=resume.id,
        position=0,
    )

    section_position = 0

    for section_type, should_create in sections_data.items():
        if not should_create:
            continue

        add_section(
            column_id=column.id,
            section_type=section_type,
            position=section_position,
            # layout=deepcopy(DEFAULT_SECTION_LAYOUT)
        )

        section_position += 1

    return resume

def build_resume_copy(resume_id):
    original_resume = Resume.query.get(resume_id)

    if original_resume is None:
        return None

    # Helper function to create deep-copies of a models column-values in a new instance
    def copy_instance(instance, model, excluded_names):
        copied = {}
        for column in model.__table__.columns:
            column_name = column.name
            if column_name in excluded_names:
                continue
            copied[column_name] = deepcopy(getattr(instance, column_name))
        return model(**copied)

    resume_copy = copy_instance(
        original_resume,
        Resume,
        {"id", "title", "created_at", "updated_at"},
    )
    resume_copy.title = f"{original_resume.title} (Copy)"
    
    db.session.add(resume_copy)
    db.session.flush()

    # Copy columns from the original resume to the new resume.
    # Ordered by position, though probably not necessary, to catch edge cases of conflicting position values
    # This happens for sections, subsections, and fields as well
    original_columns = (
        Column.query.filter_by(resume_id=original_resume.id)
        .order_by(Column.position)
        .all()
    )

    for original_column in original_columns:
        column_copy = copy_instance(
            original_column,
            Column,
            {"id", "resume_id"},
        )
        column_copy.resume_id = resume_copy.id
        
        db.session.add(column_copy)
        db.session.flush()

        original_sections = (
            Section.query.filter_by(column_id=original_column.id)
            .order_by(Section.position)
            .all()
        )

        for original_section in original_sections:
            section_copy = copy_instance(
                original_section,
                Section,
                {"id", "column_id"},
            )
            section_copy.column_id = column_copy.id
            
            db.session.add(section_copy)
            db.session.flush()

            original_subsections = (
                Subsection.query.filter_by(section_id=original_section.id)
                .order_by(Subsection.position)
                .all()
            )

            for original_subsection in original_subsections:
                subsection_copy = copy_instance(
                    original_subsection,
                    Subsection,
                    {"id", "section_id"},
                )
                subsection_copy.section_id = section_copy.id
                
                db.session.add(subsection_copy)
                db.session.flush()

                original_fields = (
                    Field.query.filter_by(subsection_id=original_subsection.id)
                    .order_by(Field.position)
                    .all()
                )

                for original_field in original_fields:
                    field_copy = copy_instance(
                        original_field,
                        Field,
                        {"id", "subsection_id"},
                    )
                    field_copy.subsection_id = subsection_copy.id
                    
                    db.session.add(field_copy)

    db.session.commit()
    return resume_copy