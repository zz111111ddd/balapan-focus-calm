/* Keyboard Hunt — find letters on an on-screen keyboard (Latin or Cyrillic, follows the UI language).
   Easy: single letters, no timer, a gentle hint. Medium: letter pairs, soft timer, one decoy glow.
   Hard: short words, faster timer, two decoy glows. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.keys = {
  title:{en:"Keyboard Hunt",ru:"Охота за буквами"}, skill:{en:"Visual search & letters",ru:"Зрительный поиск и буквы"}, motor:false, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Find the letter on the keyboard and tap it. Longer levels ask for two or three letters in a row.",ru:"Найди букву на клавиатуре и нажми её. На сложных уровнях — две-три буквы подряд."},
  why:{en:"Scanning a busy keyboard for one letter, while ignoring glowing decoys, trains selective attention — and makes letters familiar.",ru:"Искать одну букву на клавиатуре, не отвлекаясь на мигающие «приманки», — это тренировка избирательного внимания и знакомство с буквами."},
  art:function(){ var k = ""; for(var r=0;r<3;r++) for(var i=0;i<(7-r);i++) k += '<rect x="'+(10+r*7+i*15)+'" y="'+(30+r*17)+'" width="12" height="13" rx="3" fill="'+((r===1&&i===2)?'#C98E70':'#E9DCC5')+'"/>'; return '<svg viewBox="0 0 120 90"><rect x="4" y="24" width="112" height="60" rx="10" fill="#93A9BA"/>'+k+'<rect x="44" y="4" width="32" height="18" rx="6" fill="#FBF7EF" stroke="#C98E70" stroke-width="2"/><text x="60" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#A96C51">A</text></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, ru = BF.lang()==="ru";
    var ROWS = ru ? ["ЙЦУКЕНГШЩЗХ","ФЫВАПРОЛДЖЭ","ЯЧСМИТЬБЮ"] : ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
    var ALL = ROWS.join("").replace(/[ЬЪЙ]/g,"").split("");
    var WORDS = ru ? ["КОТ","ДОМ","СОК","ЛЕС","МЯЧ","СУП","ЛУК","СЫР","НОС","РОТ","ЖУК","ЁЖ".replace("Ё","Е")] : ["CAT","SUN","DOG","HAT","BED","CUP","MAP","BUS","OWL","FOX","BEE","PIG"];
    var N = api.pick([8,9,8]), TIME = api.pick([0,9000,7000]), DECOYS = api.pick([0,1,2]);
    var targets = [];
    for(var i=0;i<N;i++){
      if(api.lv===0) targets.push(ALL[Math.floor(Math.random()*ALL.length)]);
      else if(api.lv===1) targets.push(i%2 ? ALL[Math.floor(Math.random()*ALL.length)]+ALL[Math.floor(Math.random()*ALL.length)] : ALL[Math.floor(Math.random()*ALL.length)]);
      else targets.push(WORDS[Math.floor(Math.random()*WORDS.length)]);
    }
    var t = 0, pos = 0, misses = 0, timer = 0, hintT = 0, decoyT = 0, t0 = 0, raf = 0, over = false;
    stage.innerHTML = '<div class="kh"><div class="kh-top"><span class="kh-hero">'+BF.avatar.svg(BF.store.s.avatar,{size:64, headOnly:true})+'</span><div class="kh-card paper" id="khCard"></div><span class="kh-count" id="khN"></span></div>'+
      '<div class="kh-bar'+(TIME?'':' hidden')+'"><i id="khBar"></i></div>'+
      '<div class="kb'+(ru?' kb-ru':'')+'" role="group" aria-label="'+BF.L("Keyboard","Клавиатура")+'">'+ROWS.map(function(r){ return '<div class="kb-row">'+r.split("").map(function(ch){ return '<button class="kb-k" data-ch="'+ch+'">'+ch+'</button>'; }).join("")+'</div>'; }).join("")+'</div></div>';
    var card = stage.querySelector("#khCard"), bar = stage.querySelector("#khBar");
    function keyEl(ch){ return stage.querySelector('.kb-k[data-ch="'+ch+'"]'); }
    function show(){
      var w = targets[t];
      card.innerHTML = w.split("").map(function(ch, i){ return '<span class="'+(i<pos?'got':i===pos?'now':'')+'">'+ch+'</span>'; }).join("");
      stage.querySelector("#khN").textContent = (t+1)+" / "+N;
      clearTimeout(hintT); stage.querySelectorAll(".kb-k.hint").forEach(function(k){ k.classList.remove("hint"); });
      if(api.lv===0) hintT = setTimeout(function(){ var k = keyEl(w[pos]); if(k) k.classList.add("hint"); api.say(BF.L("Look — it's glowing softly.","Смотри — она тихонько светится.")); }, 5000);
      t0 = performance.now();
    }
    function decoy(){
      if(over || !DECOYS) return;
      stage.querySelectorAll(".kb-k.decoy").forEach(function(k){ k.classList.remove("decoy"); });
      var want = targets[t][pos];
      for(var d=0; d<DECOYS; d++){ var ch = ALL[Math.floor(Math.random()*ALL.length)]; if(ch!==want){ var k = keyEl(ch); if(k) k.classList.add("decoy"); } }
      decoyT = setTimeout(decoy, 1800);
    }
    function next(){
      pos = 0; t++;
      if(t >= N){ over = true; clearTimeout(hintT); clearTimeout(decoyT); var lim = api.pick([[1,4],[2,5],[2,6]]); api.win(misses<=lim[0]?3:misses<=lim[1]?2:1, misses<=lim[0]?BF.L("Eagle eyes!","Зоркий глаз!"):BF.L("All the letters found!","Все буквы найдены!")); return; }
      show();
    }
    function press(ch){
      if(over) return;
      var k = keyEl(ch), want = targets[t][pos];
      if(ch === want){
        if(k){ k.classList.add("ok"); setTimeout(function(){ k.classList.remove("ok"); }, 300); }
        BF.sound.pop(); pos++;
        if(pos >= targets[t].length){ api.say([BF.L("Found it!","Нашёл!"),BF.L("Yes!","Да!"),BF.L("Sharp eyes.","Зоркие глаза.")][t%3]); next(); } else show();
      } else {
        misses++; BF.sound.soft();
        if(k){ k.classList.add("no"); setTimeout(function(){ k.classList.remove("no"); }, 350); }
        api.say(BF.L("Not that one — look for ","Не эта — ищи ")+want+".");
      }
    }
    stage.querySelectorAll(".kb-k").forEach(function(b){ b.addEventListener("click", function(){ press(b.getAttribute("data-ch")); }); });
    function kd(e){ if(e.key && e.key.length===1){ var ch = e.key.toUpperCase().replace("Ё","Е"); if(ROWS.join("").indexOf(ch)>=0){ e.preventDefault(); press(ch); } } }
    window.addEventListener("keydown", kd);
    function loop(now){
      if(over) return;
      if(TIME){ var f = Math.min(1, (now - t0)/TIME); bar.style.transform = "scaleX("+(1-f).toFixed(3)+")";
        if(f>=1){ misses++; api.say(BF.L("Time's up for that one — next!","Время вышло — следующая!")); next(); } }
      raf = requestAnimationFrame(loop);
    }
    show(); decoy(); raf = requestAnimationFrame(loop);
    return function(){ over = true; cancelAnimationFrame(raf); clearTimeout(hintT); clearTimeout(decoyT); window.removeEventListener("keydown", kd); };
  }
};
