# Resume SQL work

Before creating or revising resume templates in this directory, read `README.md`
for the user's explicit design judgments and the status of proposed refinements.
Treat inferred preferences as hypotheses, and preserve approved design diversity.

Provide PostgreSQL statements for the user to run unless execution is explicitly
requested. Existing-resume updates must target the supplied resume ID and owner,
preserve user edits outside the requested changes, and be atomic.
