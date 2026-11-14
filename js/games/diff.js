/* Spot the Difference — two calm pictures; find what changed. More, subtler changes on harder levels. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.diff = {
  title:{en:"Spot the Difference",ru:"Найди отличия"}, skill:{en:"Careful looking",ru:"Внимательный взгляд"}, motor:false, time:{en:"2–3 min",ru:"2–3 мин"},
  howto:{en:"Look at both pictures. Tap anything that is different in the bottom one.",ru:"Посмотри на обе картинки. Нажми на всё, что отличается на нижней."},
  why:{en:"Comparing slowly, part by part, builds sustained attention and a habit of checking — useful for homework and getting ready.",ru:"Медленное сравнение по частям развивает устойчивое внимание и привычку проверять — пригодится для уроков и сборов."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="6" y="10" width="50" height="70" rx="8" fill="#DCE4D5"/><rect x="64" y="10" width="50" height="70" rx="8" fill="#DCE4D5"/><circle cx="22" cy="28" r="7" fill="#E4CC8F"/><circle cx="80" cy="28" r="7" fill="#C98E70"/><rect x="26" y="50" width="20" height="20" fill="#93A9BA"/><rect x="84" y="50" width="20" height="20" fill="#93A9BA"/><circle cx="80" cy="28" r="12" fill="none" stroke="#A96C51" stroke-width="2.5" stroke-dasharray="3 3"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, ND = api.pick([3,5,7]), found = 0, wrong = 0;
    // objects: id, x, y, draw(variant) -> svg ; variants: 0 original, 1 changed
    var C = { sage:"#A3B59C", clay:"#C98E70", dusty:"#93A9BA", oat:"#E4CC8F", rose:"#D9B5A7", bark:"#8B6F64" };
    var OBJ = [
      {id:"sun", x:60, y:50, r:30, d:function(v){ return '<circle cx="60" cy="50" r="'+(v?18:24)+'" fill="'+C.oat+'"/>'; }},
      {id:"cloud", x:190, y:46, r:34, d:function(v){ return v?'':'<path d="M160 60 q-14 0 -14 -12 q0 -12 16 -12 q4 -14 22 -14 q16 0 20 14 q18 0 18 12 q0 12 -14 12z" fill="#FBF7EF"/>'; }},
      {id:"bird", x:300, y:40, r:24, d:function(v){ return '<path d="M288 40 q6 -8 12 0 q6 -8 12 0" stroke="'+(v?C.clay:C.bark)+'" stroke-width="3" fill="none" stroke-linecap="round"/>'; }},
      {id:"house", x:95, y:160, r:46, d:function(v){ return '<rect x="60" y="140" width="70" height="60" fill="'+C.rose+'"/><path d="M52 142 L95 105 L138 142z" fill="'+C.clay+'"/><rect x="86" y="168" width="18" height="32" rx="6" fill="'+(v?C.sage:C.bark)+'"/>'; }},
      {id:"win", x:72, y:158, r:16, d:function(v){ return v?'':'<rect x="66" y="152" width="13" height="13" rx="2" fill="#D8E1E7"/>'; }},
      {id:"tree", x:240, y:150, r:44, d:function(v){ return '<rect x="234" y="150" width="12" height="50" fill="'+C.bark+'"/><circle cx="240" cy="'+(v?132:138)+'" r="'+(v?38:30)+'" fill="'+C.sage+'"/>'; }},
      {id:"apple", x:228, y:132, r:14, d:function(v){ return '<circle cx="228" cy="132" r="5" fill="'+(v?C.oat:C.clay)+'"/>'; }},
      {id:"flower", x:330, y:186, r:22, d:function(v){ return '<path d="M330 200 v-14" stroke="'+C.sage+'" stroke-width="3"/><circle cx="330" cy="182" r="7" fill="'+(v?C.dusty:C.rose)+'"/>'; }},
      {id:"ball", x:170, y:206, r:18, d:function(v){ return '<circle cx="'+(v?150:170)+'" cy="206" r="10" fill="'+C.dusty+'"/>'; }},
      {id:"kite", x:340, y:95, r:26, d:function(v){ return '<path d="M340 78 l14 16 -14 18 -14 -18z" fill="'+C.oat+'"/><path d="M340 112 q-6 14 4 26" stroke="'+C.bark+'" stroke-width="1.6" fill="none"/>'+(v?'':'<path d="M326 94 h28" stroke="'+C.clay+'" stroke-width="2"/>'); }},
      {id:"fence", x:180, y:178, r:26, d:function(v){ var s=""; for(var i=0;i<(v?3:4);i++) s += '<rect x="'+(158+i*12)+'" y="170" width="7" height="26" rx="2" fill="#E9DCC5"/>'; return s; }},
      {id:"cat", x:300, y:206, r:20, d:function(v){ return '<ellipse cx="300" cy="208" rx="13" ry="8" fill="'+C.bark+'"/><circle cx="312" cy="201" r="6" fill="'+C.bark+'"/>'+(v?'':'<path d="M287 206 q-8 -8 -4 -16" stroke="'+C.bark+'" stroke-width="3" fill="none" stroke-linecap="round"/>'); }}
    ];
    var easyPool = ["sun","cloud","house","tree","ball","flower","kite"];
    var pool = api.lv===0 ? OBJ.filter(function(o){ return easyPool.indexOf(o.id)>=0; }) : OBJ.slice();
    var changed = U.shuffle(pool.slice()).slice(0, ND).map(function(o){ return o.id; });
    function pic(alt){ return '<svg class="g-svg df-pic" viewBox="0 0 400 240" data-alt="'+(alt?1:0)+'"><rect width="400" height="240" fill="#E5EEF0"/><path d="M0 196 C120 180 260 206 400 188 V240 H0Z" fill="#DCE4D5"/>'+OBJ.map(function(o){ return o.d(alt && changed.indexOf(o.id)>=0 ? 1 : 0); }).join("")+'<g class="df-marks"></g></svg>'; }
    stage.innerHTML = '<div class="df-hud">'+BF.L("Found: ","Найдено: ")+'<b id="dfN">0</b> / '+ND+'</div><div class="df-wrap">'+pic(false)+pic(true)+'</div>';
    var got = {};
    stage.querySelectorAll(".df-pic").forEach(function(svg){
      svg.addEventListener("click", function(e){
        var pt = U.svgPoint(svg, e), hit = null, best = 1e9;
        OBJ.forEach(function(o){ if(changed.indexOf(o.id)<0 || got[o.id]) return; var d = U.dist(pt, o); if(d < o.r+10 && d < best){ best = d; hit = o; } });
        if(hit){
          got[hit.id] = 1; found++; BF.sound.pop();
          stage.querySelectorAll(".df-marks").forEach(function(g){ g.insertAdjacentHTML("beforeend", '<circle cx="'+hit.x+'" cy="'+hit.y+'" r="'+(hit.r*0.8)+'" fill="none" stroke="#A96C51" stroke-width="3" stroke-dasharray="5 4" class="df-ring"/>'); });
          stage.querySelector("#dfN").textContent = found;
          if(found >= ND) api.win(wrong<=1?3:wrong<=4?2:1, BF.L("Every difference found!","Все отличия найдены!"));
          else api.say([BF.L("Yes, that changed!","Да, это изменилось!"),BF.L("Good looking.","Хорошо смотришь."),BF.L("Another one!","Ещё одно!")][found%3]);
        } else { wrong++; BF.sound.soft(); api.say(BF.L("Same in both — keep comparing slowly.","Здесь одинаково — сравнивай медленно.")); }
      });
    });
    return function(){};
  }
};
