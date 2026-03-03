Resume Builder

FRONT END

Completed/Functional Main Features:

-Create all primary/frequently used resume sections including but not limited to:
   -Header
   -Contact Info
   -Summary
   -Employment/Work History
   -Education
   -Skills
-Ability to add, reorder, and delete each section (full CRUD)
   -Same for the subsections
   -Same for the fields/inputs within subsections


Uncompleted Main Features:

-User can add custom sections in resume (not just the prebuilt ones)
-Adding columns
   -User can have columns independently in each section, or just per document?
-User text formatting
   -How customizable?  Per content type (headers, subheaders, main text all independently stylable ideally) or globally controlled?
-User section/subsection styling
   -Background color, borders, etc
-Make PDF download/Printing capability

Future Addons/Todos:

-Investigate upgrading to DND React Drag&Drop Libary
-Investigate upgrading from React Print to a better PDF download
-Investigate AI integration for resume suggestions (longer term, unsure if this is something I even want)



BACK END

DB Structure (work in progress, unstarted as of typing this):

User:
   -id
   -username/email
   -password
   -templates (created)
   -templates (liked - if publishing ability is added)
   -resumes: resume.ids (individual, created and saved resumes for the specific user)

Resume:
   -id
   -user.id
   content:
      -contentId
      -contentType (header, subheader, main content like descriptions, etc)
      -contentText
      -contentStyles (array of objects?  Each key/value pair being the style type and value?)
   -template.id