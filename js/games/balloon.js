/* Balloon Breath — paced breathing: hold to breathe in (4s), let go to breathe out (6s). */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.balloon = {
  title:"Balloon Breath", skill:"Calm body", motor:false, time:"1–2 min",
  howto:"Press and hold to breathe in while the balloon fills. Let go and breathe out slowly. Five balloons.",
  why:"A longer out-breath is a simple, gentle way to help the body settle before a brave step.",
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M60 64 q-3 10 4 22" stroke="#B9A48A" stroke-width="2" fill="none"/><ellipse cx="60" cy="36" rx="24" ry="28" fill="#D9B5A7"/><path d="M55 63 h10 l-5 6z" fill="#C79E8F"/><path d="M48 22 q5 -8 12 -8" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="60" cy="36" r="40" fill="none" stroke="#A3B59C" stroke-width="2" stroke-dasharray="3 6"/></svg>'; },
  mount:function(stage, api){
    var v = 0, holding = false, breaths = 0, peaked = false, raf = 0, last = 0, early = 0;
    var COLORS = ["#D9B5A7","#A3B59C","#93A9BA","#E4CC8F","#C98E70"];
    stage.innerHTML = '<div class="bal-wrap"><div class="bal-dots" id="bd">'+[0,1,2,3,4].map(function(i){ return '<span data-i="'+i+'"></span>'; }).join("")+'</div>'+
      '<svg class="g-svg bal-svg" viewBox="0 0 400 360"><circle id="pace" cx="200" cy="160" r="118" fill="none" stroke="#C9D3C1" stroke-width="3" stroke-dasharray="4 10"/>'+
      '<g id="bal" style="transform-origin:200px 250px"><path d="M200 248 q-10 40 6 100" stroke="#B9A48A" stroke-width="2.5" fill="none"/><ellipse id="balB" cx="200" cy="160" rx="80" ry="92" fill="'+COLORS[0]+'"/><path d="M190 250 h20 l-10 12z" fill="#000" opacity=".12"/><path d="M160 110 q14 -26 40 -26" stroke="#fff" stroke-opacity=".55" stroke-width="10" fill="none" stroke-linecap="round"/></g>'+
      '<g id="balKid" transform="translate(150 230)">'+BF.gameUtil.heroHead(100,0,0)+'</g></svg>'+
      '<button class="hold-btn" id="hold"><span id="holdT">Hold to breathe in</span></button></div>';
    var bal = stage.querySelector("#bal"), balB = stage.querySelector("#balB"), holdT = stage.querySelector("#holdT"), holdB = stage.querySelector("#hold");
    function render(){
      var s = 0.25 + v*0.75; bal.style.transform = "scale("+s.toFixed(3)+")";
      holdT.textContent = holding ? (v>=1 ? "Full! Let go slowly…" : "Breathe in… "+Math.min(4, Math.floor(v*4)+1)) : (v>0.02 ? "Breathe out… "+Math.max(1, Math.ceil(v*6)) : "Hold to breathe in");
    }
    function loop(t){
      var dt = last ? (t-last) : 16; last = t;
      if(holding) v = Math.min(1, v + dt/4000); else v = Math.max(0, v - dt/6000);
      if(v >= 0.85) peaked = true;
      if(!holding && peaked && v <= 0.04){
        peaked = false; breaths++;
        var dot = stage.querySelector('[data-i="'+(breaths-1)+'"]'); if(dot) dot.classList.add("on");
        BF.sound.chime(); balB.setAttribute("fill", COLORS[breaths % COLORS.length]);
        if(breaths >= 5){ api.win(early<=1?3:2, "Calm as a slow wave."); cancelAnimationFrame(raf); return; }
        api.say(["Lovely. Again — slow in…","Nice long breath out.","You're getting the rhythm.","One more after this."][breaths-1] || "Again…");
      }
      render(); raf = requestAnimationFrame(loop);
    }
    function press(e){ if(e) e.preventDefault(); BF.sound.unlock(); holding = true; holdB.classList.add("on"); }
    function release(){ if(!holding) return; holding = false; holdB.classList.remove("on"); if(v < 0.5){ early++; api.say("A little longer next time — try to fill it to the dotted ring."); } }
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
