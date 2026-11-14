/* Shape Tracing — trace around a shape outline with one finger. Narrower outlines and trickier shapes later. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.shapes = {
  title:{en:"Shape Tracing",ru:"Обведи фигуру"}, skill:{en:"Fine motor",ru:"Мелкая моторика"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Start at the glowing dot and trace all the way around the shape. Slow is perfect.",ru:"Начни со светящейся точки и обведи фигуру по кругу. Медленно — идеально."},
  why:{en:"Tracing closed shapes is a pre-writing skill: it builds the controlled curves and corners that letters need.",ru:"Обводка фигур — подготовка к письму: она развивает плавные линии и углы, из которых состоят буквы."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M60 12 L72 38 L100 40 L78 58 L86 84 L60 70 L34 84 L42 58 L20 40 L48 38Z" fill="none" stroke="#E7D7BC" stroke-width="10" stroke-linejoin="round"/><path d="M60 12 L72 38 L100 40 L78 58" fill="none" stroke="#C98E70" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="78" cy="58" r="6" fill="#FBF7EF" stroke="#A96C51" stroke-width="2.5"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil;
    function star(){ var o=[]; for(var i=0;i<10;i++){ var a=-Math.PI/2+i*Math.PI/5, r=i%2?60:130; o.push((300+Math.cos(a)*r).toFixed(1)+" "+(190+Math.sin(a)*r).toFixed(1)); } return "M"+o.join(" L")+"Z"; }
    var SH = {
      circle:{n:{en:"circle",ru:"круг"}, d:"M300 60 A120 120 0 1 1 299.9 60Z"},
      square:{n:{en:"square",ru:"квадрат"}, d:"M190 80 H410 V300 H190Z"},
      triangle:{n:{en:"triangle",ru:"треугольник"}, d:"M300 60 L430 300 H170Z"},
      star:{n:{en:"star",ru:"звезда"}, d:star()},
      heart:{n:{en:"heart",ru:"сердце"}, d:"M300 120 C300 60 200 50 190 120 C180 190 260 240 300 300 C340 240 420 190 410 120 C400 50 300 60 300 120Z"},
      drop:{n:{en:"drop",ru:"капля"}, d:"M300 50 C350 130 400 180 400 230 A100 100 0 0 1 200 230 C200 180 250 130 300 50Z"}
    };
    var LIST = api.pick([["circle","square"],["triangle","heart","circle"],["star","drop","heart"]]), TOL = api.pick([32,25,18]);
    var k = 0, slips = 0, svg, path, prog, tok, samples, N = 400, idx = 0, len = 0, tracing = false;
    function build(){
      var S = SH[LIST[k]];
      stage.innerHTML = '<div class="lvl-tag">'+BF.ui.T(S.n)+' · '+(k+1)+' / '+LIST.length+'</div><svg class="g-svg" viewBox="0 0 600 380" aria-label="'+BF.ui.T(S.n)+'">'+
        '<path id="shT" d="'+S.d+'" fill="#F1E9DB" stroke="#D6C09C" stroke-width="'+(TOL*2+4)+'" stroke-linejoin="round"/>'+
        '<path d="'+S.d+'" fill="none" stroke="#F4ECDD" stroke-width="'+(TOL*2-6)+'" stroke-linejoin="round"/>'+
        '<path d="'+S.d+'" fill="none" stroke="#CDBA98" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>'+
        '<path id="shP" d="'+S.d+'" fill="none" stroke="#C98E70" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<g id="shTok"><circle r="20" fill="#FBF7EF" stroke="#A96C51" stroke-width="3"/><circle class="tok-ring" r="28" fill="none" stroke="#A96C51" stroke-width="2" stroke-dasharray="4 6"/></g></svg>';
      svg = stage.querySelector("svg"); path = stage.querySelector("#shT"); prog = stage.querySelector("#shP"); tok = stage.querySelector("#shTok");
      len = path.getTotalLength(); samples = [];
      for(var i=0;i<N;i++){ var p = path.getPointAtLength(len*i/(N-1)); samples.push({x:p.x,y:p.y}); }
      prog.style.strokeDasharray = len; idx = 0; paint();
    }
    function paint(){ var p = samples[idx]; tok.setAttribute("transform","translate("+p.x+" "+p.y+")"); prog.style.strokeDashoffset = len*(1-idx/(N-1)); }
    function near(pt){ var best=-1, bd=1e9; for(var i=Math.max(0,idx-10); i<=Math.min(N-1, idx+30); i++){ var d=U.dist(pt, samples[i]); if(d<bd){ bd=d; best=i; } } return {i:best,d:bd}; }
    stage.addEventListener("pointerdown", function(e){ if(!svg) return; var pt = U.svgPoint(svg, e);
      if(U.dist(pt, samples[idx]) < 46){ tracing = true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} tok.classList.add("held"); }
      else api.say(BF.L("Start from the round dot.","Начни с круглой точки.")); });
    stage.addEventListener("pointermove", function(e){ if(!tracing) return; var pt = U.svgPoint(svg, e), n = near(pt);
      if(n.d <= TOL){ stage.classList.remove("off"); if(n.i > idx){ idx = n.i; paint(); if(idx%50===0) BF.sound.pop(); } if(idx >= N-6) done(); }
      else if(n.d > TOL+6 && !stage.classList.contains("off")){ slips++; stage.classList.add("off"); api.say(BF.L("Back onto the line — your progress stays.","Вернись на линию — прогресс сохранён.")); } });
    function up(){ tracing = false; if(tok) tok.classList.remove("held"); stage.classList.remove("off"); }
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    function done(){
      tracing = false; idx = N-1; paint(); BF.sound.star();
      api.say(BF.L("A whole ","Целый ")+BF.ui.T(SH[LIST[k]].n)+"!");
      if(k < LIST.length-1){ k++; setTimeout(build, 900); }
      else api.win(slips<=2?3:slips<=6?2:1, BF.L("Beautiful shapes!","Красивые фигуры!"));
    }
    build();
    return function(){};
  }
};
