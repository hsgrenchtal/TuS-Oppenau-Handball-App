(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navButtons = [...document.querySelectorAll('.navbtn')];
  function showPage(name) {
    if (!document.getElementById(name)) return;
    pages.forEach(p => p.classList.toggle('active', p.id === name));
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.page === name));
    window.scrollTo({top:0, behavior:'smooth'});
  }
  document.addEventListener('click', e => {
    const control = e.target.closest('[data-page]');
    if (!control) return;
    e.preventDefault();
    showPage(control.dataset.page);
  });
})();