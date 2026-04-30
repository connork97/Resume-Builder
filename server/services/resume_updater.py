from models import db, Resume, Column, Section, Subsection, Field


def update_resume_with_form_data(resume_id, data):
    resume = Resume.query.filter(Resume.id == resume_id).one_or_none()

    if not resume:
        raise ValueError(f"Could not find resume of ID {resume_id}.")

    # * ------------------------
    # * Top Level Resume Updates
    # * ------------------------

    if "title" in data:
        resume.title = data["title"]

    if "styling" in data:
        resume.styling = data["styling"]

    if "layout" in data:
        resume.layout = data["layout"]

    # * --------------
    # * Column updates
    # * --------------

    columns_by_id = data.get("columns", {}).get("byId", {})
    for column_id, column_data in columns_by_id.items():
        column = Column.query.get(int(column_id))
        if not column:
            continue

        if "width" in column_data:
            column.width = column_data["width"]

        if "position" in column_data:
            column.position = column_data["position"]

    # * ---------------
    # * Section updates
    # * ---------------

    sections_by_id = data.get("sections", {}).get("byId", {})
    for section_id, section_data in sections_by_id.items():
        section = Section.query.get(int(section_id))
        if not section:
            continue

        if "label" in section_data:
            section.label = section_data["label"]

        if "type" in section_data:
            section.type = section_data["type"]

        if "value" in section_data:
            section.value = section_data["value"]

        if "styling" in section_data:
            section.styling = section_data["styling"]

        if "position" in section_data:
            section.position = section_data["position"]

        if "columnId" in section_data:
            section.column_id = section_data["columnId"]

        if "showHeading" in section_data:
            section.show_heading = section_data["showHeading"]

    # * ------------------
    # * Subsection updates
    # * ------------------

    subsections_by_id = data.get("subsections", {}).get("byId", {})
    for subsection_id, subsection_data in subsections_by_id.items():
        subsection = Subsection.query.get(int(subsection_id))
        if not subsection:
            continue

        if "label" in subsection_data:
            subsection.label = subsection_data["label"]

        if "type" in subsection_data:
            subsection.type = subsection_data["type"]

        if "styling" in subsection_data:
            subsection.styling = subsection_data["styling"]

        if "position" in subsection_data:
            subsection.position = subsection_data["position"]

        if "sectionId" in subsection_data:
            subsection.section_id = subsection_data["sectionId"]

    # * -------------
    # * Field updates
    # * -------------

    fields_by_id = data.get("fields", {}).get("byId", {})
    
    incoming_field_ids = {int(field_id) for field_id in fields_by_id.keys()}
    
    existing_fields = (
        Field.query.join(Subsection)
        .join(Section)
        .join(Column)
        .filter(Column.resume_id == resume_id)
        .all()
    )

    for field in existing_fields:
        if field.id not in incoming_field_ids:
            db.session.delete(field)
    for field_id, field_data in fields_by_id.items():
        field = Field.query.get(int(field_id))
        if not field:
            continue

        if "label" in field_data:
            field.label = field_data["label"]

        if "value" in field_data:
            field.value = field_data["value"]

        if "styling" in field_data:
            field.styling = field_data["styling"]

        if "position" in field_data:
            field.position = field_data["position"]

        if "subsectionId" in field_data:
            field.subsection_id = field_data["subsectionId"]

    return resume
