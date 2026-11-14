/* Home: first run → onboarding quiz right away.
   After the quiz → the parent's main menu for the active child. */
var BF = window.BF = window.BF || {};
BF.screens.home = {
  title:function(){ return BF.store.s.quizDone ? BF.L("Home","Главная") : BF.L("Let's get to know your child","Давайте познакомимся с ребёнком"); },
  render:function(el){
    var c = BF.store.s;
    if(!c.quizDone) return BF.screens.home.onboarding(el);
    return BF.screens.home.menu(el);
  },
  onboarding:function(el){
    var I = BF.icon, demo = BF.store.children().find(function(k){ return k.isDemo; });
    el.innerHTML = '<div class="onboard wrap">'+
      '<aside class="ob-side">'+
        '<div class="ob-art">'+BF.scene.render("park|tree,flower|wave|sparkle|d",{label:"", avatar:BF.store.s.avatar})+'<div class="ob-chick">'+BF.avatar.chick(70)+'</div></div>'+
        '<p class="eyebrow">'+BF.L("Welcome to Balapan","Добро пожаловать в Balapan")+'</p>'+
        '<h1>'+BF.L("Let's get to know your child","Давайте познакомимся с вашим ребёнком")+'</h1>'+
        '<p class="lede">'+BF.L("Seven short steps, about 2 minutes. Then you get a family plan: a story where your child is the hero, five small brave steps and the exact words to say.","Семь коротких шагов, около 2 минут. Потом — план для вашей семьи: история, где ребёнок — главный герой, пять маленьких смелых шагов и точные слова, что сказать.")+'</p>'+
        '<ul class="ob-points"><li>'+I('lock',16)+' '+BF.L("No sign-up. Everything stays in this browser.","Без регистрации. Всё остаётся в этом браузере.")+'</li><li>'+I('heart',16)+' '+BF.L("For kids 5–10 with anxiety, ADHD, or both.","Для детей 5–10 лет с тревожностью, СДВГ или и тем, и другим.")+'</li><li>'+I('shield',16)+' '+BF.L("Parent support, not therapy or diagnosis.","Поддержка родителя, а не терапия и не диагноз.")+'</li></ul>'+
        '<p class="ob-links">'+(demo?'<button class="linkbtn" id="obDemo">'+BF.L("Look around first: open the demo child “Mira”","Сначала осмотреться: открыть демо-ребёнка «Мира»")+'</button> · ':'')+'<a href="#/about">'+BF.L("What is Balapan?","Что такое Balapan?")+'</a></p>'+
      '</aside>'+
      '<div class="ob-quiz quiz" id="obQuiz"></div>'+
    '</div>';
    BF.quiz.mount(el.querySelector("#obQuiz"), {embedded:true});
    var d = el.querySelector("#obDemo"); if(d) d.onclick = function(){ BF.store.setActive(demo.id); BF.renderShell(); BF.router.refresh(); };
  },
  menu:function(el){
    var st = BF.store, c = st.s, I = BF.icon, esc = BF.ui.esc, T = BF.ui.T, A = BF.avatar;
    var name = esc(BF.ui.heroName(c)), streak = st.streak(), blocked = st.planBlocked(c);
    var plan = c.activePlan && c.plans[c.activePlan], sit = plan && BF.engine.find(plan.id), step = plan && plan.ladder[plan.current];
    var today = st.today(), hour = new Date().getHours(), partNow = hour<11?"morning":hour<14?"midday":hour<18?"afternoon":"evening";
    var todayMoods = (c.moods||[]).filter(function(m){ return m.date===today; });
    var recs = blocked ? [] : BF.engine.recommend(c, 3), adapt = BF.engine.adaptive(c).slice(0,3);
    var greet = hour<12 ? BF.L("Good morning","Доброе утро") : hour<18 ? BF.L("Good afternoon","Добрый день") : BF.L("Good evening","Добрый вечер");
    var tiles = [
      {href:"#/library", ico:"book", t:BF.L("Situations","Ситуации"), d:BF.L("122 moments, story + steps","122 ситуации: история и шаги")},
      {href:"#/games", ico:"puzzle", t:BF.L("Calm games","Спокойные игры"), d:BF.L("16 games · 3 levels","16 игр · 3 уровня")},
      {href:"#/diary?tab=today", ico:"bed", t:BF.L("Daily log","Дневник дня"), d:BF.L("Sleep, food, screens…","Сон, еда, экраны…")},
      {href:"#/diary?tab=outcomes&add=1", ico:"target", t:BF.L("Log a trigger","Записать триггер"), d:BF.L("How did it go?","Как прошло?")},
      {href:"#/diary?tab=diary&add=1", ico:"pencil", t:BF.L("Diary note","Запись в дневник"), d:BF.L("Mood 1–5 + comment","Настроение 1–5 + комментарий")},
      {href:"#/specialist", ico:"chart", t:BF.L("For the specialist","Для специалиста"), d:BF.L("Charts + printable report","Графики и отчёт для печати")},
      {href:"#/hero", ico:"user", t:BF.L("Edit hero","Изменить героя"), d:BF.L("Looks like "+name,"Похож на ребёнка")},
      {href:"#/quiz", ico:"refresh", t:BF.L("Retake quiz","Пройти квиз заново"), d:BF.L("Update the answers","Обновить ответы")}
    ];
    el.innerHTML = '<div class="home2 wrap">'+
      (c.isDemo?'<div class="demo-banner paper">'+I('sparkle',20)+'<div><b>'+BF.L("You're viewing demo data.","Вы смотрите демо-данные.")+'</b> '+BF.L("Mira is a fictional child with two weeks of sample entries.","Мира — вымышленный ребёнок с примерами записей за две недели.")+'</div><button class="btn small ghost" id="toReal">'+BF.L("Switch to my child","К моему ребёнку")+'</button></div>':'')+
      (blocked?'<div class="flag-banner paper">'+I('heart',26)+'<div><b>'+BF.L("We paused brave plans for now.","Мы пока приостановили смелые планы.")+'</b> '+BF.L("You mentioned something that deserves a specialist's support. Please talk with your pediatrician or a child mental-health professional. In a crisis in the US call or text <b>988</b>, or <b>911</b>.","Вы отметили то, что требует поддержки специалиста. Пожалуйста, обратитесь к педиатру или детскому психологу/психиатру. В кризисной ситуации в США — <b>988</b> или <b>911</b>, в Казахстане — <b>112</b> или телефон доверия <b>150</b>.")+' <a href="#/safety?from=quiz">'+BF.L("What to do","Что делать")+'</a></div></div>':'')+
      '<header class="h2-head">'+
        '<div class="h2-scene">'+BF.scene.render(sit ? sit.scene : "park|tree,ball|wave|sun|d", {avatar:c.avatar})+'</div>'+
        '<div class="h2-intro"><p class="eyebrow">'+greet+'</p><h1>'+BF.L(name+"'s home","Главная: "+name)+'</h1>'+
          '<div class="plan-meta"><span class="chip">'+I('star',14)+' '+c.stars+' '+BF.plural(c.stars, BF.L("star","звезда"),BF.L("stars","звезды"),"звёзд")+'</span><span class="chip">'+I('sun',14)+' '+BF.L(streak+" days in a row", streak+" "+BF.plural(streak,"день","дня","дней")+" подряд")+'</span><span class="chip">'+I('ladder',14)+' '+c.done.length+' '+BF.L("steps done","шагов пройдено")+'</span><a class="chip" href="#/plan">'+I('list',14)+' '+BF.L("Family plan","План для семьи")+'</a></div>'+
        '</div>'+
      '</header>'+
      '<div class="h2-grid">'+
        '<section class="today paper"><span class="tape"></span><h2>'+BF.L("Today","Сегодня")+'</h2>'+
          (step && !blocked ? '<div class="today-step"><p class="eyebrow">'+T(sit.title)+' · '+BF.L("step","шаг")+' '+(plan.current+1)+'/'+plan.ladder.length+'</p><p class="ts-text">'+esc(T(step.text))+'</p><div class="cel-actions"><a class="btn clay small" href="#/'+(plan.tag==="adhd"?"quest":"brave")+'/'+plan.id+'">'+I('play',16)+' '+BF.L("Open","Открыть")+'</a><a class="btn ghost small" href="#/game/'+plan.game+'?plan='+plan.id+'">'+I('hand',16)+' '+BF.L("Warm-up game","Игра-разминка")+'</a></div>'+
            '<div class="checkin"><b>'+BF.L("Evening check-in: how did the step go?","Вечерний чек-ин: как прошёл шаг?")+'</b><div class="ci-row">'+[["easy",BF.L("Easy","Легко")],["ok",BF.L("Okay","Нормально")],["hard",BF.L("Too hard","Слишком трудно")]].map(function(m){ return '<button class="btn small ghost ci-'+m[0]+'" data-ci="'+m[0]+'">'+m[1]+'</button>'; }).join("")+'</div></div></div>'
          : (!blocked ? '<p class="muted">'+BF.L("No active brave plan yet. Pick one below to start.","Пока нет активного плана. Выберите ситуацию ниже.")+'</p>' : '<p class="muted">'+BF.L("Games, diary and the specialist report are still available.","Игры, дневник и отчёт для специалиста по-прежнему доступны.")+'</p>'))+
          '<div class="mood-now"><b>'+BF.L("Mood stickers today","Настроение сегодня")+'</b><div class="mood-parts">'+BF.DAYPARTS.map(function(dp){ var m = todayMoods.filter(function(x){ return x.part===dp.v; }).pop(); return '<button class="mp '+(dp.v===partNow?'now':'')+'" data-part="'+dp.v+'"><span class="mp-st">'+(m?BF.moodFace(m.mood,34):'<span class="mp-empty">+</span>')+'</span><small>'+T(dp.t)+'</small></button>'; }).join("")+'</div></div>'+
        '</section>'+
        '<section class="tiles">'+tiles.map(function(t,k){ return '<a class="tile paper reveal d'+((k%4)+1)+'" href="'+t.href+'"><span class="tile-ico">'+I(t.ico,24)+'</span><b>'+t.t+'</b><small>'+t.d+'</small></a>'; }).join("")+
          '<button class="tile paper add-kid" id="addKid"><span class="tile-ico">'+I('plus',24)+'</span><b>'+BF.L("Add a child","Добавить ребёнка")+'</b><small>'+BF.L(st.realChildren().length+" of "+st.childLimit()+" on your plan","на тарифе: "+st.realChildren().length+" из "+st.childLimit())+'</small></button>'+
        '</section>'+
      '</div>'+
      (adapt.length?'<section class="adapt paper"><h2>'+I('sparkle',20)+' '+BF.L("Next steps from your trigger log","Следующие шаги по журналу триггеров")+'</h2><ul class="plain">'+adapt.map(function(a){ return '<li class="ad-'+a.kind+'">'+esc(T(a.text))+' <a href="#/library?open='+a.sit+'">'+BF.L("Open","Открыть")+'</a></li>'; }).join("")+'</ul></section>':'')+
      (recs.length?'<section class="start-here"><h2>'+BF.L("Picked for "+name,"Подобрано для: "+name)+'</h2><div class="stones-path">'+recs.map(function(s,ix){
        var has = !!c.plans[s.id];
        return '<article class="stone-card paper"><div class="sc-scene">'+BF.scene.render(s.scene,{avatar:c.avatar, size:"thumb"})+'</div>'+BF.ui.tagChip(s.tag)+'<h3>'+T(s.title)+'</h3><p class="muted">'+T(s.why)+'</p><div class="sc-actions">'+
          (s.tag!=="adhd"?'<button class="btn small clay" data-open="'+s.id+'" data-mode="brave">'+(has?BF.L("Open","Открыть"):BF.L("Make","Создать"))+' Brave Plan</button>':'')+(s.tag!=="anxiety"?'<button class="btn small sage" data-open="'+s.id+'" data-mode="quest">Routine Quest</button>':'')+'</div></article>';
      }).join("")+'</div></section>':'')+
    '</div>';
    el.querySelectorAll("[data-open]").forEach(function(b){ b.onclick = function(){ BF.plans.open(b.getAttribute("data-open"), b.getAttribute("data-mode")); }; });
    el.querySelector("#addKid").onclick = function(){ BF.addChildFlow(); };
    var tr = el.querySelector("#toReal"); if(tr) tr.onclick = function(){ var r = st.realChildren()[0] || st.addChild(); st.setActive(r.id); BF.renderShell(); BF.router.refresh(); };
    el.querySelectorAll(".mp").forEach(function(b){ b.onclick = function(){ BF.moodPicker(today, b.getAttribute("data-part"), function(){ BF.router.refresh(); }); }; });
    el.querySelectorAll("[data-ci]").forEach(function(b){ b.onclick = function(){ BF.plans.checkin(b.getAttribute("data-ci")); }; });
  }
};
