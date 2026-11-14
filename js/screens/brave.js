var BF = window.BF = window.BF || {};
BF.screens.brave = {
  title:"Brave Plan",
  render:function(el, id){
    var st = BF.store.s, I = BF.icon, A = BF.avatar, esc = BF.ui.esc;
    var plan = st.plans[id], sit = BF.plans.find(id);
    if(!plan || !sit){ el.innerHTML = '<div class="wrap empty paper"><h2>This plan isn\'t made yet</h2><p class="muted">Pick a situation from the library to create it.</p><a class="btn clay" href="#/library'+(sit?'?open='+sit.id:'')+'">Open the library</a></div>'; return; }
    BF.store.update(function(s){ s.activePlan = id; });
    var page = 0, pages = plan.story, game = BF.games && BF.games[plan.game];
    el.innerHTML =
      '<div class="brave wrap">'+
        '<div class="crumbs"><a href="#/library">'+I('back',16)+' Library</a>'+BF.ui.tagChip(plan.tag)+(plan.tag==="both"?'<a class="chip" href="#/quest/'+id+'">'+I('clock',14)+' Also as Routine Quest</a>':'')+'</div>'+
        '<h1>'+esc(BF.ui.heroName())+' and the '+plan.title.toLowerCase()+'</h1>'+
        '<div class="brave-grid">'+
          '<div class="book paper">'+
            '<div class="book-scene" id="bkScene">'+BF.ui.hills(2)+'<div class="bk-prop" id="bkProp"></div><div class="bk-kid" id="bkKid">'+A.svg(st.avatar,{size:150,pose:"walk"})+'</div><div class="bk-chick" id="bkChick">'+A.chick(52)+'</div></div>'+
            '<div class="book-text"><p id="bkText"></p></div>'+
            '<div class="book-nav"><button class="btn small ghost" id="bkPrev" aria-label="Previous page">'+I('back',18)+'</button><div class="dots" id="bkDots"></div>'+
              '<button class="btn small dusty" id="bkRead">'+I('speaker',18)+' Read aloud</button><button class="btn small clay" id="bkNext" aria-label="Next page">'+I('next',18)+'</button></div>'+
          '</div>'+
          '<aside class="ladder-col">'+
            '<div class="ladder paper"><div class="ladder-head"><h3>'+I('ladder',20)+' Brave ladder</h3><span class="muted small" id="ldProg"></span></div><ol class="rungs" id="rungs"></ol>'+
            (game?'<a class="btn small sage warm" href="#/game/'+plan.game+'?plan='+id+'">'+I('hand',16)+' Warm up with “'+game.title+'” — earn practice stars</a>':'')+'</div>'+
          '</aside>'+
        '</div>'+
        '<section class="tips">'+
          '<div class="tip paper"><span class="tape"></span><h3>Say this</h3><p class="muted small">Acceptance + confidence — say it once, calmly.</p><ul class="quote-list">'+plan.phrases.map(function(p){ return '<li>“'+esc(p)+'”</li>'; }).join("")+'</ul></div>'+
          '<div class="tip paper"><h3>Gently drop</h3><ul class="swap-list">'+plan.habits.map(function(h){ return '<li><span class="drop">'+h.drop+'</span><span class="arrow">'+I('next',16)+'</span><span class="instead">'+h.instead+'</span></li>'; }).join("")+'</ul></div>'+
          '<div class="tip paper"><h3>How to climb</h3><ul class="plain"><li>One rung at a time. Repeat a rung until it feels <i>boring</i>.</li><li>Stay nearby, but let '+esc(BF.ui.heroName())+' do the step.</li><li>Too hard tonight? Use the <a href="#/dashboard">evening check-in</a> — it splits the step in two.</li><li>If worry stops daily life for weeks, <a href="#/safety">talk to a specialist</a>.</li></ul></div>'+
        '</section>'+
      '</div>'+
      '<div class="celebrate" id="celebrate" hidden><div class="cel-card paper"><div class="cel-kid">'+A.svg(st.avatar,{size:170,pose:"cheer"})+'</div><h2>The whole ladder — done!</h2><p>'+esc(BF.ui.heroName())+' climbed every step. That\'s real courage, not luck.</p><div class="cel-actions"><a class="btn clay" href="#/library">Pick a new situation</a><button class="btn ghost" id="celClose">Stay here</button></div></div></div>';

    var props = ["", "feel", "wave", "ladder", "breath", "star", "star"];
    function drawPage(){
      var t = el.querySelector("#bkText"), n = pages.length;
      t.classList.remove("in"); void t.offsetWidth; t.classList.add("in");
      t.textContent = pages[page];
      var pct = n>1 ? page/(n-1) : 0;
      el.querySelector("#bkKid").style.left = (8 + pct*62)+"%";
      el.querySelector("#bkChick").style.left = (2 + pct*62)+"%";
      el.querySelector("#bkProp").className = "bk-prop prop-"+(props[page]||"star");
      el.querySelector("#bkProp").innerHTML = propSVG(props[page]||"star");
      el.querySelector("#bkDots").innerHTML = pages.map(function(_,i){ return '<button class="dot '+(i===page?'on':'')+'" data-p="'+i+'" aria-label="Page '+(i+1)+'"></button>'; }).join("");
      el.querySelector("#bkPrev").disabled = page===0;
      el.querySelector("#bkNext").disabled = page===n-1;
    }
    function propSVG(k){
      if(k==="feel") return '<svg viewBox="0 0 120 80"><path d="M10 50 q15 -25 30 0 t30 0 t30 0" stroke="#93A9BA" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 66 q12 -16 24 0 t24 0 t24 0" stroke="#D8E1E7" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
      if(k==="wave") return '<svg viewBox="0 0 120 80"><path class="wv" d="M0 60 q20 -40 40 0 t40 0 t40 0 V80 H0Z" fill="#B7C7D3"/><path d="M0 70 q20 -20 40 0 t40 0 t40 0 V80 H0Z" fill="#93A9BA"/></svg>';
      if(k==="ladder") return '<svg viewBox="0 0 80 110"><path d="M18 108 L26 4 M62 108 L54 4" stroke="#A96C51" stroke-width="5" stroke-linecap="round"/>'+[20,40,60,80,100].map(function(y,i){ return '<path d="M'+(19+i*0)+' '+y+' H61" stroke="#C98E70" stroke-width="5" stroke-linecap="round"/>'; }).join("")+'</svg>';
      if(k==="breath") return '<svg viewBox="0 0 100 120"><path d="M50 90 q-2 14 4 26" stroke="#B9A48A" stroke-width="2" fill="none"/><ellipse class="bl" cx="50" cy="50" rx="30" ry="36" fill="#D9B5A7"/><path d="M44 86 h12 l-6 6z" fill="#C79E8F"/><path d="M36 34 q6 -10 14 -10" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
      return '<svg viewBox="0 0 120 90">'+[[30,40,22],[70,26,30],[100,54,18]].map(function(p){ return '<g transform="translate('+(p[0]-p[2])+' '+(p[1]-p[2])+') scale('+(p[2]/20)+')"><path d="M20 3.5l4.6 10 10.9 1.3-8.1 7.4 2.2 10.8L20 27.6l-9.6 5.4 2.2-10.8-8.1-7.4 10.9-1.3z" fill="#E4CC8F" stroke="#C7A65A" stroke-width="1.5"/></g>'; }).join("")+'</svg>';
    }
    function drawLadder(){
      plan = BF.store.s.plans[id];
      var L = plan.ladder, done = L.filter(function(r){ return r.done; }).length;
      el.querySelector("#ldProg").textContent = done+" of "+L.length+" steps";
      el.querySelector("#rungs").innerHTML = L.map(function(r,i){
        var state = r.done ? "done" : (i===plan.current ? "now" : "later");
        return '<li class="rung-row '+state+(r.mini?' mini':'')+'"><span class="rung-n">'+(r.done?BF.starSVG(26,true):(i+1))+'</span><div class="rung-body"><p>'+esc(r.text)+'</p>'+
          (r.done?'<small>Done '+r.date+'</small>':'')+
          (state==="now"?'<div class="rung-actions"><span class="practice" title="Practice stars from games">'+BF.ui.stars(r.practice||0,3,18)+'<small>practice</small></span><button class="btn small clay" data-did="'+i+'">'+I('check',16)+' We did it!</button></div>':'')+
          '</div></li>';
      }).reverse().join("");
      var b = el.querySelector("[data-did]");
      if(b) b.onclick = function(e){
        var ix = +b.getAttribute("data-did");
        BF.ui.burst(b, 2);
        BF.store.update(function(s){ var p=s.plans[id], r=p.ladder[ix]; r.done=true; r.date=BF.store.today(); p.current=ix+1; s.done.push({date:BF.store.today(), plan:id, text:r.text}); });
        BF.store.addStars(1, "brave step");
        drawLadder();
        if(BF.store.s.plans[id].current >= BF.store.s.plans[id].ladder.length) setTimeout(function(){ el.querySelector("#celebrate").hidden=false; }, 500);
        else BF.ui.toast("Brave step saved. Tonight, do a quick check-in.");
      };
    }
    el.querySelector("#bkPrev").onclick = function(){ if(page>0){ page--; drawPage(); BF.sound.soft(); } };
    el.querySelector("#bkNext").onclick = function(){ if(page<pages.length-1){ page++; drawPage(); BF.sound.soft(); } };
    el.querySelector("#bkDots").addEventListener("click", function(e){ var d=e.target.closest(".dot"); if(d){ page=+d.getAttribute("data-p"); drawPage(); } });
    el.querySelector("#bkRead").onclick = function(e){ BF.ui.speak(pages[page], e.currentTarget); };
    el.querySelector("#celClose").onclick = function(){ el.querySelector("#celebrate").hidden = true; };
    function onKey(e){ if(e.target.tagName==="INPUT") return; if(e.key==="ArrowRight") el.querySelector("#bkNext").click(); if(e.key==="ArrowLeft") el.querySelector("#bkPrev").click(); }
    document.addEventListener("keydown", onKey);
    drawPage(); drawLadder();
    return function(){ document.removeEventListener("keydown", onKey); };
  }
};
