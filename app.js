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