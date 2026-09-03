const openBtn = document.getElementById('openNav');
  const closeBtn = document.getElementById('closeNav');
  const mobileNav = document.getElementById('mobile-nav');

  function setNav(open){
    mobileNav.classList.toggle('open', open);
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  openBtn.addEventListener('click', () => setNav(true));
  closeBtn.addEventListener('click', () => setNav(false));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

  // Only one accordion item open per group at a time
  document.querySelectorAll('.prop-group').forEach(group => {
    const items = group.querySelectorAll('details.prop');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open){
          items.forEach(other => { if (other !== item) other.open = false; });
        }
      });
    });
  });