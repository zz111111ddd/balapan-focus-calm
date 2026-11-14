var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
/* helpers shared by all games */
BF.gameUtil = {
  svgPoint:function(svg, e){ var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : {x:0,y:0}; },
  dist:function(a,b){ var dx=a.x-b.x, dy=a.y-b.y; return Math.sqrt(dx*dx+dy*dy); },
  shuffle:function(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; },
  heroHead:function(size, x, y){ return BF.avatar.svg(BF.store.s.avatar,{size:size, headOnly:true}).replace('<svg ','<svg x="'+x+'" y="'+y+'" '); },
  rand:function(a,b){ return a + Math.random()*(b-a); },
  calm:function(){ return document.documentElement.classList.contains("calm") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }
};
BF.LEVELS = ["easy","medium","hard"];
BF.GAME_ORDER = ["trail","lace","dots","shapes","jars","puzzle","sizes","backpack","balloon","bubbles","rhythm","memory","simon","spot","diff","keys"];
BF.levelName = function(lv){ return ({easy:BF.L("Easy","Легко"), medium:BF.L("Medium","Средне"), hard:BF.L("Hard","Сложно")})[lv] || BF.L("Easy","Легко"); };
BF.gameUnlocked = function(c, id){ var u = (c.gameLevels||{})[id]||"easy"; return BF.LEVELS.indexOf(u); };

BF.screens.games = {
  title:{en:"Calm games",ru:"Спокойные игры"},
  render:function(el){
    var c = BF.store.s, T = BF.ui.T;
    var shelves = [ {t:BF.L("Steady hands","Точные руки"), d:BF.L("Fine-motor practice — slow fingers, careful eyes.","Мелкая моторика — медленные пальцы, внимательные глаза."), ids:["trail","lace","dots","shapes","jars","puzzle","sizes"]},
                    {t:BF.L("Focus & calm","Внимание и спокойствие"), d:BF.L("Hold attention, wait, breathe, remember.","Удерживать внимание, ждать, дышать, запоминать."), ids:["backpack","balloon","bubbles","rhythm","memory","simon","spot","diff","keys"]} ];
    el.innerHTML = '<div class="games wrap"><div class="g-head"><div><p class="eyebrow">'+BF.L("Games for ","Игры для ")+BF.ui.esc(BF.ui.heroName(c))+'</p><h1>'+BF.L("Pick a calm game","Выберите спокойную игру")+'</h1><p class="muted">'+BF.L("Each takes 1–3 minutes and has three levels. Two stars or more opens the next level.","Каждая занимает 1–3 минуты, в каждой три уровня. Две звезды и больше открывают следующий уровень.")+'</p></div>'+
      '<div class="g-stars paper">'+BF.starSVG(40,true)+'<div><b>'+c.stars+'</b><small>'+BF.L("stars so far","звёзд собрано")+'</small></div></div></div>'+
      shelves.map(function(sh){
        return '<section class="shelf"><div class="shelf-label"><h2>'+sh.t+'</h2><p class="muted">'+sh.d+'</p></div><div class="shelf-row">'+sh.ids.map(function(id, k){
          var g = BF.games[id]; if(!g) return "";
          var best = (c.games||{})[id]||0, u = BF.gameUnlocked(c, id);
          return '<a class="toy reveal d'+(k%4+1)+'" href="#/game/'+id+'" data-game="'+id+'" style="--tilt:'+((k%2?1:-1)*(1+k%3*0.6))+'deg"><span class="toy-art">'+g.art()+'</span><span class="toy-meta"><b>'+T(g.title)+'</b><small>'+T(g.skill)+' · '+T(g.time)+'</small><span class="toy-best">'+BF.ui.stars(best,3,16)+'<span class="lv-dots" title="'+BF.levelName(BF.LEVELS[u])+'">'+[0,1,2].map(function(i){ return '<i class="'+(i<=u?'on':'')+'"></i>'; }).join("")+'</span></span></span></a>';
        }).join("")+'</div><div class="plank"></div></section>';
      }).join("")+'</div>';
  }
};

BF.screens.game = {
  title:function(id){ var g = BF.games[id]; return g ? g.title : {en:"Game",ru:"Игра"}; },
  render:function(el, id, query){
    var g = BF.games[id], I = BF.icon, T = BF.ui.T, c = BF.store.s;
    if(!g){ BF.router.go("/games"); return; }
    var fromPlan = query && query.plan && c.plans[query.plan] ? query.plan : null;
    var unlocked = BF.gameUnlocked(c, id);
    var lvIdx = query && query.lv && BF.LEVELS.indexOf(query.lv) >= 0 ? Math.min(BF.LEVELS.indexOf(query.lv), unlocked) : unlocked;
    var cleanup = null, back = fromPlan ? '#/brave/'+fromPlan : '#/games';
    el.innerHTML = '<div class="gshell wrap">'+
      '<div class="gs-top"><a class="btn small ghost" href="'+back+'">'+I('back',16)+' <span class="hide-sm">'+(fromPlan?BF.L("Back to the plan","К плану"):BF.L("All games","Все игры"))+'</span></a>'+
      '<div class="gs-title"><h1>'+T(g.title)+'</h1><span class="chip hide-sm">'+I(g.motor?'hand':'sparkle',14)+' '+T(g.skill)+'</span><span class="chip hide-sm">'+I('clock',14)+' '+T(g.time)+'</span></div>'+
      '<button class="btn small ghost" id="gRestart" aria-label="'+BF.L("Restart","Заново")+'">'+I('refresh',16)+' <span class="hide-sm">'+BF.L("Restart","Заново")+'</span></button></div>'+
      '<div class="lv-pick seg" role="group" aria-label="'+BF.L("Level","Уровень")+'">'+BF.LEVELS.map(function(lv, i){ return '<button data-lv="'+i+'" aria-pressed="'+(i===lvIdx)+'" '+(i>unlocked?'disabled title="'+BF.L("Get 2 stars on the level before","Получите 2 звезды на предыдущем уровне")+'"':'')+'>'+(i>unlocked?I('lock',12)+' ':'')+BF.levelName(lv)+'</button>'; }).join("")+'</div>'+
      '<p class="gs-say" id="gSay" aria-live="polite"></p>'+
      '<div class="stage paper" id="gStage"></div>'+
      '<p class="gs-why muted"><b>'+BF.L("Why it helps:","Чем полезно:")+'</b> '+T(g.why)+'</p>'+
      '<div class="win" id="gWin" hidden><div class="win-card paper"><div class="win-kid">'+BF.avatar.svg(c.avatar,{size:140,pose:"cheer"})+'</div><h2 id="gWinT"></h2><div class="win-stars" id="gWinS"></div><p id="gWinP" class="muted"></p><p id="gWinU" class="unlock" hidden></p><div class="cel-actions"><button class="btn clay" id="gAgain">'+BF.L("Play again","Ещё раз")+'</button><button class="btn sage" id="gNext" hidden>'+BF.L("Next level","Следующий уровень")+'</button><a class="btn ghost" href="'+back+'">'+(fromPlan?BF.L("Back to the brave step","К смелому шагу"):BF.L("More games","Другие игры"))+'</a></div></div></div>'+
    '</div>';
    var stage = el.querySelector("#gStage"), say = el.querySelector("#gSay");
    var api = {
      level:BF.LEVELS[lvIdx], lv:lvIdx,
      pick:function(arr){ return arr[lvIdx]; },
      say:function(t){ say.textContent = t; say.classList.remove("nudge"); void say.offsetWidth; say.classList.add("nudge"); },
      win:function(n, msg){
        n = Math.max(1, Math.min(3, n|0));
        var opened = null;
        BF.store.update(function(s){
          s.games = s.games||{}; s.games[id] = Math.max(s.games[id]||0, n);
          s.gameLevels = s.gameLevels||{};
          var u = BF.LEVELS.indexOf(s.gameLevels[id]||"easy");
          if(n>=2 && lvIdx===u && u<2){ s.gameLevels[id] = BF.LEVELS[u+1]; opened = BF.LEVELS[u+1]; }
          if(fromPlan) s.activePlan = fromPlan;
        });
        BF.store.addStars(n, "game:"+id+":"+api.level);
        el.querySelector("#gWinS").innerHTML = [0,1,2].map(function(i){ return '<span style="animation-delay:'+(i*180)+'ms">'+BF.starSVG(54, i<n)+'</span>'; }).join("");
        el.querySelector("#gWinT").textContent = msg || [BF.L("Nice try!","Хорошая попытка!"),BF.L("Lovely and steady!","Спокойно и точно!"),BF.L("Wow — so focused!","Ого, как сосредоточенно!")][n-1];
        var s2 = BF.store.s, ap = s2.activePlan && s2.plans[s2.activePlan], sit = ap && BF.engine.find(ap.id);
        el.querySelector("#gWinP").textContent = sit ? BF.L("+"+n+" practice star"+(n>1?"s":"")+" for the next step in “"+sit.title.en+"”.", "+"+n+" "+BF.plural(n,"звезда","звезды","звёзд")+" тренировки для следующего шага в «"+sit.title.ru+"».") : BF.L("+"+n+" star"+(n>1?"s":"")+" saved to the parent dashboard.", "+"+n+" "+BF.plural(n,"звезда","звезды","звёзд")+" сохранено в кабинете родителя.");
        var u = el.querySelector("#gWinU"), nx = el.querySelector("#gNext");
        u.hidden = !opened; nx.hidden = !(opened || (lvIdx<2 && lvIdx<BF.gameUnlocked(BF.store.s,id)));
        if(opened) u.textContent = BF.L("New level open: ","Открыт новый уровень: ")+BF.levelName(opened)+" ✦";
        BF.sound.done();
        setTimeout(function(){ el.querySelector("#gWin").hidden = false; }, 350);
      },
      heroHead:BF.gameUtil.heroHead
    };
    function start(){ if(typeof cleanup==="function") cleanup(); var fresh = stage.cloneNode(false); stage.replaceWith(fresh); stage = fresh; stage.innerHTML=""; stage.className = "stage paper stage-"+id+" lv-"+api.level; say.textContent = T(g.howto); el.querySelector("#gWin").hidden = true; cleanup = g.mount(stage, api);
      // Drop zones / list items are not buttons: a tap on them explains what to do instead of doing nothing.
      var downAt = null; stage.addEventListener("pointerdown", function(e){ downAt = [e.clientX, e.clientY]; }, true);
      stage.addEventListener("click", function(e){ if(downAt && Math.abs(e.clientX-downAt[0]) + Math.abs(e.clientY-downAt[1]) > 6) return; var t = e.target.closest && e.target.closest(".pz-slot:empty, .sz-slot, .jar, .bp-list li"); if(!t) return; api.say(BF.L("Drag a piece onto it — press, hold and move.","Перетащи сюда деталь — нажми, удерживай и веди.")); say.classList.remove("nudge"); void say.offsetWidth; say.classList.add("nudge"); }); }
    function goLv(i){ BF.router.go("/game/"+id+"?lv="+BF.LEVELS[i]+(fromPlan?"&plan="+fromPlan:"")); }
    el.querySelectorAll("[data-lv]").forEach(function(b){ b.onclick = function(){ var i = +b.getAttribute("data-lv"); if(i!==lvIdx) goLv(i); else { start(); BF.ui.toast(BF.L("Level restarted.","Уровень начат заново.")); } }; });
    el.querySelector("#gRestart").onclick = start;
    el.querySelector("#gAgain").onclick = start;
    el.querySelector("#gNext").onclick = function(){ goLv(Math.min(2, lvIdx+1)); };
    start();
    return function(){ if(typeof cleanup==="function") cleanup(); };
  }
};
