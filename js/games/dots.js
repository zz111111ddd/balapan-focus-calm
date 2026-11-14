/* Dot-to-Dot Reveal — fine motor + number order: slide from dot to dot to reveal a picture. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.dots = {
  title:{en:"Dot-to-Dot",ru:"По точкам"}, skill:{en:"Fine motor",ru:"Мелкая моторика"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Start at 1. Slide your finger to 2, then 3… Each dot lights up when you reach it.",ru:"Начни с 1. Веди пальцем к 2, потом к 3… Точка загорается, когда ты до неё дошёл."},
  why:{en:"Moving with purpose from one small target to the next builds pencil control and number order — calmly, at the child's pace.",ru:"Движение от одной маленькой цели к другой развивает контроль карандаша и порядок чисел — спокойно, в темпе ребёнка."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M60 8 L72 34 L100 36 L78 54 L86 82 L60 66" fill="none" stroke="#C98E70" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'+[[60,8],[72,34],[100,36],[78,54],[86,82],[60,66],[34,82],[42,54],[20,36],[48,34]].map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="'+(i<6?'#A96C51':'#CDBFA8')+'"/>';}).join("")+'</svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, round = 0, NPIC = api.pick([2,3,3]), HIT = api.pick([32,26,18]), svg, next = 0, pressed = false, pts, lines, prev;
    function starPts(){ var o=[]; for(var i=0;i<10;i++){ var a=-Math.PI/2 + i*Math.PI/5, r=i%2?62:150; o.push({x:300+Math.cos(a)*r, y:192+Math.sin(a)*r}); } return o; }
    var SHAPES = [
      { name:{en:"a star",ru:"звезда"}, fill:"#E4CC8F", pts:starPts(), extra:'' },
      { name:{en:"a little house",ru:"домик"}, fill:"#A3B59C", pts:[{x:180,y:320},{x:180,y:190},{x:140,y:190},{x:300,y:60},{x:460,y:190},{x:420,y:190},{x:420,y:320}],
        extra:'<rect x="270" y="236" width="60" height="84" rx="26" fill="#FBF7EF"/><rect x="200" y="210" width="44" height="40" rx="6" fill="#D8E1E7"/><rect x="356" y="210" width="44" height="40" rx="6" fill="#D8E1E7"/>' },
      { name:{en:"a calm fish",ru:"спокойная рыбка"}, fill:"#93A9BA", pts:[{x:110,y:190},{x:190,y:118},{x:320,y:104},{x:420,y:170},{x:520,y:104},{x:500,y:190},{x:520,y:276},{x:420,y:210},{x:320,y:276},{x:190,y:262}],
        extra:'<circle cx="186" cy="176" r="12" fill="#FBF7EF"/><circle cx="188" cy="176" r="6" fill="#3B3632"/><path d="M260 150 q30 40 0 80 M300 140 q30 50 0 100" stroke="#D8E1E7" stroke-width="5" fill="none" stroke-linecap="round"/>' }
    ];
    function build(){
      var S = SHAPES[round]; pts = S.pts; next = 0;
      stage.innerHTML = '<div class="lvl-tag">'+BF.L("Picture ","Картинка ")+(round+1)+' / '+NPIC+'</div><svg class="g-svg" viewBox="0 0 600 380" aria-label="Dot to dot">'+
        '<path id="dFill" d="M'+pts.map(function(p){return p.x+" "+p.y;}).join(" L")+'Z" fill="'+S.fill+'" opacity="0"/><g id="dExtra" opacity="0">'+S.extra+'</g>'+
        '<g id="dLines"></g><line id="dPrev" stroke="#C98E70" stroke-width="4" stroke-dasharray="4 8" stroke-linecap="round" opacity="0"/>'+
        '<g id="dDots">'+pts.map(function(p,i){ var lx = p.x + (p.x>=300?22:-22), ly = p.y - 14; return '<g class="ddot" data-i="'+i+'"><circle class="halo" cx="'+p.x+'" cy="'+p.y+'" r="22"/><circle cx="'+p.x+'" cy="'+p.y+'" r="9"/><text x="'+lx+'" y="'+ly+'" text-anchor="middle">'+(i+1)+'</text></g>'; }).join("")+'</g></svg>';
      svg = stage.querySelector("svg"); lines = stage.querySelector("#dLines"); prev = stage.querySelector("#dPrev");
      mark();
    }
    function mark(){ stage.querySelectorAll(".ddot").forEach(function(g){ var i=+g.getAttribute("data-i"); g.classList.toggle("done", i<next); g.classList.toggle("next", i===next); }); }
    function hit(pt){
      var p = pts[next]; if(!p) return;
      if(U.dist(pt, p) < HIT){
        if(next>0){ var a = pts[next-1]; lines.insertAdjacentHTML("beforeend", '<line x1="'+a.x+'" y1="'+a.y+'" x2="'+p.x+'" y2="'+p.y+'" stroke="#A96C51" stroke-width="5" stroke-linecap="round" class="dline"/>'); }
        next++; mark(); BF.sound.pop();
        if(next >= pts.length){ done(); }
        else if(next>1) api.say(BF.L("Now ","Теперь ")+(next+1)+"…");
      }
    }
    function done(){
      pressed = false; prev.setAttribute("opacity","0");
      var a = pts[pts.length-1], b = pts[0];
      lines.insertAdjacentHTML("beforeend", '<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="#A96C51" stroke-width="5" stroke-linecap="round" class="dline"/>');
      stage.querySelector("#dFill").classList.add("show"); stage.querySelector("#dExtra").classList.add("show");
      BF.sound.star(); api.say(BF.L("It's "+SHAPES[round].name.en+"!","Это "+SHAPES[round].name.ru+"!"));
      if(round < NPIC-1){ round++; setTimeout(build, 1400); }
      else setTimeout(function(){ api.win(3, BF.L("All pictures revealed!","Все картинки открыты!")); }, 900);
    }
    stage.addEventListener("pointerdown", function(e){ if(!svg) return; pressed = true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} var pt = U.svgPoint(svg, e); hit(pt); });
    stage.addEventListener("pointermove", function(e){
      if(!svg || !pressed) return; var pt = U.svgPoint(svg, e);
      if(next>0 && next<pts.length){ var a = pts[next-1]; prev.setAttribute("x1",a.x); prev.setAttribute("y1",a.y); prev.setAttribute("x2",pt.x); prev.setAttribute("y2",pt.y); prev.setAttribute("opacity","1"); }
      hit(pt);
    });
    function up(){ pressed = false; if(prev) prev.setAttribute("opacity","0"); }
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    build();
    return function(){};
  }
};
