from config import db
from config import app

from services.builders import build_resume_copy

from models import Resume


def delete_existing_demo_resume():
    existing_demo_resume = Resume.query.filter(Resume.id == 0).one_or_none()
    if existing_demo_resume:
        db.session.delete(existing_demo_resume)
        # deleted_resume = True
        db.session.flush()

def build_new_demo_resume():
    new_demo_resume = build_resume_copy(28)

    for column in new_demo_resume.columns:
        column.resume_id = 0
        db.session.add(column)
        db.session.flush()
        
    new_demo_resume.id = 0
    new_demo_resume.title = 'Demo Resume'
    db.session.add(new_demo_resume)
    db.session.flush()
        
    db.session.commit()

def main():
    with app.app_context():
        try:
            delete_existing_demo_resume()
			# user = create_demo_user()
            build_new_demo_resume()

            # new_demo_resume.id = 0

            db.session.commit()

            print(
                'Seed complete'
                # f"Seed complete: deleted resume={deleted_resume}; created resume (id={resume.id})"
				# f"Seed complete: deleted user={deleted_user}, deleted resume={deleted_resume}; "
				# f"created user (id={user.id}, email={user.email}) and resume (id={resume.id}, user_id={resume.user_id})"
			)
        except Exception as exc:
            db.session.rollback()
            print(f"Seed failed: {exc}")
            raise


if __name__ == "__main__":
	main()

# from datetime import datetime, timezone

# from config import app, db
# from models import Column, User, Resume

# from lorem_text import lorem

# from services.builders import build_resume_with_defaults

# from routes.column_routes import add_column, add_section

# DEMO_EMAIL = "demo@example.com"
# DEMO_PASSWORD = "change-me"
# DEMO_TITLE = "Demo Resume"

# DEMO_STYLING = {
# 	"display": "flex",
# 	"fontSize": "12px",
# 	"lineHeight": 1.2,
# 	"color": "rgba(0, 0, 0, 1)",
# 	"backgroundColor": "rgba(255, 255, 255, 1)",
# }

# DEMO_LAYOUT = {
# 	"padding": {
# 		"top": "2.5rem",
# 		"right": "2.5rem",
# 		"bottom": "2.5rem",
# 		"left": "2.5rem",
# 	},
# 	"gap": {
# 		"horizontal": "1rem",
# 		"vertical": "0.5rem",
# 	},
# }


# def delete_existing_demo_data():
# 	deleted_user = False
# 	deleted_resume = False

# 	demo_user = User.query.filter_by(email=DEMO_EMAIL).one_or_none()
# 	if demo_user:
# 		db.session.delete(demo_user)
# 		deleted_user = True
# 		# Flush so cascade deletes happen before we check for an orphaned id=0 resume.
# 		db.session.flush()

# 	demo_resume = Resume.query.filter(Resume.id == 0).one_or_none()
# 	if demo_resume:
# 		db.session.delete(demo_resume)
# 		deleted_resume = True
# 		db.session.flush()

# 	return deleted_user, deleted_resume


# def create_demo_user():
# 	user = User(
# 		id=0,
# 		first_name="Demo",
# 		last_name="User",
# 		email=DEMO_EMAIL,
# 	)
# 	user.set_password(DEMO_PASSWORD)
# 	db.session.add(user)
# 	db.session.flush()
# 	return user

#    #  "header": {''},
#    #  "workHistory": "Work History",
#    #  "education": "Education",
#    #  "skills": "Skills",
#    #  "contact": "Contact",
#    #  "summary": "Summary",
#    #  "projects": "Projects",
#    #  "custom": "Custom Section",
#    #  "default": "New Section",
# def create_demo_resume(user):
#    resume = build_resume_with_defaults(
#        title=DEMO_TITLE,
#        user_id=user.id,
#        sections_data={'header': True, 'contact': True, 'summary': True, 'skills': True, 'workHistory': True, 'education': True, 'projects': True}
#    )
#    db.session.add(resume)
#    db.session.flush()

#    column = resume.columns[0]
#    column.resume_id = 0
#    resume.id = 0
#    for section in column.sections:
#       if (section.type == 'header'):
#          section.show_heading = False
#       for subsection in section.subsections:
#          for field in subsection.fields:
#             field.value = [{"type": "paragraph", "label": field.label, "children": [{"type": "text", "text": lorem.words(1)}]}]
#             # field_value = field.value[0]["children"][0]["text"]
#             # print(field_value, 'field value')
#             # field.value[0]["children"][0]["text"] = lorem.words(1)
#             # print(field_value, 'field value')

#             # field.value[0]["children"][0]["text"] = 'lorem.words(1)'
#             print(lorem.words(1))


#    # db.session.commit()

#    return resume
# 	# resume = Resume(
# 	# 	id=0,
# 	# 	user_id=user.id,
# 	# 	title=DEMO_TITLE,
# 	# 	styling=DEMO_STYLING,
# 	# 	layout=DEMO_LAYOUT,
# 	# )
# 	# db.session.add(resume)
# 	# db.session.flush()
# 	# return resume

# def main():
# 	with app.app_context():
# 		try:
# 			deleted_user, deleted_resume = delete_existing_demo_data()
# 			user = create_demo_user()
# 			resume = create_demo_resume(user)

# 			db.session.commit()

# 			print(
# 				f"Seed complete: deleted user={deleted_user}, deleted resume={deleted_resume}; "
# 				f"created user (id={user.id}, email={user.email}) and resume (id={resume.id}, user_id={resume.user_id})"
# 			)
# 		except Exception as exc:
# 			db.session.rollback()
# 			print(f"Seed failed: {exc}")
# 			raise


# if __name__ == "__main__":
# 	main()
