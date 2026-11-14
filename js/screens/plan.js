var BF = window.BF = window.BF || {};
/* Plan opening logic shared by library, home and plan */
BF.plans = {
  find:function(id){ return BF.engine.find(id); },
  open:function(id, mode){
    var st = BF.store, c = st.s, sit = BF.plans.find(id); if(!sit) return;
    mode = mode || (sit.tag==="adhd" ? "quest" : "brave");
    if(st.planBlocked(c)){ BF.router.go("/safety?from=plan"); return; }
    if(c.plans[id]){ st.update(function(x){ x.activePlan = id; }); BF.router.go("/"+mode+"/"+id); return; }
    if(st.plansLeft()<=0){ BF.router.go("/pricing?locked="+id); return; }
    BF.engine.generate(sit, c).then(function(plan){
      st.update(function(x){ x.plans[id]=plan; x.planOrder.push(id); x.activePlan=id; });
      st.markActive(); BF.router.go("/"+mode+"/"+id);
    });
  },
  /* evening check-in: easy / ok / hard (hard splits the step) */
  checkin:function(m){
    var st = BF.store, c = st.s, p = c.plans[c.activePlan]; if(!p) return;
    var step = p.ladder[p.current]; if(!step) return;
    var wasMini = !!step.mini;
    st.update(function(x){
      x.checkins.push({ date:st.today(), plan:p.id, mood:m, step:BF.L(step.text) });
      if(m==="hard" && !wasMini){ var q = x.plans[x.activePlan], parts = BF.engine.splitStep(q.ladder[q.current]); q.ladder.splice(q.current, 1, parts[0], parts[1]); }
    });
    st.markActive();
    BF.ui.toast({ easy:BF.L("Lovely. Tomorrow, try the next rung — or repeat once to make it boring.","Отлично. Завтра — следующая ступенька или ещё раз, чтобы стало скучно."),
      ok:BF.L("Good. Repeat this step tomorrow until it feels easy.","Хорошо. Повторите этот шаг завтра, пока он не станет лёгким."),
      hard: wasMini ? BF.L("Thanks for being honest. Repeat this mini step tomorrow — stay extra close.","Спасибо за честность. Завтра повторите этот мини-шаг — будьте совсем рядом.") : BF.L("Thanks for being honest. We added a smaller mini step first.","Спасибо за честность. Мы добавили сначала шаг поменьше.") }[m]);
    BF.router.refresh();
  }
};
/* Step 7 of the quiz: "Plan for your family" */
BF.screens.plan = {
  title:{en:"Family plan",ru:"План для семьи"},
  render:function(el){
    var st = BF.store, c = st.s, I = BF.icon, esc = BF.ui.esc, A = BF.avatar, T = BF.ui.T;
    if(!c.quizDone){ BF.router.go("/"); return; }
    var name = esc(BF.ui.heroName(c)), prof = c.profile, it = BF.INTERESTS[c.interest]||BF.INTERESTS.space;
    var blocked = st.planBlocked(c), recs = blocked ? [] : BF.engine.recommend(c, 3), habits = BF.engine.habitsFor(c), left = st.plansLeft();
    var profText = T((BF.PROFILE_OPTS.find(function(o){ return o.v===prof; })||BF.PROFILE_OPTS[3]).t);
    var pool = BF.PHRASES[prof==="anxiety"||prof==="adhd"?prof:"both"];
    var words = [T(pool.accept[0]), T(pool.confident[1]), T(pool.confident[0])];
    var mot = (c.motivators||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[5].options, v); });
    el.innerHTML =
      '<div class="plan wrap">'+
        (blocked?'<div class="flag-banner paper">'+I('heart',26)+'<div><b>'+BF.L("We won't build a brave plan yet.","Мы пока не будем строить смелый план.")+'</b> '+BF.L("Some answers need a specialist's support first. Please talk with your pediatrician or a child mental-health professional. In a crisis in the US call or text <b>988</b> (Suicide &amp; Crisis Lifeline) or <b>911</b>.","Некоторые ответы требуют сначала поддержки специалиста. Обратитесь к педиатру или детскому психологу/психиатру. В кризисной ситуации в США — <b>988</b> или <b>911</b>; в Казахстане — <b>112</b>, детский телефон доверия <b>150</b>.")+' <a href="#/safety?from=quiz">'+BF.L("Safety page","Страница безопасности")+'</a></div></div>':'')+
        '<header class="plan-head">'+
          '<div class="plan-hero">'+A.svg(c.avatar,{size:150,pose:"wave"})+'<div class="ph-chick">'+A.chick(56)+'</div></div>'+
          '<div class="plan-intro"><p class="eyebrow">'+BF.L("Step 7 of 7 · Plan for your family","Шаг 7 из 7 · План для вашей семьи")+'</p><h1>'+BF.L(name+"'s brave &amp; focused week","Смелая и собранная неделя: "+name)+'</h1>'+
            '<p class="lede">'+BF.L("Starting point","Отправная точка")+': <b>'+profText+'</b>. '+BF.L("Story world","Мир истории")+': <b>'+T(it.world)+'</b> · '+BF.L("buddy","друг")+': '+T(it.buddy)+'.'+(mot.length?' '+BF.L("Rewards","Награды")+': '+esc(mot.join(", "))+'.':'')+'</p>'+
            '<div class="plan-meta"><span class="chip">'+(left===Infinity?BF.L("Unlimited plans","Безлимитные планы"):BF.L(left+" of "+st.FREE_PLANS+" free plans left","осталось бесплатных планов: "+left+" из "+st.FREE_PLANS))+'</span><a class="chip" href="#/hero">'+I('pencil',14)+' '+BF.L("Edit hero","Изменить героя")+'</a><a class="chip" href="#/quiz">'+I('refresh',14)+' '+BF.L("Retake quiz","Пройти квиз заново")+'</a><a class="chip" href="#/">'+I('home',14)+' '+BF.L("Home","Главная")+'</a></div>'+
          '</div>'+
        '</header>'+
        (recs.length?'<section class="start-here"><h2>'+BF.L("Start here","Начните отсюда")+'</h2><p class="muted">'+BF.L("Picked from what you said is hardest and what your child fears.","Подобрано по тому, что сейчас труднее всего и чего ребёнок боится.")+'</p><div class="stones-path">'+recs.map(function(s,ix){
            var has = !!c.plans[s.id];
            return '<article class="stone-card paper reveal d'+(ix+1)+'"><span class="stone-n">'+(ix+1)+'</span><div class="sc-scene">'+BF.scene.render(s.scene,{avatar:c.avatar,size:"thumb"})+'</div>'+BF.ui.tagChip(s.tag)+'<h3>'+T(s.title)+'</h3><p class="muted">'+T(s.why)+'</p>'+
              '<div class="sc-actions">'+(s.tag!=="adhd"?'<button class="btn small clay" data-open="'+s.id+'" data-mode="brave">'+(has?BF.L("Open","Открыть"):BF.L("Make","Создать"))+' Brave Plan</button>':'')+
              (s.tag!=="anxiety"?'<button class="btn small sage" data-open="'+s.id+'" data-mode="quest">'+(has?BF.L("Open","Открыть"):BF.L("Start","Начать"))+' Routine Quest</button>':'')+'</div></article>';
          }).join("")+'</div><p class="center"><a class="btn ghost" href="#/library">'+BF.L("See all "+BF.SITUATIONS.length+" situations","Все "+BF.SITUATIONS.length+" ситуации")+'</a></p></section>':'')+
        '<section class="two-col">'+
          '<div class="words paper"><span class="tape"></span><h3>'+BF.L("Words for this week","Слова на эту неделю")+'</h3><p class="muted small">'+BF.L("Acceptance first, then confidence.","Сначала принятие, потом уверенность.")+'</p><ul class="quote-list">'+words.map(function(w){ return '<li>“'+esc(w)+'”</li>'; }).join("")+'</ul></div>'+
          '<div class="habits paper"><h3>'+BF.L("Gently drop → try instead","Мягко отказаться → попробовать вместо")+'</h3><ul class="swap-list">'+habits.map(function(h){ return '<li><span class="drop">'+T(h.drop)+'</span><span class="arrow">'+I('next',16)+'</span><span class="instead">'+T(h.instead)+'</span></li>'; }).join("")+'</ul></div>'+
        '</section>'+
        '<section class="rhythm"><h2>'+BF.L("Ten minutes a day","Десять минут в день")+'</h2><div class="rhythm-row">'+
          '<div class="rh paper"><span class="rh-ico">'+I('sun',26)+'</span><b>'+BF.L("Morning · 3 min","Утро · 3 мин")+'</b><p>'+BF.L("One Routine Quest card with the slow timer.","Одна карточка Routine Quest с медленным таймером.")+'</p></div>'+
          '<div class="rh paper"><span class="rh-ico">'+I('hand',26)+'</span><b>'+BF.L("After school · 3 min","После школы · 3 мин")+'</b><p>'+BF.L("One calm game — stars go to the next brave step.","Одна спокойная игра — звёзды идут в следующий смелый шаг.")+'</p></div>'+
          '<div class="rh paper"><span class="rh-ico">'+I('moon',26)+'</span><b>'+BF.L("Evening · 4 min","Вечер · 4 мин")+'</b><p>'+BF.L("Read the story, a mood sticker and a 10-second check-in.","Сказка, наклейка настроения и чек-ин на 10 секунд.")+'</p></div>'+
        '</div></section>'+
      '</div>';
    el.querySelectorAll("[data-open]").forEach(function(b){ b.onclick = function(){ BF.plans.open(b.getAttribute("data-open"), b.getAttribute("data-mode")); }; });
  }
};
