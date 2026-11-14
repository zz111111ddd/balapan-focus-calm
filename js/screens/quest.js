var BF = window.BF = window.BF || {};
BF.screens.quest = {
  title:{en:"Routine Quest",ru:"Карточки распорядка"},
  render:function(el, id){
    var st = BF.store, c = st.s, I = BF.icon, A = BF.avatar, esc = BF.ui.esc, T = BF.ui.T;
    var plan = c.plans[id], sit = BF.engine.find(id);
    if(!plan || !sit){ el.innerHTML = '<div class="wrap empty paper"><h2>'+BF.L("Pick a routine first","Сначала выберите распорядок")+'</h2><p class="muted">'+BF.L("Routine Quests are made from the library — mornings, homework, bedtime and more.","Карточки распорядка создаются в библиотеке: утро, уроки, отход ко сну и другое.")+'</p><a class="btn sage" href="#/library?tag=adhd">'+BF.L("Open focus situations","Ситуации про внимание")+'</a></div>'; return; }
    st.update(function(x){ x.activePlan = id; });
    var steps = plan.ladder.map(function(r){ return {text:T(r.text), min:r.min}; });
    var i = 0, total = steps[0].min*60000, remain = total, running = false, last = 0, raf = 0, breakTimer = 0, earned = 0, chimed = false;
    var hero = esc(BF.ui.heroName());
    el.innerHTML =
      '<div class="quest wrap">'+
        '<div class="crumbs"><a href="#/library">'+I('back',16)+' '+BF.L("Library","Библиотека")+'</a>'+BF.ui.tagChip(plan.tag)+(plan.tag!=="adhd"?'<a class="chip" href="#/brave/'+id+'">'+I('book',14)+' '+BF.L("Brave Plan &amp; story","План смелых шагов и сказка")+'</a>':'')+'</div>'+
        '<div class="q-top"><h1>'+BF.L(hero+"'s quest: "+T(sit.title).toLowerCase(),"Распорядок: "+T(sit.title).toLowerCase())+'</h1><div class="pebbles" id="qPeb"></div></div>'+
        '<div class="q-grid">'+
          '<div class="q-card paper" id="qCard"></div>'+
          '<div class="q-timer paper"><div class="timer" id="qTimer"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="#FBF7EF" stroke="#E2D6C3" stroke-width="3"/>'+
            Array.from({length:12}).map(function(_,k){ var a=k*30*Math.PI/180; return '<line x1="'+(100+Math.sin(a)*80)+'" y1="'+(100-Math.cos(a)*80)+'" x2="'+(100+Math.sin(a)*88)+'" y2="'+(100-Math.cos(a)*88)+'" stroke="#D6C09C" stroke-width="3" stroke-linecap="round"/>'; }).join("")+
            '<path id="qWedge" fill="#A3B59C"/><circle cx="100" cy="100" r="12" fill="#3B3632"/></svg><div class="t-read" id="qRead"></div></div>'+
            '<div class="t-ctrl"><button class="btn small dusty" id="qPlay"></button><button class="btn small ghost" id="qMore">'+BF.L("+1 min","+1 мин")+'</button><button class="btn small ghost" id="qWiggle">'+BF.L("Wiggle break","Минутка движения")+'</button><button class="btn small ghost" id="qSay">'+I('speaker',16)+'</button></div></div>'+
        '</div>'+
      '</div>'+
      '<div class="move" id="qMove" hidden><div class="move-card paper"><p class="eyebrow">'+BF.L("60-second movement break","Минута движения")+'</p><h2 id="mvT"></h2><p id="mvD"></p><div class="move-stage"><div class="mv-kid" id="mvKid">'+A.svg(c.avatar,{size:150,pose:"cheer"})+'</div></div><div class="mv-count"><span id="mvN">60</span>'+BF.L("s","с")+'</div><button class="btn clay" id="mvDone">'+BF.L("Back to the quest","Вернуться к карточкам")+'</button></div></div>';
    var card = el.querySelector("#qCard"), wedge = el.querySelector("#qWedge"), read = el.querySelector("#qRead"), playB = el.querySelector("#qPlay");
    function wedgePath(frac){
      if(frac<=0) return "";
      if(frac>=0.9999) return "M100 100 m-78 0 a78 78 0 1 0 156 0 a78 78 0 1 0 -156 0";
      var a = frac*2*Math.PI, x = 100+Math.sin(a)*78, y = 100-Math.cos(a)*78;
      return "M100 100 L100 22 A78 78 0 "+(frac>0.5?1:0)+" 1 "+x.toFixed(2)+" "+y.toFixed(2)+" Z";
    }
    function fmt(ms){ var s=Math.ceil(ms/1000), m=Math.floor(s/60); return m+":"+String(s%60).padStart(2,"0"); }
    function paintTimer(){ wedge.setAttribute("d", wedgePath(remain/total)); read.textContent = remain>0 ? fmt(remain) : BF.L("Time!","Время!"); }
    function tick(t){
      if(!running) return;
      if(last) remain = Math.max(0, remain-(t-last)); last = t;
      paintTimer();
      if(remain<=0 && !chimed){ chimed = true; BF.sound.chime(); BF.ui.toast(BF.L("Timer's done — finish this bit, then tap Done.","Таймер закончился — доделай и нажми «Готово».")); running=false; setPlay(); return; }
      raf = requestAnimationFrame(tick);
    }
    function setPlay(){ playB.innerHTML = running ? I('pause',16)+' '+BF.L("Pause","Пауза") : I('play',16)+' '+(remain<total?BF.L("Resume","Продолжить"):BF.L("Start timer","Запустить таймер")); }
    function start(){ if(running||remain<=0) return; running=true; last=0; setPlay(); raf=requestAnimationFrame(tick); }
    function stop(){ running=false; cancelAnimationFrame(raf); setPlay(); }
    function drawCard(){
      var s = steps[i];
      el.querySelector("#qPeb").innerHTML = steps.map(function(_,k){ return '<span class="peb '+(k<i?'done':k===i?'now':'')+'">'+(k<i?BF.starSVG(18,true):'')+'</span>'; }).join("");
      card.classList.remove("flip"); void card.offsetWidth; card.classList.add("flip");
      card.innerHTML = '<p class="eyebrow">'+BF.L("Card "+(i+1)+" of "+steps.length,"Карточка "+(i+1)+" из "+steps.length)+'</p><div class="q-ill">'+BF.scene.render(sit.scene,{avatar:c.avatar,size:"thumb"})+'</div><h2 class="q-step">'+esc(s.text)+'</h2><p class="muted">'+BF.L("About "+s.min+" min. Just this card — nothing else yet.","Примерно "+s.min+" мин. Только эта карточка — больше ничего.")+'</p>'+
        '<button class="done-btn" id="qDone"><span class="db-inner">'+I('check',30)+'<b>'+BF.L("Done!","Готово!")+'</b></span></button>';
      card.querySelector("#qDone").onclick = done;
      stop(); total = s.min*60000; remain = total; chimed=false; paintTimer(); setPlay();
    }
    function done(e){
      BF.ui.burst(e.currentTarget, 1); earned++;
      BF.store.update(function(x){ x.done.push({date:BF.store.today(), plan:id, text:{en:"Quest card: "+plan.ladder[i].text.en, ru:"Карточка распорядка: "+plan.ladder[i].text.ru}}); });
      BF.store.addStars(1, "quest card");
      i++;
      if(i>=steps.length){ finish(); return; }
      if(i===Math.ceil(steps.length/2)) setTimeout(openMove, 450);
      drawCard();
    }
    function finish(){
      stop();
      el.querySelector("#qPeb").innerHTML = steps.map(function(){ return '<span class="peb done">'+BF.starSVG(18,true)+'</span>'; }).join("");
      card.innerHTML = '<div class="q-finish"><div>'+A.svg(c.avatar,{size:170,pose:"cheer"})+'</div><h2>'+BF.L("Quest complete!","Все карточки пройдены!")+'</h2><p>'+BF.L(hero+" finished every card and earned","Все карточки выполнены, заработано:")+' '+BF.ui.stars(earned, earned, 24)+'</p><div class="cel-actions"><button class="btn sage" id="qAgain">'+BF.L("Run it again","Пройти ещё раз")+'</button><a class="btn ghost" href="#/">'+BF.L("Evening check-in","Вечерняя отметка")+'</a></div></div>';
      card.querySelector("#qAgain").onclick = function(){ i=0; earned=0; drawCard(); };
      BF.sound.done();
    }
    function openMove(){
      stop();
      var m = BF.MOVES[Math.floor(Math.random()*BF.MOVES.length)], box = el.querySelector("#qMove"), n = 60;
      el.querySelector("#mvT").textContent = T(m.t); el.querySelector("#mvD").textContent = T(m.d);
      el.querySelector("#mvKid").className = "mv-kid mv-"+m.anim;
      el.querySelector("#mvN").textContent = n; box.hidden = false;
      clearInterval(breakTimer);
      breakTimer = setInterval(function(){ n--; el.querySelector("#mvN").textContent = n; if(n<=0){ clearInterval(breakTimer); BF.sound.chime(); } }, 1000);
    }
    el.querySelector("#mvDone").onclick = function(){ clearInterval(breakTimer); el.querySelector("#qMove").hidden = true; };
    playB.onclick = function(){ BF.sound.unlock(); running ? stop() : start(); };
    el.querySelector("#qMore").onclick = function(){ total += 60000; remain += 60000; chimed=false; paintTimer(); };
    el.querySelector("#qWiggle").onclick = openMove;
    el.querySelector("#qSay").onclick = function(e){ BF.voice.speak(steps[i] ? steps[i].text : "", e.currentTarget); };
    drawCard();
    return function(){ stop(); clearInterval(breakTimer); };
  }
};
