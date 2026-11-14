var BF = window.BF = window.BF || {};
BF.screens.library = {
  title:{en:"Situation library",ru:"Библиотека ситуаций"},
  render:function(el, param, query){
    var I = BF.icon, T = BF.ui.T, esc = BF.ui.esc, tag = (query&&query.tag)||"all", cat = (query&&query.cat)||"all", q = "", c = BF.store.s;
    var ALL = BF.SITUATIONS, counts = {all:ALL.length}; ALL.forEach(function(s){ counts[s.tag]=(counts[s.tag]||0)+1; });
    var BATCH = 18, list = [], shown = 0, io = null;
    el.innerHTML =
      '<div class="library wrap">'+
        '<div class="lib-head"><div><p class="eyebrow">'+BF.L("Situation library","Библиотека ситуаций")+'</p><h1>'+BF.L("The moments that get hard","Моменты, когда трудно")+'</h1>'+
        '<p class="muted">'+BF.L(counts.all+" everyday situations, each with its own animated scene. Tap one to see why it's hard, what to say and the five small steps — then turn it into "+esc(BF.ui.heroName())+"'s own story.", counts.all+" ситуации из жизни, у каждой своя анимированная сцена. Нажмите, чтобы узнать, почему это трудно, что сказать и какие пять маленьких шагов сделать — и превратите это в историю про героя по имени "+esc(BF.ui.heroName())+".")+'</p></div>'+
        '<div class="lib-legend paper"><b>'+BF.L("Three starting points","Три отправные точки")+'</b>'+["anxiety","adhd","both"].map(function(t){ return '<span>'+BF.ui.tagChip(t)+' '+T(BF.TAGS[t].note)+'</span>'; }).join("")+'</div></div>'+
        '<div class="lib-tools">'+
          '<div class="filter-tabs" role="tablist">'+["all","anxiety","adhd","both"].map(function(t){ return '<button data-tag="'+t+'" class="ft ft-'+t+'" aria-pressed="'+(t===tag)+'">'+(t==="all"?BF.L("All","Все"):T(BF.TAGS[t].label))+' <small>'+counts[t]+'</small></button>'; }).join("")+'</div>'+
          '<label class="search"><span class="sr">'+BF.L("Search situations","Поиск ситуаций")+'</span>'+I('search',18)+'<input class="input" id="libQ" placeholder="'+BF.L("Search: dentist, homework, noise…","Поиск: стоматолог, уроки, шум…")+'" autocomplete="off"></label>'+
          '<div class="cat-row">'+['all'].concat(Object.keys(BF.CATS)).map(function(k){ return '<button data-cat="'+k+'" aria-pressed="'+(k===cat)+'">'+(k==="all"?BF.L("Everywhere","Везде"):T(BF.CATS[k]))+'</button>'; }).join("")+'</div>'+
        '</div>'+
        '<p class="lib-count muted small" id="libCount"></p>'+
        '<div class="lib-grid" id="libGrid"></div><div id="libMore" class="lib-more" aria-hidden="true"></div>'+
        '<p class="empty-note muted" id="libEmpty" hidden>'+BF.L("No situations match. Try another word — or","Ничего не найдено. Попробуйте другое слово — или")+' <a href="#/library">'+BF.L("clear filters","сбросить фильтры")+'</a>.</p>'+
      '</div>';
    var grid = el.querySelector("#libGrid"), more = el.querySelector("#libMore");
    function hay(s){ return [s.title.en,s.title.ru,s.why.en,s.why.ru,s.event.en,s.event.ru].concat(s.steps.map(function(x){ return x.en+" "+x.ru; })).join(" ").toLowerCase(); }
    function card(s, ix){
      var rot = ((s.id.charCodeAt(0)+s.id.length*7)%5-2)*0.5, has = !!c.plans[s.id];
      return '<button class="sit-card sit-'+s.tag+'" data-id="'+s.id+'" style="--rot:'+rot+'deg; animation-delay:'+((ix%BATCH)*30)+'ms">'+
        '<span class="sit-scene">'+BF.scene.render(s.scene,{avatar:c.avatar, size:"thumb", still:true})+'</span>'+
        '<span class="sit-top">'+BF.ui.tagChip(s.tag)+'<span class="sit-ico" title="'+T(BF.CATS[s.cat])+'">'+I(BF.CAT_ICON[s.cat],18)+'</span></span>'+
        '<h3>'+T(s.title)+'</h3><p>'+T(s.why).split(/\.\s/)[0].replace(/\.$/,"")+'.</p>'+
        '<span class="sit-foot">'+(has?'<span class="has">'+I('check',14)+' '+BF.L("plan made","план создан")+'</span>':'<span>'+T(BF.CATS[s.cat])+'</span>')+'<span class="go">'+BF.L("Open","Открыть")+' '+I('next',14)+'</span></span></button>';
    }
    function appendBatch(){
      var next = list.slice(shown, shown+BATCH); if(!next.length) return;
      grid.insertAdjacentHTML("beforeend", next.map(function(s,i){ return card(s, shown+i); }).join(""));
      shown += next.length; more.hidden = shown >= list.length;
    }
    function draw(){
      var ql = q.toLowerCase().trim();
      list = ALL.filter(function(s){ return (tag==="all"||s.tag===tag) && (cat==="all"||s.cat===cat) && (!ql || hay(s).indexOf(ql)>=0); });
      grid.innerHTML = ""; shown = 0; appendBatch();
      el.querySelector("#libEmpty").hidden = list.length>0;
      el.querySelector("#libCount").textContent = BF.L("Showing "+list.length+" of "+ALL.length, "Показано "+list.length+" из "+ALL.length);
    }
    if("IntersectionObserver" in window){ io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) appendBatch(); }); }, {rootMargin:"600px"}); io.observe(more); }
    else more.innerHTML = '<button class="btn ghost">'+BF.L("Show more","Показать ещё")+'</button>', more.onclick = appendBatch;
    el.querySelector(".filter-tabs").addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; tag=b.getAttribute("data-tag"); el.querySelectorAll(".filter-tabs button").forEach(function(x){ x.setAttribute("aria-pressed",x===b); }); draw(); });
    el.querySelector(".cat-row").addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; cat=b.getAttribute("data-cat"); el.querySelectorAll(".cat-row button").forEach(function(x){ x.setAttribute("aria-pressed",x===b); }); draw(); });
    var deb = 0; el.querySelector("#libQ").addEventListener("input", function(e){ q=e.target.value; clearTimeout(deb); deb = setTimeout(draw, 120); });
    grid.addEventListener("click", function(e){ var b=e.target.closest(".sit-card"); if(b){ BF.sound.soft(); BF.screens.library.openSheet(b.getAttribute("data-id")); } });
    draw();
    if(query && query.open) BF.screens.library.openSheet(query.open);
    return function(){ if(io) io.disconnect(); };
  },
  openSheet:function(id){
    var I = BF.icon, T = BF.ui.T, esc = BF.ui.esc, c = BF.store.s, s = BF.engine.find(id); if(!s) return;
    var has = !!c.plans[id], blocked = BF.store.planBlocked(c), g = BF.games[s.game];
    var ladderTitle = s.tag==="adhd" ? BF.L("Routine steps","Шаги распорядка") : (s.tag==="both" ? BF.L("Brave ladder · one timed card at a time","Лесенка · по одной карточке с таймером") : BF.L("Brave ladder","Лесенка смелых шагов"));
    var left = BF.store.plansLeft();
    var sh = BF.ui.sheet('<div class="sh-scene">'+BF.scene.render(s.scene,{avatar:c.avatar, label:T(s.title)})+'</div>'+
      '<div class="sh-top">'+BF.ui.tagChip(s.tag)+'<span class="chip">'+I(BF.CAT_ICON[s.cat],14)+' '+T(BF.CATS[s.cat])+'</span></div>'+
      '<h2 id="shT">'+T(s.title)+'</h2>'+
      '<div class="sh-grid"><div><h4>'+BF.L("Why it's hard","Почему это трудно")+'</h4><p>'+T(s.why)+'</p><h4>'+BF.L("Try saying","Попробуйте сказать")+'</h4><ul class="quote-list">'+BF.engine.phrases(s).map(function(p){ return '<li>“'+esc(p)+'”</li>'; }).join("")+'</ul></div>'+
      '<div><h4>'+ladderTitle+'</h4><ol class="mini-ladder">'+s.steps.map(function(t,i){ return '<li><span>'+(i+1)+'</span><div>'+T(t)+(s.tag!=="anxiety"?' <small>· '+s.mins[i]+'&nbsp;'+BF.L("min","мин")+'</small>':'')+'</div></li>'; }).join("")+'</ol></div></div>'+
      '<div class="sh-actions">'+(blocked?'<a class="btn clay" href="#/safety?from=plan">'+I('heart',18)+' '+BF.L("Talk to a specialist first","Сначала к специалисту")+'</a>':
        (s.tag!=="adhd"?'<button class="btn clay" data-mode="brave">'+I('book',18)+' '+(has?BF.L("Open Brave Plan","Открыть план смелых шагов"):BF.L("Make Brave Plan","Составить план смелых шагов"))+'</button>':'')+
        (s.tag!=="anxiety"?'<button class="btn sage" data-mode="quest">'+I('clock',18)+' '+(has?BF.L("Open Routine Quest","Открыть карточки распорядка"):BF.L("Start Routine Quest","Сделать карточки распорядка"))+'</button>':''))+
        (g?'<a class="btn ghost" href="#/game/'+s.game+'">'+I('hand',18)+' '+T(g.title)+'</a>':'')+
        '<a class="btn ghost" href="#/diary?tab=outcomes&add=1&sit='+s.id+'">'+I('target',18)+' '+BF.L("Log how it went","Записать, как прошло")+'</a></div>'+
      (has||blocked?'':'<p class="fine">'+(left===Infinity?BF.L("Unlimited plans","Сколько угодно планов"):BF.L(left+" free plans left",'Осталось бесплатных планов: '+left))+' · '+BF.L("plans use "+esc(BF.ui.heroName())+"'s name, buddy and hero — only in this browser.","в планах используются имя, друг и герой ребёнка — только в этом браузере.")+'</p>'), "wide");
    sh.querySelectorAll("[data-mode]").forEach(function(b){ b.onclick = function(){ sh.close(); BF.plans.open(id, b.getAttribute("data-mode")); }; });
    sh.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ sh.close(); }); });
  }
};
