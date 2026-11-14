/* Coloring — tap a color, then tap a part of the picture to fill it. Easy: free coloring.
   Medium/Hard: color by number with a legend. Eraser, undo, and a gallery that keeps finished pictures. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.COLOR_PAL = [
  {c:"#A9C3D6", n:{en:"sky blue",ru:"голубой"}}, {c:"#A9C29B", n:{en:"sage green",ru:"зелёный"}}, {c:"#E8CF8F", n:{en:"butter yellow",ru:"жёлтый"}},
  {c:"#D79A7E", n:{en:"clay",ru:"терракотовый"}}, {c:"#E2B3B5", n:{en:"rose",ru:"розовый"}}, {c:"#B8AACB", n:{en:"lavender",ru:"лавандовый"}},
  {c:"#A27C62", n:{en:"brown",ru:"коричневый"}}, {c:"#EFE3CC", n:{en:"oat",ru:"бежевый"}}
];
/* Each region: [id, svg element, legend color index, label x, label y] — drawn in order (background first). */
BF.COLOR_PICS = {
  house:{n:{en:"House",ru:"Домик"}, r:[
    ["sky",'<rect x="0" y="0" width="600" height="300"/>',0,60,40],["grass",'<rect x="0" y="300" width="600" height="80"/>',1,60,345],
    ["sun",'<circle cx="510" cy="70" r="38"/>',2,510,76],["wall",'<rect x="200" y="180" width="200" height="140"/>',3,370,300],
    ["roof",'<polygon points="178,182 300,88 422,182"/>',6,300,160],["door",'<rect x="280" y="236" width="46" height="84" rx="6"/>',4,303,285],
    ["win",'<rect x="222" y="204" width="42" height="38" rx="4"/>',0,243,228],["bush",'<ellipse cx="140" cy="305" rx="55" ry="32"/>',1,140,312]]},
  fish:{n:{en:"Fish",ru:"Рыбка"}, r:[
    ["sea",'<rect x="0" y="0" width="600" height="320"/>',0,50,40],["sand",'<path d="M0 320 Q150 300 300 318 T600 312 V380 H0Z"/>',7,80,355],
    ["body",'<path d="M150 180 C210 100 360 100 420 180 C360 260 210 260 150 180Z"/>',3,285,200],["tail",'<path d="M418 180 L488 128 L488 232Z"/>',2,462,186],
    ["fin",'<path d="M260 118 Q300 70 340 116Z"/>',2,300,106],["weed",'<path d="M90 320 C60 260 120 230 90 170 C130 220 110 270 120 320Z"/>',1,98,270],
    ["eye",'<circle cx="205" cy="168" r="14"/>',7,205,173],["shell",'<path d="M480 330 A30 30 0 0 1 540 330Z"/>',4,510,324]]},
  rocket:{n:{en:"Rocket",ru:"Ракета"}, r:[
    ["space",'<rect x="0" y="0" width="600" height="380"/>',5,50,40],["planet",'<circle cx="490" cy="300" r="56"/>',1,490,306],
    ["body",'<path d="M300 50 C350 100 362 180 352 280 H248 C238 180 250 100 300 50Z"/>',7,300,230],["nose",'<path d="M300 50 C330 80 342 110 346 130 H254 C258 110 270 80 300 50Z"/>',3,300,110],
    ["window",'<circle cx="300" cy="175" r="24"/>',0,300,181],["finL",'<path d="M250 220 L205 300 L250 288Z"/>',3,232,280],["finR",'<path d="M350 220 L395 300 L350 288Z"/>',3,368,280],
    ["flame",'<path d="M262 282 Q300 360 338 282Z"/>',2,300,305],["moon",'<circle cx="110" cy="90" r="30"/>',2,110,96]]},
  flower:{n:{en:"Flower",ru:"Цветок"}, r:[
    ["bg",'<rect x="0" y="0" width="600" height="380"/>',7,40,40],["pot",'<path d="M240 290 H360 L345 370 H255Z"/>',3,300,335],
    ["stem",'<rect x="294" y="160" width="12" height="132"/>',1,300,250],["leafL",'<path d="M296 250 C250 250 230 220 220 200 C260 200 290 220 296 250Z"/>',1,250,226],
    ["leafR",'<path d="M304 230 C350 230 370 200 380 180 C340 180 310 200 304 230Z"/>',1,364,197],
    ["p1",'<circle cx="300" cy="90" r="34"/>',4,300,74],["p2",'<circle cx="352" cy="128" r="34"/>',5,368,128],["p3",'<circle cx="248" cy="128" r="34"/>',5,232,128],
    ["p4",'<circle cx="270" cy="182" r="30"/>',4,256,192],["p5",'<circle cx="330" cy="182" r="30"/>',4,344,192],["mid",'<circle cx="300" cy="138" r="26"/>',2,300,144]]}
};
BF.colorThumb = function(g, w){
  var P = BF.COLOR_PICS[g.pic]; if(!P) return "";
  return '<svg viewBox="0 0 600 380" width="'+(w||120)+'" class="cl-thumb" role="img" aria-label="'+BF.ui.esc(BF.ui.T(P.n))+'">'+P.r.map(function(r){ return r[1].replace(/^<(\w+)/, '<$1 fill="'+(g.fills[r[0]]||"#FBF7EF")+'" stroke="#5b4a3e" stroke-width="3" stroke-linejoin="round"'); }).join("")+'</svg>';
};
BF.games.color = {
  title:{en:"Coloring",ru:"Раскраска"}, skill:{en:"Fine motor & attention",ru:"Моторика и внимание"}, motor:true, cat:"motor", time:{en:"2–4 min",ru:"2–4 мин"},
  howto:{en:"Pick a color, then tap a part of the picture. Harder levels: match the numbers to the color legend.",ru:"Выбери цвет и нажми на часть картинки. На сложных уровнях подбирай цвет по номеру из легенды."},
  why:{en:"Coloring inside shapes and following a legend trains careful looking, planning and a calm, steady hand.",ru:"Раскрашивание по контуру и по легенде тренирует внимательность, планирование и спокойную, твёрдую руку."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="18" y="14" width="64" height="62" rx="6" fill="#FBF7EF" stroke="#8a7562" stroke-width="2"/><circle cx="50" cy="36" r="12" fill="#E8CF8F" stroke="#8a7562" stroke-width="2"/><path d="M26 72 Q44 52 62 72Z" fill="#A9C29B" stroke="#8a7562" stroke-width="2"/><path d="M64 70 L74 60" stroke="#8a7562" stroke-width="2"/><g transform="translate(86 18) rotate(30)"><rect width="10" height="48" rx="3" fill="#D79A7E"/><path d="M0 48 L5 60 L10 48Z" fill="#EFE3CC"/></g></svg>'; },
  mount:function(stage, api){
    var T = BF.ui.T, esc = BF.ui.esc, byNum = api.lv > 0;
    var pic = api.pick([["house","flower"],["house","fish"],["rocket","flower","fish"]]); pic = pic[Math.floor(Math.random()*pic.length)];
    var P = BF.COLOR_PICS[pic], PAL = BF.COLOR_PAL;
    var used = []; P.r.forEach(function(r){ if(used.indexOf(r[2])<0) used.push(r[2]); }); used.sort();
    var legendNum = {}; used.forEach(function(ci, i){ legendNum[ci] = i+1; });
    var fills = {}, hist = [], cur = byNum ? used[0] : 2, erase = false, mistakes = 0, finished = false;
    var BLANK = "#FBF7EF";
    stage.innerHTML = '<div class="cl-wrap"><div class="cl-pic"><svg class="g-svg cl-svg" viewBox="0 0 600 380" aria-label="'+esc(T(P.n))+'">'+
        P.r.map(function(r){ return r[1].replace(/^<(\w+)/, '<$1 class="cl-r" data-r="'+r[0]+'" fill="'+BLANK+'" stroke="#5b4a3e" stroke-width="3" stroke-linejoin="round"'); }).join("")+
        (byNum ? '<g class="cl-nums" pointer-events="none">'+P.r.map(function(r){ return '<text x="'+r[3]+'" y="'+r[4]+'" data-n="'+r[0]+'" text-anchor="middle" dominant-baseline="middle">'+legendNum[r[2]]+'</text>'; }).join("")+'</g>' : '')+
      '</svg></div><div class="cl-side"><div class="cl-pal" role="group" aria-label="'+BF.L("Colors","Цвета")+'">'+
        (byNum ? used : PAL.map(function(_, i){ return i; })).map(function(ci){ return '<button class="cl-sw" data-ci="'+ci+'" style="--c:'+PAL[ci].c+'" aria-pressed="'+(ci===cur)+'" aria-label="'+esc(T(PAL[ci].n))+'">'+(byNum?'<b>'+legendNum[ci]+'</b>':'')+'</button>'; }).join("")+'</div>'+
        '<div class="cl-tools"><button class="btn small ghost" id="clErase" aria-pressed="false">'+BF.icon("trash",14)+' '+BF.L("Eraser","Ластик")+'</button><button class="btn small ghost" id="clUndo" disabled>'+BF.icon("back",14)+' '+BF.L("Undo","Отменить")+'</button>'+
        (byNum ? '' : '<button class="btn small sage" id="clDone" disabled>'+BF.icon("check",14)+' '+BF.L("Done — save","Готово — сохранить")+'</button>')+'</div>'+
        '<div class="cl-gal"><small>'+BF.L("My gallery","Моя галерея")+'</small><div id="clGal"></div></div></div></div>';
    var svg = stage.querySelector(".cl-svg");
    function gallery(){ var g = (BF.store.s.gallery||[]).slice(-6).reverse(); stage.querySelector("#clGal").innerHTML = g.length ? g.map(function(x){ return BF.colorThumb(x, 74); }).join("") : '<em class="muted">'+BF.L("Finished pictures appear here.","Готовые картинки появятся здесь.")+'</em>'; }
    function setTool(ci, er){ erase = !!er; if(ci!=null) cur = ci; stage.querySelectorAll(".cl-sw").forEach(function(b){ b.setAttribute("aria-pressed", !erase && +b.getAttribute("data-ci")===cur); }); stage.querySelector("#clErase").setAttribute("aria-pressed", erase); }
    function paint(id, col){ var el = svg.querySelector('[data-r="'+id+'"]'); el.setAttribute("fill", col||BLANK); var t = svg.querySelector('[data-n="'+id+'"]'); if(t) t.style.display = col ? "none" : ""; }
    function complete(){ return P.r.every(function(r){ return byNum ? fills[r[0]]===PAL[r[2]].c : !!fills[r[0]]; }); }
    function refresh(){ stage.querySelector("#clUndo").disabled = !hist.length; var d = stage.querySelector("#clDone"); if(d) d.disabled = !complete(); if(byNum && complete() && !finished) finish(); }
    function save(){ BF.store.update(function(s){ s.gallery = s.gallery||[]; s.gallery.push({ id:BF.store.uid(), date:BF.store.today(), pic:pic, fills:JSON.parse(JSON.stringify(fills)) }); if(s.gallery.length>24) s.gallery.shift(); }); gallery(); }
    function finish(){ finished = true; save(); BF.sound.star(); api.win(byNum ? (mistakes<=1?3:mistakes<=4?2:1) : 3, BF.L("Saved to your gallery!","Сохранено в галерею!")); }
    stage.querySelector(".cl-pal").addEventListener("click", function(e){ var b = e.target.closest(".cl-sw"); if(!b) return; setTool(+b.getAttribute("data-ci"), false); BF.sound.pop(); });
    stage.querySelector("#clErase").onclick = function(){ setTool(null, !erase); };
    stage.querySelector("#clUndo").onclick = function(){ var h = hist.pop(); if(!h) return; if(h[1]) fills[h[0]] = h[1]; else delete fills[h[0]]; paint(h[0], h[1]); refresh(); };
    var dn = stage.querySelector("#clDone"); if(dn) dn.onclick = function(){ if(complete() && !finished) finish(); };
    svg.addEventListener("click", function(e){
      var t = e.target.closest && e.target.closest(".cl-r"); if(!t || finished) return;
      var id = t.getAttribute("data-r"), reg = P.r.filter(function(r){ return r[0]===id; })[0], prev = fills[id]||null, col = erase ? null : PAL[cur].c;
      if(byNum && col && col !== PAL[reg[2]].c){ mistakes++; api.say(BF.L("Look at the number — this part needs color ","Посмотри на номер — здесь нужен цвет ")+legendNum[reg[2]]+"."); t.classList.remove("cl-no"); void t.getBBox(); t.classList.add("cl-no"); return; }
      if(prev === col) return;
      hist.push([id, prev]); if(col) fills[id] = col; else delete fills[id]; paint(id, col); BF.sound.pop(); refresh();
      if(!byNum && complete()) api.say(BF.L("All colored! Press “Done — save”.","Всё раскрашено! Нажми «Готово — сохранить»."));
    });
    gallery();
    return function(){};
  }
};
