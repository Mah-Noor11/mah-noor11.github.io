(() => {
  'use strict';
  const root=document.documentElement;
  const theme=document.getElementById('theme-toggle');
  const menu=document.getElementById('menu-toggle');
  const nav=document.getElementById('site-nav');
  const year=document.getElementById('year');
  year.textContent=String(new Date().getFullYear());
  let saved=null;
  try{saved=localStorage.getItem('mahnoor-theme')}catch(e){}
  const system=window.matchMedia('(prefers-color-scheme: dark)');
  const useTheme=(mode)=>{
    root.dataset.theme=mode;
    theme.setAttribute('aria-label',`Switch to ${mode==='light'?'dark':'light'} theme`);
    theme.title=`Switch to ${mode==='light'?'dark':'light'} theme`;
    document.querySelector('meta[name="theme-color"]').content=mode==='light'?'#f8f9f5':'#111b18';
  };
  useTheme(['light','dark'].includes(saved)?saved:system.matches?'dark':'light');
  theme.addEventListener('click',()=>{
    const mode=root.dataset.theme==='light'?'dark':'light';useTheme(mode);
    try{localStorage.setItem('mahnoor-theme',mode)}catch(e){}
  });
  if(system.addEventListener)system.addEventListener('change',e=>{try{if(!localStorage.getItem('mahnoor-theme'))useTheme(e.matches?'dark':'light')}catch(err){useTheme(e.matches?'dark':'light')}});
  const setMenu=(open)=>{nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')};
  menu.addEventListener('click',()=>setMenu(!nav.classList.contains('is-open')));
  [...nav.querySelectorAll('a')].forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('click',e=>{if(nav.classList.contains('is-open')&&!nav.contains(e.target)&&!menu.contains(e.target))setMenu(false)});
  const navlinks=[...nav.querySelectorAll('a')];
  const updateNav=()=>{let active='';for(const a of navlinks){const item=document.querySelector(a.getAttribute('href'));if(item&&item.getBoundingClientRect().top<160)active=a.getAttribute('href')}navlinks.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')===active);if(a.getAttribute('href')===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})};
  window.addEventListener('scroll',updateNav,{passive:true});updateNav();
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-kind]')];
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const value=btn.dataset.filter;
    filters.forEach(other=>{const active=other===btn;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active))});
    cards.forEach(card=>{card.hidden=value!=='all'&&card.dataset.kind!==value});
  }));
  const modal=document.getElementById('lightbox');
  const modalImage=document.getElementById('lightbox-img');
  const modalTitle=document.getElementById('lightbox-title');
  const modalSubtitle=document.getElementById('lightbox-subtitle');
  const modalDownload=document.getElementById('lightbox-download');
  const closeBtn=document.getElementById('lightbox-close');
  let lastFocus=null;
  const closeModal=()=>{if(modal.hidden)return;modal.hidden=true;document.body.classList.remove('modal-open');modalImage.removeAttribute('src');if(lastFocus)lastFocus.focus()};
  document.querySelectorAll('.evidence-photo').forEach(btn=>btn.addEventListener('click',()=>{
    lastFocus=btn;
    modalImage.src=btn.dataset.image;
    modalImage.alt=btn.dataset.title;
    modalTitle.textContent=btn.dataset.title;
    modalSubtitle.textContent=btn.dataset.subtitle;
    modalDownload.href=btn.dataset.image;
    modalDownload.download=btn.dataset.image.split('/').pop();
    modal.hidden=false;
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }));
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target.dataset.close)closeModal()});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeModal();setMenu(false)}
    if(e.key==='Tab'&&!modal.hidden){const elems=[closeBtn,modalDownload];if(e.shiftKey&&document.activeElement===elems[0]){e.preventDefault();elems[1].focus()}else if(!e.shiftKey&&document.activeElement===elems[1]){e.preventDefault();elems[0].focus()}}
  });
})();
