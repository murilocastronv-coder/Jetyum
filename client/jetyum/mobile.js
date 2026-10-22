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
        <div id="mobile-status">Forgotten Lands</div>
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
        kicker:'MMORPG de fantasia • aventura online', title:'O teu destino está por escrever.', intro:'Entra em Forgotten Lands, cria o teu herói, explora terras misteriosas, enfrenta monstros, conquista tesouros e torna-te uma lenda. A aventura espera por ti.',
        play:'⚔ ENTRAR NA AVENTURA', learn:'✦ DESCOBRIR O JOGO', feature1:'Explora terras esquecidas', desc1:'Percorre mapas, revela novos lugares e descobre os segredos deste mundo.',
        feature2:'Combate e evolução', desc2:'Enfrenta criaturas, ganha experiência, sobe de nível e melhora as tuas habilidades.',
        feature3:'Tesouros e equipamento', desc3:'Recolhe saque, organiza a mochila e prepara o teu herói para desafios maiores.',
        foot:'Forgotten Lands é um MMORPG em desenvolvimento. As funcionalidades podem evoluir.', mobile:'Joga no telemóvel ou computador • Interface adaptada a ecrãs pequenos.',
        stop:'⏹ Parar', battle:'⚔ Batalha', bag:'🎒 Mochila', speak:'✎ Chat', chat:'Mensagem, comando ou magia…',
        enter:'Entrar', create:'Criar conta', account:'Conta', password:'Palavra-passe', repeat:'Repete a palavra-passe',
        character:'Nome do personagem', vocation:'Vocação', sex:'Sexo', man:'Homem', woman:'Mulher', remember:'Memorizar conta neste navegador',
        world:'Entrar no mundo', change:'Mudar de conta', map:'Minimapa', hpmp:'Vida e mana', equipment:'Equipamento', skills:'Habilidades',
        quests:'Missões', options:'Opções', help:'Ajuda', bagTitle:'Mochila', battleTitle:'Batalha', vip:'Lista VIP',
        experience:'Experiência', level:'Nível', health:'Vida', mana:'Mana', capacity:'Capacidade', speed:'Velocidade', stamina:'Resistência',
        default:'Geral', serverLog:'Registo do servidor', status:'A ligar…'
      },
      en: {
        kicker:'Fantasy MMORPG • online adventure', title:'Your destiny is unwritten.', intro:'Enter Forgotten Lands, create your hero, explore mysterious lands, battle monsters, claim treasures, and become a legend. Your adventure awaits.',
        play:'⚔ ENTER THE ADVENTURE', learn:'✦ DISCOVER THE GAME', feature1:'Explore forgotten lands', desc1:'Travel across maps, uncover new places, and discover the secrets of this world.',
        feature2:'Combat and progression', desc2:'Fight creatures, earn experience, level up, and improve your abilities.',
        feature3:'Loot and equipment', desc3:'Collect loot, manage your backpack, and prepare your hero for greater challenges.',
        foot:'Forgotten Lands is an MMORPG in development. Features may evolve.', mobile:'Play on your phone or computer • Designed for mobile screens.',
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
      'Minimapa':'map','Minimap':'map','Vida y maná':'hpmp','Health and mana':'hpmp','Equipo':'equipment','Equipment':'equipment','Skills':'skills','Habilidades':'skills','Batalla':'battleTitle','Battle':'battleTitle','VIP':'vip',
      'Misiones':'quests','Quests':'quests','Opciones':'options','Options':'options','Ayuda':'help','Help':'help','Mochila':'bagTitle','Backpack':'bagTitle','Experiencia':'experience','Experience':'experience',
      'Nivel':'level','Level':'level','Vida':'health','Health':'health','Maná':'mana','Mana':'mana','Capacidad':'capacity','Capacity':'capacity','Velocidad':'speed','Speed':'speed','Stamina':'stamina',
      'Cuenta':'account','Account':'account','Contraseña':'password','Password':'password','Repite la contraseña':'repeat','Repeat password':'repeat','Nombre del personaje':'character','Character name':'character',
      'Vocación':'vocation','Vocation':'vocation','Sexo':'sex','Sex':'sex','Hombre':'man','Male':'man','Mujer':'woman','Female':'woman','Entrar':'enter','Log in':'enter','Crear cuenta':'create','Create account':'create',
      'Entrar al mundo':'world','Enter the world':'world','Recordar cuenta en este navegador':'remember','Remember account on this browser':'remember','Default':'default','Server Log':'serverLog',
      'Parar':'stop','Falar':'speak','Batalha':'battle','Bolsa':'bag','Mensagem ou magia…':'chat'
    };
    function applyLanguage(lang) {
      language.value = lang;
      const d = dictionary[lang];
      document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
      document.title = 'Forgotten Lands — ' + (lang === 'pt' ? 'RPG online' : 'online RPG');
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
        <nav class="jw-nav"><a class="jw-logo" href="#" aria-label="Forgotten Lands home">FORGOTTEN <span>LANDS</span></a><div class="jw-lang"><button type="button" data-language="en">🇬🇧 ENGLISH</button><button type="button" data-language="pt">🇵🇹 PORTUGUÊS</button></div></nav>
        <main class="jw-hero">
          <div class="jw-kicker" data-copy="kicker"></div>
          <h1 data-copy="title"></h1>
          <p data-copy="intro"></p>
          <div class="jw-cta"><button type="button" id="jw-play" data-copy="play"></button><button type="button" class="jw-secondary" id="jw-learn" data-copy="learn"></button></div>
          <div class="jw-screenshot"><img src="https://raw.githubusercontent.com/murilocastronv-coder/Jetyum/main/docs/guias/img/juego-detalle.png" alt="Imagem do mundo de Forgotten Lands" loading="eager"><div class="jw-image-label"><span>FORGOTTEN LANDS</span><small>EXPLORE • FIGHT • BECOME A LEGEND</small></div></div>
          <h2 class="jw-section-title" id="jw-world-title">A TUA AVENTURA COMEÇA AQUI</h2>
          <div class="jw-features">
            <button type="button" class="jw-feature" data-feature="map"><span class="jw-icon">🗺️</span><strong data-copy="feature1"></strong><p data-copy="desc1"></p><span class="jw-more">＋</span></button>
            <button type="button" class="jw-feature" data-feature="combat"><span class="jw-icon">⚔️</span><strong data-copy="feature2"></strong><p data-copy="desc2"></p><span class="jw-more">＋</span></button>
            <button type="button" class="jw-feature" data-feature="bag"><span class="jw-icon">🎒</span><strong data-copy="feature3"></strong><p data-copy="desc3"></p><span class="jw-more">＋</span></button>
          </div>
          <div id="jw-feature-detail" class="jw-feature-detail" hidden></div>
          <div class="jw-how"><h2 id="jw-how-title">COMO COMEÇAR</h2><div class="jw-steps"><div><b>01</b><strong id="jw-step1">Cria a tua conta</strong><p id="jw-step1p">Escolhe as tuas credenciais e cria o teu herói.</p></div><div><b>02</b><strong id="jw-step2">Entra no mundo</strong><p id="jw-step2p">Explora o mapa e aprende os controlos.</p></div><div><b>03</b><strong id="jw-step3">Fica mais forte</strong><p id="jw-step3p">Combate criaturas, recolhe itens e evolui.</p></div></div></div>
          <div class="jw-bottom-cta"><div><strong id="jw-ready">Pronto para descobrir Forgotten Lands?</strong><p id="jw-ready-p">A tua próxima aventura começa com um clique.</p></div><button type="button" id="jw-play-bottom">JOGAR AGORA →</button></div>
          <p class="jw-foot" data-copy="foot"></p><p class="jw-foot" data-copy="mobile"></p>
        </main>
      </div>`;
    document.body.appendChild(welcome);
    welcome.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.language)));
    const featureDetails = {
      pt: {map:'Explora o território, percorre diferentes zonas e fica atento a criaturas e segredos escondidos.',combat:'Ataca criaturas, acompanha a batalha e desenvolve o teu personagem enquanto ganhas experiência.',bag:'Consulta a mochila, recolhe objetos e gere o equipamento que encontras durante a aventura.'},
      en: {map:'Explore the territory, travel through different areas, and watch for creatures and hidden secrets.',combat:'Fight creatures, follow battles, and develop your character as you gain experience.',bag:'Open your backpack, collect items, and manage the equipment you discover on your journey.'}
    };
    welcome.querySelectorAll('[data-feature]').forEach(card=>card.addEventListener('click',()=>{
      const key=card.dataset.feature, detail=$('#jw-feature-detail');
      detail.textContent=featureDetails[language.value][key]; detail.hidden=false;
      welcome.querySelectorAll('[data-feature]').forEach(el=>el.classList.toggle('selected',el===card));
      detail.scrollIntoView({behavior:'smooth',block:'nearest'});
    }));
    const enterLogin = () => { welcome.hidden=true; const overlay=$('#overlay'); if(overlay) { overlay.hidden=false; overlay.style.display='flex'; } };
    $('#jw-play').addEventListener('click',enterLogin);
    $('#jw-play-bottom').addEventListener('click',enterLogin);
    $('#m-lang').addEventListener('click',()=>applyLanguage(language.value==='pt'?'en':'pt'));
    $('#jw-learn').addEventListener('click',()=>$('#jw-how-title')?.scrollIntoView({behavior:'smooth',block:'center'}));
    const syncLandingLanguage = lang => {
      const pt=lang==='pt';
      $('#jw-world-title').textContent=pt?'A TUA AVENTURA COMEÇA AQUI':'YOUR ADVENTURE STARTS HERE';
      $('#jw-how-title').textContent=pt?'COMO COMEÇAR':'HOW TO BEGIN';
      $('#jw-step1').textContent=pt?'Cria a tua conta':'Create your account';
      $('#jw-step1p').textContent=pt?'Escolhe as tuas credenciais e cria o teu herói.':'Choose your credentials and create your hero.';
      $('#jw-step2').textContent=pt?'Entra no mundo':'Enter the world';
      $('#jw-step2p').textContent=pt?'Explora o mapa e aprende os controlos.':'Explore the map and learn the controls.';
      $('#jw-step3').textContent=pt?'Fica mais forte':'Become stronger';
      $('#jw-step3p').textContent=pt?'Combate criaturas, recolhe itens e evolui.':'Fight creatures, collect items, and level up.';
      $('#jw-ready').textContent=pt?'Pronto para descobrir Forgotten Lands?':'Ready to discover Forgotten Lands?';
      $('#jw-ready-p').textContent=pt?'A tua próxima aventura começa com um clique.':'Your next adventure is one click away.';
      $('#jw-play-bottom').textContent=pt?'JOGAR AGORA →':'PLAY NOW →';
      const detail=$('#jw-feature-detail'); if(!detail.hidden){ const selected=$('.jw-feature.selected'); if(selected) detail.textContent=featureDetails[lang][selected.dataset.feature];}
    };
    const originalApplyLanguage=applyLanguage;
    applyLanguage = (lang) => { originalApplyLanguage(lang); syncLandingLanguage(lang); };
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
    if (status) new MutationObserver(() => { $('#mobile-status').textContent = status.textContent || 'Forgotten Lands'; }).observe(status,{childList:true,subtree:true,characterData:true});
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