# Khushboo — Robotics & AI Portfolio
Plain HTML/CSS/JS. No dependencies, no build step, no API keys, no external fonts.

## Run locally (macOS)
    cd khushboo-robotics-ai-portfolio
    python3 -m http.server 8000     # open http://localhost:8000
(Opening index.html directly also works.)

## Edit content
Everything is in `data.js`: email, links, resume, skills, leadership, projects. Add a project by adding one object to `projects`.
Resume: `assets/resume.pdf` (your uploaded resume). To update, replace that file.

## Features
- **Hero simulation**: differential-drive kinematics (dx = v·cosθ·dt, dy = v·sinθ·dt, dθ = ω·dt). Sliders for v, ω and speed; play/pause/reset; trail; telemetry. Starts paused if reduced motion is on. Walls stop the robot.
- **Project explorer**: category filters, text search (name, summary, tech), expandable details.
- **Technical map**: click a skill to search projects using it. "No verified project" means none found.
- **Command palette**: Cmd/Ctrl+K, arrows, Enter, Esc.

## Publish to GitHub Pages (existing repo)
    git clone https://github.com/Khushii0213/khushii0213.github.io && cd khushii0213.github.io
    # replace its contents with this folder's files (keep .git)
    git add -A && git commit -m "New portfolio" && git push
Pages serves from the main branch root.

## To verify / assumptions
- Email taken from your old site. Phone number deliberately NOT included.
- Leadership entries come from your resume; edit `leadership` in `data.js`.
- Projects 09–11 came from your old site without public repos; add links or remove.
- SQL and RAG metrics are copied from your resume; the ~30% path-planning claim is not shown on the site.
- Old claims (e.g. "30+ FPS", "88% accuracy" style stats) were intentionally dropped as unverified.
