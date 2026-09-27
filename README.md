# Nathan Tran — personal site

Static HTML, CSS and one small script. No build step, no dependencies,
no framework. Edit a file, refresh the browser.

## Files

```
index.html        Home — portrait, bio, Latest News, links onward
research.html     The three research projects
experience.html   Roles grouped by kind, plus Education
about.html        Currently, background, toolkit, photos
style.css         ALL styling for all four pages
theme.js          Light/dark toggle
images/           Photos and figures
```

`style.css` is shared. Change a colour there and every page follows.

## Previewing locally

Open `index.html` in a browser and it works. For live reload in VS Code,
install the **Live Server** extension, then right-click `index.html` →
*Open with Live Server*.

## Publishing to GitHub Pages

1. Create a repository on GitHub.
2. Push these files to it, with `index.html` at the repository root.
3. Repo **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait a minute or two. Your site is at `https://<username>.github.io/<repo>/`.

To use `https://<username>.github.io` with no subpath, name the repo
`<username>.github.io`.

## Where to change things

**Colours and fonts** — the top of `style.css`. Tokens are defined twice:
once under `:root` for light mode, once in the two dark-mode blocks.
Keep the two dark blocks in sync; they're marked with a comment.

**Navigation** — the `<nav class="topnav">` block near the top of each
HTML file. Adding a page means adding a link in all four.

**The scanpath graphic** — the gaze-plot divider under your name on the
home page. It's `<div class="scanrule">` in `index.html` and section 6 of
`style.css`. Delete both to remove it.

**Adding a research entry** — copy any `<li>` inside `<ul class="entries">`
in `research.html`.

**Adding a role** — copy any `<li>` inside a `<ul class="cv">` in
`experience.html`. Keep each group in reverse-chronological order.

## Still to do

| File | Line | What |
|---|---|---|
| `index.html` | 62 | Save your résumé beside `index.html` as `cv.pdf` so the CV link works |
| `research.html` | 66 | Swap the Pupil Labs render for your own screenshot, then delete the credit `<figcaption>` |
| `research.html` | 83 | Swap the EmotiBit photo for your own rig photo, then delete the credit `<figcaption>` |
| `research.html` | 89 | Add the PulseCoach author list |
| `experience.html` | 143 | Optional: a line about the Student Body VP role |
| `about.html` | 94, 98, 102 | Optional: add the meet, club or place to the photo captions |

Three open questions, none of them code:

- **Graduation date.** The site says May 2027; your LinkedIn says December 2027.
- **PulseCoach** is labelled "under review". Check with Prof. Jin whether naming
  a submission under review is fine for that venue.
- **The two vendor images** on `research.html` are Pupil Labs' and Connected
  Future Labs' own marketing shots, credited in their captions. Your own photos
  of the actual rigs would be stronger, and would remove the need for credits.
