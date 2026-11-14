/* Hero Puzzle — drag pieces of a calm picture (with the child's hero) into place. 2×2, 3×3, 4×3. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.puzzle = {
  title:{en:"Hero Puzzle",ru:"Пазл с героем"}, skill:{en:"Fine motor & planning",ru:"Моторика и планирование"}, motor:true, time:{en:"2–3 min",ru:"2–3 мин"},
  howto:{en:"Drag each piece onto the board. It clicks into place when it's in the right spot — the faint picture helps.",ru:"Перетащи каждый кусочек на поле. Он защёлкнется, когда окажется на своём месте, — бледная картинка подскажет."},
  why:{en:"Turning, comparing and placing pieces combines hand control with planning: look first, then move.",ru:"Сравнивать и ставить кусочки — это сочетание точных движений и планирования: сначала посмотри, потом действуй."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="10" y="10" width="46" height="34" fill="#A3B59C"/><rect x="58" y="10" width="46" height="34" fill="#93A9BA"/><rect x="10" y="46" width="46" height="34" fill="#E4CC8F"/><rect x="70" y="52" width="46" height="34" fill="#C98E70" transform="rotate(8 93 69)"/><circle cx="56" cy="44" r="6" fill="#FBF7EF"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, G = api.pick([[2,2],[3,3],[4,3]]), CX = G[0], CY = G[1], W = 400, H = 240, pw = W/CX, ph = H/CY;
    var pics = BF.SITUATIONS.filter(function(s){ return /park|garden|beach|forest|playground|field|snow/.test(s.scene); });
    var sit = pics[Math.floor(Math.random()*pics.length)] || BF.SITUATIONS[0];
    var full = BF.scene.render(sit.scene, {avatar:BF.store.s.avatar, size:"big", still:true});
    function piece(x, y){ return full.replace('viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"', 'viewBox="'+(x*pw)+' '+(y*ph)+' '+pw+' '+ph+'" preserveAspectRatio="none"'); }
    stage.innerHTML = '<div class="pz"><div class="pz-board" id="pzB" style="--cx:'+CX+';--cy:'+CY+'"><div class="pz-ghost">'+full+'</div>'+
      Array.apply(null,{length:CX*CY}).map(function(_,i){ return '<div class="pz-slot" data-i="'+i+'"></div>'; }).join("")+'</div><div class="pz-tray" id="pzT"></div></div>';
    var board = stage.querySelector("#pzB"), tray = stage.querySelector("#pzT"), left = CX*CY, wrong = 0;
    var order = U.shuffle(Array.apply(null,{length:CX*CY}).map(function(_,i){ return i; }));
    order.forEach(function(i){
      var d = document.createElement("div"); d.className = "pz-piece"; d.setAttribute("data-i", i);
      d.innerHTML = piece(i%CX, Math.floor(i/CX)); d.style.setProperty("--cx", CX); d.style.setProperty("--tilt", U.rand(-8,8).toFixed(1)+"deg");
      tray.appendChild(d); drag(d);
    });
    function slotAt(x, y){ var hit = null; stage.querySelectorAll(".pz-slot").forEach(function(s){ var r = s.getBoundingClientRect(); if(x>=r.left && x<=r.right && y>=r.top && y<=r.bottom) hit = s; }); return hit; }
    function drag(d){
      var sx, sy, on = false;
      d.addEventListener("pointerdown", function(e){ if(d.classList.contains("set")) return; e.preventDefault(); on = true; try{ d.setPointerCapture(e.pointerId); }catch(_){} sx = e.clientX; sy = e.clientY; d.classList.add("lift"); });
      d.addEventListener("pointermove", function(e){ if(!on) return; d.style.transform = "translate("+(e.clientX-sx)+"px,"+(e.clientY-sy)+"px)"; var s = slotAt(e.clientX, e.clientY); stage.querySelectorAll(".pz-slot").forEach(function(x){ x.classList.toggle("hover", x===s); }); });
      function end(e){ if(!on) return; on = false; d.classList.remove("lift"); d.style.transform = ""; stage.querySelectorAll(".pz-slot").forEach(function(x){ x.classList.remove("hover"); });
        var s = slotAt(e.clientX, e.clientY); if(!s) return;
        if(s.getAttribute("data-i") === d.getAttribute("data-i") && !s.firstChild){ s.appendChild(d); d.classList.add("set"); BF.sound.pop(); left--;
          if(left === 0){ board.classList.add("done"); BF.sound.star(); setTimeout(function(){ api.win(wrong<=1?3:wrong<=4?2:1, BF.L("The picture is whole!","Картинка собрана!")); }, 500); }
          else api.say([BF.L("Click! It fits.","Щёлк! Подходит."),BF.L("Nice match.","Точно на месте."),BF.L("Keep going, slowly.","Продолжай, не спеша.")][left%3]);
        } else { wrong++; BF.sound.soft(); api.say(BF.L("Not quite there — compare the edges with the faint picture.","Не совсем — сравни края с бледной картинкой.")); }
      }
      d.addEventListener("pointerup", end); d.addEventListener("pointercancel", end);
    }
    return function(){};
  }
};
