Add your resume PDF here.

Required file path (relative to this folder):
    sathvika-gudise-resume.pdf

Full path in the project:
    public/resume/sathvika-gudise-resume.pdf

Until this file exists, every "Resume" button stays honest: instead of
downloading nothing, it explains where to put the PDF. Once the file is
present (restart the dev server if it is already running), the buttons
switch to a real download automatically — no code change needed.

If you rename the file, update `assets.resume.path` in
src/data/content.ts.
