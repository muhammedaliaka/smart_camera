---
name: find-skills
description: Use when no installed skill covers the task, or the user asks "is there a skill for X". Searches skill directories; never installs without a scan and an explicit yes.
license: MIT
---

# Find skills (adapted)

Adapted from vercel-labs/skills `find-skills`, MIT. Changed: no auto-install, scan before install, telemetry off, local skills first. See THIRD_PARTY.md.

A skill is instructions the agent obeys. A hostile one can run commands or leak files. So: search freely, install only after a scan and a yes.

## Steps
1. **Local first.** Check `recipes`, then the project's `.claude/skills` and `.agents/skills`. A skill you already have beats a new one.
2. **Search.** `DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npx skills@1.7.4 find <2 to 4 specific words>` (Node 22.20 or newer). No Node or no network: say so, point to https://skills.sh, stop.
3. **Judge each hit.** Check the owner, read the source, check the date. Install counts and stars show popularity, not quality; fake stars exist. Say what you checked.
4. **Report at most 3 options** in plain Turkish: name, one line of what it does, owner, source link, "not scanned". Recommend one or none.
5. **Install only after the user names one and says yes.** Never `-y`, never `-g`.
   - Clone the repo (shallow) into a scratch folder, not the project.
   - `skillspector scan <skill folder>`. Any finding: show it, do not install.
   - Read the whole `SKILL.md` and its scripts. Scripts or network calls you cannot explain: do not install.
   - Copy only that skill folder into the project's `.claude/skills` and `.agents/skills`.
   - Add one row to the project's `THIRD_PARTY.md`: name, license as stated, link, commit.
6. MCP servers stay off. A skill that needs one: say so and let the user decide.
