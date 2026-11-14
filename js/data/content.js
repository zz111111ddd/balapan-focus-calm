/* ==========================================================
   Bilingual content: quiz (7 steps per spec), interests,
   story templates, habits, phrase pools, moods, reactions.
   Plain-language parenting support — no medical claims.
   ========================================================== */
var BF = window.BF = window.BF || {};

BF.INTERESTS = {
  space:    { label:{en:"Space & rockets",ru:"Космос и ракеты"}, buddy:{en:"Pip the little rocket",ru:"ракета Пип"}, world:{en:"the Moon Road",ru:"Лунная дорога"}, power:{en:"count down from five like a rocket",ru:"посчитать от пяти до одного, как ракета на старте"} },
  dinos:    { label:{en:"Dinosaurs",ru:"Динозавры"}, buddy:{en:"Moss the tiny dinosaur",ru:"динозаврик Мох"}, world:{en:"Fern Valley",ru:"Папоротниковая долина"}, power:{en:"stomp slowly like a big, calm dinosaur",ru:"медленно потопать, как большой спокойный динозавр"} },
  animals:  { label:{en:"Animals",ru:"Животные"}, buddy:{en:"Juniper the fox",ru:"лисёнок Можжевельник"}, world:{en:"the Quiet Woods",ru:"Тихий лес"}, power:{en:"stretch tall like a giraffe",ru:"вытянуться вверх, как жираф"} },
  trains:   { label:{en:"Trains & cars",ru:"Поезда и машины"}, buddy:{en:"Tock the little train",ru:"паровозик Ток"}, world:{en:"Station Hill",ru:"Вокзальный холм"}, power:{en:"go chug-chug, one car at a time",ru:"ехать «чух-чух», по одному вагончику"} },
  ocean:    { label:{en:"The ocean",ru:"Море и океан"}, buddy:{en:"Wren the sea turtle",ru:"черепаха Рен"}, world:{en:"Shell Bay",ru:"Ракушечная бухта"}, power:{en:"breathe like slow waves",ru:"дышать, как медленные волны"} },
  building: { label:{en:"Building & robots",ru:"Конструкторы и роботы"}, buddy:{en:"Bolt the helper robot",ru:"робот-помощник Болт"}, world:{en:"Gear Town",ru:"город Шестерёнок"}, power:{en:"power up one block at a time",ru:"заряжаться по одному кубику"} },
  drawing:  { label:{en:"Drawing & art",ru:"Рисование"}, buddy:{en:"Doodle the pencil",ru:"карандаш Каляка"}, world:{en:"Paper Hills",ru:"Бумажные холмы"}, power:{en:"draw the feeling, then fold it away",ru:"нарисовать чувство и сложить листок"} },
  sports:   { label:{en:"Ball games",ru:"Мяч и спорт"}, buddy:{en:"Kick the bouncy ball",ru:"мячик Прыг"}, world:{en:"Meadow Field",ru:"Луговое поле"}, power:{en:"bounce, breathe, and aim",ru:"подпрыгнуть, выдохнуть и прицелиться"} }
};

/* Quiz — 6 question screens + the family plan screen = 7 steps (spec) */
BF.QUIZ = [
  { id:"child", kind:"child", title:{en:"Who are we making this for?",ru:"Для кого мы это делаем?"}, sub:{en:"First name or nickname, and age. It stays on this device.",ru:"Имя или домашнее прозвище и возраст. Всё остаётся только на этом устройстве."} },
  { id:"hard", kind:"multi", title:{en:"What's hardest right now?",ru:"Что сейчас труднее всего?"}, sub:{en:"Choose all that apply.",ru:"Можно выбрать несколько вариантов."},
    options:[ {v:"mornings",t:{en:"Mornings",ru:"Утро"}},{v:"homework",t:{en:"Homework",ru:"Домашка"}},{v:"bedtime",t:{en:"Sleep & bedtime",ru:"Сон и отбой"}},{v:"fears",t:{en:"Fears & worries",ru:"Страхи и тревоги"}},
              {v:"transitions",t:{en:"Switching activities",ru:"Переключение между делами"}},{v:"noise",t:{en:"Noisy, busy places",ru:"Шумные, людные места"}},{v:"losing",t:{en:"Losing & mistakes",ru:"Проигрыши и ошибки"}},{v:"screens",t:{en:"Ending screen time",ru:"Выключить планшет"}} ],
    profile:true },
  { id:"fears", kind:"multi", title:{en:"What does your child fear or avoid?",ru:"Чего ребёнок боится или избегает?"}, sub:{en:"Pick what you've actually seen.",ru:"Отметьте то, что вы действительно видели."},
    options:[ {v:"separation",t:{en:"Being apart from me",ru:"Расставаться со мной"}},{v:"sleepover",t:{en:"Sleeping away from home",ru:"Ночевать не дома"}},{v:"doctors",t:{en:"Doctors & dentists",ru:"Врачей и стоматолога"}},{v:"tests",t:{en:"Tests & being wrong",ru:"Контрольных и ошибок"}},
              {v:"dark",t:{en:"The dark, storms",ru:"Темноты, грозы"}},{v:"loud",t:{en:"Loud sounds",ru:"Громких звуков"}},{v:"new",t:{en:"New places & people",ru:"Новых мест и людей"}},{v:"speaking",t:{en:"Speaking in front of others",ru:"Выступать перед другими"}},{v:"none",t:{en:"Nothing specific",ru:"Ничего конкретного"},exclusive:true} ] },
  { id:"tries", kind:"multi", title:{en:"When your child is scared, what do you usually do?",ru:"Что вы обычно делаете, когда ребёнку страшно?"}, sub:{en:"No judgement — every loving parent does some of these.",ru:"Без оценок — любящие родители делают это все."},
    options:[ {v:"stay",t:{en:"Stay right next to them",ru:"Остаюсь рядом всё время"}},{v:"answer",t:{en:"Answer or speak for them",ru:"Отвечаю за него / за неё"}},{v:"cancel",t:{en:"Cancel or skip the plan",ru:"Отменяем то, чего он боится"}},{v:"reassure",t:{en:"Reassure again and again",ru:"Снова и снова успокаиваю"}},
              {v:"repeat",t:{en:"Repeat instructions many times",ru:"Повторяю просьбу много раз"}},{v:"screen",t:{en:"Give a screen to calm down",ru:"Даю планшет, чтобы успокоить"}} ] },
  { id:"interest", kind:"single", title:{en:"What does your child love?",ru:"Что ребёнок любит?"}, sub:{en:"Their buddy and story world will be built around it.",ru:"Под это мы подберём друга-помощника и мир истории."},
    options: Object.keys(BF.INTERESTS).map(function(k){ return {v:k, t:BF.INTERESTS[k].label}; }) },
  { id:"motivators", kind:"multi", title:{en:"What motivates your child?",ru:"Что мотивирует ребёнка?"}, sub:{en:"We'll use it for rewards. Then a short safety check.",ru:"Используем это для наград. Ниже — короткая проверка безопасности."},
    options:[ {v:"stars",t:{en:"Stars & stickers",ru:"Звёзды и наклейки"}},{v:"time",t:{en:"Special time with me",ru:"Особое время со мной"}},{v:"praise",t:{en:"Praise out loud",ru:"Похвала вслух"}},{v:"choice",t:{en:"Choosing what's next",ru:"Самому выбрать, что дальше"}},{v:"treat",t:{en:"A small treat",ru:"Маленькое угощение"}},{v:"play",t:{en:"Extra play time",ru:"Лишнее время на игру"}} ],
    safety:true }
];
BF.PROFILE_OPTS = [
  {v:"anxiety", t:{en:"Mostly worry & fears",ru:"Больше страхи и тревога"}},
  {v:"adhd", t:{en:"Mostly focus & starting",ru:"Больше внимание и «не может начать»"}},
  {v:"both", t:{en:"Both, honestly",ru:"Честно — и то, и другое"}},
  {v:"unsure", t:{en:"Not sure yet",ru:"Пока не уверены"}}
];
BF.FLAGS = [
  {v:"selfharm", t:{en:"Talks about hurting themselves or not wanting to live",ru:"Говорит о том, чтобы причинить себе вред или не жить"}},
  {v:"school", t:{en:"Has refused school for weeks",ru:"Неделями отказывается ходить в школу"}},
  {v:"panic", t:{en:"Panic attacks",ru:"Панические атаки"}},
  {v:"danger", t:{en:"Hurts others or is in danger",ru:"Причиняет вред другим или в опасности"}}
];
BF.RED_FLAGS = ["selfharm","school","panic","danger"];

/* Habits to drop (spec: family accommodation) */
BF.HABITS = {
  stay:{ drop:{en:"Staying right next to them the whole time",ru:"Быть рядом каждую минуту"}, instead:{en:"Stay close at first, then step back a little each day.",ru:"Сначала рядом, потом каждый день отходить чуть дальше."} },
  answer:{ drop:{en:"Answering or speaking for them",ru:"Отвечать за ребёнка"}, instead:{en:"Wait 5 seconds. Let them try, even quietly.",ru:"Подождать 5 секунд. Пусть попробует сам, даже тихо."} },
  cancel:{ drop:{en:"Cancelling the scary plan",ru:"Отменять то, чего он боится"}, instead:{en:"Shrink the step instead of skipping it.",ru:"Сделать шаг меньше, но не отменять."} },
  reassure:{ drop:{en:"Endless reassurance (“nothing bad will happen”)",ru:"Бесконечно успокаивать («ничего страшного не случится»)"}, instead:{en:"Say it once, then show confidence: “You can handle this.”",ru:"Сказать один раз и показать уверенность: «Ты справишься»."} },
  repeat:{ drop:{en:"Repeating the instruction again and again",ru:"Повторять просьбу снова и снова"}, instead:{en:"Say it once, show the step card, point — no words.",ru:"Сказать один раз, показать карточку шага и молча указать на неё."} },
  screen:{ drop:{en:"Screens as the main calm-down tool",ru:"Планшет как главный способ успокоить"}, instead:{en:"Try 3 balloon breaths or a 60-second movement break first.",ru:"Сначала 3 «вдоха-шарика» или минута движения."} }
};

/* Phrase pools — "acceptance + confidence" (spec) */
BF.PHRASES = {
  anxiety:{
    accept:[ {en:"I know this feels really scary for you.",ru:"Я знаю, что тебе правда страшно."},{en:"It makes sense that you feel worried.",ru:"Понятно, что ты волнуешься."},{en:"Your body is saying ‘new and scary’. That's okay.",ru:"Твоё тело говорит: «новое и страшно». Это нормально."},{en:"Lots of kids feel nervous about this.",ru:"Многие дети волнуются из-за этого."},{en:"You don't have to like it.",ru:"Тебе не обязательно это любить."},{en:"Worry feels big right now. It will get smaller.",ru:"Сейчас тревога большая. Она станет меньше."} ],
    confident:[ {en:"And I know you can handle it.",ru:"И я знаю, что ты справишься."},{en:"You can feel scared and still do it.",ru:"Можно бояться и всё равно сделать."},{en:"I'll be right here afterwards.",ru:"Я буду рядом сразу после."},{en:"You've been brave before. You can do it again.",ru:"Ты уже был смелым раньше. Получится и сейчас."},{en:"One small step is enough today.",ru:"Сегодня хватит одного маленького шага."},{en:"I believe in you.",ru:"Я в тебя верю."} ] },
  adhd:{
    accept:[ {en:"It's hard to start something boring. I get it.",ru:"Трудно начинать скучное дело. Я понимаю."},{en:"Your brain is busy with a lot of ideas.",ru:"У тебя в голове сейчас много идей."},{en:"It's hard to stop something fun.",ru:"Трудно остановиться, когда весело."},{en:"Waiting is hard work.",ru:"Ждать — это тяжёлая работа."},{en:"It's okay that it feels slow.",ru:"Ничего, что кажется, будто время тянется."},{en:"Lots of steps feel like too much. Let's make them small.",ru:"Много шагов — это слишком. Сделаем их маленькими."} ],
    confident:[ {en:"Just the first card. You've got this.",ru:"Только первая карточка. У тебя получится."},{en:"Let's beat the slow timer together.",ru:"Давай вместе обгоним медленный таймер."},{en:"I noticed you started on your own — that's big.",ru:"Я заметила, что ты начал сам — это здорово."},{en:"One step at a time. What's next?",ru:"По одному шагу. Что дальше?"},{en:"You're in charge of the timer.",ru:"Ты командуешь таймером."},{en:"Look how much you already did!",ru:"Смотри, сколько ты уже сделал!"} ] },
  both:{
    accept:[ {en:"Your heart and your brain are both busy today. That's okay.",ru:"Сегодня и сердце, и голова очень заняты. Это нормально."},{en:"It's a lot at once — noise, waiting, worry.",ru:"Слишком много сразу: шум, ожидание, тревога."},{en:"I see it's hard right now.",ru:"Я вижу, что сейчас тяжело."},{en:"Feeling wobbly and fizzy at once is normal.",ru:"Можно одновременно волноваться и не находить себе места."},{en:"You don't need to do it all — just the next bit.",ru:"Не нужно всё сразу — только следующий кусочек."},{en:"It's okay to need a break.",ru:"Это нормально — захотеть передышку."} ],
    confident:[ {en:"One breath, one step, one card.",ru:"Один вдох, один шаг, одна карточка."},{en:"You can feel wobbly and still be the one in charge.",ru:"Можно волноваться и всё равно быть главным."},{en:"Let's slow down together — and then you try.",ru:"Давай вместе замедлимся — а потом попробуешь ты."},{en:"Take a break, then come back. I know you can.",ru:"Отдохни и возвращайся. Я знаю, ты сможешь."},{en:"You handled hard things before.",ru:"Ты уже справлялся с трудным."},{en:"I'm proud of you for trying.",ru:"Я горжусь, что ты пробуешь."} ] }
};

BF.FEELINGS = { en:["wobbly","fluttery","tight","buzzy","fizzy"], ru:["как желе","будто там бабочки","тугим узелком","жужжащим","как газировка"] };

/* Story templates. Russian keeps the name in nominative; {g:masc|fem} picks gender. */
BF.STORY = {
  en:{
    open:[ "This is {name}. {name} lives near {world} and loves it there. {Their} best buddy is {buddy}.", "Every hero has a home base. {name}'s is {world}, where {buddy} is always nearby." ],
    anxiety:[ "One day {name} found out that soon {they} would {event}. {Their} tummy went {feel}. That's the brave feeling — it shows up when something new is coming.", "{Buddy} said: “Worry is like a wave. It rises… and then it goes down again. You don't have to make it go away.”", "So they made a ladder. Not one giant jump — five small steps. The first one was: {step1}.", "When the feeling got big, {name} remembered {their} trick: {power}. And {they} took the next step anyway.", "Step by step, {name} climbed. Maybe it wasn't perfect. But it was brave — and brave is what counts." ],
    adhd:[ "{name} has a busy, bright brain — full of ideas, like {world} on a sunny day. Sometimes it zooms right past the thing {they} need to do.", "Today the mission was to {event}. {Buddy} had a plan: “We don't do it all at once. We do ONE card, then tap Done.”", "First card: {step1}. The timer was a slow little circle. {name} watched it and kept going.", "Halfway there, it was time to move! {name} did a quick wiggle break, then came right back.", "Card by card, the mission was done. {Buddy} cheered: “You did each step — that's how big things get done!”" ],
    both:[ "{name} has a big heart and a busy brain. Sometimes worry and wiggles show up at the same time — and that's okay.", "Soon {name} would {event}. {Their} tummy went {feel}, and {their} thoughts started zooming in every direction.", "{Buddy} said: “Let's slow it all down. One breath. One step. One card at a time.” The first step was: {step1}.", "When it got loud inside, {name} used {their} trick: {power}. Then {they} looked at the next card — just one.", "Step by step, breath by breath, {name} did it. Worry came along for the ride, but {name} was the one driving." ],
    close:"The end — and the beginning of {name}'s brave ladder."
  },
  ru:{
    open:[ "Это {name}. {name} {g:живёт|живёт} рядом с местом под названием {world} и очень его любит. Лучший друг — {buddy}.", "У каждого героя есть свой дом. У героя по имени {name} это {world}, а рядом всегда {buddy}." ],
    anxiety:[ "Однажды {name} {g:узнал|узнала}, что скоро нужно будет {event}. В животике стало {feel}. Это смелое чувство — оно приходит, когда впереди что-то новое.", "{Buddy} шепчет: «Тревога — как волна. Она поднимается… а потом снова опускается. Не нужно её прогонять»." , "И они построили лесенку. Не один огромный прыжок, а пять маленьких шагов. Первый шаг: {step1}.", "Когда чувство становилось большим, {name} {g:вспоминал|вспоминала} свой приём: {power}. И всё равно {g:делал|делала} следующий шаг.", "Шаг за шагом {name} {g:поднимался|поднималась} всё выше. Может, не идеально. Зато смело — а это главное." ],
    adhd:[ "У героя по имени {name} быстрая, яркая голова, полная идей — как {world} в солнечный день. Иногда мысли проносятся мимо того, что нужно сделать.", "Сегодня задание было такое: {event}. {Buddy} предлагает план: «Не всё сразу. Делаем ОДНУ карточку и жмём „Готово“»." , "Первая карточка: {step1}. Таймер был медленным кружочком. {name} {g:смотрел|смотрела} на него и {g:продолжал|продолжала}.", "На середине пора было подвигаться! {name} быстро {g:размялся|размялась} и сразу {g:вернулся|вернулась} к делу.", "Карточка за карточкой — и задание выполнено. {Buddy} радуется: «Ты сделал каждый шаг — так и делаются большие дела!»" ],
    both:[ "У героя по имени {name} большое сердце и очень занятая голова. Иногда тревога и непоседливость приходят одновременно — и это нормально.", "Скоро нужно было {event}. В животике стало {feel}, а мысли разбежались во все стороны.", "{Buddy} шепчет: «Давай всё замедлим. Один вдох. Один шаг. Одна карточка». Первый шаг: {step1}.", "Когда внутри становилось шумно, {name} {g:вспоминал|вспоминала} свой приём: {power}. А потом {g:смотрел|смотрела} только на следующую карточку.", "Шаг за шагом, вдох за вдохом — {name} {g:справился|справилась}. Тревога ехала рядом, но за рулём был сам герой." ],
    close:"Конец — и начало смелой лесенки."
  }
};

BF.MOVES = [
  { t:{en:"Giraffe stretch",ru:"Жираф тянется"}, d:{en:"Reach up tall, slowly, for 5 counts. Then flop down like a rag doll.",ru:"Медленно тянемся вверх на 5 счётов. Потом расслабляемся, как тряпичная кукла."}, anim:"stretch" },
  { t:{en:"Frog hops",ru:"Лягушачьи прыжки"}, d:{en:"Five slow frog hops. Land soft, like a feather.",ru:"Пять медленных прыжков лягушкой. Приземляемся мягко, как пёрышко."}, anim:"hop" },
  { t:{en:"Tree pose",ru:"Поза дерева"}, d:{en:"Stand on one foot like a tree in the wind. Switch feet.",ru:"Стоим на одной ноге, как дерево на ветру. Меняем ногу."}, anim:"sway" },
  { t:{en:"Wall push",ru:"Толкаем стену"}, d:{en:"Push the wall like it's very heavy, for 10 counts. Then shake it out.",ru:"Толкаем стену, будто она очень тяжёлая, 10 счётов. Потом стряхиваем руки."}, anim:"push" }
];

/* Diary scale 1–5, moods, reactions, helpers */
BF.SCALE = [
  {v:1, t:{en:"Very hard day",ru:"Очень тяжёлый день"}, c:"#C98E70"},
  {v:2, t:{en:"Hard",ru:"Тяжело"}, c:"#D9B5A7"},
  {v:3, t:{en:"So-so",ru:"Так себе"}, c:"#E4CC8F"},
  {v:4, t:{en:"Good",ru:"Хорошо"}, c:"#A3B59C"},
  {v:5, t:{en:"Great day",ru:"Отличный день"}, c:"#6F8A6E"}
];
BF.MOODS = [
  {v:"happy", t:{en:"Happy",ru:"Радостно"}, val:5},
  {v:"calm", t:{en:"Calm",ru:"Спокойно"}, val:4},
  {v:"proud", t:{en:"Proud",ru:"Гордится"}, val:5},
  {v:"tired", t:{en:"Tired",ru:"Устал(а)"}, val:3},
  {v:"worried", t:{en:"Worried",ru:"Тревожно"}, val:2},
  {v:"sad", t:{en:"Sad",ru:"Грустно"}, val:2},
  {v:"angry", t:{en:"Angry",ru:"Злится"}, val:1},
  {v:"overwhelmed", t:{en:"Overwhelmed",ru:"Перегружен(а)"}, val:1}
];
BF.DAYPARTS = [ {v:"morning",t:{en:"Morning",ru:"Утро"}}, {v:"midday",t:{en:"Midday",ru:"День"}}, {v:"afternoon",t:{en:"After school",ru:"После школы"}}, {v:"evening",t:{en:"Evening",ru:"Вечер"}} ];
BF.REACTIONS = [
  {v:"calm",t:{en:"Stayed calm",ru:"Оставался спокойным"}},{v:"worried",t:{en:"Worried, asked “what if”",ru:"Волновался, спрашивал «а если…»"}},{v:"cried",t:{en:"Cried",ru:"Плакал"}},
  {v:"meltdown",t:{en:"Meltdown",ru:"Сорвался, истерика"}},{v:"froze",t:{en:"Froze / went quiet",ru:"Замер, замолчал"}},{v:"avoided",t:{en:"Refused / avoided",ru:"Отказался, избегал"}},
  {v:"shouted",t:{en:"Shouted",ru:"Кричал"}},{v:"ran",t:{en:"Ran off",ru:"Убежал"}},{v:"distracted",t:{en:"Drifted off task",ru:"Отвлекался, забывал задачу"}},{v:"body",t:{en:"Tummy ache / headache",ru:"Болел живот / голова"}}
];
BF.HELPERS = [
  {v:"breath",t:{en:"Balloon breathing",ru:"Дыхание-шарик"}},{v:"phrase",t:{en:"The calm phrase",ru:"Спокойная фраза"}},{v:"break",t:{en:"A short break",ru:"Короткий перерыв"}},{v:"hug",t:{en:"A hug",ru:"Объятие"}},
  {v:"timer",t:{en:"Visual timer",ru:"Наглядный таймер"}},{v:"game",t:{en:"A warm-up game",ru:"Игра-разминка"}},{v:"quiet",t:{en:"Quiet corner",ru:"Тихий уголок"}},{v:"headphones",t:{en:"Ear muffs",ru:"Наушники"}},{v:"choice",t:{en:"Giving a choice",ru:"Дать выбор"}},{v:"story",t:{en:"Reading the story",ru:"Читали историю"}}
];
BF.RESULTS = [ {v:"managed",t:{en:"Managed it",ru:"Справился"}}, {v:"partly",t:{en:"Partly",ru:"Частично"}}, {v:"not",t:{en:"Didn't manage",ru:"Не справился"}} ];
BF.ROLES = [ {v:"psych",t:{en:"Child psychologist",ru:"Детский психолог"}}, {v:"assistant",t:{en:"Teaching assistant",ru:"Педагог-ассистент"}}, {v:"speech",t:{en:"Speech therapist",ru:"Логопед"}}, {v:"defect",t:{en:"Special-needs educator",ru:"Дефектолог"}}, {v:"pediatric",t:{en:"Pediatrician",ru:"Педиатр"}}, {v:"teacher",t:{en:"Teacher",ru:"Учитель"}} ];

/* Sourced figures from the product spec (shown on landing with sources) */
BF.FACTS = [
  { n:"1 in 9", nru:"1 из 9", t:{en:"US children aged 3–17 have been diagnosed with ADHD (7.1M, 11.4%)",ru:"детей 3–17 лет в США имеют диагноз СДВГ (7,1 млн, 11,4%)"}, src:"CDC, 2022", url:"https://stacks.cdc.gov/view/cdc/160350" },
  { n:"11%", nru:"11%", t:{en:"of US children aged 3–17 have a current anxiety diagnosis",ru:"детей 3–17 лет в США имеют текущий диагноз тревожности"}, src:"CDC, 2022–2023", url:"https://www.cdc.gov/children-mental-health/data-research/index.html" },
  { n:"77.9%", nru:"77,9%", t:{en:"of children with ADHD have at least one other condition",ru:"детей с СДВГ имеют хотя бы одно сопутствующее расстройство"}, src:"CDC, 2022", url:"https://stacks.cdc.gov/view/cdc/160350" },
  { n:"up to 30%", nru:"до 30%", t:{en:"of children with ADHD also have an anxiety disorder (expert estimate)",ru:"детей с СДВГ также имеют тревожное расстройство (оценка экспертов)"}, src:"CHADD", url:"https://chadd.org/attention-article/space-a-parent-based-intervention-for-reducing-childhood-anxiety/" }
];

BF.TAGS = {
  anxiety:{ label:{en:"Anxiety",ru:"Тревожность"}, note:{en:"Worry, fear, avoidance",ru:"Страхи, тревога, избегание"} },
  adhd:{ label:{en:"ADHD / Focus",ru:"СДВГ / внимание"}, note:{en:"Starting, switching, waiting",ru:"Начать, переключиться, подождать"} },
  both:{ label:{en:"Both at once",ru:"И то, и другое"}, note:{en:"Anxiety + ADHD together",ru:"Тревожность + СДВГ вместе"} }
};
BF.CATS = {
  school:{en:"School",ru:"Школа и сад"}, home:{en:"Home",ru:"Дом"}, health:{en:"Doctor & care",ru:"Врачи и здоровье"},
  out:{en:"Out & about",ru:"На улице и в городе"}, social:{en:"Friends & play",ru:"Друзья и игры"}, travel:{en:"Travel",ru:"Поездки"}, feelings:{en:"Feelings & change",ru:"Чувства и перемены"}
};
BF.CAT_ICON = { school:"school", home:"home", health:"health", out:"out", social:"social", travel:"travel", feelings:"heart" };

/* Daily log (sleep, food, other factors) */
BF.MEALS = [ {v:"breakfast",t:{en:"Breakfast",ru:"Завтрак"}}, {v:"lunch",t:{en:"Lunch",ru:"Обед"}}, {v:"dinner",t:{en:"Dinner",ru:"Ужин"}}, {v:"snacks",t:{en:"Snacks",ru:"Перекусы"}} ];
BF.FOODS = [
  {v:"porridge",t:{en:"Porridge",ru:"Каша"}},{v:"eggs",t:{en:"Eggs",ru:"Яйца"}},{v:"bread",t:{en:"Bread",ru:"Хлеб"}},{v:"dairy",t:{en:"Dairy",ru:"Молочное"}},
  {v:"fruit",t:{en:"Fruit",ru:"Фрукты"}},{v:"veg",t:{en:"Vegetables",ru:"Овощи"}},{v:"soup",t:{en:"Soup",ru:"Суп"}},{v:"meat",t:{en:"Meat",ru:"Мясо"}},
  {v:"fish",t:{en:"Fish",ru:"Рыба"}},{v:"pasta",t:{en:"Pasta / rice",ru:"Макароны / рис"}},{v:"sweets",t:{en:"Sweets",ru:"Сладкое"}},{v:"juice",t:{en:"Juice / soda",ru:"Сок / газировка"}},
  {v:"fastfood",t:{en:"Fast food",ru:"Фастфуд"}},{v:"nothing",t:{en:"Skipped",ru:"Не ел(а)"}}
];
BF.APPETITE = [ {v:1,t:{en:"Very poor",ru:"Очень плохой"}},{v:2,t:{en:"Poor",ru:"Плохой"}},{v:3,t:{en:"Normal",ru:"Обычный"}},{v:4,t:{en:"Good",ru:"Хороший"}},{v:5,t:{en:"Very hungry",ru:"Очень голодный"}} ];
BF.SUGAR = [ {v:0,t:{en:"None",ru:"Нет"}},{v:1,t:{en:"A little",ru:"Немного"}},{v:2,t:{en:"Some",ru:"Средне"}},{v:3,t:{en:"A lot",ru:"Много"}} ];
BF.SLEEPQ = [ {v:1,t:{en:"Restless",ru:"Беспокойный"}},{v:2,t:{en:"Poor",ru:"Плохой"}},{v:3,t:{en:"Okay",ru:"Нормальный"}},{v:4,t:{en:"Good",ru:"Хороший"}},{v:5,t:{en:"Deep",ru:"Крепкий"}} ];
BF.BODY = [
  {v:"tummy",t:{en:"Tummy ache",ru:"Болел живот"}},{v:"constipation",t:{en:"Constipation",ru:"Запор"}},{v:"loose",t:{en:"Loose stools",ru:"Жидкий стул"}},
  {v:"headache",t:{en:"Headache",ru:"Головная боль"}},{v:"cold",t:{en:"Cold / runny nose",ru:"Простуда / насморк"}},{v:"fever",t:{en:"Fever",ru:"Температура"}},{v:"tired",t:{en:"Very tired",ru:"Сильная усталость"}}
];
BF.EVENTS = [
  {v:"test",t:{en:"Test / exam",ru:"Контрольная"}},{v:"guests",t:{en:"Guests / visit",ru:"Гости"}},{v:"trip",t:{en:"Trip",ru:"Поездка"}},{v:"conflict",t:{en:"Conflict",ru:"Конфликт"}},
  {v:"change",t:{en:"Change in routine",ru:"Смена распорядка"}},{v:"party",t:{en:"Party",ru:"Праздник"}},{v:"doctor",t:{en:"Doctor visit",ru:"Визит к врачу"}},{v:"success",t:{en:"Big success",ru:"Большой успех"}}
];
