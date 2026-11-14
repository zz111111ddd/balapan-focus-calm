/* Lace It Up — fine motor: pull the shoelace from hole to hole, in number order. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.lace = {
  title:{en:"Lace It Up",ru:"Зашнуруй"}, skill:{en:"Fine motor",ru:"Мелкая моторика"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Grab the tip of the lace and pull it to the glowing hole. Follow the numbers.",ru:"Возьми кончик шнурка и тяни к светящейся дырочке. Следуй за цифрами."},
  why:{en:"Aiming a finger to a small target, then the next, builds hand–eye control — the same skill as real laces and buttons.",ru:"Попадать пальцем в маленькую цель, затем в следующую, — это координация «глаз–рука», как с настоящими шнурками и пуговицами."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M10 66 q0 -30 30 -38 l30 -8 q20 0 22 20 l14 10 q8 8 0 18 h-96z" fill="#93A9BA"/><rect x="8" y="74" width="104" height="8" rx="4" fill="#5F7889"/>'+[[46,36],[60,32],[50,48],[66,44]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.4" fill="#FBF7EF"/>';}).join("")+'<path d="M46 36 L60 32 L50 48 L66 44" stroke="#C98E70" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, round = 0, slips = 0, SHOES = api.pick([[6],[6,10],[10,12]]), svg, holes, next, dragging = false, laceG, band, tip;
    function holesFor(n){
      var rows = n/2, out = [], top = 118, bottom = 252, gap = (bottom-top)/(rows-1);
      for(var r=0;r<rows;r++){ var y = bottom - r*gap, inset = r*3; out.push({x:246+inset, y:y}); out.push({x:354-inset, y:y}); }
      return out;
    }
    function build(){
      var n = SHOES[round];
      holes = holesFor(n); next = 1;
      stage.innerHTML = '<div class="lvl-tag">'+BF.L("Shoe ","Ботинок ")+(round+1)+' / '+SHOES.length+'</div><svg class="g-svg" viewBox="0 0 600 360" aria-label="Lacing shoe">'+
        '<ellipse cx="300" cy="346" rx="120" ry="10" fill="#3B3632" opacity=".07"/>'+
        '<path d="M300 14 C384 14 414 90 409 170 C404 252 392 344 300 345 C208 344 196 252 191 170 C186 90 216 14 300 14Z" fill="'+(round?'#6F8A6E':'#5F7889')+'"/>'+
        '<path d="M300 26 C372 26 399 92 395 170 C391 248 382 332 300 333 C218 332 209 248 205 170 C201 92 228 26 300 26Z" fill="'+(round?'#A3B59C':'#93A9BA')+'"/>'+
        '<path d="M300 26 C372 26 399 92 395 118 C356 98 244 98 205 118 C201 92 228 26 300 26Z" fill="'+(round?'#C9D3C1':'#B7C7D3')+'"/>'+
        '<rect x="262" y="96" width="76" height="196" rx="30" fill="'+(round?'#DCE4D5':'#D8E1E7')+'"/>'+
        '<ellipse cx="300" cy="300" rx="56" ry="30" fill="'+(round?'#6F8A6E':'#5F7889')+'"/><ellipse cx="300" cy="304" rx="44" ry="20" fill="#E9DCC5"/>'+
        '<path d="M222 60 q-14 40 -14 110" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>'+
        '<g transform="translate(40 120)">'+BF.gameUtil.heroHead(110,0,0)+'</g>'+
        '<g transform="translate(470 210) scale(.9)">'+BF.avatar.chick(100).replace('<svg ','<svg x="0" y="0" ')+'</g>'+
        '<g id="lc"></g><g id="hl">'+holes.map(function(h,i){ return '<g class="hole" data-i="'+i+'"><circle cx="'+h.x+'" cy="'+h.y+'" r="13" fill="#FBF7EF" stroke="#6E655D" stroke-width="3"/><text x="'+(h.x + (i%2? 30:-30))+'" y="'+(h.y+5)+'" text-anchor="middle" class="hole-n">'+(i+1)+'</text></g>'; }).join("")+'</g>'+
        '<line id="band" stroke="#C98E70" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 0" opacity="0"/>'+
        '<g id="tip"><circle r="22" fill="#C98E70" opacity=".18"/><rect x="-6" y="-14" width="12" height="28" rx="5" fill="#A96C51"/></g></svg>';
      svg = stage.querySelector("svg"); laceG = stage.querySelector("#lc"); band = stage.querySelector("#band"); tip = stage.querySelector("#tip");
      mark(0); placeTip(holes[0]);
    }
    function mark(i){
      stage.querySelectorAll(".hole").forEach(function(g){ var k=+g.getAttribute("data-i"); g.classList.toggle("done", k<=i); g.classList.toggle("next", k===i+1); });
    }
    function placeTip(p){ tip.setAttribute("transform","translate("+p.x+" "+p.y+")"); }
    function down(e){
      var pt = U.svgPoint(svg, e), from = holes[next-1];
      if(U.dist(pt, from) < 44){ dragging = true; svg.setPointerCapture(e.pointerId); band.setAttribute("opacity","1"); move(e); }
      else api.say(BF.L("Grab the lace tip first — it's on hole "+next+".","Сначала возьми кончик шнурка — он у дырочки "+next+"."));
    }
    function move(e){
      if(!dragging) return;
      var pt = U.svgPoint(svg, e), from = holes[next-1];
      band.setAttribute("x1", from.x); band.setAttribute("y1", from.y); band.setAttribute("x2", pt.x); band.setAttribute("y2", pt.y);
      placeTip(pt);
      var target = holes[next];
      if(target && U.dist(pt, target) < 24){
        var over = next % 2 === 0;
        laceG.insertAdjacentHTML("beforeend", '<line x1="'+from.x+'" y1="'+from.y+'" x2="'+target.x+'" y2="'+target.y+'" stroke="'+(over?'#C98E70':'#A96C51')+'" stroke-width="8" stroke-linecap="round" class="lace-seg"/>');
        mark(next); next++; BF.sound.pop();
        band.setAttribute("x1", target.x); band.setAttribute("y1", target.y);
        if(next >= holes.length){ dragging = false; band.setAttribute("opacity","0"); placeTip(target); finish(); }
        else api.say([BF.L("Through it!","Продето!"),BF.L("Nice aim.","Точно!"),BF.L("Next hole is glowing.","Следующая дырочка светится."),BF.L("Steady fingers!","Уверенные пальцы!")][next%4]);
      }
    }
    function up(){
      if(!dragging) return; dragging = false; band.setAttribute("opacity","0"); placeTip(holes[next-1]);
      slips++; api.say(BF.L("The lace slipped back — no problem. Grab the tip again.","Шнурок выскользнул — ничего страшного. Возьми кончик снова."));
    }
    function finish(){
      var a = holes[holes.length-2], b = holes[holes.length-1], cx = (a.x+b.x)/2, cy = a.y-24;
      laceG.insertAdjacentHTML("beforeend", '<g class="bow"><path d="M'+cx+' '+cy+' C'+(cx-50)+' '+(cy-40)+' '+(cx-60)+' '+(cy+10)+' '+cx+' '+cy+' C'+(cx+60)+' '+(cy+10)+' '+(cx+50)+' '+(cy-40)+' '+cx+' '+cy+'Z" fill="none" stroke="#C98E70" stroke-width="8" stroke-linejoin="round"/><path d="M'+cx+' '+cy+' l-18 40 M'+cx+' '+cy+' l18 40" stroke="#A96C51" stroke-width="7" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="8" fill="#A96C51"/></g>');
      tip.style.display = "none"; BF.sound.star();
      if(round < SHOES.length-1){ round++; api.say(BF.L("Tied! Now a longer shoe…","Завязано! Теперь ботинок подлиннее…")); setTimeout(build, 1100); }
      else api.win(slips<=2?3:slips<=5?2:1, BF.L("All laced up!","Всё зашнуровано!"));
    }
    stage.addEventListener("pointerdown", function(e){ if(svg) down(e); });
    stage.addEventListener("pointermove", function(e){ if(svg) move(e); });
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    build();
    return function(){};
  }
};
