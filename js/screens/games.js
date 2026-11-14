var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
/* helpers shared by all games */
BF.gameUtil = {
  svgPoint:function(svg, e){ var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : {x:0,y:0}; },
  dist:function(a,b){ var dx=a.x-b.x, dy=a.y-b.y; return Math.sqrt(dx*dx+dy*dy); },
  shuffle:function(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; },
  heroHead:function(size, x, y){ return BF.avatar.svg(BF.store.s.avatar,{size:size, headOnly:true}).replace('<svg ','<svg x="'+x+'" y="'+y+'" '); },
  rand:function(a,b){ return a + Math.random()*(b-a); }
};
BF.GAME_ORDER = ["trail","lace","dots","jars","backpack","balloon","bubbles","memory"];

BF.screens.games = {
  title:"Calm games",
  render:function(el){
    var st = BF.store.s, I = BF.icon;
    var shelves = [ {t:"Steady hands", d:"Fine-motor practice — slow fingers, careful eyes.", ids:["trail","lace","dots","jars"]},
                    {t:"Focus & calm", d:"Hold attention, wait, breathe, remember.", ids:["backpack","balloon","bubbles","memory"]} ];
    el.innerHTML = '<div class="games wrap"><div class="g-head"><div><p class="eyebrow">Games for '+BF.ui.esc(BF.ui.heroName())+'</p><h1>Pick a calm game</h1><p class="muted">Each one takes 1–3 minutes. Stars earned here light up the next brave step.</p></div>'+
      '<div class="g-stars paper">'+BF.starSVG(40,true)+'<div><b>'+st.stars+'</b><small>stars so far</small></div></div></div>'+
      shelves.map(function(sh, si){
        return '<section class="shelf"><div class="shelf-label"><h2>'+sh.t+'</h2><p class="muted">'+sh.d+'</p></div><div class="shelf-row">'+sh.ids.map(function(id, k){
          var g = BF.games[id]; if(!g) return "";
          var best = (st.games||{})[id]||0;
          return '<a class="toy reveal d'+(k+1)+'" href="#/game/'+id+'" style="--tilt:'+((k%2?1:-1)*(1+k%3*0.6))+'deg"><span class="toy-art">'+g.art()+'</span><span class="toy-meta"><b>'+g.title+'</b><small>'+g.skill+' · '+g.time+'</small><span class="toy-best">'+BF.ui.stars(best,3,16)+'</span></span></a>';
        }).join("")+'</div><div class="plank"></div></section>';
      }).join("")+'</div>';
  }
};

BF.screens.game = {
  title:"Game",
  render:function(el, id, query){
    var g = BF.games[id], I = BF.icon, st = BF.store.s;
    if(!g){ BF.router.go("/games"); return; }
    var fromPlan = query && query.plan && st.plans[query.plan] ? query.plan : null;
    var cleanup = null;
    el.innerHTML = '<div class="gshell wrap">'+
      '<div class="gs-top"><a class="btn small ghost" href="'+(fromPlan?'#/brave/'+fromPlan:'#/games')+'">'+I('back',16)+' '+(fromPlan?'Back to the plan':'All games')+'</a>'+
      '<div class="gs-title"><h1>'+g.title+'</h1><span class="chip">'+I(g.motor?'hand':'sparkle',14)+' '+g.skill+'</span><span class="chip">'+I('clock',14)+' '+g.time+'</span></div>'+
      '<button class="btn small ghost" id="gRestart">'+I('refresh',16)+' Restart</button></div>'+
      '<p class="gs-say" id="gSay" aria-live="polite">'+g.howto+'</p>'+
      '<div class="stage paper" id="gStage"></div>'+
      '<p class="gs-why muted"><b>Why it helps:</b> '+g.why+'</p>'+
      '<div class="win" id="gWin" hidden><div class="win-card paper"><div class="win-kid">'+BF.avatar.svg(st.avatar,{size:140,pose:"cheer"})+'</div><h2 id="gWinT">Lovely and steady!</h2><div class="win-stars" id="gWinS"></div><p id="gWinP" class="muted"></p><div class="cel-actions"><button class="btn clay" id="gAgain">Play again</button><a class="btn ghost" href="'+(fromPlan?'#/brave/'+fromPlan:'#/games')+'">'+(fromPlan?'Back to the brave step':'More games')+'</a></div></div></div>'+
    '</div>';
    var stage = el.querySelector("#gStage"), say = el.querySelector("#gSay");
    var api = {
      say:function(t){ say.textContent = t; say.classList.remove("nudge"); void say.offsetWidth; say.classList.add("nudge"); },
      win:function(n, msg){
        n = Math.max(1, Math.min(3, n|0));
        BF.store.update(function(s){ s.games = s.games||{}; s.games[id] = Math.max(s.games[id]||0, n); if(fromPlan) s.activePlan = fromPlan; });
        BF.store.addStars(n, "game:"+id);
        el.querySelector("#gWinS").innerHTML = [0,1,2].map(function(i){ return '<span style="animation-delay:'+(i*180)+'ms">'+BF.starSVG(54, i<n)+'</span>'; }).join("");
        el.querySelector("#gWinT").textContent = msg || ["Nice try!","Lovely and steady!","Wow — so focused!"][n-1];
        var ap = BF.store.s.activePlan && BF.store.s.plans[BF.store.s.activePlan];
        el.querySelector("#gWinP").textContent = ap ? "+"+n+" practice star"+(n>1?"s":"")+" for the next step in “"+ap.title+"”." : "+"+n+" star"+(n>1?"s":"")+" saved to the parent dashboard.";
        BF.sound.done();
        setTimeout(function(){ el.querySelector("#gWin").hidden = false; }, 350);
      },
      heroHead:BF.gameUtil.heroHead
    };
    function start(){ if(typeof cleanup==="function") cleanup(); var fresh = stage.cloneNode(false); stage.replaceWith(fresh); stage = fresh; stage.innerHTML=""; stage.className = "stage paper stage-"+id; say.textContent = g.howto; el.querySelector("#gWin").hidden = true; cleanup = g.mount(stage, api); }
    el.querySelector("#gRestart").onclick = start;
    el.querySelector("#gAgain").onclick = start;
    start();
    return function(){ if(typeof cleanup==="function") cleanup(); };
  }
};
