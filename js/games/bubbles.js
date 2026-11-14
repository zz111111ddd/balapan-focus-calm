/* Calm Bubbles — go/no-go attention: pop only the smooth calm bubbles, let the prickly ones float away. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.bubbles = {
  title:{en:"Calm Bubbles",ru:"Спокойные пузыри"}, skill:{en:"Focus & self-control",ru:"Внимание и самоконтроль"}, motor:false, time:{en:"30–60 sec",ru:"30–60 сек"},
  howto:{en:"Tap only the smooth, round calm bubbles. Let the prickly ones float away — don't touch them!",ru:"Нажимай только на гладкие круглые пузыри. Колючие пусть улетают — не трогай их!"},
  why:{en:"Choosing NOT to tap is the hard part. It practices the ‘pause button’ that helps with waiting and impulses.",ru:"Самое трудное — НЕ нажать. Так тренируется «кнопка паузы», которая помогает ждать и сдерживать импульсы."},
  art:function(){ return '<svg viewBox="0 0 120 90"><circle cx="40" cy="50" r="22" fill="#DCE4D5" stroke="#A3B59C" stroke-width="3"/><path d="M30 42 q4 -6 10 -6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M86 18 l4 8 9 -2 -4 8 8 5 -9 3 2 9 -8 -4 -5 8 -3 -9 -9 2 4 -8 -8 -5 9 -3 -2 -9 8 4z" fill="#EBCDBB" stroke="#C98E70" stroke-width="2" stroke-linejoin="round"/><circle cx="92" cy="66" r="12" fill="#D8E1E7" stroke="#93A9BA" stroke-width="3"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, bubbles = [], hits = 0, mistakes = 0, t0 = 0, last = 0, spawnAcc = 0, raf = 0, DUR = api.pick([30000,45000,60000]), PR = api.pick([0.2,0.32,0.42]), SPD = api.pick([0.8,1,1.25]), GOAL = api.pick([[9,5],[14,7],[20,10]]), over = false;
    stage.innerHTML = '<div class="bub-hud"><span>'+BF.L("Calm popped: ","Лопнуло спокойных: ")+'<b id="bh">0</b></span><span class="bub-time"><svg viewBox="0 0 36 36" width="34" height="34"><circle cx="18" cy="18" r="15" fill="none" stroke="#E2D6C3" stroke-width="5"/><circle id="bt" cx="18" cy="18" r="15" fill="none" stroke="#93A9BA" stroke-width="5" stroke-dasharray="94.25" stroke-dashoffset="0" transform="rotate(-90 18 18)" stroke-linecap="round"/></svg></span></div><div class="bub-field" id="bf"></div>';
    var field = stage.querySelector("#bf"), bh = stage.querySelector("#bh"), bt = stage.querySelector("#bt");
    function calmSVG(c, s){ return '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="'+s+'" stroke="'+c+'" stroke-width="3"/><path d="M16 22 q5 -8 13 -8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="23" cy="31" r="2.2" fill="#6E655D"/><circle cx="37" cy="31" r="2.2" fill="#6E655D"/><path d="M25 38 q5 4 10 0" stroke="#6E655D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'; }
    function prickSVG(){ var pts=[], n=14; for(var i=0;i<n*2;i++){ var a=i*Math.PI/n, r=i%2?20:29; pts.push((30+Math.cos(a)*r).toFixed(1)+","+(30+Math.sin(a)*r).toFixed(1)); }
      return '<svg viewBox="0 0 60 60"><polygon points="'+pts.join(" ")+'" fill="#EBCDBB" stroke="#B98166" stroke-width="2.4" stroke-linejoin="round"/><path d="M22 28 l4 2 M38 28 l-4 2" stroke="#6E655D" stroke-width="2" stroke-linecap="round"/><path d="M25 38 h10" stroke="#6E655D" stroke-width="2" stroke-linecap="round"/></svg>'; }
    var CALM = [["#A3B59C","#DCE4D5"],["#93A9BA","#D8E1E7"],["#C7A65A","#F1E6C8"]];
    function spawn(){
      var W = field.clientWidth, H = field.clientHeight, size = U.rand(58, 84), prick = Math.random() < PR;
      var el = document.createElement("button"); el.className = "bub"+(prick?" prick":""); el.setAttribute("aria-label", prick?BF.L("prickly bubble","колючий пузырь"):BF.L("calm bubble","спокойный пузырь"));
      var c = CALM[Math.floor(Math.random()*CALM.length)];
      el.innerHTML = prick ? prickSVG() : calmSVG(c[0], c[1]);
      el.style.width = el.style.height = size+"px";
      var b = { el:el, x:U.rand(8, Math.max(10, W-size-8)), y:H+10, vy:U.rand(42,62) * SPD * (1 + Math.min(0.5,(last-t0)/DUR*0.5)), sway:U.rand(0,6.28), prick:prick, size:size, dead:false };
      el.addEventListener("pointerdown", function(e){ e.preventDefault(); e.stopPropagation(); tap(b); });
      field.appendChild(el); bubbles.push(b);
    }
    function tap(b){
      if(b.dead || over) return;
      if(b.prick){ mistakes++; b.el.classList.add("shake"); api.say(BF.L("That one's prickly — let it float. You've got this.","Этот колючий — пусть летит. У тебя получится.")); BF.sound.soft(); setTimeout(function(){ b.el.classList.remove("shake"); }, 400); return; }
      b.dead = true; hits++; bh.textContent = hits; b.el.classList.add("pop"); BF.sound.pop();
      setTimeout(function(){ b.el.remove(); }, 300);
      if(hits % 5 === 0) api.say([BF.L("Great focus!","Отличное внимание!"),BF.L("So careful!","Очень аккуратно!"),BF.L("Calm and quick!","Спокойно и быстро!")][(hits/5-1)%3]);
    }
    function loop(t){
      if(!t0){ t0 = t; last = t; }
      var dt = (t-last)/1000; last = t;
      spawnAcc += dt; if(spawnAcc > 0.85/SPD){ spawnAcc = 0; spawn(); }
      bubbles.forEach(function(b){ if(b.dead) return; b.y -= b.vy*dt; b.sway += dt*1.4; b.el.style.transform = "translate("+(b.x + Math.sin(b.sway)*10)+"px,"+b.y+"px)"; if(b.y < -b.size-10){ b.dead = true; b.el.remove(); } });
      bubbles = bubbles.filter(function(b){ return !b.dead || b.el.isConnected; });
      var frac = Math.min(1, (t-t0)/DUR); bt.setAttribute("stroke-dashoffset", (94.25*frac).toFixed(2));
      if(frac >= 1){ over = true; var n = hits>=GOAL[0] && mistakes<=2 ? 3 : hits>=GOAL[1] && mistakes<=5 ? 2 : 1; api.win(n, BF.L(hits+" calm bubbles popped!","Лопнуло спокойных пузырей: "+hits+"!")); return; }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return function(){ cancelAnimationFrame(raf); over = true; };
  }
};
