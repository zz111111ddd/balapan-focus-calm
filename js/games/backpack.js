/* Pack the Backpack — routine sequencing: drag only today's items, in the order on the list. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.backpack = {
  title:{en:"Pack the Backpack",ru:"Собери рюкзак"}, skill:{en:"Planning & order",ru:"Планирование и порядок"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Look at the list. Drag the items into the backpack in that order. Toys stay home!",ru:"Посмотри на список. Перетащи вещи в рюкзак по порядку. Игрушки остаются дома!"},
  why:{en:"Following a short visual checklist is exactly how real mornings get easier — one item, then the next.",ru:"Короткий наглядный список — именно так утро становится легче: одна вещь, потом следующая."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M36 30 q0 -18 24 -18 q24 0 24 18" fill="none" stroke="#A96C51" stroke-width="5"/><rect x="28" y="28" width="64" height="56" rx="16" fill="#C98E70"/><rect x="40" y="52" width="40" height="22" rx="8" fill="#A96C51"/><rect x="6" y="20" width="18" height="24" rx="4" fill="#A3B59C"/><circle cx="104" cy="28" r="10" fill="#93A9BA"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, step = 0, mistakes = 0, T = BF.ui.T;
    var NEED = [
      { id:"lunch", n:{en:"Lunchbox",ru:"Ланч-бокс"}, svg:'<svg viewBox="0 0 60 50"><rect x="4" y="12" width="52" height="34" rx="8" fill="#A3B59C"/><rect x="4" y="12" width="52" height="10" rx="5" fill="#6F8A6E"/><path d="M22 12 v-5 h16 v5" fill="none" stroke="#6F8A6E" stroke-width="4" stroke-linecap="round"/></svg>' },
      { id:"water", n:{en:"Water bottle",ru:"Бутылка воды"}, svg:'<svg viewBox="0 0 40 60"><rect x="13" y="2" width="14" height="8" rx="2" fill="#5F7889"/><rect x="8" y="10" width="24" height="46" rx="9" fill="#93A9BA"/><rect x="8" y="26" width="24" height="10" fill="#D8E1E7"/></svg>' },
      { id:"book", n:{en:"Reading book",ru:"Книга для чтения"}, svg:'<svg viewBox="0 0 60 50"><rect x="6" y="6" width="46" height="38" rx="4" fill="#C98E70"/><rect x="12" y="6" width="4" height="38" fill="#A96C51"/><rect x="22" y="14" width="22" height="6" rx="2" fill="#FBF7EF"/></svg>' },
      { id:"pencils", n:{en:"Pencil case",ru:"Пенал"}, svg:'<svg viewBox="0 0 60 40"><rect x="4" y="8" width="52" height="26" rx="12" fill="#E4CC8F"/><path d="M10 14 h40" stroke="#C7A65A" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="14" r="3" fill="#6E655D"/></svg>' },
      { id:"folder", n:{en:"Homework folder",ru:"Папка с домашкой"}, svg:'<svg viewBox="0 0 60 50"><path d="M4 10 h20 l5 5 h27 v31 h-52z" fill="#D9B5A7"/><rect x="4" y="18" width="52" height="28" rx="3" fill="#E9CDBF"/></svg>' }
    ];
    var EXTRA = [
      { id:"car", n:{en:"Toy car",ru:"Машинка"}, svg:'<svg viewBox="0 0 60 40"><path d="M6 26 v-6 l8 -10 h22 l10 10 h8 v6z" fill="#93A9BA"/><circle cx="16" cy="28" r="6" fill="#3B3632"/><circle cx="44" cy="28" r="6" fill="#3B3632"/></svg>' },
      { id:"pad", n:{en:"Game controller",ru:"Джойстик"}, svg:'<svg viewBox="0 0 60 40"><path d="M10 10 h40 q8 0 8 12 q0 12 -8 12 q-6 0 -10 -6 h-20 q-4 6 -10 6 q-8 0 -8 -12 q0 -12 8 -12z" fill="#8B6F64"/><path d="M16 20 h8 M20 16 v8" stroke="#FBF7EF" stroke-width="3" stroke-linecap="round"/><circle cx="42" cy="18" r="2.5" fill="#FBF7EF"/><circle cx="47" cy="23" r="2.5" fill="#FBF7EF"/></svg>' },
      { id:"ball", n:{en:"Ball",ru:"Мяч"}, svg:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="#E4CC8F"/><path d="M5 25 h40 M25 5 q-12 20 0 40 M25 5 q12 20 0 40" stroke="#C7A65A" stroke-width="2.5" fill="none"/></svg>' },
      { id:"teddy", n:{en:"Teddy bear",ru:"Мишка"}, svg:'<svg viewBox="0 0 50 50"><circle cx="14" cy="12" r="7" fill="#B9A48A"/><circle cx="36" cy="12" r="7" fill="#B9A48A"/><circle cx="25" cy="22" r="14" fill="#C9B396"/><circle cx="20" cy="20" r="2" fill="#3B3632"/><circle cx="30" cy="20" r="2" fill="#3B3632"/><ellipse cx="25" cy="27" rx="5" ry="4" fill="#E9DCC5"/><rect x="14" y="34" width="22" height="14" rx="7" fill="#C9B396"/></svg>' },
      { id:"tablet", n:{en:"Tablet",ru:"Планшет"}, svg:'<svg viewBox="0 0 60 44"><rect x="6" y="4" width="48" height="36" rx="6" fill="#5F6B78"/><rect x="11" y="9" width="38" height="26" rx="2" fill="#B7C7D3"/></svg>' }
    ];
    NEED = NEED.slice(0, api.pick([3,5,5])); EXTRA = U.shuffle(EXTRA).slice(0, api.pick([1,3,5]));
    stage.innerHTML = '<div class="bp-wrap"><div class="bp-list paper"><h4>'+BF.L("Today\'s list","Список на сегодня")+'</h4><ol id="bpL">'+NEED.map(function(it,i){ return '<li data-i="'+i+'"><span class="bp-ico">'+it.svg+'</span>'+T(it.n)+'</li>'; }).join("")+'</ol></div>'+
      '<div class="bp-floor" id="bpF"></div><div class="bp-bag" id="bpB"><svg viewBox="0 0 200 220"><path d="M58 70 q0 -50 42 -50 q42 0 42 50" fill="none" stroke="#A96C51" stroke-width="12" stroke-linecap="round"/><rect x="30" y="62" width="140" height="150" rx="34" fill="#C98E70"/><path d="M30 104 q70 -30 140 0" fill="#A96C51"/><rect x="58" y="140" width="84" height="52" rx="16" fill="#A96C51"/><path d="M70 160 h60" stroke="#E4CC8F" stroke-width="4" stroke-linecap="round"/></svg><div class="bp-in" id="bpIn"></div></div></div>';
    var floor = stage.querySelector("#bpF"), bag = stage.querySelector("#bpB");
    var items = U.shuffle(NEED.map(function(x){ return Object.assign({need:true}, x); }).concat(EXTRA.map(function(x){ return Object.assign({need:false}, x); })));
    function highlight(){ stage.querySelectorAll("#bpL li").forEach(function(li){ var i=+li.getAttribute("data-i"); li.className = i<step?"done":i===step?"now":""; }); }
    var W = floor.clientWidth||400, H = floor.clientHeight||260, cols = W > 380 ? 4 : 3;
    items.forEach(function(it, i){
      var d = document.createElement("div"); d.className = "bp-item"; d.innerHTML = it.svg+'<small>'+T(it.n)+'</small>'; d.setAttribute("data-id", it.id);
      var col = i % cols, row = Math.floor(i/cols), rows = Math.ceil(items.length/cols);
      var x = (col+0.5)*(W/cols) - 38 + U.rand(-6,6), y = (row+0.5)*(H/rows) - 34 + U.rand(-6,6);
      d.style.left = x+"px"; d.style.top = y+"px"; d._home = {x:x,y:y}; d._it = it;
      floor.appendChild(d); drag(d);
    });
    function overBag(x,y){ var r = bag.getBoundingClientRect(); return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom; }
    function drag(d){
      var sx, sy, ox, oy, on=false;
      d.addEventListener("pointerdown", function(e){ e.preventDefault(); on=true; try{ d.setPointerCapture(e.pointerId); }catch(_){} sx=e.clientX; sy=e.clientY; ox=parseFloat(d.style.left); oy=parseFloat(d.style.top); d.classList.add("lift"); });
      d.addEventListener("pointermove", function(e){ if(!on) return; d.style.left=(ox+e.clientX-sx)+"px"; d.style.top=(oy+e.clientY-sy)+"px"; bag.classList.toggle("hover", overBag(e.clientX,e.clientY)); });
      function end(e){ if(!on) return; on=false; d.classList.remove("lift"); bag.classList.remove("hover");
        if(overBag(e.clientX, e.clientY)){
          var it = d._it;
          if(!it.need){ mistakes++; api.say(BF.L("The "+it.n.en.toLowerCase()+" stays home today — it'll be waiting after school.","«"+it.n.ru+"» сегодня остаётся дома — подождёт после школы.")); BF.sound.soft(); back(d); return; }
          if(it.id !== NEED[step].id){ mistakes++; api.say(BF.L("Good item! But first: "+NEED[step].n.en.toLowerCase()+". Check the list.","Нужная вещь! Но сначала: «"+NEED[step].n.ru+"». Посмотри в список.")); BF.sound.soft(); back(d); return; }
          d.classList.add("packed"); stage.querySelector("#bpIn").appendChild(d); d.style.left=""; d.style.top="";
          step++; highlight(); BF.sound.pop(); bag.classList.add("gulp"); setTimeout(function(){ bag.classList.remove("gulp"); }, 350);
          if(step >= NEED.length){ api.win(mistakes<=1?3:mistakes<=3?2:1, BF.L("Backpack ready — out the door!","Рюкзак собран — можно выходить!")); }
          else api.say(BF.L("Packed! Next on the list: "+NEED[step].n.en.toLowerCase()+".","Уложено! Дальше по списку: «"+NEED[step].n.ru+"»."));
        } else back(d);
      }
      d.addEventListener("pointerup", end); d.addEventListener("pointercancel", end);
    }
    function back(d){ d.classList.add("nope"); d.style.left=d._home.x+"px"; d.style.top=d._home.y+"px"; setTimeout(function(){ d.classList.remove("nope"); }, 400); }
    highlight();
    return function(){};
  }
};
