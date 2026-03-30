from config import db


class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, default="Untitled Resume")
    styling = db.Column(db.JSON, nullable=False, default=dict)
    layout = db.Column(db.JSON, nullable=False, default=dict)

    columns = db.relationship(
        "Column",
        backref="resume",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Column.position",
    )

    def __repr__(self):
        return f"<Resume {self.id}: {self.title}>"


class Column(db.Model):
    __tablename__ = "columns"

    id = db.Column(db.String, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"), nullable=False)
    width = db.Column(db.String, nullable=True)
    position = db.Column(db.Integer, nullable=False, default=0)

    sections = db.relationship(
        "Section",
        backref="column",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Section.position",
    )

    def __repr__(self):
        return f"<Column {self.id}>"


class Section(db.Model):
    __tablename__ = "sections"

    id = db.Column(db.String, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"), nullable=False)
    column_id = db.Column(db.String, db.ForeignKey("columns.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    type = db.Column(db.String, nullable=False, default="defaultSection")
    value = db.Column(db.JSON, nullable=False, default=list)
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)

    subsections = db.relationship(
        "Subsection",
        backref="section",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Subsection.position",
    )

    def __repr__(self):
        return f"<Section {self.id}: {self.label}>"


class Subsection(db.Model):
    __tablename__ = "subsections"

    id = db.Column(db.String, primary_key=True)
    section_id = db.Column(db.String, db.ForeignKey("sections.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    type = db.Column(db.String, nullable=False, default="default")
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)

    fields = db.relationship(
        "Field",
        backref="subsection",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Field.position",
    )

    def __repr__(self):
        return f"<Subsection {self.id}: {self.label}>"


class Field(db.Model):
    __tablename__ = "fields"

    id = db.Column(db.String, primary_key=True)
    subsection_id = db.Column(db.String, db.ForeignKey("subsections.id"), nullable=False)
    label = db.Column(db.String, nullable=True)
    value = db.Column(db.JSON, nullable=False, default=list)
    styling = db.Column(db.JSON, nullable=False, default=dict)
    position = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<Field {self.id}: {self.label}>"