/* Touch controls for phones/tablets. Movement sends the same arrow keys as desktop. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const isMobile = () => matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  function keyEvent(type, key) {
    document.dispatchEvent(new KeyboardEvent(type, {key, code:key.startsWith('Arrow') ? key : key, bubbles:true, cancelable:true}));
  }
  function tapKey(key) { keyEvent('keydown', key); setTimeout(() => keyEvent('keyup', key), 90); }
  function mount() {
    if ($('#mobile-hud')) return;
    const hud = document.createElement('div');
    hud.id = 'mobile-hud';
    hud.innerHTML = `
      <div id="mobile-top">
        <div class="mgroup"><button class="m-btn" id="m-full" type="button" aria-label="Tela cheia">⛶</button>
          <button class="m-btn" id="m-panels-toggle" type="button">☰</button></div>
        <div id="mobile-status">Jetyum</div>
        <div class="mgroup"><button class="m-btn" id="m-chat-toggle" type="button">Chat</button></div>
      </div>
      <div id="mobile-panels" aria-label="Painéis do jogo"></div>
      <div id="mobile-bottom">
        <div id="mobile-dpad" aria-label="Movimento">
          <button type="button" data-dir="up" aria-label="Cima">▲</button>
          <button type="button" data-dir="left" aria-label="Esquerda">◀</button>
          <button type="button" data-dir="down" aria-label="Baixo">▼</button>
          <button type="button" data-dir="right" aria-label="Direita">▶</button>
        </div>
        <div id="mobile-actions">
          <button class="m-btn" type="button" id="m-stop">⏹ Parar</button>
          <button class="m-btn" type="button" id="m-attack">⚔ Batalha</button>
          <button class="m-btn" type="button" id="m-bag">🎒 Bolsa</button>
          <button class="m-btn" type="button" id="m-chat-focus">✎ Falar</button>
        </div>
      </div>
      <form id="mobile-chat"><input id="mobile-chat-input" autocomplete="off" placeholder="Mensagem ou magia…"></form>`;
    document.body.appendChild(hud);

    const panel = $('#mobile-panels');
    const side = $('#lateral');
    if (side) {
      const ids = ['ventana-minimapa','ventana-vida','ventana-equipo','ventana-skills','ventana-batalla','ventana-vip','ventana-misiones','ventana-opciones','ventana-ayuda','ventana-mochila'];
      ids.forEach(id => { const el = $('#'+id); if (el) panel.appendChild(el); });
    }
    const panelsToggle = () => {
      panel.classList.toggle('open');
      document.body.classList.toggle('mobile-panels-open', panel.classList.contains('open'));
    };
    $('#m-panels-toggle').addEventListener('click', panelsToggle);
    $('#m-full').addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({navigationUI:'hide'});
        else { document.body.classList.toggle('mobile-fullscreen'); }
      } catch (_) { document.body.classList.toggle('mobile-fullscreen'); }
    });
    document.addEventListener('fullscreenchange', () => $('#m-full')?.classList.toggle('active', !!document.fullscreenElement));

    const directions = {up:'ArrowUp', down:'ArrowDown', left:'ArrowLeft', right:'ArrowRight'};
    $$('#mobile-dpad [data-dir]').forEach(btn => {
      const key = directions[btn.dataset.dir];
      let held = false, repeat;
      const start = e => {
        e.preventDefault(); if (held) return; held = true; btn.classList.add('active');
        keyEvent('keydown', key);
        repeat = setInterval(() => keyEvent('keydown', key), 130);
      };
      const stop = e => {
        if (e) e.preventDefault(); if (!held) return; held = false; btn.classList.remove('active');
        clearInterval(repeat); keyEvent('keyup', key);
      };
      btn.addEventListener('pointerdown', start);
      ['pointerup','pointercancel','pointerleave'].forEach(ev => btn.addEventListener(ev, stop));
      btn.addEventListener('contextmenu', e => e.preventDefault());
    });
    $('#m-stop').addEventListener('click', () => { tapKey('Escape'); const b=$('[data-accion="stop"]'); b?.click(); });
    $('#m-attack').addEventListener('click', () => {
      const first = $('#lista-batalla .batalla-fila');
      if (first) first.click();
      else { panel.classList.add('open'); $('#ventana-batalla')?.scrollIntoView({block:'nearest'}); }
    });
    $('#m-bag').addEventListener('click', () => {
      const bag = $('#ventana-mochila');
      if (bag) { bag.hidden = !bag.hidden; if (!bag.hidden) { panel.classList.add('open'); bag.scrollIntoView({block:'nearest'}); } }
    });
    const chat = $('#mobile-chat'), input = $('#mobile-chat-input');
    const toggleChat = () => { chat.classList.toggle('open'); if(chat.classList.contains('open')) input.focus(); };
    $('#m-chat-toggle').addEventListener('click', toggleChat);
    $('#m-chat-focus').addEventListener('click', toggleChat);
    chat.addEventListener('submit', e => {
      e.preventDefault();
      const target = $('#chat');
      if (target) {
        target.value = input.value;
        target.dispatchEvent(new Event('input', {bubbles:true}));
        target.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));
      }
      input.value=''; chat.classList.remove('open'); input.blur();
    });
    const status = $('#status');
    if (status) new MutationObserver(() => { $('#mobile-status').textContent = status.textContent || 'Jetyum'; }).observe(status,{childList:true,subtree:true,characterData:true});
    document.addEventListener('keydown', e => {
      if (!isMobile() || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    }, {passive:false});
    document.addEventListener('contextmenu', e => { if (isMobile()) e.preventDefault(); });
    window.addEventListener('resize', () => { if (!isMobile()) { panel.classList.remove('open'); chat.classList.remove('open'); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();