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

  // Solo un área de propuestas abierta a la vez; al abrir, se lleva al inicio del área
  const groups = document.querySelectorAll('details.prop-group');
  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      groups.forEach(other => { if (other !== group) other.open = false; });
      group.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

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

  // Marcar propuestas como cumplidas (se guarda solo en este navegador)
  const DONE_KEY = 'ceal-lista-e-propuestas-cumplidas';

  function loadDone(){
    try {
      const raw = localStorage.getItem(DONE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveDone(ids){
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(ids));
    } catch (e) {
      // localStorage no disponible; el marcado no se guardará entre visitas
    }
  }

  const doneIds = new Set(loadDone().map(String));

  document.querySelectorAll('.prop-done').forEach(checkbox => {
    const id = checkbox.dataset.id;
    const details = checkbox.closest('details.prop');
    if (doneIds.has(id)){
      checkbox.checked = true;
      details.classList.add('done');
    }
    checkbox.addEventListener('change', () => {
      if (checkbox.checked){
        doneIds.add(id);
        details.classList.add('done');
      } else {
        doneIds.delete(id);
        details.classList.remove('done');
      }
      saveDone(Array.from(doneIds));
    });
  });

  // Popup de bienvenida: se muestra unos segundos una vez por visita
  const splash = document.getElementById('splash');
  const SPLASH_KEY = 'ceal-lista-e-splash-visto';
  let yaVisto = false;
  try { yaVisto = sessionStorage.getItem(SPLASH_KEY) === '1'; } catch (e) {}

  if (splash && !yaVisto){
    let splashTimer;
    const closeSplash = () => {
      clearTimeout(splashTimer);
      splash.classList.add('closing');
      setTimeout(() => { splash.hidden = true; }, 300);
      document.removeEventListener('keydown', onSplashKey);
    };
    const onSplashKey = e => { if (e.key === 'Escape') closeSplash(); };

    splash.hidden = false;
    try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch (e) {}
    splashTimer = setTimeout(closeSplash, 6000);
    document.getElementById('splashClose').addEventListener('click', closeSplash);
    splash.addEventListener('click', e => { if (e.target === splash) closeSplash(); });
    document.addEventListener('keydown', onSplashKey);
  }
