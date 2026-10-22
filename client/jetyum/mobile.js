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
        <div class="mgroup"><button class="m-btn" id="m-full" type="button" aria-label="Fullscreen">⛶</button>
          <button class="m-btn" id="m-lang" type="button" aria-label="Change language">EN</button>
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

    const language = { value: (navigator.language || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en' };
    const dictionary = {
      pt: {
        kicker:'RPG online para explorar', title:'A aventura começa aqui.', intro:'Explora um mundo de fantasia, cria o teu personagem, luta contra criaturas, recolhe itens e evolui enquanto descobres o mundo de Jetyum.',
        play:'Jogar agora', learn:'Como jogar', feature1:'Explora o mundo', desc1:'Viaja pelo mapa, descobre lugares e encontra criaturas pelo caminho.',
        feature2:'Combate e progresso', desc2:'Enfrenta monstros, ganha experiência e melhora o teu personagem.',
        feature3:'Equipamento e inventário', desc3:'Recolhe objetos, gere a mochila e organiza o teu equipamento.',
        foot:'Jetyum é um RPG em desenvolvimento. Algumas funcionalidades podem mudar.', mobile:'Feito para jogar no telemóvel ou computador.',
        stop:'⏹ Parar', battle:'⚔ Batalha', bag:'🎒 Mochila', speak:'✎ Chat', chat:'Mensagem, comando ou magia…',
        enter:'Entrar', create:'Criar conta', account:'Conta', password:'Palavra-passe', repeat:'Repete a palavra-passe',
        character:'Nome do personagem', vocation:'Vocação', sex:'Sexo', man:'Homem', woman:'Mulher', remember:'Memorizar conta neste navegador',
        world:'Entrar no mundo', change:'Mudar de conta', map:'Minimapa', hpmp:'Vida e mana', equipment:'Equipamento', skills:'Habilidades',
        quests:'Missões', options:'Opções', help:'Ajuda', bagTitle:'Mochila', battleTitle:'Batalha', vip:'Lista VIP',
        experience:'Experiência', level:'Nível', health:'Vida', mana:'Mana', capacity:'Capacidade', speed:'Velocidade', stamina:'Resistência',
        default:'Geral', serverLog:'Registo do servidor', status:'A ligar…'
      },
      en: {
        kicker:'Online RPG adventure', title:'Your adventure starts here.', intro:'Explore a fantasy world, create your character, fight creatures, collect loot, and grow stronger as you discover the world of Jetyum.',
        play:'Play now', learn:'How to play', feature1:'Explore the world', desc1:'Travel across the map, discover new places, and encounter creatures along the way.',
        feature2:'Combat and progression', desc2:'Fight monsters, earn experience, and improve your character.',
        feature3:'Gear and inventory', desc3:'Collect items, manage your backpack, and organise your equipment.',
        foot:'Jetyum is an RPG in development. Some features may change.', mobile:'Designed for phones and computers.',
        stop:'⏹ Stop', battle:'⚔ Battle', bag:'🎒 Backpack', speak:'✎ Chat', chat:'Message, command, or spell…',
        enter:'Log in', create:'Create account', account:'Account', password:'Password', repeat:'Repeat password',
        character:'Character name', vocation:'Vocation', sex:'Sex', man:'Male', woman:'Female', remember:'Remember account on this browser',
        world:'Enter the world', change:'Change account', map:'Minimap', hpmp:'Health and mana', equipment:'Equipment', skills:'Skills',
        quests:'Quests', options:'Options', help:'Help', bagTitle:'Backpack', battleTitle:'Battle', vip:'VIP list',
        experience:'Experience', level:'Level', health:'Health', mana:'Mana', capacity:'Capacity', speed:'Speed', stamina:'Stamina',
        default:'Default', serverLog:'Server Log', status:'Connecting…'
      }
    };
    const replacements = {
      'Minimapa':'map','Vida y maná':'hpmp','Equipo':'equipment','Skills':'skills','Batalla':'battleTitle','VIP':'vip',
      'Misiones':'quests','Opciones':'options','Ayuda':'help','Mochila':'bagTitle','Experiencia':'experience',
      'Nivel':'level','Vida':'health','Maná':'mana','Capacidad':'capacity','Velocidad':'speed','Stamina':'stamina',
      'Cuenta':'account','Contraseña':'password','Repite la contraseña':'repeat','Nombre del personaje':'character',
      'Vocación':'vocation','Sexo':'sex','Hombre':'man','Mujer':'woman','Entrar':'enter','Crear cuenta':'create',
      'Entrar al mundo':'world','Recordar cuenta en este navegador':'remember','Default':'default','Server Log':'serverLog',
      'Parar':'stop','Falar':'speak','Batalha':'battle','Bolsa':'bag','Mensagem ou magia…':'chat'
    };
    function applyLanguage(lang) {
      language.value = lang;
      const d = dictionary[lang];
      document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
      document.title = 'Jetyum — ' + (lang === 'pt' ? 'RPG online' : 'online RPG');
      const welcome = $('#jetyum-welcome');
      if (welcome) {
        $('[data-copy]', welcome).forEach(el => { const k=el.dataset.copy; if (d[k]) el.textContent=d[k]; });
        $('.jw-lang button', welcome).forEach(b => b.classList.toggle('active', b.dataset.language===lang));
      }
      const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes=[]; while(textWalker.nextNode()) nodes.push(textWalker.currentNode);
      nodes.forEach(node => {
        const original=node.nodeValue.trim();
        const key=replacements[original];
        if (key && d[key] && node.nodeValue.trim()===original) {
          const leading=node.nodeValue.match(/^\\s*/)?.[0] || '';
          const trailing=node.nodeValue.match(/\\s*$/)?.[0] || '';
          node.nodeValue=leading+d[key]+trailing;
        }
      });
      $('[title]').forEach(el => {
        const old=el.getAttribute('title');
        const map={ 'Minimizar':lang==='pt'?'Minimizar':'Minimise','Cerrar':lang==='pt'?'Fechar':'Close','Acercar el minimapa':lang==='pt'?'Aproximar minimapa':'Zoom minimap in','Alejar el minimapa':lang==='pt'?'Afastar minimapa':'Zoom minimap out'};
        if(map[old]) el.title=map[old];
      });
      const chatInput=$('#mobile-chat-input'); if(chatInput) chatInput.placeholder=d.chat;
      const stopBtn=$('#m-stop'); if(stopBtn) stopBtn.textContent=d.stop;
      const battleBtn=$('#m-attack'); if(battleBtn) battleBtn.textContent=d.battle;
      const bagBtn=$('#m-bag'); if(bagBtn) bagBtn.textContent=d.bag;
      const speakBtn=$('#m-chat-focus'); if(speakBtn) speakBtn.textContent=d.speak;
      const panelBtn=$('#m-panels-toggle'); if(panelBtn) panelBtn.textContent=lang==='pt'?'☰ Menu':'☰ Menu';
      const mlang=$('#m-lang'); if(mlang) mlang.textContent=lang==='pt'?'PT':'EN';
    }
    const welcome = document.createElement('section');
    welcome.id='jetyum-welcome';
    welcome.innerHTML=`
      <div class="jw-wrap">
        <nav class="jw-nav"><div class="jw-logo">JETYUM</div><div class="jw-lang"><button type="button" data-language="en">ENGLISH</button><button type="button" data-language="pt">PORTUGUÊS</button></div></nav>
        <main class="jw-hero">
          <div class="jw-kicker" data-copy="kicker"></div>
          <h1 data-copy="title"></h1>
          <p data-copy="intro"></p>
          <div class="jw-cta"><button type="button" id="jw-play" data-copy="play"></button><button type="button" class="jw-secondary" id="jw-learn" data-copy="learn"></button></div>
          <div class="jw-features">
            <article class="jw-feature"><div class="jw-icon">🗺️</div><div><strong data-copy="feature1"></strong><p data-copy="desc1"></p></div></article>
            <article class="jw-feature"><div class="jw-icon">⚔️</div><div><strong data-copy="feature2"></strong><p data-copy="desc2"></p></div></article>
            <article class="jw-feature"><div class="jw-icon">🎒</div><div><strong data-copy="feature3"></strong><p data-copy="desc3"></p></div></article>
          </div>
          <p class="jw-foot" data-copy="foot"></p><p class="jw-foot" data-copy="mobile"></p>
        </main>
      </div>`;
    document.body.appendChild(welcome);
    welcome.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.language)));
    $('#m-lang').addEventListener('click',()=>applyLanguage(language.value==='pt'?'en':'pt'));
    $('#jw-play').addEventListener('click',()=>{welcome.hidden=true; const overlay=$('#overlay'); if(overlay) overlay.hidden=false;});
    $('#jw-learn').addEventListener('click',()=>$('#jetyum-welcome .jw-features')?.scrollIntoView({behavior:'smooth',block:'center'}));
    applyLanguage(language.value);
    const overlay=$('#overlay'); if(overlay) overlay.hidden=true;


    const panel = $('#mobile-panels');
    const side = $('#lateral');
    const originalColumn = $('#columna-der');
    const ids = ['ventana-minimapa','ventana-vida','ventana-equipo','ventana-skills','ventana-batalla','ventana-vip','ventana-misiones','ventana-opciones','ventana-ayuda','ventana-mochila'];
    const syncPanelPlacement = () => {
      if (isMobile()) {
        ids.forEach(id => { const el = $('#'+id); if (el && el.parentElement !== panel) panel.appendChild(el); });
      } else if (originalColumn) {
        ids.forEach(id => { const el = $('#'+id); if (el && el.parentElement !== originalColumn) originalColumn.appendChild(el); });
      }
    };
    syncPanelPlacement();
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
    window.addEventListener('resize', () => {
      syncPanelPlacement();
      if (!isMobile()) { panel.classList.remove('open'); chat.classList.remove('open'); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();