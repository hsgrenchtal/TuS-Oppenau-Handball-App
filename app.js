(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navButtons = [...document.querySelectorAll('.navbtn')];
  function showPage(name) {
    if (!document.getElementById(name)) return;
    pages.forEach(page => page.classList.toggle('active', page.id === name));
    navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === name));
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button) return;
    event.preventDefault();
    showPage(button.dataset.page);
  });
})();

(() => {
  const matches = Array.isArray(window.TUS_MATCHES) ? window.TUS_MATCHES : [];
  const list = document.getElementById('matchList');
  const teamFilter = document.getElementById('matchTeamFilter');
  const count = document.getElementById('matchCount');
  const pastToggle = document.getElementById('matchPastToggle');
  const clubButtons = [...document.querySelectorAll('[data-club-filter]')];
  if (!list || !teamFilter || !count || !pastToggle) return;

  let selectedClub = 'all';
  let showPast = false;
  const today = new Date();
  today.setHours(0,0,0,0);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
  const fmtDate = iso => {
    const [y,m,d] = iso.split('-').map(Number);
    return new Date(y,m-1,d).toLocaleDateString('de-DE',{
      weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'
    });
  };
  const mapsUrl = match => 'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(match.address || [match.hall,match.city,'Deutschland'].filter(Boolean).join(', '));

  function render() {
    const team = teamFilter.value;
    const filtered = matches.filter(match => {
      if (selectedClub !== 'all' && match.club !== selectedClub) return false;
      if (team !== 'all' && match.team !== team) return false;
      const [y,m,d] = match.date.split('-').map(Number);
      const matchDay = new Date(y,m-1,d);
      matchDay.setHours(0,0,0,0);
      if (!showPast && matchDay < today) return false;
      return true;
    }).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));

    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'Spiel' : 'Spiele'} ${showPast ? 'gesamt' : 'ab heute'}`;
    if (!filtered.length) {
      list.innerHTML = '<div class="match-empty">Für diese Auswahl sind keine anstehenden Spiele im hochgeladenen Spielplan enthalten.</div>';
      return;
    }
    list.innerHTML = filtered.map(match => {
      const [y,m,d] = match.date.split('-').map(Number);
      const matchDay = new Date(y,m-1,d);
      matchDay.setHours(0,0,0,0);
      const past = matchDay < today;
      const venue = [match.hall, match.street, `${match.postal} ${match.city}`].filter(Boolean).join(' · ');
      const status = past ? 'Vergangener Spieltag' : (match.isHome ? 'HEIMSPIEL' : 'AUSWÄRTSSPIEL');
      const eventNote = match.event ? ' · ' + esc(match.event) : '';
      return `<article class="match-card">
        <div class="match-card-top">
          <span class="match-date">${esc(fmtDate(match.date))} · ${esc(match.time)} Uhr</span>
          <span class="match-team-tag">${esc(match.team)}</span>
        </div>
        <div class="match-pairing">${esc(match.home)} <span style="color:#ff777b">–</span> ${esc(match.away)}</div>
        <div class="match-meta">${esc(status)}${eventNote}<br>📍 ${esc(venue)}</div>
        <div class="match-actions">
          <a class="btn primary" href="${mapsUrl(match)}" target="_blank" rel="noopener noreferrer">📍 Google Maps · Route</a>
          ${match.bwhv ? `<a class="btn" href="${esc(match.bwhv)}" target="_blank" rel="noopener noreferrer">BWHV-Spielplan ↗</a>` : ""}
        </div>
      </article>`;
    }).join('');
  }

  clubButtons.forEach(button => button.addEventListener('click', () => {
    selectedClub = button.dataset.clubFilter;
    teamFilter.value = 'all';
    clubButtons.forEach(item => item.classList.toggle('active', item === button));
    render();
  }));
  teamFilter.addEventListener('change', () => {
    if (teamFilter.value.startsWith('Herren')) selectedClub = 'TuS Oppenau';
    else if (teamFilter.value !== 'all') selectedClub = 'HSG Renchtal';
    else selectedClub = 'all';
    clubButtons.forEach(item => item.classList.toggle('active', item.dataset.clubFilter === selectedClub));
    render();
  });
  pastToggle.addEventListener('click', () => {
    showPast = !showPast;
    pastToggle.textContent = showPast ? 'Nur kommende Spiele' : 'Alle Termine anzeigen';
    render();
  });
  render();
})();
