const data = window.siteContent;
const make = (tag, cls, text) => { const node = document.createElement(tag); if(cls) node.className = cls; if(text !== undefined) node.textContent = text; return node; };
function safeUrl(value) { try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } }
const bio = document.querySelector('#bio');
if (bio) {
  data.bio.forEach(text => { const p = make('p'); p.innerHTML = text; bio.append(p); });
  if (data.photo) { const img = make('img'); img.src = data.photo; img.alt = 'Portrait of ' + data.name; document.querySelector('.portrait').replaceChildren(img); }
  const social = document.querySelector('#social');
  const icons = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96C2 21.32 2.69 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.98V9.2h2.95ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.36-1.55 2.79-1.55 2.98 0 3.53 1.96 3.53 4.5Z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 1 10l11 8 11-8-11-8Z"/><path fill="currentColor" opacity=".7" d="M5 13.5v5C7 22 17 22 19 18.5v-5L12 19l-7-5.5Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>'
  };
  [['linkedin','LinkedIn'],['scholar','Google Scholar']].forEach(([key,label]) => {
    if(!data.links[key]) return;
    const a = make('a', 'social-icon'); a.innerHTML = icons[key]; a.href = safeUrl(data.links[key]); a.title = label; a.setAttribute('aria-label',label); social.append(a);
  });
  const emailWrap = make('div', 'email-wrap'), emailButton = make('button', 'social-icon');
  emailButton.type = 'button'; emailButton.innerHTML = icons.email; emailButton.title = 'Email';
  emailButton.setAttribute('aria-label','Email addresses'); emailButton.setAttribute('aria-expanded','false'); emailButton.setAttribute('aria-controls','email-addresses');
  const addresses = make('div','email-addresses'); addresses.id = 'email-addresses'; addresses.hidden = true;
  ['email','personalEmail'].forEach(key => { if(data.links[key]) { const a = make('a','',data.links[key]); a.href = 'mailto:' + data.links[key]; addresses.append(a); } });
  const closeEmail = () => { addresses.hidden = true; emailButton.setAttribute('aria-expanded','false'); };
  emailButton.addEventListener('click',()=>{ addresses.hidden = !addresses.hidden; emailButton.setAttribute('aria-expanded',String(!addresses.hidden)); });
  document.addEventListener('click',event=>{ if(!emailWrap.contains(event.target)) closeEmail(); });
  document.addEventListener('keydown',event=>{ if(event.key === 'Escape' && !addresses.hidden) { closeEmail(); emailButton.focus(); } });
  emailWrap.append(emailButton, addresses); social.append(emailWrap);
  data.publications.forEach(paper => {
    const row = make('article','publication'), year = make('div','year',paper.year), body = make('div');
    const title = make('h3'); const titleLink = make('a', 'publication-title', paper.title); titleLink.href = safeUrl(paper.url); title.append(titleLink); body.append(title);
    const authors = make('p','authors');
    const parts = paper.authors.split('Li, X.');
    parts.forEach((part,i) => { authors.append(document.createTextNode(part)); if(i < parts.length-1) authors.append(make('strong','','Li, X.')); });
    body.append(authors, make('p','venue',paper.venue));
    if(paper.status) body.append(make('span','badge',paper.status));
    const links = make('div','paperlinks');
    (paper.links || []).forEach(link => { const a = make('a','',link.label + ' ↗'); a.href = safeUrl(link.url); links.append(a); });
    if(links.children.length) body.append(links); row.append(year,body); document.querySelector('#publication-list').append(row);
  });
  data.research.forEach(project => {
    const card = make('article','research-card'); card.append(make('h3','',project.title)); if(project.date) card.append(make('div','project-date',project.date)); card.append(make('p','',project.description));
    const tags = make('div','tags'); project.tags.forEach(tag => tags.append(make('span','',tag))); card.append(tags); document.querySelector('#research-list').append(card);
  });
  data.awards.forEach(award => { const row = make('article','award'), body = make('div'); const title = make('h3','',award.title); if(award.organization) title.append(make('span','award-organization',', ' + award.organization)); body.append(title); row.append(make('div','year',award.year),body); document.querySelector('#award-list').append(row); });
  const sections = [...document.querySelectorAll('main > section[id]')];
  const navItems = [...document.querySelectorAll('.navlinks a[data-section]')];
  // Select the section covering the most viewport area below the sticky header.
  // Keep this as a pure function so the selection can be checked independently.
  function dominantSection(rectangles, viewportTop, viewportBottom, viewportWidth) {
    let winner = null, maxArea = 0;
    rectangles.forEach(({ id, top, bottom, left, right }) => {
      const height = Math.max(0, Math.min(bottom, viewportBottom) - Math.max(top, viewportTop));
      const width = Math.max(0, Math.min(right, viewportWidth) - Math.max(left, 0));
      const area = height * width;
      if (area > maxArea) { maxArea = area; winner = id; }
    });
    return winner;
  }
  let pendingFrame = false;
  function updateActiveSection() {
    pendingFrame = false;
    // The standalone preview has a separate Updates view.
    if (document.querySelector('#preview-home')?.hidden) return;
    const headerBottom = Math.max(0, document.querySelector('.header').getBoundingClientRect().bottom);
    const rectangles = sections.map(section => ({ id: section.id, ...(() => {
      const r = section.getBoundingClientRect(); return { top:r.top, bottom:r.bottom, left:r.left, right:r.right };
    })() }));
    let active = dominantSection(rectangles, headerBottom, window.innerHeight, window.innerWidth);
    // A short final section may never dominate. At the page bottom, select it
    // if visible, without adding artificial whitespace to the layout.
    const pageHeight = document.documentElement.scrollHeight;
    const atBottom = pageHeight > window.innerHeight + 2 &&
      window.scrollY + window.innerHeight >= pageHeight - 12;
    const last = rectangles[rectangles.length - 1];
    if (atBottom && last && last.bottom > headerBottom && last.top < window.innerHeight) {
      active = last.id;
    }
    navItems.forEach(a => {
      const selected = a.dataset.section === active;
      a.classList.toggle('active', selected);
      if(selected) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
    });
  }
  function scheduleActiveUpdate() {
    if (!pendingFrame) { pendingFrame = true; requestAnimationFrame(updateActiveSection); }
  }
  window.addEventListener('scroll',scheduleActiveUpdate,{passive:true});
  window.addEventListener('resize',scheduleActiveUpdate);
  window.addEventListener('load',scheduleActiveUpdate);
  window.addEventListener('hashchange',scheduleActiveUpdate);
  document.fonts?.ready.then(scheduleActiveUpdate);
  updateActiveSection();

}
const feed = document.querySelector('#updates-feed');
if(feed) {
  if(!data.updates.length) { const empty = make('div','empty'); empty.append(make('h2','','A little beyond research'),make('p','','Conference moments, everyday discoveries, and life along the way. More soon!')); feed.append(empty); }
  [...data.updates].sort((a,b) => b.date.localeCompare(a.date)).forEach(update => {
    const article = make('article','update'), meta = make('div','update-meta');
    const date = make('time'); date.dateTime = update.date; const monthOnly = /^\d{4}-\d{2}$/.test(update.date); date.textContent = new Date(update.date + (monthOnly ? '-01' : '') + 'T12:00:00').toLocaleDateString('en-US',monthOnly ? {year:'numeric',month:'long'} : {year:'numeric',month:'long',day:'numeric'}); meta.append(date);
    if(update.category) meta.append(make('span','',update.category));
    article.append(meta,make('h2','',update.title),make('p','',update.text));
    const gallery = make('div','gallery'); (update.photos || []).forEach(photo => { const figure = make('figure'), img = make('img'); img.src = photo.src; img.alt = photo.alt || ''; img.loading = 'lazy'; figure.append(img); if(photo.caption) figure.append(make('figcaption','',photo.caption)); gallery.append(figure); });
    article.append(gallery); feed.append(article);
  });
}
