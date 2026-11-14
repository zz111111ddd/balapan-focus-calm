/* Button Jars — fine motor drag & sort: first by color, then by shape. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.jars = {
  title:{en:"Button Jars",ru:"Баночки с пуговицами"}, skill:{en:"Fine motor",ru:"Мелкая моторика"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Drag each button into the jar that matches its color.",ru:"Перетащите каждую пуговицу в баночку того же цвета."},
  why:{en:"Pinch-and-drag works the small hand muscles, and sorting by one rule, then switching rules, trains flexible attention.",ru:"Перетаскивание тренирует мелкие мышцы руки, а смена правила сортировки — гибкость внимания."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="14" y="34" width="30" height="44" rx="8" fill="#D8E1E7" stroke="#93A9BA" stroke-width="3"/><rect x="48" y="34" width="30" height="44" rx="8" fill="#DCE4D5" stroke="#A3B59C" stroke-width="3"/><rect x="82" y="34" width="30" height="44" rx="8" fill="#F1DED3" stroke="#C98E70" stroke-width="3"/><circle cx="63" cy="16" r="11" fill="#A3B59C"/><circle cx="60" cy="14" r="1.8" fill="#FBF7EF"/><circle cx="66" cy="14" r="1.8" fill="#FBF7EF"/><circle cx="60" cy="19" r="1.8" fill="#FBF7EF"/><circle cx="66" cy="19" r="1.8" fill="#FBF7EF"/><circle cx="28" cy="64" r="7" fill="#93A9BA"/><circle cx="97" cy="66" r="7" fill="#C98E70"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, round = 0, mistakes = 0, left = 0, PER = api.pick([2,3,4]), ROUNDS = api.pick([1,2,2]);
    var COLORS = { sage:"#A3B59C", dusty:"#93A9BA", clay:"#C98E70" };
    var SOFT = { sage:"#DCE4D5", dusty:"#D8E1E7", clay:"#F1DED3" };
    var SHAPE_FILL = ["#E4CC8F","#D9B5A7","#B9A48A"];
    function btnSVG(shape, fill){
      var holes = '<circle cx="-5" cy="-5" r="2.6" fill="#FBF7EF" opacity=".9"/><circle cx="5" cy="-5" r="2.6" fill="#FBF7EF" opacity=".9"/><circle cx="-5" cy="5" r="2.6" fill="#FBF7EF" opacity=".9"/><circle cx="5" cy="5" r="2.6" fill="#FBF7EF" opacity=".9"/>';
      var body = shape==="square" ? '<rect x="-19" y="-19" width="38" height="38" rx="9" fill="'+fill+'"/><rect x="-14" y="-14" width="28" height="28" rx="6" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>'
        : shape==="flower" ? '<path d="M0 -21 C8 -21 9 -9 12 -12 C20 -18 26 -4 15 0 C26 4 20 18 12 12 C9 9 8 21 0 21 C-8 21 -9 9 -12 12 C-20 18 -26 4 -15 0 C-26 -4 -20 -18 -12 -12 C-9 -9 -8 -21 0 -21Z" fill="'+fill+'"/>'
        : '<circle r="20" fill="'+fill+'"/><circle r="15" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>';
      return '<svg viewBox="-24 -24 48 48" width="56" height="56">'+body+holes+'</svg>';
    }
    function shapeIcon(shape){ return btnSVG(shape, "#8E8378").replace('width="56" height="56"','width="34" height="34"'); }
    function build(){
      var byColor = round===0;
      var keys = byColor ? ["sage","dusty","clay"] : ["round","square","flower"];
      api.say(byColor ? BF.L("Drag each button into the jar that matches its color.","Перетащите каждую пуговицу в баночку того же цвета.") : BF.L("New rule! Now sort by SHAPE — color doesn't matter.","Новое правило! Теперь по ФОРМЕ — цвет не важен."));
      stage.innerHTML = '<div class="lvl-tag">'+(byColor?BF.L("Round 1 · by color","Раунд 1 · по цвету"):BF.L("Round 2 · by shape","Раунд 2 · по форме"))+'</div><div class="jar-field" id="jf"></div><div class="jars">'+keys.map(function(k,i){
        var stroke = byColor ? COLORS[k] : "#B9A48A", fill = byColor ? SOFT[k] : "#F1E9DB";
        return '<div class="jar" data-k="'+k+'"><svg viewBox="0 0 120 140" class="jar-svg"><rect x="30" y="4" width="60" height="16" rx="6" fill="'+stroke+'"/><path d="M22 26 h76 q8 0 8 10 v88 q0 12 -12 12 h-68 q-12 0 -12 -12 v-88 q0 -10 8 -10z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="4"/><path d="M30 40 v70" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/></svg>'+(byColor?'':'<span class="jar-label">'+shapeIcon(k)+'</span>')+'<span class="jar-in"></span></div>';
      }).join("")+'</div>';
      var jf = stage.querySelector("#jf"), items = [];
      keys.forEach(function(k){ for(var i=0;i<PER;i++){
        var shape = byColor ? ["round","square","flower"][Math.floor(Math.random()*3)] : k;
        var fill = byColor ? COLORS[k] : SHAPE_FILL[Math.floor(Math.random()*3)];
        items.push({k:k, html:btnSVG(shape, fill)});
      }});
      U.shuffle(items); left = items.length;
      var W = jf.clientWidth || 600, H = jf.clientHeight || 200, cols = Math.max(3, Math.min(9, Math.floor(W/70)));
      items.forEach(function(it, i){
        var b = document.createElement("div"); b.className = "gbtn"; b.setAttribute("data-k", it.k); b.innerHTML = it.html;
        var col = i % cols, row = Math.floor(i / cols), rows = Math.ceil(items.length/cols);
        var x = (col+0.5)*(W/cols) - 28 + U.rand(-8,8), y = (row+0.5)*(H/rows) - 28 + U.rand(-8,8);
        b.style.left = x+"px"; b.style.top = y+"px"; b._home = {x:x, y:y};
        b.style.transform = "rotate("+U.rand(-20,20)+"deg)";
        jf.appendChild(b); drag(b);
      });
    }
    function drag(b){
      var sx=0, sy=0, ox=0, oy=0, on=false;
      b.addEventListener("pointerdown", function(e){ e.preventDefault(); on=true; try{ b.setPointerCapture(e.pointerId); }catch(_){} sx=e.clientX; sy=e.clientY; ox=parseFloat(b.style.left); oy=parseFloat(b.style.top); b.classList.add("lift"); });
      b.addEventListener("pointermove", function(e){ if(!on) return; b.style.left=(ox+e.clientX-sx)+"px"; b.style.top=(oy+e.clientY-sy)+"px";
        var hit = jarAt(e.clientX, e.clientY); stage.querySelectorAll(".jar").forEach(function(j){ j.classList.toggle("hover", j===hit); }); });
      function end(e){ if(!on) return; on=false; b.classList.remove("lift");
        var hit = jarAt(e.clientX, e.clientY); stage.querySelectorAll(".jar").forEach(function(j){ j.classList.remove("hover"); });
        if(hit && hit.getAttribute("data-k")===b.getAttribute("data-k")){
          var inn = hit.querySelector(".jar-in"); b.classList.add("in"); inn.appendChild(b); b.style.left=""; b.style.top=""; b.style.transform="";
          BF.sound.pop(); left--; api.say([BF.L("Clink!","Дзынь!"),BF.L("Into the jar!","В баночку!"),BF.L("Neat sorting.","Аккуратно!")][left%3]);
          if(left===0){ if(round<ROUNDS-1){ round++; setTimeout(build, 700); } else api.win(mistakes<=1?3:mistakes<=4?2:1, mistakes<=1?BF.L("A perfect sorter!","Идеальная сортировка!"):BF.L("All sorted!","Всё разложено!")); }
        } else {
          if(hit){ mistakes++; api.say(round===0 ? BF.L("Hmm, look at the color again.","Хм, посмотри ещё раз на цвет.") : BF.L("Look at the shape — the jar shows it.","Смотри на форму — она нарисована на баночке.")); BF.sound.soft(); b.classList.add("nope"); setTimeout(function(){ b.classList.remove("nope"); }, 400); }
          b.style.left = b._home.x+"px"; b.style.top = b._home.y+"px";
        }
      }
      b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end);
    }
    function jarAt(x,y){ var hit=null; stage.querySelectorAll(".jar").forEach(function(j){ var r=j.getBoundingClientRect(); if(x>=r.left-10&&x<=r.right+10&&y>=r.top-30&&y<=r.bottom) hit=j; }); return hit; }
    build();
    return function(){};
  }
};
