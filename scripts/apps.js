/* ==========================================================================
   apps.js — content for each "application" window
   ========================================================================== */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nl2p = s => s.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');

const sidePanel = (title, bodyHtml) => `
  <div class="exp-panel"><h3>${title}</h3><div class="exp-panel-body">${bodyHtml}</div></div>`;

const FILE_ICONS = { py: '&#128196;', nb: '&#128200;', db: '&#128451;', txt: '&#128462;' };

const Apps = {

  /* ------------------------------------------------------------------ */
  about() {
    const side =
      sidePanel('Details', `<dl>
        <dt>Role</dt><dd>${esc(PROFILE.role)}</dd>
        <dt>Location</dt><dd>${esc(PROFILE.location)}</dd>
        <dt>Focus</dt><dd>LLM pipelines, knowledge graphs, document AI</dd>
      </dl>`) +
      sidePanel('Other Places', `
        <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub &#8599;</a>
        <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn &#8599;</a>
        <a href="mailto:${PROFILE.email}">Email me</a>`) +
      sidePanel('See Also', `
        <a href="#" data-open="experience">My Experience</a>
        <a href="#" data-open="projects">My Projects</a>
        <a href="#" data-open="skills">Skills</a>`);

    const main = `
      <div class="doc">
        <h2>${esc(PROFILE.name)}</h2>
        <p class="doc-role">${esc(PROFILE.role)} &middot; ${esc(PROFILE.location)}</p>
        <p>${esc(PROFILE.summary)}</p>
        <p>${esc(PROFILE.detail)}</p>

        <h3>Currently</h3>
        <p>Junior AI/ML Engineer at <strong>FeatherSoft</strong>, Kochi — building document
           intelligence systems and biomedical knowledge graphs.</p>

        <h3>Education</h3>
        <ul>${EDUCATION.map(e => `<li><strong>${esc(e.degree)}</strong> &mdash; ${esc(e.org)}
            <em>(${esc(e.years)})</em></li>`).join('')}</ul>

        <h3>Publication</h3>
        <ul>${PUBLICATIONS.map(p => `<li>${esc(p.note)} &mdash; &ldquo;${esc(p.title)}&rdquo;,
            <em>${esc(p.venue)}</em>, ${esc(p.date)}.</li>`).join('')}</ul>

        <h3>Certifications</h3>
        <ul>${CERTIFICATIONS.map(c => `<li>${esc(c.name)} &mdash; ${esc(c.org)} (${esc(c.date)})</li>`).join('')}</ul>

        <h3>Achievements</h3>
        <ul>${ACHIEVEMENTS.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      </div>`;

    return WM.open({
      id: 'about', title: 'About Me', icon: '&#128100;',
      width: 700, height: 500,
      menu: ['File', 'Edit', 'View', 'Favorites', 'Help'],
      address: 'My Computer \\ About Me',
      status: ['Ready', 'My Computer'],
      html: `<div class="exp"><aside class="exp-side xp-scroll">${side}</aside>
             <div class="exp-main xp-scroll">${main}</div></div>`
    });
  },

  /* ------------------------------------------------------------------ */
  projects() {
    const groups = [...new Set(PROJECTS.map(p => p.kind))];
    const tiles = groups.map(g => `
      <h3 style="margin:14px 0 6px;font-size:11px;color:#0a246a;text-transform:uppercase;letter-spacing:.04em">${esc(g)}</h3>
      <ul class="file-grid">
        ${PROJECTS.filter(p => p.kind === g).map(p => `
          <li><button class="file-tile" type="button" data-project="${p.id}">
            <span class="ft-icon" aria-hidden="true">${FILE_ICONS[p.icon] || FILE_ICONS.txt}</span>
            <span class="ft-meta">
              <span class="ft-name">${esc(p.name)}</span>
              <span class="ft-sub">${esc(p.stack)}</span>
            </span>
          </button></li>`).join('')}
      </ul>`).join('');

    const side =
      sidePanel('File and Folder Tasks', `
        <p>Double-click any project to open its details.</p>
        <a href="${PROFILE.github}" target="_blank" rel="noopener">View all repos on GitHub &#8599;</a>`) +
      sidePanel('Details', `<p><strong>My Projects</strong><br>File Folder<br>
        ${PROJECTS.length} items</p>`);

    const el = WM.open({
      id: 'projects', title: 'My Projects', icon: '&#128193;',
      width: 720, height: 520,
      menu: ['File', 'Edit', 'View', 'Favorites', 'Help'],
      address: 'My Computer \\ My Projects',
      status: [`${PROJECTS.length} objects`, 'My Computer'],
      html: `<div class="exp"><aside class="exp-side xp-scroll">${side}</aside>
             <div class="exp-main xp-scroll">${tiles}</div></div>`
    });

    el.querySelectorAll('[data-project]').forEach(btn => {
      const openIt = () => Apps.project(btn.dataset.project);
      btn.addEventListener('dblclick', openIt);
      btn.addEventListener('click', () => {
        el.querySelectorAll('[data-project]').forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
      });
      // touch devices get single-tap open
      btn.addEventListener('touchend', e => { e.preventDefault(); openIt(); });
    });
    return el;
  },

  project(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    const link = p.link
      ? `<p><a href="${p.link}" target="_blank" rel="noopener">Open repository on GitHub &#8599;</a></p>`
      : `<p style="color:#5a6a86"><em>Professional work — source is not public.</em></p>`;

    return WM.open({
      id: 'proj-' + p.id, title: p.file, icon: FILE_ICONS[p.icon] || FILE_ICONS.txt,
      width: 560, height: 400,
      menu: ['File', 'Edit', 'View', 'Help'],
      status: [p.kind, p.stack],
      html: `<div class="win-scroll xp-scroll"><div class="doc">
          <h2>${esc(p.name)}</h2>
          <p class="doc-role">${esc(p.stack)} &middot; ${esc(p.kind)}</p>
          ${nl2p(p.body)}
          ${link}
          <ul class="tag-row">${p.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        </div></div>`
    });
  },

  /* ------------------------------------------------------------------ */
  experience() {
    const items = EXPERIENCE.map(e => `
      <li class="tl-item ${e.current ? 'is-current' : ''}">
        <div class="tl-head">
          <span class="tl-role">${esc(e.role)}</span>
          <span class="tl-when">${esc(e.from)} &ndash; ${esc(e.to)}</span>
        </div>
        <p class="tl-org">${esc(e.org)} &middot; ${esc(e.place)} &middot; <em>${esc(e.kind)}</em></p>
        <ul>${e.points.map(pt => `<li>${esc(pt)}</li>`).join('')}</ul>
      </li>`).join('');

    return WM.open({
      id: 'experience', title: 'My Experience', icon: '&#128188;',
      width: 660, height: 500,
      menu: ['File', 'Edit', 'View', 'Help'],
      status: [`${EXPERIENCE.length} positions`, 'My Documents'],
      html: `<div class="win-scroll xp-scroll"><div class="doc">
          <h2>Experience</h2>
          <p class="doc-role">Where I have worked, most recent first</p>
          <ul class="tl">${items}</ul>
        </div></div>`
    });
  },

  /* ------------------------------------------------------------------ */
  skills() {
    const groups = SKILLS.map(g => `
      <div class="meter-group">
        <h3>${esc(g.group)}</h3>
        ${g.items.map(s => `
          <div class="meter">
            <div class="meter-head"><span>${esc(s.name)}</span><span>${s.level}%</span></div>
            <div class="meter-track"><div class="meter-fill" data-level="${s.level}" style="width:0"></div></div>
          </div>`).join('')}
      </div>`).join('');

    const el = WM.open({
      id: 'skills', title: 'Skills Manager', icon: '&#128202;',
      width: 520, height: 520, flat: true,
      menu: ['File', 'Options', 'View', 'Help'],
      status: ['Processes: ' + SKILLS.reduce((n, g) => n + g.items.length, 0), 'CPU Usage: 4%'],
      html: `<div class="win-scroll xp-scroll" style="background:var(--xp-face)">${groups}</div>`
    });

    requestAnimationFrame(() => setTimeout(() => {
      el.querySelectorAll('.meter-fill').forEach(f => { f.style.width = f.dataset.level + '%'; });
    }, 60));
    return el;
  },

  /* ------------------------------------------------------------------ */
  resume() {
    const line = '='.repeat(62);
    const text = [
      PROFILE.name.toUpperCase(),
      PROFILE.role.toUpperCase(),
      `${PROFILE.location}  |  ${PROFILE.email}`,
      `${PROFILE.linkedin}  |  ${PROFILE.github}`,
      '', line, 'PROFESSIONAL SUMMARY', line, '',
      wrap(PROFILE.summary), '', wrap(PROFILE.detail),
      '', line, 'EXPERIENCE', line, '',
      ...EXPERIENCE.flatMap(e => [
        `${e.role}`,
        `${e.org}, ${e.place} (${e.kind})`,
        `${e.from} - ${e.to}`,
        ...e.points.map(p => wrap('  * ' + p, '    ')),
        ''
      ]),
      line, 'SKILLS', line, '',
      ...SKILLS.map(g => wrap(`${g.group}: ${g.items.map(i => i.name).join(', ')}`, '    ')),
      '', line, 'PROJECTS', line, '',
      ...PROJECTS.filter(p => p.kind !== 'Open source').flatMap((p, i) => [
        `${i + 1}. ${p.name} (${p.stack})`, wrap('   ' + p.blurb, '   '), ''
      ]),
      line, 'EDUCATION', line, '',
      ...EDUCATION.map(e => `${e.degree}\n  ${e.org} — ${e.years}`),
      '', line, 'PUBLICATIONS', line, '',
      ...PUBLICATIONS.map(p => wrap(`* ${p.note}: "${p.title}", ${p.venue}, ${p.date}.`, '  ')),
      '', line, 'CERTIFICATIONS', line, '',
      ...CERTIFICATIONS.map(c => `* ${c.name} — ${c.org} (${c.date})`),
      '', line, 'ACHIEVEMENTS', line, '',
      ...ACHIEVEMENTS.map(a => wrap('* ' + a, '  '))
    ].join('\n');

    return WM.open({
      id: 'resume', title: 'resume.txt - Notepad', icon: '&#128462;',
      width: 620, height: 520, flat: true,
      menu: ['File', 'Edit', 'Format', 'View', 'Help'],
      html: `<div class="notepad xp-scroll">${esc(text)}</div>`
    });
  },

  /* ------------------------------------------------------------------ */
  contact() {
    return WM.open({
      id: 'contact', title: 'Contact — Outlook Express', icon: '&#9993;',
      width: 480, height: 380,
      menu: ['File', 'Edit', 'View', 'Tools', 'Help'],
      status: ['Connected', PROFILE.location],
      html: `<div class="win-scroll xp-scroll"><div class="doc">
          <h2>Get in touch</h2>
          <p class="doc-role">The fastest way to reach me is email.</p>
          <ul class="contact-list">
            <li><a href="mailto:${PROFILE.email}">
              <span class="contact-glyph" aria-hidden="true">&#9993;</span>
              <span><strong>Email</strong>${esc(PROFILE.email)}</span></a></li>
            <li><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">
              <span class="contact-glyph" aria-hidden="true">&#128188;</span>
              <span><strong>LinkedIn</strong>${esc(PROFILE.linkedin.replace('https://', ''))}</span></a></li>
            <li><a href="${PROFILE.github}" target="_blank" rel="noopener">
              <span class="contact-glyph" aria-hidden="true">&#128187;</span>
              <span><strong>GitHub</strong>${esc(PROFILE.githubUser)}</span></a></li>
            <li><span>
              <span class="contact-glyph" aria-hidden="true">&#128205;</span>
              <span><strong>Location</strong>${esc(PROFILE.location)}</span></span></li>
          </ul>
        </div></div>`
    });
  },

  /* ------------------------------------------------------------------ */
  recycle() {
    return WM.open({
      id: 'recycle', title: 'Recycle Bin', icon: '&#128465;',
      width: 480, height: 320,
      menu: ['File', 'Edit', 'View', 'Favorites', 'Help'],
      address: 'Recycle Bin',
      status: ['3 objects', ''],
      html: `<div class="win-scroll xp-scroll"><div class="doc">
          <ul class="file-grid">
            <li><button class="file-tile" type="button"><span class="ft-icon">&#128462;</span>
              <span class="ft-meta"><span class="ft-name">imposter_syndrome.txt</span>
              <span class="ft-sub">0 KB</span></span></button></li>
            <li><button class="file-tile" type="button"><span class="ft-icon">&#128462;</span>
              <span class="ft-meta"><span class="ft-name">untested_prompt.xml</span>
              <span class="ft-sub">2 KB</span></span></button></li>
            <li><button class="file-tile" type="button"><span class="ft-icon">&#128462;</span>
              <span class="ft-meta"><span class="ft-name">it_works_on_my_machine.log</span>
              <span class="ft-sub">41 KB</span></span></button></li>
          </ul>
          <p style="margin-top:14px;color:#5a6a86"><em>Nothing important. Probably.</em></p>
        </div></div>`
    });
  },

  /* ------------------------------------------------------------------ */
  minesweeper() { return Minesweeper.open(); },

  credits() {
    return WM.dialog({
      id: 'credits', title: 'About this portfolio', icon: '&#8505;',
      message: `<strong>Portfolio XP</strong><br><br>
        Built from scratch with plain HTML, CSS and JavaScript — no frameworks,
        no build step, no dependencies.<br><br>
        A fond tribute to Windows XP. Not affiliated with or endorsed by Microsoft;
        every pixel here is hand-drawn in CSS.`,
      buttons: ['OK']
    });
  }
};

/* wrap long text for the Notepad view */
function wrap(str, indent = '') {
  const width = 76;
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > width) { lines.push(cur); cur = indent + w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines.join('\n');
}
