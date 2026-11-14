/* Balloon Breath — paced breathing: hold to breathe in (4s), let go to breathe out (6s). */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.balloon = {
  title:{en:"Balloon Breath",ru:"Дыхание-шарик"}, skill:{en:"Calm body",ru:"Спокойное тело"}, motor:false, time:{en:"1–2 min",ru:"1–2 мин"},
  howto:{en:"Press and hold to breathe in while the balloon fills. Let go and breathe out slowly.",ru:"Нажми и держи — делай вдох, пока шарик надувается. Отпусти — медленный выдох."},
  why:{en:"A longer out-breath is a simple, gentle way to help the body settle before a brave step.",ru:"Длинный выдох — простой и мягкий способ успокоить тело перед смелым шагом."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M60 64 q-3 10 4 22" stroke="#B9A48A" stroke-width="2" fill="none"/><ellipse cx="60" cy="36" rx="24" ry="28" fill="#D9B5A7"/><path d="M55 63 h10 l-5 6z" fill="#C79E8F"/><path d="M48 22 q5 -8 12 -8" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="60" cy="36" r="40" fill="none" stroke="#A3B59C" stroke-width="2" stroke-dasharray="3 6"/></svg>'; },
  mount:function(stage, api){
    var v = 0, holding = false, breaths = 0, peaked = false, raf = 0, last = 0, early = 0, NB = api.pick([3,5,6]), IN = api.pick([3000,4000,4000]), OUT = api.pick([4000,6000,7000]), INS = IN/1000, OUTS = OUT/1000;
    var COLORS = ["#D9B5A7","#A3B59C","#93A9BA","#E4CC8F","#C98E70"];
    stage.innerHTML = '<div class="bal-wrap"><div class="bal-dots" id="bd">'+Array.apply(null,{length:NB}).map(function(_,i){ return i; }).map(function(i){ return '<span data-i="'+i+'"></span>'; }).join("")+'</div>'+
      '<svg class="g-svg bal-svg" viewBox="0 0 400 360"><circle id="pace" cx="200" cy="160" r="118" fill="none" stroke="#C9D3C1" stroke-width="3" stroke-dasharray="4 10"/>'+
      '<g id="bal" style="transform-origin:200px 250px"><path d="M200 248 q-10 40 6 100" stroke="#B9A48A" stroke-width="2.5" fill="none"/><ellipse id="balB" cx="200" cy="160" rx="80" ry="92" fill="'+COLORS[0]+'"/><path d="M190 250 h20 l-10 12z" fill="#000" opacity=".12"/><path d="M160 110 q14 -26 40 -26" stroke="#fff" stroke-opacity=".55" stroke-width="10" fill="none" stroke-linecap="round"/></g>'+
      '<g id="balKid" transform="translate(150 230)">'+BF.gameUtil.heroHead(100,0,0)+'</g></svg>'+
      '<button class="hold-btn" id="hold"><span id="holdT">'+BF.L("Hold to breathe in","Держи — вдох")+'</span></button></div>';
    var bal = stage.querySelector("#bal"), balB = stage.querySelector("#balB"), holdT = stage.querySelector("#holdT"), holdB = stage.querySelector("#hold");
    function render(){
      var s = 0.25 + v*0.75; bal.style.transform = "scale("+s.toFixed(3)+")";
      holdT.textContent = holding ? (v>=1 ? BF.L("Full! Let go slowly…","Полный! Отпускай медленно…") : BF.L("Breathe in… ","Вдох… ")+Math.min(INS, Math.floor(v*INS)+1)) : (v>0.02 ? BF.L("Breathe out… ","Выдох… ")+Math.max(1, Math.ceil(v*OUTS)) : BF.L("Hold to breathe in","Держи — вдох"));
    }
    function loop(t){
      var dt = last ? (t-last) : 16; last = t;
      if(holding) v = Math.min(1, v + dt/IN); else v = Math.max(0, v - dt/OUT);
      if(v >= 0.85) peaked = true;
      if(!holding && peaked && v <= 0.04){
        peaked = false; breaths++;
        var dot = stage.querySelector('[data-i="'+(breaths-1)+'"]'); if(dot) dot.classList.add("on");
        BF.sound.chime(); balB.setAttribute("fill", COLORS[breaths % COLORS.length]);
        if(breaths >= NB){ api.win(early<=1?3:early<=3?2:1, BF.L("Calm as a slow wave.","Спокойно, как медленная волна.")); cancelAnimationFrame(raf); return; }
        api.say(NB-breaths===1 ? BF.L("One more after this.","Ещё один — и всё.") : [BF.L("Lovely. Again — slow in…","Чудесно. Снова — медленный вдох…"),BF.L("Nice long breath out.","Хороший длинный выдох."),BF.L("You're getting the rhythm.","Ты ловишь ритм.")][(breaths-1)%3]);
      }
      render(); raf = requestAnimationFrame(loop);
    }
    function press(e){ if(e) e.preventDefault(); BF.sound.unlock(); holding = true; holdB.classList.add("on"); }
    function release(){ if(!holding) return; holding = false; holdB.classList.remove("on"); if(v < 0.5){ early++; api.say(BF.L("A little longer next time — try to fill it to the dotted ring.","В следующий раз чуть дольше — до пунктирного круга.")); } }
    stage.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    function kd(e){ if(e.code==="Space" && !e.repeat){ press(e); } }
    function ku(e){ if(e.code==="Space") release(); }
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    raf = requestAnimationFrame(loop);
    return function(){ cancelAnimationFrame(raf); window.removeEventListener("pointerup", release); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }
};
