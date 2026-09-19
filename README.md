# Portfolio XP

A personal portfolio for **Thejas Haridas** built as a working Windows XP desktop.

Boot screen, login, draggable windows, a start menu, a system tray clock — and a
playable Minesweeper. Plain HTML, CSS and JavaScript: no framework, no build step,
no dependencies.

## Run it

Any static server works. There is nothing to install and nothing to compile.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell: boot, login, desktop, taskbar, start menu |
| `scripts/data.js` | **All personal content.** Edit this and nothing else to update the site |
| `scripts/wm.js` | Window manager — open, focus, drag, resize, minimise, maximise, close |
| `scripts/apps.js` | The individual "applications" and their content |
| `scripts/minesweeper.js` | A complete Minesweeper implementation |
| `scripts/main.js` | Boot sequence, desktop icons, start menu, clock |
| `styles/base.css` | Reset, XP primitives, boot / login / wallpaper / icons |
| `styles/window.css` | Window chrome: title bars, controls, scrollbars |
| `styles/taskbar.css` | Taskbar and start menu |
| `styles/apps.css` | Content styles inside windows |

### Updating content

Everything a visitor reads comes from `scripts/data.js` — profile, experience,
projects, skills, education, publications, certifications and achievements.
Change the data, reload the page. No other file needs touching.

## Applications

- **About Me** — summary, education, publication, certifications
- **My Projects** — Explorer-style folder; double-click any project for detail
- **My Experience** — timeline of roles
- **Skills** — skill levels as Task Manager performance meters
- **resume.txt** — the whole CV rendered in Notepad
- **Contact** — email, LinkedIn, GitHub
- **Minesweeper** — fully playable, with safe first click
- **Recycle Bin** — a joke

Right-click the desktop for a context menu; Turn Off Computer and Log Off both work.

## Deployment

`.github/workflows/pages.yml` publishes the site to GitHub Pages on every push
to `main` or `v2`.

> **Note:** GitHub's `github-pages` environment only permits deployments from the
> default branch unless you say otherwise. To publish from `v2`, either merge it
> into `main`, or go to **Settings → Environments → github-pages** and add `v2` to
> the allowed deployment branches. Also set **Settings → Pages → Source** to
> *GitHub Actions*.

## Notes

This is a tribute to Windows XP, not a reproduction of it. Every visual element —
the wallpaper, the window chrome, the taskbar, the flag — is drawn from scratch in
CSS. No Microsoft artwork, fonts or trademarked assets are bundled in this
repository.

## License

MIT
