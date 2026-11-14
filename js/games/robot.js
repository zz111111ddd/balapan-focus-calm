/* Follow the Robot — watch the arrows and move the robot in your head (no finger!), then tap where it stopped. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.robot = {
  title:{en:"Follow the Robot",ru:"Догони робота"}, skill:{en:"Attention & spatial memory",ru:"Внимание и пространство"}, cat:"attention", time:{en:"2 min",ru:"2 мин"},
  howto:{en:"Remember where the robot starts. Watch the arrows one by one and move it in your head. Then tap the square where it stopped.",ru:"Запомни, где стоит робот. Смотри на стрелки по одной и двигай его в уме. Потом нажми клетку, где он остановился."},
  why:{en:"Following moves without pointing holds attention on a task and trains working memory and spatial thinking.",ru:"Следить за ходами без пальца — значит удерживать внимание на задаче и тренировать рабочую память и пространственное мышление."},
  art:function(){ return '<svg viewBox="0 0 120 90"><rect x="20" y="8" width="74" height="74" rx="6" fill="#FBF7EF" stroke="#D6C09C" stroke-width="2"/><path d="M38.5 8 V82 M57 8 V82 M75.5 8 V82 M20 26.5 H94 M20 45 H94 M20 63.5 H94" stroke="#E7D7BC" stroke-width="1.5"/>'+BF.robotSVG(29,17,14)+'<path d="M102 30 V58 M96 50 L102 58 L108 50" fill="none" stroke="#B27A62" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'; },
  mount:function(stage, api){
    var n = api.pick([4,5,5]), MOVES = api.pick([3,5,7]), ROUNDS = 3, SPEED = api.pick([1300,1150,1000]);
    var round = 0, good = 0, pos, end, path, timers = [], busy = true;
    var DIRS = {u:[0,-1,"↑"], d:[0,1,"↓"], l:[-1,0,"←"], r:[1,0,"→"]};
    var AR = {u:'M0 10 V-10 M-7 -3 L0 -10 L7 -3', d:'M0 -10 V10 M-7 3 L0 10 L7 3', l:'M10 0 H-10 M-3 -7 L-10 0 L-3 7', r:'M-10 0 H10 M3 -7 L10 0 L3 7'};
    function later(f, t){ timers.push(setTimeout(f, t)); }
    function plan(){
      pos = [Math.floor(Math.random()*n), Math.floor(Math.random()*n)]; var p = pos.slice(); path = [];
      while(path.length < MOVES){ var ks = Object.keys(DIRS).filter(function(k){ var x=p[0]+DIRS[k][0], y=p[1]+DIRS[k][1]; return x>=0&&y>=0&&x<n&&y<n; }); var k = ks[Math.floor(Math.random()*ks.length)]; p = [p[0]+DIRS[k][0], p[1]+DIRS[k][1]]; path.push(k); }
      end = p;
    }
    function board(showRobot){
      var cells = ""; for(var y=0;y<n;y++) for(var x=0;x<n;x++) cells += '<button class="rb-cell" data-x="'+x+'" data-y="'+y+'" aria-label="'+(y+1)+'-'+(x+1)+'">'+(showRobot && x===pos[0] && y===pos[1] ? '<svg viewBox="0 0 40 40">'+BF.robotSVG(20,20,15)+'</svg>' : '')+'</button>';
      return cells;
    }
    function start(){
      plan(); busy = true;
      stage.innerHTML = '<div class="rb-wrap"><div class="lvl-tag">'+BF.L("Round ","Раунд ")+(round+1)+' / '+ROUNDS+'</div><div class="rb-grid" style="--n:'+n+'">'+board(true)+'</div>'+
        '<div class="rb-side"><div class="rb-arrow paper" id="rbA" aria-live="polite"><span>'+BF.L("Ready?","Готов?")+'</span></div><div class="rb-trail" id="rbT"></div></div></div>';
      api.say(BF.L("Remember where the robot is…","Запомни, где робот…"));
      later(function(){
        stage.querySelectorAll(".rb-cell svg").forEach(function(s){ s.remove(); });
        stage.querySelector('.rb-cell[data-x="'+pos[0]+'"][data-y="'+pos[1]+'"]').classList.add("start");
        api.say(BF.L("Watch the arrows. Move it in your head!","Смотри на стрелки. Двигай робота в уме!"));
        path.forEach(function(k, i){ later(function(){
          stage.querySelector("#rbA").innerHTML = '<svg viewBox="-16 -16 32 32" width="64" height="64"><path d="'+AR[k]+'" fill="none" stroke="#B27A62" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg><small>'+(i+1)+' / '+MOVES+'</small>';
          stage.querySelector("#rbT").insertAdjacentHTML("beforeend", '<i>'+DIRS[k][2]+'</i>'); BF.sound.pop();
          if(api.lv===2) later(function(){ var t = stage.querySelector("#rbT"); if(t) t.innerHTML = ""; }, SPEED-200);
        }, 1600 + i*SPEED); });
        later(function(){ stage.querySelector("#rbA").innerHTML = '<span>'+BF.L("Where is it now?","Где он теперь?")+'</span>'; api.say(BF.L("Tap the square where the robot stopped.","Нажми клетку, где остановился робот.")); busy = false; }, 1600 + MOVES*SPEED);
      }, 1700);
    }
    stage.addEventListener("click", function(e){
      var c = e.target.closest && e.target.closest(".rb-cell"); if(!c) return;
      if(busy){ api.say(BF.L("Wait for the arrows to finish.","Дождись, пока закончатся стрелки.")); return; }
      busy = true; var x = +c.getAttribute("data-x"), y = +c.getAttribute("data-y"), ok = x===end[0] && y===end[1];
      var right = stage.querySelector('.rb-cell[data-x="'+end[0]+'"][data-y="'+end[1]+'"]'); right.innerHTML = '<svg viewBox="0 0 40 40">'+BF.robotSVG(20,20,15)+'</svg>'; right.classList.add("end");
      if(ok){ good++; BF.sound.star(); api.say(BF.L("Yes! You caught the robot.","Да! Робот пойман.")); }
      else { c.classList.add("miss"); api.say(BF.L("It went here — let's try another one.","Он был здесь — давай ещё раз.")); }
      round++;
      later(function(){ if(round < ROUNDS) start(); else api.win(good===3?3:good===2?2:1, BF.L("Robot caught ","Поймано: ")+good+" / "+ROUNDS); }, 1400);
    });
    start();
    return function(){ timers.forEach(clearTimeout); };
  }
};
BF.robotSVG = function(cx, cy, s){ var k = s/15;
  return '<g transform="translate('+cx+' '+cy+') scale('+k+')"><line x1="0" y1="-15" x2="0" y2="-20" stroke="#6b5a4c" stroke-width="2"/><circle cx="0" cy="-21" r="2.5" fill="#D79A7E"/><rect x="-12" y="-14" width="24" height="18" rx="5" fill="#A9C3D6" stroke="#6b5a4c" stroke-width="2"/><circle cx="-5" cy="-6" r="2.6" fill="#3b3632"/><circle cx="5" cy="-6" r="2.6" fill="#3b3632"/><rect x="-9" y="5" width="18" height="11" rx="3" fill="#D79A7E" stroke="#6b5a4c" stroke-width="2"/></g>'; };
