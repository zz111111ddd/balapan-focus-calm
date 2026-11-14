/* Little to Big — line up nesting dolls by size. Harder levels: more dolls, closer sizes, and a reversed rule. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.sizes = {
  title:{en:"Little to Big",ru:"От маленького к большому"}, skill:{en:"Comparing & order",ru:"Сравнение и порядок"}, motor:true, time:{en:"1–2 min",ru:"1–2 мин"},
  howto:{en:"Drag the dolls onto the shelf from the smallest to the biggest. Watch for a rule change!",ru:"Перетащи матрёшек на полку от самой маленькой к самой большой. Следи — правило может поменяться!"},
  why:{en:"Comparing sizes and keeping an order in mind builds early math thinking and step-by-step planning.",ru:"Сравнение размеров и удержание порядка развивают математическое мышление и пошаговое планирование."},
  art:function(){ function doll(x, s, c){ return '<g transform="translate('+x+' '+(84-60*s)+') scale('+s+')"><ellipse cx="14" cy="40" rx="14" ry="20" fill="'+c+'"/><circle cx="14" cy="14" r="11" fill="'+c+'"/><circle cx="14" cy="15" r="7" fill="#F4E4D4"/></g>'; } return '<svg viewBox="0 0 120 90">'+doll(10,0.5,"#93A9BA")+doll(32,0.75,"#A3B59C")+doll(64,1,"#C98E70")+'<rect x="4" y="84" width="112" height="5" rx="2" fill="#B9A48A"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, COLS = ["#93A9BA","#A3B59C","#C98E70","#E4CC8F","#D9B5A7","#8B6F64"];
    var ROUNDS = api.pick([[{n:3,gap:0.28,rev:false}],[{n:4,gap:0.18,rev:false},{n:5,gap:0.15,rev:false}],[{n:5,gap:0.12,rev:false},{n:6,gap:0.09,rev:true}]]);
    var r = 0, mistakes = 0, need = 0, sizes;
    function doll(s, c){ return '<svg viewBox="0 0 60 100" style="height:'+Math.round(120*s)+'px"><ellipse cx="30" cy="70" rx="26" ry="29" fill="'+c+'"/><path d="M8 66 q22 12 44 0" stroke="#FBF7EF" stroke-width="3" fill="none" opacity=".7"/><circle cx="30" cy="30" r="21" fill="'+c+'"/><circle cx="30" cy="32" r="14" fill="#F4E4D4"/><circle cx="25" cy="31" r="1.8" fill="#3B3632"/><circle cx="35" cy="31" r="1.8" fill="#3B3632"/><path d="M26 37 q4 3 8 0" stroke="#A96C51" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="30" cy="70" r="6" fill="#FBF7EF" opacity=".8"/></svg>'; }
    function build(){
      var R = ROUNDS[r]; need = 0;
      sizes = []; for(var i=0;i<R.n;i++) sizes.push(1 - (R.n-1-i)*R.gap);
      if(R.rev) sizes.reverse();
      var items = sizes.map(function(s, i){ return {s:s, k:i, c:COLS[i%COLS.length]}; });
      U.shuffle(items);
      stage.innerHTML = '<div class="lvl-tag">'+(R.rev?BF.L("New rule: biggest to smallest!","Новое правило: от большой к маленькой!"):BF.L("Smallest to biggest","От маленькой к большой"))+'</div><div class="sz"><div class="sz-shelf" id="szS">'+sizes.map(function(_, i){ return '<div class="sz-slot" data-i="'+i+'"><small>'+(i+1)+'</small></div>'; }).join("")+'</div><div class="sz-tray">'+items.map(function(it){ return '<div class="sz-doll" data-k="'+it.k+'">'+doll(it.s, it.c)+'</div>'; }).join("")+'</div></div>';
      if(R.rev) api.say(BF.L("Rule change! Now the biggest goes first.","Правило поменялось! Теперь первой идёт самая большая."));
      stage.querySelectorAll(".sz-doll").forEach(drag);
    }
    function shelfHit(x, y){ var r = stage.querySelector("#szS").getBoundingClientRect(); return x>=r.left-20 && x<=r.right+20 && y>=r.top-40 && y<=r.bottom+20; }
    function drag(d){
      var sx, sy, on = false;
      d.addEventListener("pointerdown", function(e){ if(d.classList.contains("set")) return; e.preventDefault(); on = true; d.setPointerCapture(e.pointerId); sx = e.clientX; sy = e.clientY; d.classList.add("lift"); });
      d.addEventListener("pointermove", function(e){ if(on) d.style.transform = "translate("+(e.clientX-sx)+"px,"+(e.clientY-sy)+"px)"; });
      function end(e){ if(!on) return; on = false; d.classList.remove("lift"); d.style.transform = "";
        if(!shelfHit(e.clientX, e.clientY)) return;
        if(+d.getAttribute("data-k") === need){
          stage.querySelector('.sz-slot[data-i="'+need+'"]').appendChild(d); d.classList.add("set"); need++; BF.sound.pop();
          if(need >= sizes.length){ BF.sound.star();
            if(r < ROUNDS.length-1){ r++; api.say(BF.L("A perfect line!","Ровный ряд!")); setTimeout(build, 900); }
            else api.win(mistakes<=1?3:mistakes<=3?2:1, BF.L("Every doll in order!","Все матрёшки по порядку!"));
          }
        } else { mistakes++; BF.sound.soft(); d.classList.add("nope"); setTimeout(function(){ d.classList.remove("nope"); }, 400);
          api.say(ROUNDS[r].rev ? BF.L("Find the biggest one that's left.","Найди самую большую из оставшихся.") : BF.L("Find the smallest one that's left.","Найди самую маленькую из оставшихся.")); }
      }
      d.addEventListener("pointerup", end); d.addEventListener("pointercancel", end);
    }
    build();
    return function(){};
  }
};
