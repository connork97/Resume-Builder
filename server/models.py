from config import db

from datetime import datetime

class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String, nullable=False, default="Untitled Resume")
    styling = db.Column(db.JSON, nullable=False, default=dict)
    layout = db.Column(db.JSON, nullable=False, default=dict)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

    columns = db.relationship(
        "Column",
        backref="resume",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Column.position",
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "styling": self.styling,
            "layout": self.layout,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "columns": [column.to_dict() for column in self.columns],
        }

    def __repr__(self):
        return f"<Resume {self.id}: {self.title}>"


class Column(db.Model):
    __tablename__ = "columns"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"), nullable=False)
    width = db.Column(db.String, nullable=True)
    position = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

    sections = db.relationship(
        "Section",
        backref="column",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Section.position",
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "width": self.width,
            "position": self.position,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "sections": [section.to_dict() for section in self.sections],
        }

    def __repr__(self):
        return f"<Column {self.id}>"


class Section(db.Model):
    __tablename__ = "sections"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    column_id = db.Column(db.Integer, db.ForeignKey("columns.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    type = db.Column(db.String, nullable=False, default="defaultSection")
    value = db.Column(db.JSON, nullable=False, default=list)
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

    subsections = db.relationship(
        "Subsection",
        backref="section",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Subsection.position",
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "column_id": self.column_id,
            "label": self.label,
            "type": self.type,
            "value": self.value,
            "styling": self.styling,
            "position": self.position,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "subsections": [subsection.to_dict() for subsection in self.subsections],
        }

    def __repr__(self):
        return f"<Section {self.id}: {self.label}>"


class Subsection(db.Model):
    __tablename__ = "subsections"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    section_id = db.Column(db.Integer, db.ForeignKey("sections.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    type = db.Column(db.String, nullable=False, default="default")
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())


    fields = db.relationship(
        "Field",
        backref="subsection",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Field.position",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "section_id": self.section_id,
            "label": self.label,
            "type": self.type,
            "styling": self.styling,
            "position": self.position,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "fields": [field.to_dict() for field in self.fields],
        }

    def __repr__(self):
        return f"<Subsection {self.id}: {self.label}>"


class Field(db.Model):
    __tablename__ = "fields"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subsection_id = db.Column(db.Integer, db.ForeignKey("subsections.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    value = db.Column(db.JSON, nullable=False, default=list)
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "subsection_id": self.subsection_id,
            "label": self.label,
            "value": self.value,
            "styling": self.styling,
            "position": self.position,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f"<Field {self.id}: {self.label}>"