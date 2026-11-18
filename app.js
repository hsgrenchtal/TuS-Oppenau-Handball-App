(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navButtons = [...document.querySelectorAll('.navbtn')];
  function showPage(name) {
    if (!document.getElementById(name)) return;
    pages.forEach(page => page.classList.toggle('active', page.id === name));
    navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === name));
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  window.TUS_SHOW_PAGE = showPage;
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
      return `<article class="match-card ${match.club === 'HSG Renchtal' ? 'hsg-match' : 'tus-match'}">
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


(() => {
  const target = document.getElementById('homeNextMatches');
  const matches = Array.isArray(window.TUS_MATCHES) ? window.TUS_MATCHES : [];
  if (!target) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = matches.filter(match => {
    if (!match.date) return false;
    const [y,m,d] = match.date.split('-').map(Number);
    const date = new Date(y,m-1,d); date.setHours(0,0,0,0);
    return date >= today;
  }).sort((a,b) => (a.date+(a.time || '00:00')).localeCompare(b.date+(b.time || '00:00'))).slice(0,5);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const maps = match => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(match.address || [match.hall,match.city,'Deutschland'].filter(Boolean).join(', '));
  if (!upcoming.length) { target.innerHTML = '<div class="home-next-empty">Aktuell sind keine kommenden Spiele im hinterlegten Spielplan eingetragen.</div>'; return; }
  target.innerHTML = upcoming.map(match => {
    const [y,m,d] = match.date.split('-').map(Number);
    const date = new Date(y,m-1,d);
    const day = date.toLocaleDateString('de-DE',{day:'2-digit'});
    const month = date.toLocaleDateString('de-DE',{month:'short'}).replace('.','');
    const venue = [match.hall,match.city].filter(Boolean).join(' · ');
    const status = match.isHome ? 'HEIMSPIEL' : 'AUSWÄRTSSPIEL';
    const opponent = match.isHome ? match.away : match.home;
    const eventLabel = match.event ? ` · ${esc(match.event)}` : '';
    return `<article class="home-match ${match.club === 'HSG Renchtal' ? 'hsg-match' : 'tus-match'}">
      <div class="home-match-date"><b>${esc(day)}</b><small>${esc(month)}</small></div>
      <div class="home-match-info"><strong>${esc(match.team)} · ${esc(match.club)}</strong><small>${esc(status)}${eventLabel} · ${esc(match.time || 'Uhrzeit folgt')} ${match.time ? 'Uhr' : ''}<br>${esc(match.home)} – ${esc(match.away)}<br>📍 ${esc(venue)}</small>
      <div class="home-match-actions"><a class="btn primary" href="${maps(match)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a></div></div>
    </article>`;
  }).join('');
})();


// Team cards show exclusively the selected team's training sessions.
(() => {
  const rows = [...document.querySelectorAll('[data-training-session]')];
  const panel = document.getElementById('trainingSelection');
  const title = document.getElementById('trainingSelectionName');
  if (!rows.length || !panel || !title) return;

  // Exact team names are used on both the cards and schedule rows.
  const teamNames = new Set(rows.map(row => row.dataset.trainingSession));

  const updateSectionVisibility = () => {
    document.querySelectorAll('#training .schedule').forEach(schedule => {
      const hasVisibleSession = [...schedule.querySelectorAll('[data-training-session]')]
        .some(row => !row.hidden);
      schedule.hidden = !hasVisibleSession;
      const heading = schedule.previousElementSibling;
      if (heading && heading.classList.contains('section-head')) heading.hidden = !hasVisibleSession;
    });
  };

  const showTeam = team => {
    if (!teamNames.has(team)) return;
    window.TUS_SHOW_PAGE?.('training');
    rows.forEach(row => {
      const match = row.dataset.trainingSession === team;
      row.hidden = !match;
      row.classList.toggle('training-highlight', match);
    });
    title.textContent = team;
    panel.hidden = false;
    updateSectionVisibility();
    requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const showAll = () => {
    rows.forEach(row => {
      row.hidden = false;
      row.classList.remove('training-highlight');
    });
    document.querySelectorAll('#training .schedule, #training .section-head').forEach(el => { el.hidden = false; });
    panel.hidden = true;
  };

  document.addEventListener('click', event => {
    const card = event.target.closest('[data-training-team]');
    if (card) {
      if (event.target.closest('a,button')) return;
      showTeam(card.dataset.trainingTeam);
      return;
    }
    if (event.target.closest('[data-show-all-training]')) showAll();
  });

  document.addEventListener('keydown', event => {
    const card = event.target.closest('[data-training-team]');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      showTeam(card.dataset.trainingTeam);
    }
  });
})();

// Rotating sponsor spotlight on the home page.
(() => {const spot=document.getElementById('sponsorSpotlight'),logo=document.getElementById('sponsorSpotlightLogo'),name=document.getElementById('sponsorSpotlightName');if(!spot||!logo||!name)return;const sponsors=[
    {name:"J.P. Chenet", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/AP-A5-JPC-gamme-DE-sport-HD-.jpg/downsize_1280_0/AP-A5-JPC-gamme-DE-sport-HD-.jpg", url:"https://www.jpchenet.com/"},
    {name:"Roth – Die Autohäuser", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Roth.jpg/downsize_1280_0/300-Roth.jpg", url:"https://roth-autohaus.de/"},
    {name:"Lörch Obstbrände", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-loerch.jpg/downsize_1280_0/300-loerch.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"Rothaus", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Rothhaus.jpg/downsize_1280_0/300-Rothhaus.jpg", url:"https://www.rothaus.de/"},
    {name:"Getränke Roth", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Getraenke-Roth.jpg/downsize_1280_0/300-Getraenke-Roth.jpg", url:"https://www.getraenkeroth.com/"},
    {name:"Sortimo", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Sortimo.jpg/downsize_1280_0/300-Sortimo.jpg", url:"https://www.sortimo.com/"},
    {name:"Hotel Rebstock Oppenau", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Rebstock.jpg/downsize_1280_0/300-Rebstock.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"Peterstaler", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Peterstaler.jpg/downsize_1280_0/300-Peterstaler.jpg", url:"https://www.peterstaler.de/"},
    {name:"Sparkasse Offenburg/Ortenau", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Sparkasse.jpg/downsize_1280_0/300-Sparkasse.jpg", url:"https://www.sparkasse-offenburg.de/"},
    {name:"Franz H. Bruder", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Burder.jpg/downsize_1280_0/300-Burder.jpg", url:"https://www.bruder-gmbh.de/"},
    {name:"Erdrich Metallbearbeitung", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Erdrich.jpg/downsize_1280_0/300-Erdrich.jpg", url:"https://www.erdrichgmbh.de/"},
    {name:"DOLL", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/doll_300.jpg/downsize_1280_0/doll_300.jpg", url:"https://www.doll.eu/"},
    {name:"MULAG", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Mulag.jpg/downsize_1280_0/300-Mulag.jpg", url:"https://www.mulag.de/"},
    {name:"Walz Design", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Walz.jpg/downsize_1280_0/300-Walz.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"Hodapp Orthopädie · Schuhe · Sport", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/Schuh_hodapp_300.jpg/downsize_1280_0/Schuh_hodapp_300.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"etol", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-etol.jpg/downsize_1280_0/300-etol.jpg", url:"https://www.etol.de/"},
    {name:"Huber Oppenauer Reifendienst", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Reifenhuber.jpg/downsize_1280_0/300-Reifenhuber.jpg", url:"https://www.reifenhuber-oppenau.de/"},
    {name:"Synergy – Michael Metz", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/Synergy120110.jpg/downsize_1280_0/Synergy120110.jpg", url:"https://www.praxis-synergy.de/"},
    {name:"FBS Franz Birk Schlosserei", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-FBS.jpg/downsize_1280_0/300-FBS.jpg", url:"https://www.fbs-oppenau.de/"},
    {name:"Forstbetrieb Helmut Huber", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-helmuthuber.jpg/downsize_1280_0/300-helmuthuber.jpg", url:"https://www.huberoppenau.de/"},
    {name:"Modehaus Kimmig", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Kimmig.jpg/downsize_1280_0/300-Kimmig.jpg", url:"https://www.modehaus-kimmig.de/"},
    {name:"Volksbank Offenburg", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/Volksbank_300.jpg/downsize_1280_0/Volksbank_300.jpg", url:"https://www.volksbank-offenburg.de/"},
    {name:"Schlüsselservice Kehl – Jankowski", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/jankowski_home.jpg/downsize_1280_0/jankowski_home.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"Schmiederer", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Schmiederer.jpg/downsize_1280_0/300-Schmiederer.jpg", url:"https://www.schmiederer-bau-oppenau.de/"},
    {name:"Streck Elektro", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/StreckElektro300.jpg/downsize_1280_0/StreckElektro300.jpg", url:"https://www.handballoppenau.de/Verein/Sponsoren/"},
    {name:"Metzgerei Braun", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/300-Metzgerei-Braun.jpg/downsize_1280_0/300-Metzgerei-Braun.jpg", url:"https://www.metzgerei-braun-oppenau.de/"},
    {name:"LBS", image:"https://www.handballoppenau.de/.cm4all/iproc.php/Sponsoren/LBS_werbung300.jpg/downsize_1280_0/LBS_werbung300.jpg", url:"https://www.lbs.de/"}
];let i=0;const show=()=>{const s=sponsors[i];name.textContent=s.name;logo.src=s.image;logo.alt='Logo '+s.name;spot.href=s.url;spot.setAttribute('aria-label',s.name+' – Website öffnen');};show();window.setInterval(()=>{i=(i+1)%sponsors.length;show();},5000);})();
