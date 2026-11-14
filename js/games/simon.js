/* Echo Garden (Simon) — watch a growing sequence of soft pads light up, then repeat it. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.simon = {
  title:{en:"Echo Garden",ru:"Эхо-сад"}, skill:{en:"Memory for order",ru:"Память на порядок"}, motor:false, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Watch which plants glow, then tap them in the same order. The chain grows by one each time.",ru:"Смотри, какие растения светятся, и нажми их в том же порядке. Цепочка каждый раз растёт на одно."},
  why:{en:"Remembering a sequence is the same skill as remembering “shoes, coat, bag” — working memory for steps.",ru:"Запоминать последовательность — тот же навык, что помнить «обувь, куртка, рюкзак»: рабочая память на шаги."},
  art:function(){ return '<svg viewBox="0 0 120 90"><circle cx="40" cy="30" r="16" fill="#A3B59C"/><circle cx="80" cy="30" r="16" fill="#93A9BA" opacity=".55"/><circle cx="40" cy="64" r="16" fill="#C98E70" opacity=".55"/><circle cx="80" cy="64" r="16" fill="#E4CC8F" opacity=".55"/><circle cx="40" cy="30" r="22" fill="none" stroke="#A3B59C" stroke-width="2" stroke-dasharray="3 4"/></svg>'; },
  mount:function(stage, api){
    var PADS = [
      {c:"#A3B59C", s:"#DCE4D5", n:{en:"leaf",ru:"лист"}, i:'<path d="M14 34 C14 18 24 9 38 8 C37 24 28 34 14 34z" fill="currentColor"/>'},
      {c:"#93A9BA", s:"#D8E1E7", n:{en:"drop",ru:"капля"}, i:'<path d="M24 6 C30 16 36 22 36 29 a12 12 0 0 1 -24 0 C12 22 18 16 24 6z" fill="currentColor"/>'},
      {c:"#C98E70", s:"#F1DED3", n:{en:"flower",ru:"цветок"}, i:'<circle cx="24" cy="22" r="6" fill="currentColor"/><g fill="currentColor" opacity=".6"><circle cx="24" cy="11" r="6"/><circle cx="35" cy="22" r="6"/><circle cx="24" cy="33" r="6"/><circle cx="13" cy="22" r="6"/></g>'},
      {c:"#C7A65A", s:"#F1E6C8", n:{en:"sun",ru:"солнце"}, i:'<circle cx="24" cy="22" r="8" fill="currentColor"/><path d="M24 6v4M24 34v4M8 22h4M36 22h4M12 10l3 3M33 31l3 3M12 34l3-3M33 13l3-3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'},
      {c:"#8B6F64", s:"#E6DAD3", n:{en:"acorn",ru:"жёлудь"}, i:'<path d="M12 18 h24 q0 -8 -12 -8 q-12 0 -12 8z" fill="currentColor"/><path d="M14 18 q0 16 10 18 q10 -2 10 -18z" fill="currentColor" opacity=".6"/>'},
      {c:"#7D8FA8", s:"#DDE2EA", n:{en:"moon",ru:"луна"}, i:'<path d="M30 34 A13 13 0 1 1 20 8 A10 10 0 0 0 30 34z" fill="currentColor"/>'}
    ].slice(0, api.pick([4,4,6]));
    var GOAL = api.pick([4,6,8]), SPEED = api.pick([900,700,560]), seq = [], inp = 0, busy = true, mistakes = 0, timers = [];
    stage.innerHTML = '<div class="sm-hud">'+BF.L("Chain: ","Цепочка: ")+'<b id="smL">0</b> / '+GOAL+'</div><div class="sm-grid sm-'+PADS.length+'">'+PADS.map(function(p, i){ return '<button class="sm-pad" data-i="'+i+'" style="--c:'+p.c+';--s:'+p.s+'" aria-label="'+BF.ui.T(p.n)+'"><svg viewBox="0 0 48 44" width="56" height="52" style="color:'+p.c+'">'+p.i+'</svg></button>'; }).join("")+'</div>';
    var pads = stage.querySelectorAll(".sm-pad");
    function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
    function flash(i, ms){ var p = pads[i]; p.classList.add("lit"); BF.sound.pop(); later(function(){ p.classList.remove("lit"); }, ms*0.6); }
    function play(){
      busy = true; inp = 0; stage.classList.add("watching"); api.say(BF.L("Watch…","Смотри…"));
      seq.forEach(function(i, k){ later(function(){ flash(i, SPEED); }, 500 + k*SPEED); });
      later(function(){ busy = false; stage.classList.remove("watching"); api.say(BF.L("Your turn!","Твоя очередь!")); }, 500 + seq.length*SPEED);
    }
    function grow(){ seq.push(Math.floor(Math.random()*PADS.length)); stage.querySelector("#smL").textContent = seq.length; play(); }
    pads.forEach(function(p){ p.addEventListener("click", function(){
      if(busy) return; var i = +p.getAttribute("data-i"); flash(i, 400);
      if(i === seq[inp]){ inp++;
        if(inp === seq.length){ busy = true;
          if(seq.length >= GOAL){ later(function(){ api.win(mistakes===0?3:mistakes<=2?2:1, BF.L("A chain of "+GOAL+"!","Цепочка из "+GOAL+"!")); }, 500); }
          else { api.say(BF.L("Yes! One more…","Да! Ещё одно…")); later(grow, 900); }
        }
      } else {
        mistakes++; busy = true; BF.sound.soft();
        if(mistakes >= 4){ later(function(){ api.win(1, BF.L("You remembered "+(seq.length-1)+" in a row.","Ты запомнил "+(seq.length-1)+" подряд.")); }, 600); return; }
        api.say(BF.L("Almost! Let's watch the same chain again.","Почти! Посмотрим ту же цепочку ещё раз.")); later(play, 1100);
      }
    }); });
    later(grow, 600);
    return function(){ timers.forEach(clearTimeout); };
  }
};
