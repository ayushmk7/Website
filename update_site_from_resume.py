#!/usr/bin/env python3
"""Update the portfolio site from a LaTeX resume.

Usage:
    python update_site_from_resume.py [--resume resume.tex] [--root .]
    python update_site_from_resume.py --selfcheck

Drop your resume.tex in the project root and run it. It parses the ATS-style
template (the \\resumeSubheading / \\resumeItem / \\resumeProjectHeading macros)
and rewrites the resume-driven data the site renders:

  - src/data/resume.json  (name, education, experience, projects, skills)
        -> the "Stack" section reads skills from here
  - src/data/v2.ts        (the `experience` array only)
        -> the "Experience" section reads this

Projects (src/data/projects.ts) and Hackathons (v2.ts `hackathons`) are
site-curated supersets of the resume and are left untouched on purpose.

Pure stdlib. Writes are JSON-valid, so v2.ts stays syntactically sound.
"""
import argparse
import json
import re
import sys
from pathlib import Path

# resume.tex skill category label -> resume.json key the site expects
CAT_MAP = {
    "Programming Languages": "programmingLanguages",
    "AI and ML": "aiMl",
    "Software Development": "softwareDevelopment",
    "Databases and Data Engineering": "databases",
    "DevOps and Cloud Infrastructure": "devOps",
    "Cybersecurity": "cybersecurity",
    "Core Computer Science": "coreCs",
}


# ---------- LaTeX primitives ----------
def read_group(s, i):
    """s[i] must be '{'. Return (inner_text, index_after_closing_brace)."""
    if i >= len(s) or s[i] != "{":
        raise ValueError("expected '{'")
    depth, start, j = 0, i + 1, i
    while j < len(s):
        if s[j] == "{":
            depth += 1
        elif s[j] == "}":
            depth -= 1
            if depth == 0:
                return s[start:j], j + 1
        j += 1
    raise ValueError("unbalanced braces")


def read_groups(s, i, n):
    """Read n consecutive {..} groups starting at/after i (skipping space)."""
    out = []
    for _ in range(n):
        while i < len(s) and s[i] in " \t\r\n":
            i += 1
        g, i = read_group(s, i)
        out.append(g)
    return out, i


def clean(t):
    """Strip LaTeX markup down to plain text."""
    t = t.strip()
    t = re.sub(r"\\href\{[^}]*\}\{([^}]*)\}", r"\1", t)  # \href{url}{text} -> text
    for cmd in ("textbf", "emph", "textit", "small", "texttt", "underline"):
        t = re.sub(r"\\" + cmd + r"\{([^{}]*)\}", r"\1", t)
    for esc, ch in (("\\%", "%"), ("\\&", "&"), ("\\$", "$"),
                    ("\\#", "#"), ("\\_", "_")):
        t = t.replace(esc, ch)
    t = t.replace("$|$", "|").replace("~", " ")
    t = re.sub(r"\\[A-Za-z]+", "", t)          # leftover bare commands
    t = t.replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", t).strip()


def first_href_url(t):
    m = re.search(r"\\href\{([^}]*)\}", t)
    return m.group(1) if m else None


def norm_period(dates):
    return clean(dates).replace("--", "–")  # en dash


def section_slice(tex, keyword):
    """Text between \\section{...keyword...} and the next \\section / EOF."""
    m = re.search(r"\\section\{[^}]*" + re.escape(keyword) + r"[^}]*\}", tex)
    if not m:
        return ""
    start = m.end()
    nxt = re.search(r"\\section\{", tex[start:])
    return tex[start:start + nxt.start()] if nxt else tex[start:]


def parse_items(seg):
    out = []
    for m in re.finditer(r"\\resumeItem(?![A-Za-z])", seg):
        try:
            (g,), _ = read_groups(seg, m.end(), 1)
        except ValueError:
            continue
        out.append(clean(g))
    return out


def parse_subheadings(slice_text):
    """\\resumeSubheading{org}{dates}{title}{loc} + following bullets."""
    entries = []
    for m in re.finditer(r"\\resumeSubheading(?![A-Za-z])", slice_text):
        groups, after = read_groups(slice_text, m.end(), 4)
        org_raw, dates, title, loc = groups
        nxt = slice_text.find("\\resumeSubheading", after)
        seg = slice_text[after:nxt if nxt != -1 else len(slice_text)]
        entries.append({
            "org": clean(org_raw),
            "url": first_href_url(org_raw),
            "period": norm_period(dates),
            "title": clean(title),
            "location": clean(loc),
            "bullets": parse_items(seg),
        })
    return entries


def parse_projects(slice_text):
    projs = []
    for m in re.finditer(r"\\resumeProjectHeading(?![A-Za-z])", slice_text):
        (head, _), after = read_groups(slice_text, m.end(), 2)
        url = first_href_url(head)
        name, tech = None, ""
        bm = re.search(r"\\textbf\{", head)
        if bm:
            inner, _ = read_group(head, bm.end() - 1)
            name = clean(inner)
        em = re.search(r"\\emph\{", head)
        if em:
            inner, _ = read_group(head, em.end() - 1)
            tech = clean(inner)
        nxt = slice_text.find("\\resumeProjectHeading", after)
        seg = slice_text[after:nxt if nxt != -1 else len(slice_text)]
        proj = {"title": name, "technologies": tech, "achievements": parse_items(seg)}
        if url:
            proj["githubUrl"] = url
        projs.append(proj)
    return projs


def parse_skills(slice_text):
    skills = {}
    for m in re.finditer(r"\\resumeItem(?![A-Za-z])", slice_text):
        (g,), _ = read_groups(slice_text, m.end(), 1)
        bm = re.search(r"\\textbf\{", g)
        if not bm:
            continue
        cat_inner, idx = read_group(g, bm.end() - 1)
        cat = clean(cat_inner).rstrip(":").strip()
        rest = clean(g[idx:])
        items = [x.strip() for x in rest.split(",") if x.strip()]
        key = CAT_MAP.get(cat, _camel(cat))
        skills[key] = items
    return skills


def _camel(label):
    words = re.sub(r"[^A-Za-z0-9 ]", "", label).split()
    return (words[0].lower() + "".join(w.capitalize() for w in words[1:])) if words else "misc"


def parse_name(tex):
    cm = re.search(r"\\begin\{center\}(.*?)\\end\{center\}", tex, re.S)
    center = cm.group(1) if cm else tex
    m = re.search(r"\\scshape\s+([^}\\\n]+)", center)
    return clean(m.group(1)) if m else ""


def _company_badge(org):
    """'Cactus (YC S25)' -> ('Cactus', 'YC S25')."""
    m = re.match(r"^(.*?)\s*\(([^)]+)\)\s*$", org)
    return (m.group(1).strip(), m.group(2).strip()) if m else (org, None)


def _kind(role):
    r = role.lower()
    if "founder" in r:
        return "Founder"
    if "research" in r:
        return "Research"
    if any(k in r for k in ("lead", "president", "chair", "director", "head of")):
        return "Leadership"
    return "Work"


# ---------- transform ----------
def parse_resume(tex):
    exp = parse_subheadings(section_slice(tex, "Experience"))
    edu = parse_subheadings(section_slice(tex, "Education"))
    projs = parse_projects(section_slice(tex, "Projects"))
    skills = parse_skills(section_slice(tex, "Technical Skills"))
    return {"name": parse_name(tex), "experience": exp,
            "education": edu, "projects": projs, "skills": skills}


def _norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def find_matching_bracket(s, i):
    """s[i] must be '['. Return index of the matching ']'."""
    depth = 0
    while i < len(s):
        if s[i] == "[":
            depth += 1
        elif s[i] == "]":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError("unbalanced []")


def merge_skills(existing, new):
    """Union new skill items into existing, preserving order. Additive only."""
    for cat, items in new.items():
        cur = existing.setdefault(cat, [])
        have = {x.lower() for x in cur}
        for it in items:
            if it.lower() not in have:
                cur.append(it)
                have.add(it.lower())
    return existing


def merge_resume_json(existing, parsed):
    """Additively merge parsed resume into resume.json. Never deletes."""
    rj = dict(existing)
    merge_skills(rj.setdefault("skills", {}), parsed["skills"])

    exp = rj.setdefault("experience", [])
    have = {_norm(e.get("company", "")) for e in exp}
    for e in parsed["experience"]:
        if _norm(e["org"]) in have:
            continue
        exp.append({k: v for k, v in (
            ("title", e["title"]), ("company", e["org"]), ("period", e["period"]),
            ("location", e["location"]), ("url", e["url"]), ("achievements", e["bullets"]),
        ) if v})
        have.add(_norm(e["org"]))

    projs = rj.setdefault("projects", [])
    phave = {_norm(p.get("title", "")) for p in projs}
    for p in parsed["projects"]:
        if _norm(p["title"]) not in phave:
            projs.append(p)
            phave.add(_norm(p["title"]))

    edu = rj.setdefault("education", [])
    ehave = {_norm(e.get("institution", "")) for e in edu}
    for e in parsed["education"]:
        if _norm(e["org"]) in ehave:
            continue
        edu.append({k: v for k, v in (
            ("degree", e["title"]), ("institution", e["org"]), ("url", e["url"]),
            ("period", e["period"]), ("location", e["location"]),
        ) if v})
        ehave.add(_norm(e["org"]))

    rj.setdefault("certifications", existing.get("certifications", []))
    if parsed.get("name"):
        rj["name"] = parsed["name"]
    return rj


def append_v2_experience(v2_src, parsed):
    """Append resume experiences not already present (by company) to the v2.ts
    `experience` array. Curated entries are preserved verbatim. Returns (src, added)."""
    marker = "export const experience: Experience[] ="
    i = v2_src.index(marker)
    br = v2_src.index("[", i + len(marker))      # skip the [] in `Experience[]`
    close = find_matching_bracket(v2_src, br)
    present = {_norm(m) for m in re.findall(
        r'["\']?company["\']?\s*:\s*["\']([^"\']+)["\']', v2_src[br:close])}

    new_objs, added = [], []
    for e in parsed["experience"]:
        company, badge = _company_badge(e["org"])
        if _norm(company) in present:
            continue
        obj = {"company": company, "role": e["title"], "period": e["period"]}
        if e["location"]:
            obj["location"] = e["location"]
        obj["kind"] = _kind(e["title"])
        if badge:
            obj["badge"] = badge
        if e["url"]:
            obj["url"] = e["url"]
        obj["bullets"] = e["bullets"]
        new_objs.append(obj)
        added.append(company)
        present.add(_norm(company))

    if not new_objs:
        return v2_src, added
    import textwrap
    pre = v2_src[:close].rstrip()
    if not pre.endswith(","):
        pre += ","                               # ensure separator after last entry
    block = "".join(
        textwrap.indent(json.dumps(o, indent=2, ensure_ascii=False), "  ") + ",\n"
        for o in new_objs)
    return pre + "\n" + block + v2_src[close:], added


# ---------- io ----------
def run(root: Path, resume: Path):
    tex = resume.read_text(encoding="utf-8")
    parsed = parse_resume(tex)
    if not parsed["experience"] and not parsed["skills"]:
        sys.exit(f"error: parsed nothing from {resume} — is it the expected resume template?")

    rj_path = root / "src/data/resume.json"
    v2_path = root / "src/data/v2.ts"

    existing_rj = json.loads(rj_path.read_text(encoding="utf-8"))
    merged = merge_resume_json(existing_rj, parsed)
    rj_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    new_v2, added = append_v2_experience(v2_path.read_text(encoding="utf-8"), parsed)
    v2_path.write_text(new_v2, encoding="utf-8")

    print(f"Merged {resume.name} (additive — nothing existing was removed):")
    print(f"  {rj_path}  -> Stack now has {len(merged['skills'])} skill groups")
    if added:
        print(f"  {v2_path}  -> added {len(added)} new experience entries: {', '.join(added)}")
    else:
        print(f"  {v2_path}  -> no new experience (all resume roles already on the site)")
    print("Untouched: projects.ts, hackathons in v2.ts, places.ts")
    print("Next: npm run build  (or npm run dev to preview)")


SAMPLE = r"""
\begin{center}{\scshape Jane Q Hacker}\end{center}
\section{Experience}
\resumeSubHeadingListStart
\resumeSubheading{\href{https://x.com}{Acme (YC W24)}}{Jan 2025 -- Present}{Staff Engineer}{Remote}
\resumeItemListStart
\resumeItem{Shipped thing, improved latency by 40\%}
\resumeItem{Led the \textbf{platform} team}
\resumeItemListEnd
\resumeSubHeadingListEnd
\section{Projects/Contributions}
\resumeProjectHeading{\href{https://github.com/x/proj}{\textbf{Cool Proj}} $|$ \emph{Python, Rust}}{}
\resumeItemListStart
\resumeItem{Did cool stuff}
\resumeItemListEnd
\section{Technical Skills}
\resumeItemListStart
\resumeItem{\textbf{Programming Languages:} Python, Rust, Go}
\resumeItem{\textbf{Cybersecurity:} Nmap, YARA}
\resumeItemListEnd
"""


def selfcheck():
    p = parse_resume(SAMPLE)
    assert p["name"] == "Jane Q Hacker", p["name"]
    assert len(p["experience"]) == 1
    e = p["experience"][0]
    assert e["org"] == "Acme (YC W24)" and e["title"] == "Staff Engineer"
    assert e["url"] == "https://x.com" and e["location"] == "Remote"
    assert e["bullets"] == ["Shipped thing, improved latency by 40%", "Led the platform team"], e["bullets"]
    assert p["skills"]["programmingLanguages"] == ["Python", "Rust", "Go"]
    assert p["skills"]["cybersecurity"] == ["Nmap", "YARA"]
    assert len(p["projects"]) == 1
    pr = p["projects"][0]
    assert pr["title"] == "Cool Proj" and pr["githubUrl"] == "https://github.com/x/proj"
    assert pr["technologies"] == "Python, Rust"
    assert _kind("AI Lead") == "Leadership" and _kind("Co-Founder") == "Founder" and _kind("Student Researcher") == "Research"

    # additive skills merge: keep existing, union new, no dupes
    sk = {"programmingLanguages": ["Python", "Go"]}
    merge_skills(sk, {"programmingLanguages": ["Python", "Rust"], "cybersecurity": ["Nmap"]})
    assert sk["programmingLanguages"] == ["Python", "Go", "Rust"], sk
    assert sk["cybersecurity"] == ["Nmap"]

    # append only NEW companies; preserve curated; produce valid TS
    base = ('x\nexport const experience: Experience[] = [\n'
            '  {\n    company: "Acme",\n    role: "X",\n    period: "p",\n    kind: "Work",\n    bullets: [],\n  },\n];\n')
    out, added = append_v2_experience(base, p)          # SAMPLE has Acme -> already present
    assert added == [] and out == base, (added, out)
    p2 = parse_resume(SAMPLE.replace("Acme (YC W24)", "Globex (YC W24)"))
    out2, added2 = append_v2_experience(base, p2)
    assert added2 == ["Globex"], added2
    assert out2.count('"company": "Globex"') == 1 and 'company: "Acme"' in out2
    assert out2.rstrip().endswith("];")
    print("selfcheck OK")


def main():
    ap = argparse.ArgumentParser(description="Update the portfolio site from a LaTeX resume.")
    ap.add_argument("--resume", default="resume.tex", help="path to resume.tex (default: ./resume.tex)")
    ap.add_argument("--root", default=".", help="project root (default: .)")
    ap.add_argument("--selfcheck", action="store_true", help="run built-in parser tests and exit")
    args = ap.parse_args()
    if args.selfcheck:
        selfcheck()
        return
    root = Path(args.root).resolve()
    resume = Path(args.resume)
    if not resume.is_absolute():
        resume = root / resume
    if not resume.exists():
        sys.exit(f"error: {resume} not found. Put your resume.tex in the project root.")
    run(root, resume)


if __name__ == "__main__":
    main()
