/* Home (#/): the original v1 landing layout, bilingual, with live counts.
   #/welcome: first-run greeting + embedded parent quiz.
   #/parent:  the parent's main menu for the active child (quiz first if not done). */
var BF = window.BF = window.BF || {};
BF.screens.home = {
  title:{en:"Brave plans and focus quests for kids",ru:"Смелые шаги и спокойный фокус для детей"},
  render:function(el){ return BF.screens.home.landing(el); },
  landing:function(el){
    var s = BF.store.s, A = BF.avatar, I = BF.icon, started = s.quizDone, L = BF.L;
    var nSit = BF.SITUATIONS.length, nGames = BF.GAME_ORDER.length, ru = BF.lang()==="ru";
    var goStart = started ? "#/plan" : "#/welcome";
    el.innerHTML =
    '<div class="hero wrap">'+
      '<div class="hero-copy">'+
        '<p class="eyebrow reveal">'+L("For parents of kids 5–10 · anxiety, ADHD, or both","Для родителей детей 5–10 лет · тревожность, СДВГ или всё сразу")+'</p>'+
        '<h1 class="reveal d1">'+L("Turn tomorrow's worry into <em class=\"ul\">tonight's story.</em>","Пусть завтрашняя тревога станет <em class=\"ul\">сегодняшней сказкой.</em>")+'</h1>'+
        '<p class="lede reveal d2">'+L("Balapan builds a tiny brave plan where <b>your child is the hero</b> — a story, five small steps, and calm games that train focus and steady hands. Ten minutes a day, together.","Balapan составляет маленький план смелых шагов, где <b>главный герой — ваш ребёнок</b>: сказка, пять небольших шагов и спокойные игры, которые тренируют внимание и ловкость рук. Десять минут в день, вместе.")+'</p>'+
        '<div class="cta-row reveal d3">'+
          '<a class="btn big clay" href="'+goStart+'">'+(started?L("Open our family plan","Открыть план семьи"):L("Start — no sign-up","Начать без регистрации"))+' '+I('next',20)+'</a>'+
          '<a class="btn big ghost" href="#/games">'+L("Try a game first","Сначала попробовать игру")+'</a>'+
        '</div>'+
        '<p class="fine reveal d4">'+I('lock',16)+' '+L("Nothing to register. Everything stays in this browser.","Регистрироваться не нужно. Всё хранится только в этом браузере.")+(started?' · <a href="#/parent">'+L("Parent dashboard","Кабинет родителя")+'</a>':'')+'</p>'+
      '</div>'+
      '<div class="hero-art reveal d2" aria-hidden="true">'+
        '<div class="hero-blob"><div class="hero-scene">'+BF.ui.hills(0)+'</div></div>'+
        '<div class="hero-ladder">'+[0,1,2,3,4].map(function(i){ return '<span class="rung r'+i+'">'+BF.starSVG(22, i<2)+'</span>'; }).join("")+'</div>'+
        '<div class="hero-kid">'+A.svg(s.avatar,{size:220,pose:"wave"})+'</div>'+
        '<div class="hero-chick">'+A.chick(78)+'</div>'+
        '<div class="note n1 paper"><span class="tape"></span><b>'+L("Brave step 3","Смелый шаг 3")+'</b><br>'+L("Sit in the big dentist chair","Посидеть в большом кресле у стоматолога")+'</div>'+
        '<div class="note n2 paper"><span class="tape"></span>“'+L("You can feel nervous <i>and</i> still do it.","Можно волноваться <i>и</i> всё равно сделать.")+'”</div>'+
      '</div>'+
    '</div>'+

    '<section class="how wrap">'+
      '<h2 class="center reveal">'+L("How a calmer week works","Как проходит спокойная неделя")+'</h2>'+
      '<svg class="how-path" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M20 60 C200 0 300 120 500 60 C700 0 800 120 980 60" fill="none" stroke="#D6C09C" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/></svg>'+
      '<ol class="how-steps">'+
        [[L("A 2-minute parent quiz","Анкета для родителя на 2 минуты"),L("What's hard, how it looks, what your child loves. No diagnosis needed.","Что даётся трудно, как это выглядит, что любит ваш ребёнок. Диагноз не нужен.")],
         [L("Build the hero","Соберите героя"),L("Skin, hair, eyes, clothes, body shape — your child gets to see themselves being brave.","Кожа, волосы, глаза, одежда, фигура — ребёнок видит себя смелым героем.")],
         [L("Climb one small step","Один маленький шаг"),L("A story, a five-rung ladder, a timer for one task at a time, and stars for every try.","Сказка, лесенка из пяти ступенек, таймер для одного дела за раз и звёзды за каждую попытку.")],
         [L("Check in at night","Вечерняя отметка"),L("Easy, okay, or too hard? Too hard splits tomorrow's step in half. Never a fail.","Легко, нормально или слишком трудно? Если трудно, завтрашний шаг станет вдвое меньше. Провалов не бывает.")]].map(function(x,i){ return '<li class="reveal d'+(i+1)+'"><span class="num">'+(i+1)+'</span><h3>'+x[0]+'</h3><p>'+x[1]+'</p></li>'; }).join("")+
      '</ol>'+
    '</section>'+

    '<section class="venn-sec wrap">'+
      '<div class="venn-copy">'+
        '<p class="eyebrow">'+L("Built for the overlap","Когда всё вместе")+'</p>'+
        '<h2>'+L("Worry and wiggles often show up in the same child.","Тревожность и непоседливость часто встречаются у одного ребёнка.")+'</h2>'+
        '<p>'+L("Most apps pick one lane. Balapan treats <b>anxiety</b>, <b>focus struggles</b> and <b>both at once</b> as three real starting points — each with its own situations, words to say, and pacing.","Большинство приложений выбирают что-то одно. В Balapan три отправные точки: <b>тревожность</b>, <b>трудности с вниманием</b> и <b>всё сразу</b> — у каждой свои ситуации, свои слова и свой темп.")+'</p>'+
        '<a class="btn dusty" href="#/library">'+L("Browse "+nSit+" everyday situations","Смотреть "+nSit+" "+BF.plural(nSit,"житейскую ситуацию","житейские ситуации","житейских ситуаций"))+'</a>'+
      '</div>'+
      '<div class="venn" aria-hidden="true">'+
        '<div class="v v1"><span>'+L("Anxiety","Тревожность")+'<small>'+L("new places, goodbyes,<br>doctors, storms","новые места, прощания,<br>врачи, гроза")+'</small></span></div>'+
        '<div class="v v2"><span>'+L("ADHD / focus","СДВГ /<br>внимание")+'<small>'+L("mornings, homework,<br>switching, waiting","утро, уроки,<br>переключение, ожидание")+'</small></span></div>'+
        '<div class="v-mid"><b>'+L("Both","Всё сразу")+'</b><small>'+L("test day, loud lunch,<br>parties, travel","контрольная, столовая,<br>праздники, поездки")+'</small></div>'+
      '</div>'+
    '</section>'+

    '<section class="tools wrap">'+
      '<article class="tool calm-tool reveal">'+
        '<div class="tool-art">'+BF.screens.home.miniStory()+'</div>'+
        '<div><p class="eyebrow">'+L("Calm","Спокойствие")+'</p><h3>'+L("Brave Plan","План смелых шагов")+'</h3><p>'+L("A short read-aloud story starring your child, a five-step brave ladder, and parent phrases that mix <i>acceptance</i> with <i>confidence</i>.","Короткая сказка для чтения вслух, где главный герой — ваш ребёнок, лесенка из пяти смелых шагов и фразы для родителя, в которых есть и <i>понимание</i>, и <i>уверенность</i>.")+'</p></div>'+
      '</article>'+
      '<article class="tool focus-tool reveal d1">'+
        '<div class="tool-art"><div class="mini-timer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FBF7EF"/><path class="mt-wedge" d="M50 50 L50 10 A40 40 0 1 1 15.4 70 Z" fill="#A3B59C"/><circle cx="50" cy="50" r="5" fill="#3B3632"/></svg></div></div>'+
        '<div><p class="eyebrow">'+L("Focus","Внимание")+'</p><h3>'+L("Routine Quest","Карточки распорядка")+'</h3><p>'+L("One card at a time, a big slow timer, a satisfying Done button, and a 60-second movement break when the wiggles win.","По одной карточке, большой медленный таймер, приятная кнопка «Готово» и минутка движения, когда усидеть уже невозможно.")+'</p></div>'+
      '</article>'+
      '<article class="tool play-tool reveal d2">'+
        '<div class="tool-art"><svg viewBox="0 0 120 80" class="mini-trace"><path d="M10 60 C30 10 50 70 70 30 S100 20 110 50" fill="none" stroke="#E7D7BC" stroke-width="14" stroke-linecap="round"/><path class="mt-draw" d="M10 60 C30 10 50 70 70 30 S100 20 110 50" fill="none" stroke="#C98E70" stroke-width="5" stroke-linecap="round"/></svg></div>'+
        '<div><p class="eyebrow">'+L("Play","Игра")+'</p><h3>'+L(nGames+" calm games",nGames+" "+BF.plural(nGames,"спокойная игра","спокойные игры","спокойных игр"))+'</h3><p>'+L("Trace pictures, color, lace a shoe, find numbers in order — fine-motor and attention practice that earns stars for the next brave step.","Обводить картинки, раскрашивать, шнуровать ботинок, искать числа по порядку — тренировка внимания и мелкой моторики, а за неё звёзды к следующему смелому шагу.")+'</p></div>'+
      '</article>'+
    '</section>'+

    '<section class="promise wrap">'+
      '<div class="promise-card paper"><span class="tape"></span>'+
        '<div class="promise-ico">'+I('shield',30)+'</div>'+
        '<div><h3>'+L("Honest about what this is","Честно о том, что это")+'</h3><p>'+L("Balapan is a parenting support tool, not therapy, and it doesn't diagnose anything. If something feels bigger than everyday hard, we'll point you to a specialist — and in a crisis in the US, call or text <b>988</b>.","Balapan — помощник для родителей, а не терапия, и он ничего не диагностирует. Если трудности кажутся серьёзнее обычных, мы подскажем обратиться к специалисту. В кризисной ситуации в Казахстане звоните <b>112</b> или на телефон доверия <b>150</b>, в США — <b>988</b>.")+'</p><a href="#/safety">'+L("Read our safety page","О безопасности")+'</a></div>'+
      '</div>'+
      '<div class="final-cta"><h2>'+L("Ready to meet your child's hero?","Готовы познакомиться с героем вашего ребёнка?")+'</h2><a class="btn big clay" href="'+goStart+'">'+(started?L("Back to our plan","Вернуться к нашему плану"):L("Start the 2-minute quiz","Заполнить анкету за 2 минуты"))+'</a><p class="fine">'+L("3 plans free · then $12.99/month (2 children) or $79.99/year (up to 3 children)","3 плана бесплатно · затем $12.99 в месяц (2 ребёнка) или $79.99 в год (до 3 детей)")+'</p></div>'+
    '</section>';
  },
  miniStory:function(){
    return '<div class="mini-book"><div class="mb-page l"><span></span><span></span><span class="s"></span></div><div class="mb-page r">'+BF.avatar.svg(BF.store.s.avatar,{size:56,headOnly:true})+'</div></div>';
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
        '<p class="ob-links">'+(demo?'<button class="linkbtn" id="obDemo">'+BF.L("Just looking? Open the demo child, Mira","Просто посмотреть? Откройте демо-профиль Миры")+'</button> · ':'')+'<a href="#/about">'+BF.L("What is Balapan?","Что такое Balapan?")+'</a></p>'+
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
      {href:"#/library", ico:"book", t:BF.L("Situations","Ситуации"), d:BF.L(BF.SITUATIONS.length+" moments, story + steps",BF.SITUATIONS.length+" "+BF.plural(BF.SITUATIONS.length,"ситуация","ситуации","ситуаций")+": сказка и шаги")},
      {href:"#/games", ico:"puzzle", t:BF.L("Calm games","Спокойные игры"), d:BF.L(BF.GAME_ORDER.length+" games · 3 levels",BF.GAME_ORDER.length+" "+BF.plural(BF.GAME_ORDER.length,"игра","игры","игр")+" · 3 уровня")},
      {href:"#/diary?tab=today", ico:"bed", t:BF.L("Daily log","Дневник дня"), d:BF.L("Sleep, food, screens…","Сон, еда, экраны…")},
      {href:"#/diary?tab=outcomes&add=1", ico:"target", t:BF.L("Log a trigger","Записать трудный момент"), d:BF.L("How did it go?","Как прошло?")},
      {href:"#/diary?tab=diary&add=1", ico:"pencil", t:BF.L("Diary note","Запись в дневник"), d:BF.L("Mood 1–5 + comment","Настроение 1–5 + комментарий")},
      {href:"#/specialist", ico:"chart", t:BF.L("For the specialist","Для специалиста"), d:BF.L("Charts + printable report","Графики и отчёт для печати")},
      {href:"#/hero", ico:"user", t:BF.L("Edit hero","Изменить героя"), d:BF.L("Looks like "+name,"Похож на ребёнка")},
      {href:"#/family", ico:"heart", t:BF.L("Family","Семья"), d:BF.L("Children and plans","Дети и тарифы")},
      {href:"#/settings", ico:"gear", t:BF.L("Settings","Настройки"), d:BF.L("Voice, theme, data","Голос, тема, данные")},
      {href:"#/quiz", ico:"refresh", t:BF.L("Retake quiz","Заполнить анкету заново"), d:BF.L("Update the answers","Обновить ответы")}
    ];
    el.innerHTML = '<div class="home2 wrap">'+
      (c.isDemo?'<div class="demo-banner paper">'+I('sparkle',20)+'<div><b>'+BF.L("You're viewing demo data.","Вы смотрите демо-данные.")+'</b> '+BF.L("Mira is a fictional child with two weeks of sample entries.","Мира — вымышленный ребёнок с примерами записей за две недели.")+'</div><button class="btn small ghost" id="toReal">'+BF.L("Switch to my child","К моему ребёнку")+'</button></div>':'')+
      (blocked?'<div class="flag-banner paper">'+I('heart',26)+'<div><b>'+BF.L("We paused brave plans for now.","Мы поставили планы смелых шагов на паузу.")+'</b> '+BF.L("You mentioned something that deserves a specialist's support. Please talk with your pediatrician or a child mental-health professional. In a crisis in the US call or text <b>988</b>, or <b>911</b>.","Вы отметили то, что требует поддержки специалиста. Пожалуйста, обратитесь к педиатру или детскому психологу/психиатру. В кризисной ситуации в США — <b>988</b> или <b>911</b>, в Казахстане — <b>112</b> или телефон доверия <b>150</b>.")+' <a href="#/safety?from=quiz">'+BF.L("What to do","Что делать")+'</a></div></div>':'')+
      '<header class="h2-head">'+
        '<div class="h2-scene">'+BF.scene.render(sit ? sit.scene : "park|tree,ball|wave|sun|d", {avatar:c.avatar})+'</div>'+
        '<div class="h2-intro"><p class="eyebrow">'+greet+'</p><h1>'+BF.L(name+"'s home","Главная: "+name)+'</h1>'+
          '<div class="plan-meta"><span class="chip">'+I('star',14)+' '+c.stars+' '+BF.plural(c.stars, BF.L("star","звезда"),BF.L("stars","звезды"),"звёзд")+'</span><span class="chip">'+I('sun',14)+' '+BF.L(streak+" days in a row", streak+" "+BF.plural(streak,"день","дня","дней")+" подряд")+'</span><span class="chip">'+I('ladder',14)+' '+c.done.length+' '+BF.L("steps done","шагов пройдено")+'</span><a class="chip" href="#/plan">'+I('list',14)+' '+BF.L("Family plan","План для семьи")+'</a></div>'+
        '</div>'+
      '</header>'+
      '<div class="h2-grid">'+
        '<section class="today paper"><span class="tape"></span><h2>'+BF.L("Today","Сегодня")+'</h2>'+
          (step && !blocked ? '<div class="today-step"><p class="eyebrow">'+T(sit.title)+' · '+BF.L("step","шаг")+' '+(plan.current+1)+'/'+plan.ladder.length+'</p><p class="ts-text">'+esc(T(step.text))+'</p><div class="cel-actions"><a class="btn clay small" href="#/'+(plan.tag==="adhd"?"quest":"brave")+'/'+plan.id+'">'+I('play',16)+' '+BF.L("Open","Открыть")+'</a><a class="btn ghost small" href="#/game/'+plan.game+'?plan='+plan.id+'">'+I('hand',16)+' '+BF.L("Warm-up game","Игра-разминка")+'</a></div>'+
            '<div class="checkin"><b>'+BF.L("Evening check-in: how did the step go?","Вечером отметьте: как прошёл шаг?")+'</b><div class="ci-row">'+[["easy",BF.L("Easy","Легко")],["ok",BF.L("Okay","Нормально")],["hard",BF.L("Too hard","Слишком трудно")]].map(function(m){ return '<button class="btn small ghost ci-'+m[0]+'" data-ci="'+m[0]+'">'+m[1]+'</button>'; }).join("")+'</div></div></div>'
          : (!blocked ? '<p class="muted">'+BF.L("No active brave plan yet. Pick one below to start.","Пока нет активного плана. Выберите ситуацию ниже.")+'</p>' : '<p class="muted">'+BF.L("Games, diary and the specialist report are still available.","Игры, дневник и отчёт для специалиста по-прежнему доступны.")+'</p>'))+
          '<div class="mood-now"><b>'+BF.L("Mood stickers today","Настроение сегодня")+'</b><div class="mood-parts">'+BF.DAYPARTS.map(function(dp){ var m = todayMoods.filter(function(x){ return x.part===dp.v; }).pop(); return '<button class="mp '+(dp.v===partNow?'now':'')+'" data-part="'+dp.v+'"><span class="mp-st">'+(m?BF.moodFace(m.mood,34):'<span class="mp-empty">+</span>')+'</span><small>'+T(dp.t)+'</small></button>'; }).join("")+'</div></div>'+
        '</section>'+
        '<section class="tiles">'+tiles.map(function(t,k){ return '<a class="tile paper reveal d'+((k%4)+1)+'" href="'+t.href+'"><span class="tile-ico">'+I(t.ico,24)+'</span><b>'+t.t+'</b><small>'+t.d+'</small></a>'; }).join("")+
          '<button class="tile paper add-kid" id="addKid"><span class="tile-ico">'+I('plus',24)+'</span><b>'+BF.L("Add a child","Добавить ребёнка")+'</b><small>'+BF.L(st.realChildren().length+" of "+st.childLimit()+" on your plan","на тарифе: "+st.realChildren().length+" из "+st.childLimit())+'</small></button>'+
        '</section>'+
      '</div>'+
      (adapt.length?'<section class="adapt paper"><h2>'+I('sparkle',20)+' '+BF.L("Next steps from your trigger log","Что дальше — по вашим записям")+'</h2><ul class="plain">'+adapt.map(function(a){ return '<li class="ad-'+a.kind+'">'+esc(T(a.text))+' <a href="#/library?open='+a.sit+'">'+BF.L("Open","Открыть")+'</a></li>'; }).join("")+'</ul></section>':'')+
      (recs.length?'<section class="start-here"><h2>'+BF.L("Picked for "+name,"Подобрано для: "+name)+'</h2><div class="stones-path">'+recs.map(function(s,ix){
        var has = !!c.plans[s.id];
        return '<article class="stone-card paper"><div class="sc-scene">'+BF.scene.render(s.scene,{avatar:c.avatar, size:"thumb"})+'</div>'+BF.ui.tagChip(s.tag)+'<h3>'+T(s.title)+'</h3><p class="muted">'+T(s.why)+'</p><div class="sc-actions">'+
          (s.tag!=="adhd"?'<button class="btn small clay" data-open="'+s.id+'" data-mode="brave">'+(has?BF.L("Open Brave Plan","Открыть план смелых шагов"):BF.L("Make Brave Plan","Составить план смелых шагов"))+'</button>':'')+(s.tag!=="anxiety"?'<button class="btn small sage" data-open="'+s.id+'" data-mode="quest">'+BF.L("Routine Quest","Карточки распорядка")+'</button>':'')+'</div></article>';
      }).join("")+'</div></section>':'')+
    '</div>';
    el.querySelectorAll("[data-open]").forEach(function(b){ b.onclick = function(){ BF.plans.open(b.getAttribute("data-open"), b.getAttribute("data-mode")); }; });
    el.querySelector("#addKid").onclick = function(){ BF.addChildFlow(); };
    var tr = el.querySelector("#toReal"); if(tr) tr.onclick = function(){ var r = st.realChildren()[0] || st.addChild(); st.setActive(r.id); BF.renderShell(); BF.router.refresh(); };
    el.querySelectorAll(".mp").forEach(function(b){ b.onclick = function(){ BF.moodPicker(today, b.getAttribute("data-part"), function(){ BF.router.refresh(); }); }; });
    el.querySelectorAll("[data-ci]").forEach(function(b){ b.onclick = function(){ BF.plans.checkin(b.getAttribute("data-ci")); }; });
  }
};
BF.screens.welcome = {
  title:{en:"Let's get to know your child",ru:"Давайте познакомимся с ребёнком"},
  render:function(el){ return BF.store.s.quizDone ? BF.screens.home.menu(el) : BF.screens.home.onboarding(el); }
};
BF.screens.parent = {
  title:function(){ return BF.store.s.quizDone ? BF.L("Parent dashboard","Кабинет родителя") : BF.L("Let's get to know your child","Давайте познакомимся с ребёнком"); },
  render:function(el){ return BF.store.s.quizDone ? BF.screens.home.menu(el) : BF.screens.home.onboarding(el); }
};
