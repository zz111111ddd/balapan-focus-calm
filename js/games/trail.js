/* Trail Tracer — fine motor: follow a winding trail with one finger without leaving it. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.trail = {
  title:{en:"Trail Tracer",ru:"Тропинка"}, skill:{en:"Fine motor",ru:"Мелкая моторика"}, motor:true, time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Put a finger on the hero and slowly follow the trail home. If you slip off, just come back — nothing resets.",ru:"Поставьте палец на героя и медленно ведите его по тропинке домой. Соскользнули — просто вернитесь, ничего не сбрасывается."},
  why:{en:"Slow, controlled finger movement builds pencil control and teaches the body that slowing down feels good.",ru:"Медленные точные движения пальцем развивают контроль карандаша и учат тело, что замедляться приятно."},
  art:function(){ return '<svg viewBox="0 0 120 90"><path d="M12 70 C30 20 50 80 70 34 S104 20 110 54" fill="none" stroke="#E7D7BC" stroke-width="16" stroke-linecap="round"/><path d="M12 70 C30 20 50 80 70 34" fill="none" stroke="#C98E70" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="34" r="8" fill="#FBF7EF" stroke="#A96C51" stroke-width="3"/><path d="M104 46 l6 -12 l6 12z" fill="#A3B59C"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil, level = 0, slips = 0, TADJ = api.pick([10,0,-7]), COUNT = api.pick([2,3,3]);
    var LEVELS = [
      { d:"M70 270 C170 270 170 90 300 90 S430 270 530 120", tol:34 },
      { d:"M60 290 C120 120 200 110 230 210 S330 330 380 200 S470 60 545 100", tol:30 },
      { d:"M55 180 C90 60 170 60 190 170 S270 300 310 180 S380 40 430 150 S520 300 555 150", tol:27 }
    ];
    var svg, path, prog, token, home, samples, N = 360, idx = 0, len = 0, tracing = false, offT = 0;
    function build(){
      var L = {d:LEVELS[level].d, tol:LEVELS[level].tol+TADJ};
      stage.innerHTML = '<div class="lvl-tag">'+BF.L("Trail ","Тропинка ")+(level+1)+' / '+COUNT+'</div><svg class="g-svg" viewBox="0 0 600 360" aria-label="Tracing trail">'+
        '<path d="M0 330 C150 300 300 340 600 310 V360 H0Z" fill="#E9DCC5"/>'+
        '<path id="trTrack" d="'+L.d+'" fill="none" stroke="#D6C09C" stroke-width="'+(L.tol*2+4)+'" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<path d="'+L.d+'" fill="none" stroke="#F4ECDD" stroke-width="'+(L.tol*2-6)+'" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<path d="'+L.d+'" fill="none" stroke="#CDBA98" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>'+
        '<path id="trProg" d="'+L.d+'" fill="none" stroke="#C98E70" stroke-width="12" stroke-linecap="round"/>'+
        '<g id="trHome"></g><g id="trTok"><circle r="30" fill="#FBF7EF" stroke="#A96C51" stroke-width="3"/><g transform="translate(-26 -27)">'+U.heroHead(52,0,0)+'</g><circle class="tok-ring" r="38" fill="none" stroke="#A96C51" stroke-width="2" stroke-dasharray="4 6"/></g></svg>';
      svg = stage.querySelector("svg"); path = stage.querySelector("#trTrack"); prog = stage.querySelector("#trProg"); token = stage.querySelector("#trTok"); home = stage.querySelector("#trHome");
      len = path.getTotalLength(); samples = [];
      for(var i=0;i<N;i++){ var p = path.getPointAtLength(len*i/(N-1)); samples.push({x:p.x,y:p.y}); }
      var e = samples[N-1];
      home.innerHTML = '<g transform="translate('+(e.x-34)+' '+(e.y-62)+')"><path d="M6 34 L34 8 L62 34 V64 H6Z" fill="#A3B59C"/><path d="M0 36 L34 4 L68 36" fill="none" stroke="#6F8A6E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="26" y="42" width="16" height="22" rx="7" fill="#FBF7EF"/></g>';
      prog.style.strokeDasharray = len; idx = 0; paint();
    }
    function paint(){
      var p = samples[idx]; token.setAttribute("transform","translate("+p.x+" "+p.y+")");
      prog.style.strokeDashoffset = len*(1-idx/(N-1));
    }
    function nearest(pt){
      var best=-1, bd=1e9, lo=Math.max(0, idx-12), hi=Math.min(N-1, idx+28);
      for(var i=lo;i<=hi;i++){ var d=U.dist(pt, samples[i]); if(d<bd){ bd=d; best=i; } }
      return {i:best, d:bd};
    }
    function down(e){
      var pt = U.svgPoint(svg, e);
      if(U.dist(pt, samples[idx]) < 48){ tracing = true; svg.setPointerCapture(e.pointerId); token.classList.add("held"); api.say(BF.L("Slow and steady… follow the dotted line.","Медленно и спокойно… по пунктирной линии.")); }
      else api.say(BF.L("Start from the hero — put your finger on them.","Начните с героя — поставьте на него палец."));
    }
    function move(e){
      if(!tracing) return;
      var pt = U.svgPoint(svg, e), n = nearest(pt), tol = LEVELS[level].tol+TADJ;
      if(n.d <= tol){
        stage.classList.remove("off");
        if(n.i > idx){ idx = n.i; paint(); if(idx % 40 === 0) BF.sound.pop(); }
        if(idx >= N-14 || (idx > N*0.85 && U.dist(pt, samples[N-1]) < tol)){ idx = N-1; paint(); levelDone(); }
      } else if(n.d > tol + 6){
        if(!stage.classList.contains("off")){ slips++; stage.classList.add("off"); api.say(BF.L("Oops — back to the trail. Your progress is safe.","Ой — вернитесь на тропинку. Прогресс сохранён.")); BF.sound.soft(); }
        clearTimeout(offT);
      }
    }
    function up(){ tracing = false; token.classList.remove("held"); stage.classList.remove("off"); }
    function levelDone(){
      tracing = false; token.classList.remove("held"); BF.sound.star();
      if(level < COUNT-1){ level++; api.say(BF.L("Home! Here comes a twistier trail.","Дома! А вот тропинка извилистее.")); setTimeout(build, 600); }
      else var lim = api.pick([[3,8],[2,6],[1,4]]); api.win(slips<=lim[0]?3:slips<=lim[1]?2:1, slips<=lim[0] ? BF.L("Steady as a rock!","Твёрдо, как скала!") : BF.L("You made it home!","Ты дошёл домой!"));
    }
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    build();
    return function(){};
  }
};
