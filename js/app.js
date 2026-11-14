/* Boot + app shell (header, footer, mobile tab bar) */
var BF = window.BF = window.BF || {};
(function(){
  var html = document.documentElement, I = BF.icon, esc = function(s){ return BF.ui.esc(s); };
  var f = function(){ return BF.store.f; };
  if(!f().demoSeeded && !f().demoCleared){ try{ BF.seedDemo(); }catch(e){ console.warn("demo seed failed", e); } }
  BF.store.child();

  function navItems(){
    return [
      {k:"home", href:"#/", ico:"home", t:BF.L("Home","Главная")},
      {k:"library", href:"#/library", ico:"book", t:BF.L("Situations","Ситуации")},
      {k:"games", href:"#/games", ico:"puzzle", t:BF.L("Games","Игры")},
      {k:"diary", href:"#/diary", ico:"pencil", t:BF.L("Diary","Дневник")},
      {k:"specialist", href:"#/specialist", ico:"chart", t:BF.L("Specialist","Специалист")}
    ];
  }
  BF.GAME_ORDER = BF.GAME_ORDER.filter(function(id){ return BF.games[id]; });
  BF.renderShell = function(){
    // demo child is "Mira" in English and "Мира" in Russian; old saves get bilingual step texts
    var chg = false;
    BF.store.children().forEach(function(k){
      if(k.isDemo && /^(Mira|Мира)$/.test(k.name||"")){ var nm = BF.lang()==="ru" ? "Мира" : "Mira"; if(k.name !== nm){ k.name = nm; chg = true; } }
      if(BF.migrateSteps(k)) chg = true;
    });
    if(chg) BF.store.save();
    var s = f().settings, c = BF.store.s;
    document.getElementById("skipLink").textContent = BF.L("Skip to content","Перейти к содержимому");
    document.getElementById("topbar").innerHTML =
      '<a href="#/" class="brand" aria-label="Balapan Focus &amp; Calm"><span class="brand-mark">'+BF.avatar.chick(34)+'</span><span class="brand-text"><b>Balapan</b><small>Focus &amp; Calm</small></span></a>'+
      '<nav class="mainnav" aria-label="'+BF.L("Main","Главное меню")+'">'+navItems().map(function(n){ return '<a href="'+n.href+'" data-nav="'+n.k+'">'+n.t+'</a>'; }).join("")+'<a href="#/pricing" data-nav="pricing">'+BF.L("Plans","Тарифы")+'</a></nav>'+
      '<div class="toggles">'+
        '<button class="kid-switch" id="kidSwitch" aria-haspopup="true" aria-expanded="false" title="'+BF.L("Switch child","Сменить ребёнка")+'">'+BF.avatar.svg(c.avatar,{size:30, headOnly:true})+'<span>'+esc(BF.ui.heroName(c))+'</span>'+(c.isDemo?'<small class="demo-tag">'+BF.L("demo","демо")+'</small>':'')+'</button>'+
        '<div class="langsw" role="group" aria-label="Language / Язык"><button data-lang="en" aria-pressed="'+(BF.lang()==="en")+'">EN</button><button data-lang="ru" aria-pressed="'+(BF.lang()==="ru")+'">RU</button></div>'+
        '<button class="tgl icon-only" id="themeToggle" aria-pressed="'+(s.theme==="dark")+'" title="'+BF.L("Dark theme","Тёмная тема")+'"><span class="tgl-ico">'+I(s.theme==="dark"?"sun":"moon",18)+'</span></button>'+
        '<button class="tgl" id="calmToggle" aria-pressed="'+(!!s.calm)+'" title="'+BF.L("Calm mode: less motion, no sound","Спокойный режим: меньше движения, без звука")+'"><span class="tgl-ico">'+I("leaf",18)+'</span><span class="tgl-lbl">'+BF.L("Calm","Спокойно")+'</span></button>'+
        '<button class="tgl icon-only" id="soundToggle" aria-pressed="'+(!!s.sound && !s.calm)+'" title="'+BF.L("Soft sounds (off by default)","Мягкие звуки (по умолчанию выкл.)")+'"><span class="tgl-ico">'+I(s.sound && !s.calm ? "soundOn" : "soundOff",18)+'</span></button>'+
        '<a class="tgl icon-only" href="#/settings" data-nav="settings" title="'+BF.L("Settings","Настройки")+'"><span class="tgl-ico">'+I("gear",18)+'</span></a>'+
      '</div>';
    document.getElementById("tabbar").innerHTML = navItems().map(function(n){ return '<a href="'+n.href+'" data-nav="'+n.k+'">'+I(n.ico,22)+'<span>'+n.t+'</span></a>'; }).join("");
    document.getElementById("foot").innerHTML =
      '<p><b>Balapan Focus &amp; Calm</b> — '+BF.L("daily parent support, inspired by research on parent-based approaches. Not therapy and not a medical device; it does not diagnose or treat any condition.","ежедневная поддержка родителя, основанная на исследованиях методов, где главную роль играет родитель. Это не терапия и не медицинское изделие; сервис не ставит диагнозы и не лечит.")+
      ' <a href="#/safety">'+BF.L("Safety &amp; when to talk to a specialist","Безопасность и когда обратиться к специалисту")+'</a> · '+BF.L("In the US, call or text <b>988</b> in a crisis · <b>911</b> for emergencies.","В США в кризисной ситуации — звонок или SMS на <b>988</b> · <b>911</b> — экстренные службы. В Казахстане — <b>112</b>, телефон доверия для детей <b>150</b>.")+'</p>'+
      '<p class="foot-small">'+BF.L("Prototype for Zimran Business Cup 2.0 · all data stays in this browser (localStorage)","Прототип для Zimran Business Cup 2.0 · все данные хранятся только в этом браузере (localStorage)")+' · <a href="#/about">'+BF.L("About Balapan","О Balapan")+'</a> · <button class="linkbtn" id="resetAll">'+BF.L("Reset all data","Сбросить все данные")+'</button></p>';
    bind(); applySettings();
    var r = BF.router.current && BF.router.current(); if(r){ var nav = document.querySelector('[data-nav="'+r.name+'"]'); }
  };
  function applySettings(){
    var s = f().settings;
    html.classList.toggle("calm", !!s.calm);
    html.classList.toggle("dark", s.theme==="dark");
    var m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute("content", s.theme==="dark" ? "#141c2e" : "#F3EBDD");
  }
  BF.applySettings = applySettings;
  function bind(){
    var s = f().settings;
    document.querySelectorAll(".langsw [data-lang]").forEach(function(b){ b.onclick = function(){ BF.setLang(b.getAttribute("data-lang")); BF.renderShell(); BF.router.refresh(); }; });
    document.getElementById("themeToggle").onclick = function(){ BF.store.updateFamily(function(x){ x.settings.theme = x.settings.theme==="dark" ? "light" : "dark"; }); BF.renderShell(); };
    document.getElementById("calmToggle").onclick = function(){ BF.store.updateFamily(function(x){ x.settings.calm = !x.settings.calm; }); BF.renderShell(); BF.ui.toast(f().settings.calm ? BF.L("Calm mode on: less motion, no sounds.","Спокойный режим включён: меньше движения, без звуков.") : BF.L("Calm mode off.","Спокойный режим выключен.")); };
    document.getElementById("soundToggle").onclick = function(){
      if(f().settings.calm){ BF.ui.toast(BF.L("Sound stays off in Calm mode.","В спокойном режиме звук выключен.")); return; }
      BF.store.updateFamily(function(x){ x.settings.sound = !x.settings.sound; }); BF.sound.unlock(); BF.renderShell(); BF.sound.chime();
    };
    document.getElementById("kidSwitch").onclick = openSwitcher;
    document.getElementById("resetAll").onclick = function(){ if(confirm(BF.L("Remove all children, plans, diary and progress from this browser?","Удалить всех детей, планы, дневник и прогресс из этого браузера?"))){ BF.store.reset(); location.hash = "#/"; location.reload(); } };
  }
  function openSwitcher(){
    var st = BF.store, kids = st.children(), cur = st.f.active;
    var sh = BF.ui.sheet('<h2>'+BF.L("Whose plan are we looking at?","Чей план открываем?")+'</h2><div class="kid-list">'+kids.map(function(c){
      return '<button class="kid-row'+(c.id===cur?' on':'')+'" data-id="'+c.id+'">'+BF.avatar.svg(c.avatar,{size:52, headOnly:true})+'<span><b>'+esc(BF.ui.heroName(c))+'</b><small>'+(c.quizDone ? BF.L("age","возраст")+' '+c.age+' · '+BF.ui.T(BF.TAGS[c.profile]?BF.TAGS[c.profile].label:{en:"profile not set",ru:"профиль не задан"}) : BF.L("quiz not finished","анкета не заполнена"))+'</small></span>'+(c.isDemo?'<span class="demo-tag">'+BF.L("demo data","демо-данные")+'</span>':'')+'</button>';
    }).join("")+'</div><div class="cel-actions"><button class="btn clay" id="ksAdd">'+I("plus",18)+' '+BF.L("Add a child","Добавить ребёнка")+'</button><a class="btn ghost" href="#/family">'+BF.L("Manage children","Управление детьми")+'</a></div><p class="fine">'+BF.L("Free: 1 child · Monthly: 2 children · Yearly: up to 3 children.","Бесплатно: 1 ребёнок · Месяц: 2 ребёнка · Год: до 3 детей.")+'</p>', "narrow");
    sh.querySelectorAll(".kid-row").forEach(function(b){ b.onclick = function(){ st.setActive(b.getAttribute("data-id")); sh.close(); BF.renderShell(); BF.router.go("/"); BF.router.refresh(); }; });
    sh.querySelector("#ksAdd").onclick = function(){ sh.close(); BF.addChildFlow(); };
    sh.querySelector('a[href="#/family"]').onclick = function(){ sh.close(); };
  }
  BF.addChildFlow = function(){
    var st = BF.store;
    if(!st.canAddChild()){ BF.router.go("/pricing?children=1"); BF.ui.toast(BF.L("Your plan allows "+st.childLimit()+" child(ren). Upgrade to add another.","Ваш тариф позволяет детей: "+st.childLimit()+". Чтобы добавить ещё, смените тариф.")); return; }
    // reuse an empty, unfinished real child if there is one
    var empty = st.realChildren().find(function(c){ return !c.quizDone && !(c.name||"").trim(); });
    if(empty) st.setActive(empty.id); else st.addChild();
    BF.renderShell(); BF.router.go("/quiz?new=1");
  };
  // Skip link: move focus to the content without touching the hash router ("#app" is not a route).
  document.getElementById("skipLink").addEventListener("click", function(e){ e.preventDefault(); var m = document.getElementById("app"); m.focus(); m.scrollIntoView(); });
  if("scrollRestoration" in history) history.scrollRestoration = "manual";
  BF.renderShell();
  BF.router.start();
})();
