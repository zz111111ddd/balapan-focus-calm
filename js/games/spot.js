/* Spot It — find every picture that matches the target; look-alikes get closer on harder levels. */
var BF = window.BF = window.BF || {};
BF.games = BF.games || {};
BF.games.spot = {
  title:{en:"Spot It",ru:"Найди такие же"}, skill:{en:"Visual attention",ru:"Зрительное внимание"}, motor:false, time:{en:"1–2 min",ru:"1–2 мин"},
  howto:{en:"Look at the picture in the card. Tap every one that matches exactly — same shape and same color.",ru:"Посмотри на картинку в карточке. Нажми все точно такие же — та же форма и тот же цвет."},
  why:{en:"Finding exact matches among look-alikes trains careful, unhurried attention instead of quick guessing.",ru:"Искать точные совпадения среди похожих — тренировка внимательности без спешки вместо угадывания."},
  art:function(){ return '<svg viewBox="0 0 120 90"><g fill="#A3B59C"><path d="M14 30 C14 18 22 12 32 11 C31 23 25 30 14 30z"/><path d="M84 66 C84 54 92 48 102 47 C101 59 95 66 84 66z"/></g><circle cx="60" cy="24" r="9" fill="#93A9BA"/><path d="M30 70 l8 -14 8 14z" fill="#C98E70"/><circle cx="92" cy="26" r="9" fill="#E4CC8F"/><circle cx="93" cy="57" r="17" fill="none" stroke="#A96C51" stroke-width="2.5" stroke-dasharray="3 3"/></svg>'; },
  mount:function(stage, api){
    var U = BF.gameUtil;
    var SHAPES = {
      leaf:'<path d="M8 32 C8 16 18 7 33 6 C32 22 23 32 8 32z" fill="F"/>',
      star:'<path d="M20 4l4.6 10 10.9 1.3-8.1 7.4 2.2 10.8L20 28l-9.6 5.4 2.2-10.8-8.1-7.4 10.9-1.3z" fill="F"/>',
      circle:'<circle cx="20" cy="20" r="13" fill="F"/>',
      tri:'<path d="M20 6 L34 32 H6z" fill="F"/>',
      fish:'<path d="M6 20 q10 -12 22 0 l7 -7 v14 l-7 -7 q-12 12 -22 0z" fill="F"/>',
      heart:'<path d="M20 33 C6 24 4 16 8 11 C12 6 18 8 20 13 C22 8 28 6 32 11 C36 16 34 24 20 33Z" fill="F"/>'
    };
    var COL = api.lv===2 ? ["#A3B59C","#8FA88A","#93A9BA","#7F99AB"] : ["#A3B59C","#93A9BA","#C98E70","#E4CC8F"];
    var COLS = api.pick([4,5,6]), CELLS = COLS*COLS, NT = api.pick([4,6,8]);
    var shapeKeys = Object.keys(SHAPES), tShape = shapeKeys[Math.floor(Math.random()*shapeKeys.length)], tCol = COL[Math.floor(Math.random()*COL.length)];
    function svg(sh, col, rot){ return '<svg viewBox="0 0 40 40"'+(rot?' style="transform:rotate('+rot+'deg)"':'')+'>'+SHAPES[sh].replace("F", col)+'</svg>'; }
    var cells = [];
    for(var i=0;i<NT;i++) cells.push({sh:tShape, col:tCol, t:true});
    while(cells.length < CELLS){
      var sh, col;
      if(api.lv===0){ do { sh = shapeKeys[Math.floor(Math.random()*shapeKeys.length)]; } while(sh===tShape); col = COL[Math.floor(Math.random()*COL.length)]; }
      else { if(Math.random()<0.5){ sh = tShape; do { col = COL[Math.floor(Math.random()*COL.length)]; } while(col===tCol); } else { do { sh = shapeKeys[Math.floor(Math.random()*shapeKeys.length)]; } while(sh===tShape); col = Math.random()<0.6 ? tCol : COL[Math.floor(Math.random()*COL.length)]; } }
      cells.push({sh:sh, col:col, t:false});
    }
    U.shuffle(cells);
    var found = 0, wrong = 0;
    stage.innerHTML = '<div class="sp-top"><div class="sp-card paper"><small>'+BF.L("Find all:","Найди все:")+'</small>'+svg(tShape, tCol)+'</div><div class="sp-hud"><b id="spN">0</b> / '+NT+'</div></div>'+
      '<div class="sp-grid" style="--cols:'+COLS+'">'+cells.map(function(c, i){ return '<button class="sp-cell" data-i="'+i+'" aria-label="'+(i+1)+'">'+svg(c.sh, c.col, api.lv===2 ? Math.floor(Math.random()*4)*90 : 0)+'</button>'; }).join("")+'</div>';
    stage.querySelectorAll(".sp-cell").forEach(function(b){ b.addEventListener("click", function(){
      var c = cells[+b.getAttribute("data-i")]; if(b.classList.contains("got")) return;
      if(c.t){ b.classList.add("got"); found++; BF.sound.pop(); stage.querySelector("#spN").textContent = found;
        if(found >= NT) api.win(wrong===0?3:wrong<=2?2:1, BF.L("You found them all!","Ты нашёл все!"));
        else if(found === NT-1) api.say(BF.L("Just one more hiding somewhere…","Осталась одна — где-то прячется…"));
      } else { wrong++; b.classList.add("no"); setTimeout(function(){ b.classList.remove("no"); }, 400); BF.sound.soft();
        api.say(c.sh===tShape ? BF.L("Same shape — but check the color.","Форма та же — а цвет?") : BF.L("Look at the shape again.","Посмотри ещё раз на форму.")); }
    }); });
    return function(){};
  }
};
