from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from config import db



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=True)
    # username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())
    
    resumes = db.relationship(
        "Resume",
        backref="user",
        cascade="all, delete-orphan",
        lazy=True,
        order_by="Resume.updated_at.desc()",
    )
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, exclude=None, only=None, condense_relationship_data=True):
        exclude = exclude or []
        only = only or []
        user_dict = {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            # "username": self.username,
            "email": self.email,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if only:
            user_dict = {key: value for key, value in user_dict.items() if key in only}
            
        if condense_relationship_data:
            user_dict["resumes"] = [{"id": resume.id, "title": resume.title} for resume in self.resumes]
        else:
            user_dict["resumes"] = [resume.to_dict() for resume in self.resumes]
        
        if exclude:
            for key in exclude:
                user_dict.pop(key, None)
                # del user_dict[key]
        
        return user_dict
        
    def __repr__(self):
        return f"<User {self.id}>"

class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
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
            "userId": self.user_id,
            "title": self.title,
            "styling": self.styling,
            "layout": self.layout,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "columns": [column.to_dict() for column in self.columns],
        }

    def __repr__(self):
        return f"<Resume {self.id}: {self.title}>"


class Column(db.Model):
    __tablename__ = "columns"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"), nullable=False)
    position = db.Column(db.Integer, nullable=False, default=0)
    width = db.Column(db.String, nullable=True)
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
            "resumeId": self.resume_id,
            "width": self.width,
            "position": self.position,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
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
    show_heading = db.Column(db.Boolean, nullable=False, default=True, server_default='1')
    position = db.Column(db.Integer, nullable=False, default=0)
    styling = db.Column(db.JSON, nullable=False, default=dict)
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
            "columnId": self.column_id,
            "label": self.label,
            "type": self.type,
            "value": self.value,
            "showHeading": self.show_heading,
            "position": self.position,
            "styling": self.styling,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
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
            "sectionId": self.section_id,
            "label": self.label,
            "type": self.type,
            "styling": self.styling,
            "position": self.position,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
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
            "subsectionId": self.subsection_id,
            "label": self.label,
            "value": self.value,
            "styling": self.styling,
            "position": self.position,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Field {self.id}: {self.label}>"