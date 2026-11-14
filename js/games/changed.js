/* What Changed? — look at the shelf, it hides behind a curtain, then find the one thing that changed. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.changed = {
  title:{en:"What Changed?",ru:"Что изменилось?"}, skill:{en:"Attention & memory",ru:"Внимание и память"}, cat:"attention", time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Look at the shelf and remember the things. The curtain closes… then tap the thing that changed.",ru:"Рассмотри полку и запомни предметы. Шторка закроется… потом нажми на то, что изменилось."},
  why:{en:"Noticing a change needs a clear picture in memory and calm, careful comparison — attention span in action.",ru:"Чтобы заметить перемену, нужна чёткая картинка в памяти и спокойное сравнение — это и есть объём внимания."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="10" y="58" width="100" height="6" rx="3" fill="#C9A882"/><circle cx="28" cy="46" r="10" fill="#D79A7E"/><rect x="48" y="34" width="18" height="22" rx="3" fill="#A9C3D6"/><path d="M84 56 L92 34 L100 56Z" fill="#A9C29B"/><text x="93" y="28" font-size="14" font-weight="800" fill="#B27A62" text-anchor="middle">?</text></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, K = api.pick([4,6,8]), LOOK = api.pick([5000,5000,6000]), ROUNDS = 3, MODE = api.pick(["swap","swap","mix"]);
    var ICONS = ["star","heart","leaf","moon","sun","home","book","pencil","tree","puzzle","clock","bed","food","smile","school","target"];
    var COLS = ["#D79A7E","#A9C29B","#A9C3D6","#E8CF8F","#B8AACB","#E2B3B5","#A27C62"];
    var round = 0, good = 0, items, changedIdx, timers = [], busy = true;
    function later(f, t){ timers.push(setTimeout(f, t)); }
    function itemHTML(it, i){ return '<button class="wc-item" data-i="'+i+'" style="--c:'+it.c+'" aria-label="'+it.k+'">'+BF.icon(it.k, 34)+'</button>'; }
    function shelf(list){ return '<div class="wc-shelf" style="--k:'+Math.min(K,4)+'">'+list.map(itemHTML).join("")+'</div>'; }
    function start(){
      var pool = U.shuffle(ICONS.slice()); items = pool.slice(0, K).map(function(k, i){ return {k:k, c:COLS[(i*3+round)%COLS.length]}; });
      busy = true;
      stage.innerHTML = '<div class="wc-wrap"><div class="lvl-tag">'+BF.L("Round ","Раунд ")+(round+1)+' / '+ROUNDS+'</div><div class="wc-room" id="wcR">'+shelf(items)+'<div class="wc-curtain" id="wcC" hidden></div></div>'+
        '<button class="btn small ghost wc-ready" id="wcGo">'+BF.L("I remember — close","Всё, закрываем шторку")+'</button></div>';
      api.say(BF.L("Look carefully and remember…","Смотри внимательно и запоминай…"));
      stage.querySelector("#wcGo").onclick = hide;
      later(hide, LOOK);
    }
    function hide(){
      if(!busy || stage.querySelector("#wcC").hidden === false) return;
      timers.forEach(clearTimeout); timers = [];
      var go = stage.querySelector("#wcGo"); if(go) go.remove();
      stage.querySelector("#wcC").hidden = false; api.say(BF.L("The curtain is closed…","Шторка закрыта…"));
      changedIdx = Math.floor(Math.random()*K);
      var kind = MODE==="mix" && Math.random()<.5 ? "color" : "swap", now = items.slice();
      if(kind === "color"){ var it = now[changedIdx], c2 = COLS.filter(function(c){ return c!==it.c; })[Math.floor(Math.random()*6)]; now[changedIdx] = {k:it.k, c:c2}; }
      else { var spare = ICONS.filter(function(k){ return !items.some(function(x){ return x.k===k; }); }); now[changedIdx] = {k:spare[Math.floor(Math.random()*spare.length)], c:items[changedIdx].c}; }
      later(function(){ stage.querySelector("#wcR").innerHTML = shelf(now); busy = false; api.say(kind==="color" ? BF.L("Something changed color or shape. What is it?","Что-то поменяло цвет или форму. Что это?") : BF.L("One thing is different. Which one?","Один предмет другой. Какой?")); }, 1500);
    }
    stage.addEventListener("click", function(e){
      var b = e.target.closest && e.target.closest(".wc-item"); if(!b) return;
      if(busy){ if(stage.querySelector("#wcGo")) api.say(BF.L("Remember them first — the curtain will close.","Сначала запомни — шторка скоро закроется.")); return; }
      busy = true; var i = +b.getAttribute("data-i");
      stage.querySelector('.wc-item[data-i="'+changedIdx+'"]').classList.add("is");
      if(i === changedIdx){ good++; BF.sound.star(); api.say(BF.L("Yes, that one changed!","Да, именно он изменился!")); } else { b.classList.add("miss"); api.say(BF.L("It was this one — next round!","Изменился вот этот — следующий раунд!")); }
      round++; later(function(){ if(round < ROUNDS) start(); else api.win(good===3?3:good===2?2:1, BF.L("Found ","Найдено: ")+good+" / "+ROUNDS); }, 1500);
    });
    start();
    return function(){ timers.forEach(clearTimeout); };
  }
};
