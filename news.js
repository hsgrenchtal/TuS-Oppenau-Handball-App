(() => {
  const list = document.getElementById('announcementList');
  const enable = document.getElementById('enableNotifications');
  const status = document.getElementById('notificationStatus');
  if (!list || !enable || !status) return;

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
  const knownKey = 'tus-known-announcements-v1';
  const readKnown = () => {
    try { return JSON.parse(localStorage.getItem(knownKey) || '[]'); }
    catch { return []; }
  };
  let known = readKnown();
  let firstLoad = true;
  let announcements = [];

  function render() {
    const active = announcements.filter(item => item.active !== false)
      .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
    if (!active.length) {
      list.innerHTML = '<div class="panel"><strong>Aktuell keine neuen Ankündigungen</strong><p style="margin-top:7px">Sobald der Verein neue Informationen veröffentlicht, erscheinen sie hier.</p></div>';
      return;
    }
    list.innerHTML = active.map(item => {
      const hsg = item.club === 'HSG Renchtal';
      const date = item.date ? new Date(item.date + 'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'}) : '';
      const link = item.url ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Weitere Informationen ↗</a>` : '';
      return `<article class="announcement-card ${hsg ? 'hsg-announcement' : ''}">
        <div class="announcement-meta"><span>${escapeHTML(date)} · ${escapeHTML(item.club || 'TuS Oppenau')}</span><span class="announcement-tag">${escapeHTML(item.category || 'ANKÜNDIGUNG')}</span></div>
        <h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p>${link}
      </article>`;
    }).join('');
  }

  async function loadFeed(notifyNew = false) {
    try {
      const response = await fetch('./aktuelles.json?v=' + Date.now(), {cache:'no-store'});
      if (!response.ok) throw new Error('Feed nicht erreichbar');
      const data = await response.json();
      announcements = Array.isArray(data.announcements) ? data.announcements : [];
      const active = announcements.filter(item => item.active !== false && item.id);
      const newItems = active.filter(item => !known.includes(String(item.id)));
      if (notifyNew && !firstLoad && newItems.length && 'Notification' in window && Notification.permission === 'granted') {
        newItems.slice(0,3).forEach(item => {
          try { new Notification(item.title || 'Neue Vereinsankündigung', {body:item.text || 'Es gibt Neuigkeiten im Verein.', icon:'tus-oppenau-logo.png', tag:String(item.id)}); }
          catch {}
        });
      }
      if (firstLoad) {
        known = [...new Set([...known, ...active.map(item => String(item.id))])];
        localStorage.setItem(knownKey, JSON.stringify(known));
        firstLoad = false;
      } else if (newItems.length) {
        known = [...new Set([...known, ...newItems.map(item => String(item.id))])];
        localStorage.setItem(knownKey, JSON.stringify(known));
      }
      render();
    } catch (error) {
      list.innerHTML = '<div class="panel"><strong>Aktuelles momentan nicht erreichbar</strong><p style="margin-top:7px">Bitte lade die App später erneut.</p></div>';
    }
  }

  function updatePermissionStatus() {
    if (!('Notification' in window)) {
      status.textContent = 'Dieser Browser unterstützt keine Web-Benachrichtigungen.';
      enable.disabled = true;
      return;
    }
    if (Notification.permission === 'granted') {
      status.textContent = 'Benachrichtigungen sind auf diesem Gerät erlaubt.';
      enable.textContent = '✓ Benachrichtigungen aktiviert';
    } else if (Notification.permission === 'denied') {
      status.textContent = 'Benachrichtigungen wurden im Browser blockiert. Du kannst sie in den Website-Einstellungen freigeben.';
      enable.textContent = 'Benachrichtigungen in Einstellungen freigeben';
    } else {
      status.textContent = 'Benachrichtigungen sind noch nicht aktiviert.';
    }
  }

  enable.addEventListener('click', async () => {
    if (!('Notification' in window)) return updatePermissionStatus();
    if (!window.isSecureContext) {
      status.textContent = 'Benachrichtigungen benötigen eine sichere HTTPS-Verbindung.';
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      updatePermissionStatus();
      if (permission === 'granted') {
        new Notification('TuS Oppenau Handball', {body:'Benachrichtigungen sind aktiviert. Neue Ankündigungen werden erkannt, solange die App geöffnet ist.', icon:'tus-oppenau-logo.png'});
      }
    } catch {
      status.textContent = 'Die Freigabe konnte nicht geöffnet werden. Bitte prüfe die Browser-Einstellungen.';
    }
  });

  updatePermissionStatus();
  loadFeed(false);
  window.setInterval(() => loadFeed(true), 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadFeed(true);
  });
})();
