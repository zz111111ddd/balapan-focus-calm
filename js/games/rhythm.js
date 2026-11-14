/* Echo Drum — listen/watch a short rhythm, then tap it back on the drum. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.rhythm = {
  title:{en:"Echo Drum",ru:"Барабан-эхо"}, skill:{en:"Timing & self-control",ru:"Ритм и самоконтроль"}, motor:false, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Watch the drum (and listen, if sound is on). Then tap the same rhythm — long dots mean wait longer.",ru:"Смотри на барабан (и слушай, если звук включён). Потом простучи тот же ритм — длинные точки значат «подожди подольше»."},
  why:{en:"Waiting for the right moment to tap is impulse control in disguise, and steady rhythms help the body regulate.",ru:"Дождаться нужного момента — это тренировка сдерживания импульсов, а ровный ритм помогает телу успокоиться."},
  art:function(){ return '<svg viewBox="0 0 120 90"><ellipse cx="60" cy="40" rx="38" ry="12" fill="#E9DCC5" stroke="#A96C51" stroke-width="3"/><path d="M22 40 v26 q38 20 76 0 v-26" fill="#C98E70"/><path d="M30 46 l12 20 M50 50 l10 20 M70 50 l-10 20 M90 46 l-12 20" stroke="#A96C51" stroke-width="2"/><path d="M84 8 l-16 26" stroke="#8B6F64" stroke-width="4" stroke-linecap="round"/><circle cx="66" cy="36" r="4" fill="#8B6F64"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, BEAT = api.pick([650,560,480]), TOL = api.pick([0.4,0.3,0.24]);
    var PAT = api.pick([
      [[1,1,1],[1,1,1,1],[2,1,1]],
      [[1,1,2,1],[1,2,1,1],[2,1,1,2],[1,1,1,2]],
      [[1,2,1,1,2],[2,1,1,2,1],[1,1,2,1,1,1],[1,2,2,1,1],[2,1,1,1,2]]
    ]);
    var r = 0, taps = [], busy = true, score = 0, timers = [];
    stage.innerHTML = '<div class="rdm"><div class="rd-dots" id="rhD"></div><button class="rd-drum" id="rhB" aria-label="'+BF.L("Drum","Барабан")+'"><svg viewBox="0 0 200 160"><ellipse cx="100" cy="56" rx="80" ry="24" fill="#E9DCC5" stroke="#A96C51" stroke-width="5"/><path d="M20 56 v50 q80 40 160 0 v-50" fill="#C98E70"/><path d="M36 66 l22 40 M76 76 l16 38 M124 76 l-16 38 M164 66 l-22 40" stroke="#A96C51" stroke-width="3"/></svg></button><div class="rd-hud">'+BF.L("Rhythm ","Ритм ")+'<b id="rhN">1</b> / '+PAT.length+'</div></div>';
    var drum = stage.querySelector("#rhB"), dots = stage.querySelector("#rhD");
    function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
    function hit(){ drum.classList.remove("hit"); void drum.offsetWidth; drum.classList.add("hit"); BF.sound.pop(); }
    function drawDots(n){ var p = PAT[r]; dots.innerHTML = p.map(function(g, i){ return '<i class="'+(g===2?'long ':'')+(i<n?'on':'')+'"></i>'; }).join(""); }
    function play(){
      busy = true; taps = []; drawDots(0); stage.querySelector("#rhN").textContent = r+1; api.say(BF.L("Watch and listen…","Смотри и слушай…"));
      var t = 600, p = PAT[r];
      for(var i=0;i<p.length;i++){ (function(i, t){ later(function(){ hit(); drawDots(i+1); }, t); })(i, t); t += p[i]*BEAT; }
      later(function(){ busy = false; drawDots(0); api.say(BF.L("Your turn — tap the drum.","Твоя очередь — стучи по барабану.")); }, t + 200);
    }
    function judge(){
      var p = PAT[r], ok = true;
      for(var i=1;i<taps.length;i++){ var want = p[i-1]*BEAT, got = taps[i]-taps[i-1]; if(Math.abs(got-want)/want > TOL) ok = false; }
      busy = true;
      if(ok){ score++; BF.sound.star(); api.say([BF.L("Right on the beat!","Точно в ритм!"),BF.L("Lovely timing.","Отличный ритм."),BF.L("Just like the drum!","Как барабан!")][r%3]); }
      else api.say(BF.L("Close! Let's go on to the next one.","Почти! Идём к следующему."));
      r++;
      if(r >= PAT.length){ var n = score===PAT.length?3:score>=Math.ceil(PAT.length/2)?2:1; later(function(){ api.win(n, BF.L(score+" of "+PAT.length+" rhythms echoed.","Повторено ритмов: "+score+" из "+PAT.length+".")); }, 700); }
      else later(play, 1300);
    }
    drum.addEventListener("pointerdown", function(e){ e.preventDefault(); BF.sound.unlock(); if(busy){ api.say(BF.L("Wait — watch the drum first, then it is your turn.","Подожди — сначала смотри на барабан, потом твоя очередь.")); drum.classList.remove("wait"); void drum.offsetWidth; drum.classList.add("wait"); return; } hit(); taps.push(performance.now()); drawDots(taps.length); if(taps.length >= PAT[r].length) judge(); });
    later(play, 500);
    return function(){ timers.forEach(clearTimeout); };
  }
};
