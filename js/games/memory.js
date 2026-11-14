/* Hero Memory — working memory: find the pairs; one pair is your own hero. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.memory = {
  title:"Hero Memory", skill:"Working memory", motor:false, time:"2 min",
  howto:"Flip two cards at a time and find the matching pairs. Can you find your hero twice?",
  why:"Holding where things are in mind is working memory — the same skill used to remember the next step of a routine.",
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="14" y="14" width="40" height="56" rx="8" fill="#93A9BA" transform="rotate(-6 34 42)"/><rect x="64" y="16" width="40" height="56" rx="8" fill="#FBF7EF" stroke="#D6C09C" stroke-width="3" transform="rotate(5 84 44)"/><path d="M84 30 l4 8 9 1 -6 6 2 9 -9 -4 -8 4 2 -9 -6 -6 9 -1z" fill="#E4CC8F" transform="rotate(5 84 44)"/><circle cx="28" cy="36" r="4" fill="#D8E1E7"/><circle cx="40" cy="48" r="4" fill="#D8E1E7"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, first = null, lock = false, moves = 0, found = 0;
    var FACES = {
      hero: BF.avatar.svg(BF.store.s.avatar,{size:80, headOnly:true}),
      chick: BF.avatar.chick(80),
      star: '<svg viewBox="0 0 40 40" width="70" height="70"><path d="M20 3.5l4.6 10 10.9 1.3-8.1 7.4 2.2 10.8L20 27.6l-9.6 5.4 2.2-10.8-8.1-7.4 10.9-1.3z" fill="#E4CC8F" stroke="#C7A65A" stroke-width="1.5" stroke-linejoin="round"/></svg>',
      moon: '<svg viewBox="0 0 40 40" width="66" height="66"><path d="M28 28 A13 13 0 1 1 18 6 A10 10 0 0 0 28 28z" fill="#B7C7D3"/><circle cx="14" cy="18" r="2" fill="#93A9BA"/><circle cx="18" cy="26" r="1.5" fill="#93A9BA"/></svg>',
      leaf: '<svg viewBox="0 0 40 40" width="66" height="66"><path d="M8 32 C8 16 18 7 33 6 C32 22 23 32 8 32z" fill="#A3B59C"/><path d="M8 32 C14 24 20 18 28 12" stroke="#6F8A6E" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
      cloud: '<svg viewBox="0 0 40 40" width="70" height="70"><path d="M9 28 q-6 0 -6 -6 q0 -6 7 -6 q1 -7 9 -7 q7 0 9 7 q8 0 8 6 q0 6 -7 6z" fill="#FBF7EF" stroke="#C9B9A0" stroke-width="2"/></svg>'
    };
    var keys = U.shuffle(Object.keys(FACES).concat(Object.keys(FACES)));
    stage.innerHTML = '<div class="mem-hud">Moves: <b id="mm">0</b> · Pairs: <b id="mp">0</b>/6</div><div class="mem-grid">'+keys.map(function(k,i){
      return '<button class="mcard" data-k="'+k+'" aria-label="Card '+(i+1)+'"><span class="mc-in"><span class="mc-back"><svg viewBox="0 0 60 60" width="44" height="44"><circle cx="30" cy="30" r="18" fill="none" stroke="#FBF7EF" stroke-width="2" stroke-dasharray="3 5"/><path d="M30 20 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#FBF7EF" opacity=".75"/></svg></span><span class="mc-front">'+FACES[k]+'</span></span></button>';
    }).join("")+'</div>';
    stage.querySelectorAll(".mcard").forEach(function(c){
      c.addEventListener("click", function(){
        if(lock || c.classList.contains("up") || c.classList.contains("got")) return;
        c.classList.add("up"); BF.sound.soft();
        if(!first){ first = c; return; }
        moves++; stage.querySelector("#mm").textContent = moves;
        if(first.getAttribute("data-k") === c.getAttribute("data-k")){
          first.classList.add("got"); c.classList.add("got"); found++; stage.querySelector("#mp").textContent = found; BF.sound.pop();
          api.say(c.getAttribute("data-k")==="hero" ? "You found yourself! Hero pair!" : "A pair! Great remembering.");
          first = null;
          if(found === 6) api.win(moves<=10?3:moves<=15?2:1, moves+" moves — sharp memory!");
        } else {
          lock = true; var a = first; first = null;
          setTimeout(function(){ a.classList.remove("up"); c.classList.remove("up"); lock = false; }, 850);
        }
      });
    });
    return function(){};
  }
};
