/* Hero Memory — working memory: find the pairs; one pair is your own hero. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.memory = {
  title:{en:"Hero Memory",ru:"Память героя"}, skill:{en:"Working memory",ru:"Рабочая память"}, motor:false, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Flip two cards at a time and find the matching pairs. Can you find your hero twice?",ru:"Открывай по две карточки и ищи пары. Найдёшь своего героя дважды?"},
  why:{en:"Holding where things are in mind is working memory — the same skill used to remember the next step of a routine.",ru:"Помнить, где что лежит, — это рабочая память. Тот же навык помогает помнить следующий шаг утренней рутины."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="14" y="14" width="40" height="56" rx="8" fill="#93A9BA" transform="rotate(-6 34 42)"/><rect x="64" y="16" width="40" height="56" rx="8" fill="#FBF7EF" stroke="#D6C09C" stroke-width="3" transform="rotate(5 84 44)"/><path d="M84 30 l4 8 9 1 -6 6 2 9 -9 -4 -8 4 2 -9 -6 -6 9 -1z" fill="#E4CC8F" transform="rotate(5 84 44)"/><circle cx="28" cy="36" r="4" fill="#D8E1E7"/><circle cx="40" cy="48" r="4" fill="#D8E1E7"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, first = null, lock = false, moves = 0, found = 0;
    var FACES = {
      hero: BF.avatar.svg(BF.store.s.avatar,{size:80, headOnly:true}),
      chick: BF.avatar.chick(80),
      star: '<svg viewBox="0 0 40 40" width="70" height="70"><path d="M20 3.5l4.6 10 10.9 1.3-8.1 7.4 2.2 10.8L20 27.6l-9.6 5.4 2.2-10.8-8.1-7.4 10.9-1.3z" fill="#E4CC8F" stroke="#C7A65A" stroke-width="1.5" stroke-linejoin="round"/></svg>',
      moon: '<svg viewBox="0 0 40 40" width="66" height="66"><path d="M28 28 A13 13 0 1 1 18 6 A10 10 0 0 0 28 28z" fill="#B7C7D3"/><circle cx="14" cy="18" r="2" fill="#93A9BA"/><circle cx="18" cy="26" r="1.5" fill="#93A9BA"/></svg>',
      leaf: '<svg viewBox="0 0 40 40" width="66" height="66"><path d="M8 32 C8 16 18 7 33 6 C32 22 23 32 8 32z" fill="#A3B59C"/><path d="M8 32 C14 24 20 18 28 12" stroke="#6F8A6E" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
      cloud: '<svg viewBox="0 0 40 40" width="70" height="70"><path d="M9 28 q-6 0 -6 -6 q0 -6 7 -6 q1 -7 9 -7 q7 0 9 7 q8 0 8 6 q0 6 -7 6z" fill="#FBF7EF" stroke="#C9B9A0" stroke-width="2"/></svg>',
      sun: '<svg viewBox="0 0 40 40" width="66" height="66"><circle cx="20" cy="20" r="8" fill="#E4CC8F"/><g stroke="#C7A65A" stroke-width="2.5" stroke-linecap="round"><path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.5 8.5l3.5 3.5M28 28l3.5 3.5M8.5 31.5l3.5-3.5M28 12l3.5-3.5"/></g></svg>',
      heart: '<svg viewBox="0 0 40 40" width="64" height="64"><path d="M20 33 C6 24 4 16 8 11 C12 6 18 8 20 13 C22 8 28 6 32 11 C36 16 34 24 20 33Z" fill="#D9B5A7" stroke="#B98166" stroke-width="2"/></svg>'
    };
    var PAIRS = api.pick([4,6,8]);
    var pool = Object.keys(FACES).slice(0, PAIRS), keys = U.shuffle(pool.concat(pool));
    stage.innerHTML = '<div class="mem-hud">'+BF.L("Moves: ","Ходы: ")+'<b id="mm">0</b> · '+BF.L("Pairs: ","Пары: ")+'<b id="mp">0</b>/'+PAIRS+'</div><div class="mem-grid mem-'+PAIRS+'">'+keys.map(function(k,i){
      return '<button class="mcard" data-k="'+k+'" aria-label="'+BF.L("Card ","Карточка ")+(i+1)+'"><span class="mc-in"><span class="mc-back"><svg viewBox="0 0 60 60" width="44" height="44"><circle cx="30" cy="30" r="18" fill="none" stroke="#FBF7EF" stroke-width="2" stroke-dasharray="3 5"/><path d="M30 20 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#FBF7EF" opacity=".75"/></svg></span><span class="mc-front">'+FACES[k]+'</span></span></button>';
    }).join("")+'</div>';
    stage.querySelectorAll(".mcard").forEach(function(c){
      c.addEventListener("click", function(){
        if(lock || c.classList.contains("up") || c.classList.contains("got")) return;
        c.classList.add("up"); BF.sound.soft();
        if(!first){ first = c; return; }
        moves++; stage.querySelector("#mm").textContent = moves;
        if(first.getAttribute("data-k") === c.getAttribute("data-k")){
          first.classList.add("got"); c.classList.add("got"); found++; stage.querySelector("#mp").textContent = found; BF.sound.pop();
          api.say(c.getAttribute("data-k")==="hero" ? BF.L("You found yourself! Hero pair!","Ты нашёл себя! Пара героя!") : BF.L("A pair! Great remembering.","Пара! Отличная память."));
          first = null;
          if(found === PAIRS) api.win(moves<=PAIRS*1.7?3:moves<=PAIRS*2.5?2:1, BF.L(moves+" moves — sharp memory!","Ходов: "+moves+" — отличная память!"));
        } else {
          lock = true; var a = first; first = null;
          setTimeout(function(){ a.classList.remove("up"); c.classList.remove("up"); lock = false; }, 850);
        }
      });
    });
    return function(){};
  }
};
