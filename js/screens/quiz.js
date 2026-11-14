/* Parent quiz — 7 steps (spec): child → hardest → fears → what you do
   when scared → interests → motivators (+safety check) → family plan.
   BF.quiz.mount(el, {embedded}) is used both on the first-run home
   screen and on #/quiz (retake / add a child). */
var BF = window.BF = window.BF || {};
BF.screens = BF.screens || {};
BF.quiz = {
  mount:function(host, opts){
    opts = opts || {};
    var Q = BF.QUIZ, i = 0, c = BF.store.s, esc = BF.ui.esc, I = BF.icon, T = BF.ui.T;
    var total = Q.length + 1;   // + the family plan screen
    host.innerHTML = '<div class="quiz-track" id="qTrack"></div><div class="quiz-card paper" id="qCard"></div>';
    var card = host.querySelector("#qCard"), track = host.querySelector("#qTrack");
    function drawTrack(){
      var n = i+1, stones = "";
      for(var k=1;k<=total;k++) stones += '<span class="stone '+(k<n?'done':k===n?'now':'')+'">'+(k<n?I('check',14):k===total?I('star',14):k)+'</span>';
      track.innerHTML = '<div class="stones">'+stones+'</div><div class="track-chick" style="--p:'+((n-1)/(total-1))+'">'+BF.avatar.chick(46)+'</div><p class="track-lbl">'+BF.L("Step "+n+" of "+total,"Шаг "+n+" из "+total)+'</p>';
    }
    function canNext(q){
      if(q.kind==="child") return (c.name||"").trim().length>0;
      if(q.kind==="single") return !!c[q.id];
      if(q.kind==="multi") return (c[q.id]||[]).length>0 && (!q.profile || !!c.profile);
      return true;
    }
    function optBtns(list, val, multi, key){
      return '<div class="opts '+(multi?'multi':'single')+' '+(list.length>6?'many':'')+'" data-key="'+key+'">'+list.map(function(o){
        var on = multi ? (val||[]).indexOf(o.v)>=0 : val===o.v;
        return '<button type="button" class="opt opt-'+o.v+'" data-v="'+o.v+'" aria-pressed="'+on+'"><span class="tick">'+I('check',14)+'</span><span><b>'+T(o.t)+'</b></span></button>';
      }).join("")+'</div>';
    }
    function draw(){
      var q = Q[i]; drawTrack();
      var h = '<p class="eyebrow">'+BF.L("Question "+(i+1),"Вопрос "+(i+1))+'</p><h2>'+T(q.title)+'</h2><p class="muted">'+T(q.sub)+'</p>';
      if(q.kind==="child"){
        h += '<div class="field"><label for="qName">'+BF.L("Child's first name or nickname","Имя ребёнка или домашнее прозвище")+'</label><input id="qName" class="input" maxlength="20" autocomplete="off" placeholder="'+BF.L("e.g. Maya","например, Айша")+'" value="'+esc(c.name)+'"></div>'+
          '<div class="field"><label>'+BF.L("Age","Возраст")+'</label><div class="seg" data-k="age">'+[4,5,6,7,8,9,10,11].map(function(a){return '<button type="button" data-v="'+a+'" aria-pressed="'+(c.age==a)+'">'+a+'</button>';}).join("")+'</div></div>'+
          '<div class="field"><label>'+BF.L("In stories, call them","В историях говорить о ребёнке")+'</label><div class="seg" data-k="pronoun">'+[["he",BF.L("he / him","он")],["she",BF.L("she / her","она")],["they",BF.L("they / them","нейтрально")]].map(function(p){return '<button type="button" data-v="'+p[0]+'" aria-pressed="'+(c.pronoun===p[0])+'">'+p[1]+'</button>';}).join("")+'</div></div>';
      } else {
        h += optBtns(q.options, c[q.id], q.kind==="multi", q.id);
        if(q.profile) h += '<div class="field profile-q"><label>'+BF.L("How would you describe it overall? (no diagnosis needed)","Как бы вы описали это в целом? (диагноз не нужен)")+'</label>'+optBtns(BF.PROFILE_OPTS, c.profile, false, "profile")+'</div>';
        if(q.safety) h += '<div class="safety-q"><h3>'+I('shield',18)+' '+BF.L("Safety check — tick anything that's true lately","Проверка безопасности — отметьте, если это было в последнее время")+'</h3>'+optBtns(BF.FLAGS, c.flags, true, "flags")+'<p class="fine">'+BF.L("If any of these are true, we won't build a plan yet — we'll show how to reach a specialist first.","Если что-то из этого есть, мы не будем строить план — сначала подскажем, как обратиться к специалисту.")+'</p></div>';
      }
      h += '<div class="quiz-nav">'+(i>0?'<button class="btn ghost" id="qBack">'+I('back',18)+' '+BF.L("Back","Назад")+'</button>':'<span></span>')+
           '<button class="btn clay" id="qNext">'+(i===Q.length-1?BF.L("See our family plan","Открыть план для семьи"):BF.L("Continue","Дальше"))+' '+I('next',18)+'</button></div>';
      card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
      card.innerHTML = h;
      if(!opts.embedded || i>0) host.scrollIntoView({block:"start"});
      bind(q);
    }
    function refreshNext(q){ var b = card.querySelector("#qNext"); if(b) b.disabled = !canNext(q); }
    function bind(q){
      var name = card.querySelector("#qName");
      if(name){ name.addEventListener("input", function(){ c.name = name.value; BF.store.save(); refreshNext(q); }); if(!opts.embedded) setTimeout(function(){ name.focus(); }, 50); }
      card.querySelectorAll(".seg").forEach(function(seg){
        seg.addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; var k=seg.getAttribute("data-k");
          c[k] = k==="age" ? +b.getAttribute("data-v") : b.getAttribute("data-v");
          seg.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); BF.store.save(); });
      });
      card.querySelectorAll(".opts").forEach(function(box){
        var key = box.getAttribute("data-key"), multi = box.classList.contains("multi");
        var list = key==="profile" ? BF.PROFILE_OPTS : key==="flags" ? BF.FLAGS : q.options;
        box.addEventListener("click", function(e){
          var b = e.target.closest(".opt"); if(!b) return; var v = b.getAttribute("data-v");
          if(!multi){ c[key]=v; box.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); }
          else {
            var arr = (c[key]||[]).slice(), opt = list.find(function(o){ return o.v===v; }), ix = arr.indexOf(v);
            if(ix>=0) arr.splice(ix,1); else { if(opt.exclusive) arr=[]; else arr = arr.filter(function(x){ var o=list.find(function(oo){return oo.v===x;}); return !(o&&o.exclusive); }); arr.push(v); }
            c[key]=arr; box.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed", arr.indexOf(x.getAttribute("data-v"))>=0); });
          }
          BF.sound.pop(); BF.store.save(); refreshNext(q);
        });
      });
      var back = card.querySelector("#qBack"); if(back) back.onclick = function(){ i--; draw(); };
      card.querySelector("#qNext").onclick = function(){ if(!canNext(q)) return; if(i < Q.length-1){ i++; draw(); } else finish(); };
      refreshNext(q);
    }
    function finish(){
      BF.store.update(function(ch){ ch.quizDone = true; if(!ch.profile) ch.profile="unsure"; });
      BF.store.markActive(); BF.renderShell();
      if(BF.store.hasRedFlag()) BF.router.go("/safety?from=quiz");
      else BF.router.go(BF.store.s.avatarSaved ? "/plan" : "/hero?from=quiz");
    }
    draw();
  }
};
BF.screens.quiz = {
  title:{en:"Parent quiz",ru:"Анкета для родителя"},
  render:function(el, p, query){
    var isNew = query && query.new;
    el.innerHTML = '<div class="quiz wrap"><div class="quiz-intro"><p class="eyebrow">'+(isNew?BF.L("New child","Новый ребёнок"):BF.L("Edit answers","Изменить ответы"))+'</p><h1>'+(isNew?BF.L("Let's get to know your child","Давайте познакомимся с вашим ребёнком"):BF.L("Retake the parent quiz","Заполнить анкету заново"))+'</h1></div><div id="quizHost"></div></div>';
    BF.quiz.mount(el.querySelector("#quizHost"), {});
  }
};
