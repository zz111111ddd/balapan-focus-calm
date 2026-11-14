/* Picture Tracing — trace a picture (house, fish, rocket, cat…) along its dotted outline, stroke by stroke.
   An accuracy meter shows how much of the movement stayed on the line. Wider path and simple pictures first. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.pictrace = {
  title:{en:"Picture Tracing",ru:"Обводка картинок"}, skill:{en:"Fine motor & focus",ru:"Моторика и внимание"}, motor:true, cat:"motor", time:{en:"2–3 min",ru:"2–3 мин"},
  howto:{en:"Put your finger on the round dot and slowly follow the dotted line. Each line of the picture has its own dot.",ru:"Поставь палец на круглую точку и медленно веди по пунктиру. У каждой линии картинки — своя точка."},
  why:{en:"Following a contour trains steady attention and hand–eye control — the same skills needed for neat handwriting.",ru:"Обводка контура тренирует устойчивое внимание и связь «глаз — рука» — те же навыки нужны для аккуратного почерка."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M30 80 V44 L60 18 L90 44 V80 Z" fill="#F1E3C8" stroke="#D6C09C" stroke-width="3" stroke-dasharray="3 5" stroke-linejoin="round"/><path d="M30 80 V44 L60 18 L90 44" fill="none" stroke="#C98E70" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 80 V62 H68 V80" fill="none" stroke="#D6C09C" stroke-width="3" stroke-dasharray="3 5"/><circle cx="90" cy="44" r="6" fill="#FBF7EF" stroke="#A96C51" stroke-width="2.5"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, T = BF.ui.T;
    var PICS = {
      house:{n:{en:"house",ru:"домик"}, fill:"#E7C9A9", s:["M180 320 V190 L300 90 L420 190 V320 Z","M272 320 V252 H328 V320"]},
      fish:{n:{en:"fish",ru:"рыбка"}, fill:"#A9C3D6", s:["M150 190 C210 110 360 110 420 190 C360 270 210 270 150 190 Z","M420 190 L485 140 L485 240 Z"]},
      sun:{n:{en:"sun",ru:"солнышко"}, fill:"#E8CF8F", s:["M300 110 A80 80 0 1 1 299.9 110 Z","M300 60 V30","M300 350 V320","M200 190 H170","M430 190 H400"]},
      rocket:{n:{en:"rocket",ru:"ракета"}, fill:"#D9B8A6", s:["M300 50 C350 100 362 180 352 280 H248 C238 180 250 100 300 50 Z","M250 220 L205 300 L250 288","M350 220 L395 300 L350 288","M300 128 A24 24 0 1 1 299.9 128 Z"]},
      butterfly:{n:{en:"butterfly",ru:"бабочка"}, fill:"#C9B8D4", s:["M300 190 C240 80 150 110 185 190 C150 270 240 300 300 190 C360 300 450 270 415 190 C450 110 360 80 300 190 Z","M290 150 L265 95","M310 150 L335 95"]},
      cat:{n:{en:"cat",ru:"котик"}, fill:"#E2C2A0", s:["M215 175 L228 85 L275 132 Q300 125 325 132 L372 85 L385 175 C398 262 202 262 215 175 Z","M262 205 H190","M262 218 L195 238","M338 205 H410","M338 218 L405 238","M285 196 Q300 210 315 196"]},
      tree:{n:{en:"tree",ru:"дерево"}, fill:"#A9C29B", s:["M300 60 C385 60 412 150 362 190 C412 232 362 296 300 266 C238 296 188 232 238 190 C188 150 215 60 300 60 Z","M285 266 V340 H315 V266"]}
    };
    var LIST = U.shuffle(api.pick([["house","fish","sun"],["rocket","tree","butterfly"],["cat","rocket","butterfly"]]).slice()).slice(0, api.pick([2,2,3]));
    var TOL = api.pick([30,22,15]);
    var k = 0, s = 0, svg, guide, prog, tok, samples, idx = 0, len = 0, N = 0, tracing = false, onMoves = 0, allMoves = 0, meter;
    function pct(){ return allMoves ? Math.round(100*onMoves/allMoves) : 100; }
    function build(){
      var P = PICS[LIST[k]];
      stage.innerHTML = '<div class="lvl-tag">'+T(P.n)+' · '+(k+1)+' / '+LIST.length+'</div>'+
        '<div class="pt-meter" aria-live="polite"><span>'+BF.L("Accuracy","Точность")+'</span><i><b id="ptBar"></b></i><em id="ptPct">'+pct()+'%</em></div>'+
        '<svg class="g-svg" viewBox="0 0 600 380" aria-label="'+T(P.n)+'"><g id="ptDone"></g>'+
        P.s.map(function(d){ return '<path d="'+d+'" fill="none" stroke="#E4D6BD" stroke-width="'+(TOL*2)+'" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/><path d="'+d+'" fill="none" stroke="#B9A684" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round"/>'; }).join("")+
        '<path id="ptG" d="" fill="none" stroke="none"/><path id="ptP" d="" fill="none" stroke="#C98E70" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<g id="ptTok"><circle r="18" fill="#FBF7EF" stroke="#A96C51" stroke-width="3"/><circle class="tok-ring" r="26" fill="none" stroke="#A96C51" stroke-width="2" stroke-dasharray="4 6"/></g></svg>';
      svg = stage.querySelector("svg"); guide = stage.querySelector("#ptG"); prog = stage.querySelector("#ptP"); tok = stage.querySelector("#ptTok"); meter = stage.querySelector("#ptBar");
      s = 0; stroke(); paintMeter();
    }
    function stroke(){
      var d = PICS[LIST[k]].s[s];
      guide.setAttribute("d", d); prog.setAttribute("d", d);
      len = guide.getTotalLength(); N = Math.max(30, Math.round(len/4)); samples = [];
      for(var i=0;i<N;i++){ var p = guide.getPointAtLength(len*i/(N-1)); samples.push({x:p.x,y:p.y}); }
      prog.style.strokeDasharray = len; idx = 0; paint();
    }
    function paint(){ var p = samples[idx]; tok.setAttribute("transform","translate("+p.x+" "+p.y+")"); prog.style.strokeDashoffset = len*(1-idx/(N-1)); }
    function paintMeter(){ if(!meter) return; var v = pct(); meter.style.width = v+"%"; meter.className = v>=85?"good":v>=65?"ok":"low"; var t = stage.querySelector("#ptPct"); if(t) t.textContent = v+"%"; }
    function near(pt){ var best=-1, bd=1e9, hi = Math.min(N-1, idx+Math.max(12, Math.round(N/8))); for(var i=Math.max(0,idx-6); i<=hi; i++){ var d=U.dist(pt, samples[i]); if(d<bd){ bd=d; best=i; } } return {i:best,d:bd}; }
    stage.addEventListener("pointerdown", function(e){ if(!svg) return; var pt = U.svgPoint(svg, e);
      if(U.dist(pt, samples[idx]) < Math.max(40, TOL+16)){ tracing = true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} tok.classList.add("held"); }
      else if(e.target.closest && e.target.closest("svg")) api.say(BF.L("Start from the round dot.","Начни с круглой точки.")); });
    stage.addEventListener("pointermove", function(e){ if(!tracing) return; var pt = U.svgPoint(svg, e), n = near(pt);
      allMoves++;
      if(n.d <= TOL){ onMoves++; stage.classList.remove("off"); if(n.i > idx){ idx = n.i; paint(); } if(idx >= N-3) finishStroke(); }
      else if(n.d > TOL+6 && !stage.classList.contains("off")){ stage.classList.add("off"); api.say(BF.L("Back onto the line — your progress stays.","Вернись на линию — прогресс сохранён.")); }
      if(allMoves % 6 === 0) paintMeter(); });
    function up(){ tracing = false; if(tok) tok.classList.remove("held"); stage.classList.remove("off"); paintMeter(); }
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    function finishStroke(){
      tracing = false; idx = N-1; paint(); BF.sound.pop();
      var P = PICS[LIST[k]], done = stage.querySelector("#ptDone");
      done.insertAdjacentHTML("beforeend", '<path d="'+P.s[s]+'" fill="'+(s===0?P.fill:"none")+'" fill-opacity=".55" stroke="#A96C51" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>');
      if(s < P.s.length-1){ s++; stroke(); api.say(BF.L("Next line — find the new dot.","Следующая линия — найди новую точку.")); return; }
      tok.style.display = "none"; prog.style.display = "none"; BF.sound.star(); paintMeter();
      api.say(BF.L("You traced the "+T(P.n)+"!","Готово: "+T(P.n)+"!"));
      if(k < LIST.length-1){ k++; setTimeout(build, 1000); }
      else { var v = pct(); api.win(v>=85?3:v>=65?2:1, BF.L("Accuracy ","Точность ")+v+"% — "+BF.L("lovely pictures!","чудесные картинки!")); }
    }
    build();
    return function(){};
  }
};
