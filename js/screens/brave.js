var BF = window.BF = window.BF || {};
BF.screens.brave = {
  title:{en:"Brave Plan",ru:"План смелых шагов"},
  render:function(el, id){
    var st = BF.store, c = st.s, I = BF.icon, A = BF.avatar, esc = BF.ui.esc, T = BF.ui.T;
    var plan = c.plans[id], sit = BF.engine.find(id);
    if(!plan || !sit){ el.innerHTML = '<div class="wrap empty paper"><h2>'+BF.L("This plan isn't made yet","Этот план ещё не создан")+'</h2><p class="muted">'+BF.L("Pick a situation from the library to create it.","Выберите ситуацию в библиотеке, чтобы создать его.")+'</p><a class="btn clay" href="#/library'+(sit?'?open='+sit.id:'')+'">'+BF.L("Open the library","Открыть библиотеку")+'</a></div>'; return; }
    st.update(function(x){ x.activePlan = id; });
    var page = 0, pages = BF.engine.planStory(plan, sit, c), game = BF.games && BF.games[plan.game], hero = esc(BF.ui.heroName());
    var POSES = ["wave","shy","idle","walk","jump","walk","cheer"], parts = BF.scene.parse(sit.scene);
    el.innerHTML =
      '<div class="brave wrap">'+
        '<div class="crumbs"><a href="#/library">'+I('back',16)+' '+BF.L("Library","Библиотека")+'</a>'+BF.ui.tagChip(plan.tag)+(plan.tag==="both"?'<a class="chip" href="#/quest/'+id+'">'+I('clock',14)+' '+BF.L("Also as Routine Quest","Есть и карточки распорядка")+'</a>':'')+'</div>'+
        '<h1>'+BF.L(hero+" and the "+T(sit.title).toLowerCase(), hero+": "+T(sit.title).toLowerCase())+'</h1>'+
        '<div class="brave-grid">'+
          '<div class="book paper">'+
            '<div class="book-scene" id="bkScene"></div>'+
            '<div class="book-text"><p id="bkText"></p></div>'+
            '<div class="book-nav"><button class="btn small ghost" id="bkPrev" aria-label="'+BF.L("Previous page","Предыдущая страница")+'">'+I('back',18)+'</button><div class="dots" id="bkDots"></div>'+
              '<button class="btn small dusty" id="bkRead">'+I('speaker',18)+' '+BF.L("Read aloud","Читать вслух")+'</button><button class="btn small clay" id="bkNext" aria-label="'+BF.L("Next page","Следующая страница")+'">'+I('next',18)+'</button></div>'+
          '</div>'+
          '<aside class="ladder-col">'+
            '<div class="ladder paper"><div class="ladder-head"><h3>'+I('ladder',20)+' '+BF.L("Brave ladder","Лесенка смелости")+'</h3><span class="muted small" id="ldProg"></span></div><ol class="rungs" id="rungs"></ol>'+
            (game?'<a class="btn small sage warm" href="#/game/'+plan.game+'?plan='+id+'">'+I('hand',16)+' '+BF.L("Warm up with “"+T(game.title)+"” — earn practice stars","Разминка «"+T(game.title)+"» — звёзды за тренировку")+'</a>':'')+
            '<a class="btn small ghost warm" href="#/diary?tab=outcomes&add=1&sit='+id+'">'+I('target',16)+' '+BF.L("Log how the real moment went","Записать, как прошло на самом деле")+'</a></div>'+
          '</aside>'+
        '</div>'+
        '<section class="tips">'+
          '<div class="tip paper"><span class="tape"></span><h3>'+BF.L("Say this","Скажите так")+'</h3><p class="muted small">'+BF.L("First show you understand, then show you believe in them. Say it once, calmly.","Сначала покажите, что понимаете, потом — что верите в ребёнка. Скажите это один раз и спокойно.")+'</p><ul class="quote-list">'+BF.engine.phrases(sit).map(function(p){ return '<li>“'+esc(p)+'”</li>'; }).join("")+'</ul></div>'+
          '<div class="tip paper"><h3>'+BF.L("Gently drop","Мягко откажитесь")+'</h3><ul class="swap-list">'+BF.engine.habitsFor(c).map(function(h){ return '<li><span class="drop">'+T(h.drop)+'</span><span class="arrow">'+I('next',16)+'</span><span class="instead">'+T(h.instead)+'</span></li>'; }).join("")+'</ul></div>'+
          '<div class="tip paper"><h3>'+BF.L("How to climb","Как подниматься")+'</h3><ul class="plain"><li>'+BF.L("One rung at a time. Repeat a rung until it feels <i>boring</i>.","По одной ступеньке. Повторяйте, пока не станет <i>скучно</i>.")+'</li><li>'+BF.L("Stay nearby, but let "+hero+" do the step. Never force — you set the pace.","Будьте рядом, но шаг делает ребёнок. Никогда не заставляйте — темп решаете вы.")+'</li><li>'+BF.L("Too hard tonight? The evening check-in on the home screen splits the step in two.","Слишком трудно? Отметьте это вечером на главной — и шаг разделится на два попроще.")+'</li><li>'+BF.L("If worry stops daily life for weeks,","Если тревога неделями мешает жить,")+' <a href="#/safety">'+BF.L("talk to a specialist","обратитесь к специалисту")+'</a>.</li></ul></div>'+
        '</section>'+
      '</div>'+
      '<div class="celebrate" id="celebrate" hidden><div class="cel-card paper"><div class="cel-kid">'+A.svg(c.avatar,{size:170,pose:"cheer"})+'</div><h2>'+BF.L("The whole ladder — done!","Вся лесенка пройдена!")+'</h2><p>'+BF.L(hero+" climbed every step. That's real courage, not luck.","Каждая ступенька пройдена. Это настоящая смелость, а не везение.")+'</p><div class="cel-actions"><a class="btn clay" href="#/library">'+BF.L("Pick a new situation","Выбрать новую ситуацию")+'</a><button class="btn ghost" id="celClose">'+BF.L("Stay here","Остаться")+'</button></div></div></div>';

    function drawPage(){
      var t = el.querySelector("#bkText"), n = pages.length;
      t.classList.remove("in"); void t.offsetWidth; t.classList.add("in");
      t.textContent = pages[page];
      var pose = POSES[Math.min(page, POSES.length-1)], fx = page===1 && plan.tag!=="adhd" ? "thought" : (page===n-1 ? "confetti" : parts.fx);
      var recipe = [parts.bg, parts.props.join(","), pose, fx, parts.tod].join("|");
      el.querySelector("#bkScene").innerHTML = BF.scene.render(recipe, {avatar:c.avatar, heroX: 40 + (n>1 ? page/(n-1) : 0)*150, label:T(sit.title)});
      el.querySelector("#bkDots").innerHTML = pages.map(function(_,i){ return '<button class="dot '+(i===page?'on':'')+'" data-p="'+i+'" aria-label="'+BF.L("Page ","Страница ")+(i+1)+'"></button>'; }).join("");
      el.querySelector("#bkPrev").disabled = page===0;
      el.querySelector("#bkNext").disabled = page===n-1;
    }
    function drawLadder(){
      plan = BF.store.s.plans[id];
      var L = plan.ladder, done = L.filter(function(r){ return r.done; }).length;
      el.querySelector("#ldProg").textContent = BF.L(done+" of "+L.length+" steps", done+" из "+L.length);
      el.querySelector("#rungs").innerHTML = L.map(function(r,i){
        var state = r.done ? "done" : (i===plan.current ? "now" : "later");
        return '<li class="rung-row '+state+(r.mini?' mini':'')+'"><span class="rung-n">'+(r.done?BF.starSVG(26,true):(i+1))+'</span><div class="rung-body"><p>'+esc(T(r.text))+'</p>'+
          (r.done?'<small>'+BF.L("Done","Сделано")+' '+BF.dateFmt(r.date)+'</small>':'')+
          (state==="now"?'<div class="rung-actions"><span class="practice" title="'+BF.L("Practice stars from games","Звёзды за игры-тренировки")+'">'+BF.ui.stars(r.practice||0,3,18)+'<small>'+BF.L("practice","тренировка")+'</small></span><button class="btn small clay" data-did="'+i+'">'+I('check',16)+' '+BF.L("We did it!","Получилось!")+'</button></div>':'')+
          '</div></li>';
      }).reverse().join("");
      var b = el.querySelector("[data-did]");
      if(b) b.onclick = function(){
        var ix = +b.getAttribute("data-did");
        BF.ui.burst(b, 2);
        BF.store.update(function(x){ var p=x.plans[id], r=p.ladder[ix]; r.done=true; r.date=BF.store.today(); p.current=ix+1; x.done.push({date:BF.store.today(), plan:id, text:r.text}); });
        BF.store.addStars(1, "brave step");
        drawLadder();
        if(BF.store.s.plans[id].current >= BF.store.s.plans[id].ladder.length) setTimeout(function(){ el.querySelector("#celebrate").hidden=false; }, 500);
        else BF.ui.toast(BF.L("Brave step saved. Tonight, do a quick check-in.","Смелый шаг сохранён. Вечером отметьте, как он прошёл."));
      };
    }
    el.querySelector("#bkPrev").onclick = function(){ if(page>0){ page--; BF.voice.stop(); drawPage(); BF.sound.soft(); } };
    el.querySelector("#bkNext").onclick = function(){ if(page<pages.length-1){ page++; BF.voice.stop(); drawPage(); BF.sound.soft(); } };
    el.querySelector("#bkDots").addEventListener("click", function(e){ var d=e.target.closest(".dot"); if(d){ page=+d.getAttribute("data-p"); BF.voice.stop(); drawPage(); } });
    el.querySelector("#bkRead").onclick = function(e){ BF.voice.speak(pages[page], e.currentTarget); };
    el.querySelector("#celClose").onclick = function(){ el.querySelector("#celebrate").hidden = true; };
    function onKey(e){ if(/INPUT|TEXTAREA/.test(e.target.tagName)) return; if(e.key==="ArrowRight") el.querySelector("#bkNext").click(); if(e.key==="ArrowLeft") el.querySelector("#bkPrev").click(); }
    document.addEventListener("keydown", onKey);
    drawPage(); drawLadder();
    return function(){ document.removeEventListener("keydown", onKey); };
  }
};
