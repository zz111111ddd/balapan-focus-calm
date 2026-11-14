/* Number Hunt (Schulte table) — find the numbers in order 1…N on a mixed-up grid. Calm: no countdown. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.schulte = {
  title:{en:"Number Hunt",ru:"Найди числа по порядку"}, skill:{en:"Focus & visual search",ru:"Концентрация и поиск"}, cat:"attention", time:{en:"1–3 min",ru:"1–3 мин"},
  howto:{en:"Find and tap the numbers in order: 1, 2, 3… Keep your eyes in the middle and look around calmly.",ru:"Находи и нажимай числа по порядку: 1, 2, 3… Смотри в центр и спокойно оглядывай таблицу."},
  why:{en:"Schulte-style tables train steady focus and wide, calm visual search — useful for reading and copying from the board.",ru:"Таблицы в стиле Шульте тренируют устойчивое внимание и широкий спокойный обзор — это помогает читать и списывать с доски."},
  art:function(){ var n=[7,2,9,4,1,6,3,8,5]; return '<svg viewBox="0 0 120 90"><rect x="24" y="6" width="72" height="78" rx="8" fill="#FBF7EF" stroke="#D6C09C" stroke-width="2"/>'+n.map(function(v,i){ var x=38+(i%3)*22, y=26+Math.floor(i/3)*24; return '<text x="'+x+'" y="'+y+'" font-size="14" font-weight="800" text-anchor="middle" fill="'+(v===1?'#B27A62':'#6b5a4c')+'">'+v+'</text>'; }).join("")+'<circle cx="82" cy="50" r="10" fill="none" stroke="#B27A62" stroke-width="2.5"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, n = api.pick([3,4,5]), N = n*n, next = 1, miss = 0, t0 = Date.now(), timer;
    var nums = U.shuffle(Array.apply(null,{length:N}).map(function(_,i){ return i+1; }));
    var tints = ["#FBF7EF","#F3EADB","#EEF2E8","#F5E8E3"];
    stage.innerHTML = '<div class="sc-wrap"><div class="sc-top"><span class="lvl-tag sc-next">'+BF.L("Find","Найди")+' <b id="scN">1</b></span><span class="sc-time" id="scT">0:00</span></div>'+
      '<div class="sc-grid" style="--n:'+n+'">'+nums.map(function(v){ return '<button class="sc-cell" data-v="'+v+'" style="background:'+(api.lv===2?tints[(v*7)%4]:tints[0])+'">'+v+'</button>'; }).join("")+'</div></div>';
    function tick(){ var s = Math.floor((Date.now()-t0)/1000); var el = stage.querySelector("#scT"); if(el) el.textContent = Math.floor(s/60)+":"+("0"+s%60).slice(-2); }
    timer = setInterval(tick, 500);
    stage.querySelector(".sc-grid").addEventListener("click", function(e){
      var b = e.target.closest(".sc-cell"); if(!b || b.classList.contains("ok")) return;
      if(+b.getAttribute("data-v") === next){
        b.classList.add("ok"); BF.sound.pop(); next++;
        if(next > N){ clearInterval(timer); tick(); var s = Math.round((Date.now()-t0)/1000); api.win(miss<=1?3:miss<=4?2:1, BF.L("All "+N+" numbers in "+s+" s!","Все "+N+" чисел за "+s+" с!")); return; }
        stage.querySelector("#scN").textContent = next;
      } else { miss++; b.classList.remove("no"); void b.offsetWidth; b.classList.add("no"); api.say(BF.L("Not this one — look for ","Не это — ищи ")+next+"."); }
    });
    return function(){ clearInterval(timer); };
  }
};
