/* Visual project previews; all case-study copy here is deliberately provisional. */
(() => {
  const content = {
    legends: {number:'01 / VISUAL DESIGN & STORYTELLING',title:'Living Legends',intro:'Bringing a story to life, on screen and on stage.',direction:'A sample visual direction for presenting creative and social media work: expressive typography, movement, and a connected visual identity.',question:'How could digital storytelling help someone feel connected to a performance before they ever take their seat?'},
    makerspace: {number:'02 / UX THINKING & SERVICE DESIGN',title:'BYU Makerspace',intro:'Making the first step feel a little easier.',direction:'An illustrative starting-point experience for students exploring the Makerspace. The interface imagines simple paths into tools, learning, and making.',question:'How could we help a first-time visitor go from having an idea to knowing exactly where to begin?'},
    orra: {number:'03 / PRODUCT STRATEGY & USER EXPERIENCE',title:'Orra Dating',intro:'Exploring what helps people connect.',direction:'A sample product concept built around shared interests and conversation prompts. These screens illustrate a possible case-study presentation, not the existing Orra app.',question:'How could the first few interactions make meeting someone feel more natural and less intimidating?'}
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entries = document.querySelectorAll('.project-entry');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const observer = new IntersectionObserver(items => items.forEach(item => {
      if(item.isIntersecting){item.target.classList.add('is-visible');observer.unobserve(item.target);}
    }),{threshold:.08});
    document.documentElement.classList.add('project-motion');
    entries.forEach(entry=>observer.observe(entry));
  }
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.project-stage').forEach(stage=>{
    let frame;
    stage.addEventListener('pointermove',event=>{
      if(reduce.matches || !fine.matches) return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const rect=stage.getBoundingClientRect();
        stage.style.setProperty('--mx',((event.clientX-rect.left)/rect.width-.5)*14+'px');
        stage.style.setProperty('--my',((event.clientY-rect.top)/rect.height-.5)*10+'px');
      });
    });
    stage.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);stage.style.setProperty('--mx','0px');stage.style.setProperty('--my','0px');});
  });
  const dialog=document.querySelector('.project-dialog');
  if(!dialog) return;
  let opener, previousOverflow;
  document.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>{
    const item=content[button.dataset.openProject];
    if(!item)return;
    opener=button;
    dialog.querySelector('.dialog-number').textContent=item.number;
    dialog.querySelector('#dialog-title').textContent=item.title;
    dialog.querySelector('.dialog-intro').textContent=item.intro;
    dialog.querySelector('.dialog-direction').textContent=item.direction;
    dialog.querySelector('.dialog-question').textContent=item.question;
    previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.showModal();
    dialog.scrollTop=0;
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    const r=dialog.getBoundingClientRect();
    if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom))dialog.close();
  });
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';opener?.focus({preventScroll:true});});
})();
