/* Parent dashboard: daily log (sleep, food, factors), diary (mood 1–5),
   trigger outcome log, mood stickers (day/week), progress. Per child. */
var BF = window.BF = window.BF || {};
(function(){
  var MOODC = { happy:["#E4CC8F","#B8964B"], calm:["#C9D6C2","#6F8A6E"], proud:["#EBCDBB","#A96C51"], tired:["#D8DCE2","#7C8790"], worried:["#D8E1E7","#5F7889"], sad:["#CBD5DE","#5F7889"], angry:["#E7C1B0","#A96C51"], overwhelmed:["#E3D3E0","#8B6F84"] };
  BF.moodFace = function(m, size){
    size = size||40; var cc = MOODC[m]||MOODC.calm, f = cc[1], mouth = "", eyes = '<circle cx="15" cy="18" r="2.2" fill="'+f+'"/><circle cx="29" cy="18" r="2.2" fill="'+f+'"/>', extra = "";
    if(m==="happy") mouth = '<path d="M13 26 q9 9 18 0" stroke="'+f+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    if(m==="calm") { mouth = '<path d="M15 27 q7 4 14 0" stroke="'+f+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; eyes = '<path d="M12 18 q3 -3 6 0 M26 18 q3 -3 6 0" stroke="'+f+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; }
    if(m==="proud") { mouth = '<path d="M13 25 q9 8 18 0" stroke="'+f+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; extra = '<path d="M22 2 l2 4 4 .6 -3 3 .8 4 -3.8 -2 -3.8 2 .8 -4 -3 -3 4 -.6z" fill="#E4CC8F" stroke="#B8964B" stroke-width=".8"/>'; }
    if(m==="tired") { mouth = '<path d="M17 28 h10" stroke="'+f+'" stroke-width="2.4" stroke-linecap="round"/>'; eyes = '<path d="M12 19 h6 M26 19 h6" stroke="'+f+'" stroke-width="2.2" stroke-linecap="round"/>'; extra = '<text x="31" y="11" font-size="8" fill="'+f+'">z</text>'; }
    if(m==="worried") mouth = '<path d="M14 29 q4 -4 8 0 q4 4 8 0" stroke="'+f+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    if(m==="sad") { mouth = '<path d="M14 30 q8 -7 16 0" stroke="'+f+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; extra = '<path d="M30 22 q2 4 0 5 q-2 -1 0 -5z" fill="#93A9BA"/>'; }
    if(m==="angry") { mouth = '<path d="M15 29 q7 -5 14 0" stroke="'+f+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; extra = '<path d="M11 13 l7 3 M33 13 l-7 3" stroke="'+f+'" stroke-width="2.2" stroke-linecap="round"/>'; }
    if(m==="overwhelmed") { mouth = '<ellipse cx="22" cy="28" rx="4" ry="3" fill="'+f+'"/>'; eyes = '<circle cx="15" cy="18" r="3" fill="none" stroke="'+f+'" stroke-width="1.8"/><circle cx="29" cy="18" r="3" fill="none" stroke="'+f+'" stroke-width="1.8"/>'; extra = '<path d="M6 8 q3 -4 6 0 M32 6 q3 -4 6 0" stroke="'+f+'" stroke-width="1.6" fill="none"/>'; }
    return '<svg class="mface" viewBox="0 0 44 40" width="'+size+'" height="'+size*40/44+'" aria-hidden="true"><path d="M22 3 C34 3 41 10 41 20 C41 31 33 37 22 37 C10 37 3 31 3 20 C3 10 10 3 22 3Z" fill="'+cc[0]+'" stroke="'+f+'" stroke-width="1.4" stroke-opacity=".5"/>'+eyes+mouth+extra+'</svg>';
  };
  BF.moodPicker = function(date, part, cb){
    var c = BF.store.s, T = BF.ui.T, cur = (c.moods||[]).filter(function(m){ return m.date===date && m.part===part; }).pop();
    var sh = BF.ui.sheet('<h2>'+BF.L("How does "+BF.ui.esc(BF.ui.heroName())+" feel?","Как себя чувствует "+BF.ui.esc(BF.ui.heroName())+"?")+'</h2><p class="muted">'+T(BF.DAYPARTS.find(function(d){ return d.v===part; }).t)+' · '+BF.dateFmt(date)+'</p><div class="mood-pick">'+BF.MOODS.map(function(m){ return '<button class="mpk'+(cur&&cur.mood===m.v?' on':'')+'" data-m="'+m.v+'">'+BF.moodFace(m.v,54)+'<small>'+T(m.t)+'</small></button>'; }).join("")+'</div>'+(cur?'<p class="center"><button class="linkbtn" id="mpDel">'+BF.L("Remove sticker","Убрать наклейку")+'</button></p>':''), "narrow");
    sh.querySelectorAll(".mpk").forEach(function(b){ b.onclick = function(){
      BF.store.update(function(x){ x.moods = x.moods.filter(function(m){ return !(m.date===date && m.part===part); }); x.moods.push({ id:BF.store.uid(), date:date, part:part, mood:b.getAttribute("data-m") }); });
      BF.store.markActive(); BF.sound.pop(); sh.close(); if(cb) cb();
    }; });
    var del = sh.querySelector("#mpDel"); if(del) del.onclick = function(){ BF.store.update(function(x){ x.moods = x.moods.filter(function(m){ return !(m.date===date && m.part===part); }); }); sh.close(); if(cb) cb(); };
  };
  function chips(key, list, val, multi){
    return '<div class="chips" data-key="'+key+'" data-multi="'+(multi?1:0)+'">'+list.map(function(o){ var on = multi ? (val||[]).indexOf(o.v)>=0 : val===o.v; return '<button type="button" class="chipbtn" data-v="'+o.v+'" aria-pressed="'+on+'">'+BF.ui.T(o.t)+'</button>'; }).join("")+'</div>';
  }
  function bindChips(root, onChange){
    root.querySelectorAll(".chips").forEach(function(box){
      box.addEventListener("click", function(e){
        var b = e.target.closest(".chipbtn"); if(!b) return; var multi = box.getAttribute("data-multi")==="1", key = box.getAttribute("data-key");
        if(!multi){ box.querySelectorAll(".chipbtn").forEach(function(x){ x.setAttribute("aria-pressed", x===b && b.getAttribute("aria-pressed")!=="true"); }); }
        else b.setAttribute("aria-pressed", b.getAttribute("aria-pressed")!=="true");
        var vals = Array.prototype.map.call(box.querySelectorAll('.chipbtn[aria-pressed="true"]'), function(x){ var v=x.getAttribute("data-v"); return /^\d+$/.test(v)? +v : v; });
        onChange(key, multi ? vals : (vals.length?vals[0]:null)); BF.sound.pop();
      });
    });
  }
  BF.diaryUtil = { chips:chips, bindChips:bindChips };
  function sleepHours(sl){
    if(!sl || !sl.bed || !sl.wake) return null;
    var b = sl.bed.split(":"), w = sl.wake.split(":"), bm = +b[0]*60+ +b[1], wm = +w[0]*60+ +w[1];
    var d = wm - bm; if(d<=0) d += 1440; return Math.round(d/60*4)/4;
  }
  BF.sleepHours = sleepHours;
  function localISO(d){ d = d||new Date(); return BF.store.dayKey(d)+"T"+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }

  BF.screens.diary = {
    title:{en:"Parent diary",ru:"Дневник родителя"},
    render:function(el, p, query){
      var st = BF.store, c = st.s, I = BF.icon, T = BF.ui.T, esc = BF.ui.esc;
      var tab = (query && query.tab) || "today";
      var tabs = [ ["today",BF.L("Daily log","День"),"bed"], ["diary",BF.L("Diary","Дневник"),"pencil"], ["outcomes",BF.L("Triggers","Трудные моменты"),"target"], ["moods",BF.L("Moods","Настроение"),"smile"], ["progress",BF.L("Progress","Прогресс"),"ladder"] ];
      el.innerHTML = '<div class="diary wrap">'+
        '<div class="d-head"><div><p class="eyebrow">'+BF.L("Parent dashboard","Кабинет родителя")+' · '+BF.ui.childChip(c,26)+'</p><h1>'+BF.L("Diary for "+esc(BF.ui.heroName()),"Дневник: "+esc(BF.ui.heroName()))+'</h1></div><a class="btn ghost small" href="#/specialist">'+I('chart',16)+' '+BF.L("Specialist view","Для специалиста")+'</a></div>'+
        '<div class="d-tabs" role="tablist">'+tabs.map(function(t){ return '<a role="tab" href="#/diary?tab='+t[0]+'" aria-selected="'+(t[0]===tab)+'">'+I(t[2],18)+'<span>'+t[1]+'</span></a>'; }).join("")+'</div>'+
        '<div id="dBody"></div></div>';
      var body = el.querySelector("#dBody");
      var V = BF.screens.diary.views;
      (V[tab]||V.today)(body, query||{});
    },
    views:{}
  };
  var V = BF.screens.diary.views;

  /* ---------- DAILY LOG ---------- */
  V.today = function(body, query){
    var st = BF.store, I = BF.icon, T = BF.ui.T, esc = BF.ui.esc;
    var date = query.date || st.today();
    function rec(){ var c = st.s; c.daily = c.daily || {}; if(!c.daily[date]) c.daily[date] = { sleep:{bed:"",wake:"",wakings:null,quality:null}, food:{breakfast:{items:[],text:""},lunch:{items:[],text:""},dinner:{items:[],text:""},snacks:{items:[],text:""},appetite:null,sugar:null,newFood:false,note:""}, meds:[], activity:0, screen:0, outdoor:0, body:[], school:null, events:[], eventNote:"" }; return c.daily[date]; }
    var d = rec(); var exists = true;
    function shift(n){ var x = new Date(date+"T12:00:00"); x.setDate(x.getDate()+n); var k = st.dayKey(x); if(k > st.today()) return; BF.router.go("/diary?tab=today&date="+k); }
    var hrs = sleepHours(d.sleep);
    function slider(key, val, max, step, ico, label){ return '<div class="slider-row"><label for="sl_'+key+'">'+I(ico,18)+' '+label+'</label><input type="range" id="sl_'+key+'" data-k="'+key+'" min="0" max="'+max+'" step="'+step+'" value="'+(val||0)+'"><output id="out_'+key+'">'+(val||0)+' '+BF.L("min","мин")+'</output></div>'; }
    body.innerHTML =
      '<div class="day-nav paper"><button class="btn small ghost" id="dPrev">'+I('back',16)+'</button><div><b>'+new Date(date+"T12:00:00").toLocaleDateString(BF.lang()==="ru"?"ru-RU":"en-US",{weekday:"long", day:"numeric", month:"long"})+'</b><small class="muted">'+BF.L("Saved automatically","Сохраняется автоматически")+'</small></div><button class="btn small ghost" id="dNext" '+(date>=st.today()?'disabled':'')+'>'+I('next',16)+'</button></div>'+
      '<div class="log-grid">'+
        '<section class="log-card paper"><h3>'+I('bed',20)+' '+BF.L("Sleep","Сон")+'</h3>'+
          '<div class="time-row"><label>'+BF.L("Bedtime","Лёг(ла) спать")+'<input type="time" class="input" id="tBed" value="'+(d.sleep.bed||"")+'"></label><label>'+BF.L("Wake time","Проснулся(ась)")+'<input type="time" class="input" id="tWake" value="'+(d.sleep.wake||"")+'"></label><div class="hrs"><b id="hrs">'+(hrs!=null?BF.ui.num(hrs,2):"—")+'</b><small>'+BF.L("hours","часов")+'</small></div></div>'+
          '<p class="lbl">'+BF.L("Night wakings","Ночные пробуждения")+'</p>'+chips("sleep.wakings", [0,1,2,3,4].map(function(n){ return {v:n,t:{en:n===4?"4+":String(n),ru:n===4?"4+":String(n)}}; }), d.sleep.wakings, false)+
          '<p class="lbl">'+BF.L("Sleep quality","Качество сна")+'</p>'+chips("sleep.quality", BF.SLEEPQ, d.sleep.quality, false)+
        '</section>'+
        '<section class="log-card paper"><h3>'+I('food',20)+' '+BF.L("Food","Питание")+'</h3>'+
          BF.MEALS.map(function(m){ var md = d.food[m.v]||{items:[],text:""}; return '<details class="meal"'+(m.v==="breakfast"?' open':'')+'><summary><b>'+T(m.t)+'</b><span class="meal-sum">'+md.items.map(function(v){ return BF.ui.lbl(BF.FOODS,v); }).join(", ")+'</span></summary>'+chips("food."+m.v, BF.FOODS, md.items, true)+'<input class="input small" data-text="food.'+m.v+'" placeholder="'+BF.L("What exactly (optional)","Что именно (необязательно)")+'" value="'+esc(md.text||"")+'"></details>'; }).join("")+
          '<p class="lbl">'+BF.L("Appetite","Аппетит")+'</p>'+chips("food.appetite", BF.APPETITE, d.food.appetite, false)+
          '<p class="lbl">'+BF.L("Sugar / sweets today","Сахар / сладкое сегодня")+'</p>'+chips("food.sugar", BF.SUGAR, d.food.sugar, false)+
          '<label class="toggle-row"><input type="checkbox" id="newFood" '+(d.food.newFood?'checked':'')+'> '+BF.L("Tried a new food","Была новая еда")+'</label>'+
          '<input class="input small" data-text="food.note" placeholder="'+BF.L("Food notes: sugar, new foods, reactions…","Заметки: сахар, новая еда, реакции…")+'" value="'+esc(d.food.note||"")+'">'+
        '</section>'+
        '<section class="log-card paper"><h3>'+I('run',20)+' '+BF.L("Day factors","Факторы дня")+'</h3>'+
          slider("activity", d.activity, 180, 5, "run", BF.L("Physical activity","Физическая активность"))+
          slider("screen", d.screen, 300, 10, "screen", BF.L("Screen time","Экранное время"))+
          slider("outdoor", d.outdoor, 240, 10, "tree", BF.L("Outdoor time","Время на улице"))+
          '<p class="lbl">'+BF.L("School / kindergarten day","Школа / детский сад")+'</p>'+chips("school", [{v:"yes",t:{en:"Yes",ru:"Да"}},{v:"no",t:{en:"No",ru:"Нет"}}], d.school===true?"yes":d.school===false?"no":null, false)+
          '<p class="lbl">'+BF.L("Tummy, toilet or illness","Живот, стул или болезнь")+'</p>'+chips("body", BF.BODY, d.body, true)+
          '<p class="lbl">'+BF.L("Notable events","Важные события")+'</p>'+chips("events", BF.EVENTS, d.events, true)+
          '<input class="input small" data-text="eventNote" placeholder="'+BF.L("Anything else that happened","Что ещё произошло")+'" value="'+esc(d.eventNote||"")+'">'+
        '</section>'+
        '<section class="log-card paper"><h3>'+I('pill',20)+' '+BF.L("Medication (optional)","Лекарства (необязательно)")+'</h3><p class="muted small">'+BF.L("Only if your doctor prescribed something. Name and time — for your own record.","Только если что-то назначил врач. Название и время — для вашего учёта.")+'</p>'+
          '<div id="meds">'+(d.meds||[]).map(function(m,i){ return '<div class="med-row"><input class="input small" data-med="'+i+'" data-f="name" value="'+esc(m.name)+'" placeholder="'+BF.L("Name","Название")+'"><input type="time" class="input small" data-med="'+i+'" data-f="time" value="'+esc(m.time||"")+'"><button class="btn small ghost" data-delmed="'+i+'" aria-label="'+BF.L("Remove","Удалить")+'">'+I('trash',16)+'</button></div>'; }).join("")+'</div>'+
          '<button class="btn small ghost" id="addMed">'+I('plus',16)+' '+BF.L("Add medication","Добавить лекарство")+'</button>'+
        '</section>'+
      '</div>';
    function save(msg){ st.save(); st.markActive(); }
    body.querySelector("#dPrev").onclick = function(){ shift(-1); };
    body.querySelector("#dNext").onclick = function(){ shift(1); };
    function upHrs(){ var h = sleepHours(d.sleep); body.querySelector("#hrs").textContent = h!=null ? BF.ui.num(h,2) : "—"; }
    body.querySelector("#tBed").onchange = function(e){ d = rec(); d.sleep.bed = e.target.value; upHrs(); save(); };
    body.querySelector("#tWake").onchange = function(e){ d = rec(); d.sleep.wake = e.target.value; upHrs(); save(); };
    bindChips(body, function(key, val){
      d = rec(); var parts = key.split(".");
      if(parts[0]==="sleep") d.sleep[parts[1]] = val;
      else if(parts[0]==="food"){ if(parts[1]==="appetite"||parts[1]==="sugar") d.food[parts[1]] = val; else { d.food[parts[1]].items = val; var sum = body.querySelector('[data-key="'+key+'"]').parentNode.querySelector(".meal-sum"); if(sum) sum.textContent = val.map(function(v){ return BF.ui.lbl(BF.FOODS,v); }).join(", "); } }
      else if(key==="school") d.school = val==="yes" ? true : val==="no" ? false : null;
      else d[key] = val;
      save();
    });
    body.querySelectorAll("[data-text]").forEach(function(inp){ inp.addEventListener("change", function(){ d = rec(); var k = inp.getAttribute("data-text").split("."); if(k.length===1) d[k[0]] = inp.value; else if(k[1]==="note") d.food.note = inp.value; else d.food[k[1]].text = inp.value; save(); }); });
    body.querySelector("#newFood").onchange = function(e){ d = rec(); d.food.newFood = e.target.checked; save(); };
    body.querySelectorAll('input[type="range"]').forEach(function(r){ r.addEventListener("input", function(){ var k = r.getAttribute("data-k"); d = rec(); d[k] = +r.value; body.querySelector("#out_"+k).textContent = r.value+" "+BF.L("min","мин"); }); r.addEventListener("change", function(){ save(); }); });
    body.querySelector("#addMed").onclick = function(){ d = rec(); d.meds.push({name:"", time:""}); save(); V.today(body, {date:date}); };
    body.querySelectorAll("[data-med]").forEach(function(inp){ inp.addEventListener("change", function(){ d = rec(); d.meds[+inp.getAttribute("data-med")][inp.getAttribute("data-f")] = inp.value; save(); }); });
    body.querySelectorAll("[data-delmed]").forEach(function(b){ b.onclick = function(){ d = rec(); d.meds.splice(+b.getAttribute("data-delmed"),1); save(); V.today(body, {date:date}); }; });
  };

  /* ---------- DIARY ---------- */
  function scaleBtns(val){ return '<div class="scale5">'+BF.SCALE.map(function(s){ return '<button type="button" data-v="'+s.v+'" aria-pressed="'+(val===s.v)+'" style="--c:'+s.c+'"><b>'+s.v+'</b><small>'+BF.ui.T(s.t)+'</small></button>'; }).join("")+'</div>'; }
  BF.diaryForm = function(entry, done){
    var e = entry || { at:localISO(), mood:null, text:"" };
    var sh = BF.ui.sheet('<h2>'+(entry?BF.L("Edit diary entry","Изменить запись"):BF.L("New diary entry","Новая запись"))+'</h2>'+
      '<div class="field"><label>'+BF.L("Date and time","Дата и время")+'</label><input type="datetime-local" class="input" id="deAt" value="'+e.at+'"></div>'+
      '<div class="field"><label>'+BF.L("How was the day? (1–5)","Каким был день? (1–5)")+'</label>'+scaleBtns(e.mood)+'</div>'+
      '<div class="field"><label for="deText">'+BF.L("Comment","Комментарий")+'</label><textarea class="input" id="deText" rows="4" placeholder="'+BF.L("What happened, what helped, what you noticed…","Что произошло, что помогло, что вы заметили…")+'">'+BF.ui.esc(e.text)+'</textarea></div>'+
      '<div class="cel-actions"><button class="btn clay" id="deSave">'+BF.L("Save","Сохранить")+'</button></div>', "narrow");
    var mood = e.mood;
    sh.querySelectorAll(".scale5 button").forEach(function(b){ b.onclick = function(){ mood = +b.getAttribute("data-v"); sh.querySelectorAll(".scale5 button").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); }; });
    sh.querySelector("#deSave").onclick = function(){
      if(!mood){ BF.ui.toast(BF.L("Pick a number from 1 to 5.","Выберите число от 1 до 5.")); return; }
      var data = { at: sh.querySelector("#deAt").value || localISO(), mood:mood, text: sh.querySelector("#deText").value.trim() };
      BF.store.update(function(x){ if(entry){ var t = x.diary.find(function(d){ return d.id===entry.id; }); Object.assign(t, data); } else x.diary.push(Object.assign({id:BF.store.uid()}, data)); });
      BF.store.markActive(); sh.close(); BF.ui.toast(BF.L("Saved to the diary.","Сохранено в дневник.")); if(done) done();
    };
  };
  V.diary = function(body, query){
    var c = BF.store.s, I = BF.icon, esc = BF.ui.esc, T = BF.ui.T;
    var list = (c.diary||[]).slice().sort(function(a,b){ return a.at<b.at?1:-1; });
    body.innerHTML = '<div class="d-actions"><button class="btn clay" id="deAdd">'+I('plus',18)+' '+BF.L("New entry","Новая запись")+'</button></div>'+
      (list.length ? '<ol class="timeline">'+list.map(function(e){ var s = BF.SCALE[e.mood-1]||BF.SCALE[2]; return '<li class="tl-item"><span class="tl-dot" style="--c:'+s.c+'">'+e.mood+'</span><div class="tl-card paper"><div class="tl-top"><b>'+BF.dateFmt(e.at,true)+'</b><span class="chip" style="--c:'+s.c+'">'+T(s.t)+'</span><span class="tl-tools"><button class="btn small ghost" data-edit="'+e.id+'" aria-label="'+BF.L("Edit","Изменить")+'">'+I('pencil',16)+'</button><button class="btn small ghost" data-del="'+e.id+'" aria-label="'+BF.L("Delete","Удалить")+'">'+I('trash',16)+'</button></span></div>'+(e.text?'<p>'+esc(e.text)+'</p>':'')+'</div></li>'; }).join("")+'</ol>'
        : '<div class="empty paper"><p class="muted">'+BF.L("No entries yet. A short note each evening makes patterns visible for you and a specialist.","Записей пока нет. Короткая заметка каждый вечер помогает увидеть закономерности — вам и специалисту.")+'</p></div>');
    function rerender(){ V.diary(body, {}); }
    body.querySelector("#deAdd").onclick = function(){ BF.diaryForm(null, rerender); };
    body.querySelectorAll("[data-edit]").forEach(function(b){ b.onclick = function(){ BF.diaryForm(c.diary.find(function(d){ return d.id===b.getAttribute("data-edit"); }), rerender); }; });
    body.querySelectorAll("[data-del]").forEach(function(b){ b.onclick = function(){ if(confirm(BF.L("Delete this entry?","Удалить запись?"))){ BF.store.update(function(x){ x.diary = x.diary.filter(function(d){ return d.id!==b.getAttribute("data-del"); }); }); rerender(); } }; });
    if(query.add) BF.diaryForm(null, rerender);
  };

  /* ---------- TRIGGER OUTCOMES ---------- */
  BF.outcomeForm = function(entry, presetSit, done){
    var T = BF.ui.T, esc = BF.ui.esc, e = entry || { at:localISO(), sit:presetSit||"", reaction:[], result:null, intensity:3, helped:[], comment:"" };
    var opts = Object.keys(BF.CATS).map(function(cat){ return '<optgroup label="'+T(BF.CATS[cat])+'">'+BF.SITUATIONS.filter(function(s){ return s.cat===cat; }).map(function(s){ return '<option value="'+s.id+'" '+(s.id===e.sit?'selected':'')+'>'+esc(T(s.title))+'</option>'; }).join("")+'</optgroup>'; }).join("");
    var sh = BF.ui.sheet('<h2>'+(entry?BF.L("Edit trigger outcome","Изменить запись"):BF.L("How did it go?","Как всё прошло?"))+'</h2>'+
      '<div class="field"><label>'+BF.L("Triggering situation","Что произошло")+'</label><select class="input" id="ofSit"><option value="">'+BF.L("Choose…","Выберите…")+'</option>'+opts+'</select></div>'+
      '<div class="field"><label>'+BF.L("When","Когда")+'</label><input type="datetime-local" class="input" id="ofAt" value="'+e.at+'"></div>'+
      '<div class="field"><label>'+BF.L("How did the child react?","Как ребёнок отреагировал?")+'</label>'+chips("reaction", BF.REACTIONS, e.reaction, true)+'</div>'+
      '<div class="field"><label>'+BF.L("Result","Итог")+'</label>'+chips("result", BF.RESULTS, e.result, false)+'</div>'+
      '<div class="field slider-row"><label for="ofInt">'+BF.L("Intensity","Интенсивность")+'</label><input type="range" id="ofInt" min="1" max="5" step="1" value="'+e.intensity+'"><output id="ofIntO">'+e.intensity+'/5</output></div>'+
      '<div class="field"><label>'+BF.L("What helped?","Что помогло?")+'</label>'+chips("helped", BF.HELPERS, e.helped, true)+'</div>'+
      '<div class="field"><label for="ofCom">'+BF.L("Comment","Комментарий")+'</label><textarea class="input" id="ofCom" rows="3">'+esc(e.comment)+'</textarea></div>'+
      '<div class="cel-actions"><button class="btn clay" id="ofSave">'+BF.L("Save","Сохранить")+'</button></div>', "narrow");
    var data = { reaction:e.reaction.slice(), result:e.result, helped:e.helped.slice() };
    bindChips(sh, function(k, v){ data[k] = v; });
    sh.querySelector("#ofInt").oninput = function(ev){ sh.querySelector("#ofIntO").textContent = ev.target.value+"/5"; };
    sh.querySelector("#ofSave").onclick = function(){
      var sit = sh.querySelector("#ofSit").value;
      if(!sit || !data.result){ BF.ui.toast(BF.L("Choose the situation and the result.","Выберите ситуацию и итог.")); return; }
      var rec = { at:sh.querySelector("#ofAt").value||localISO(), sit:sit, reaction:data.reaction, result:data.result, intensity:+sh.querySelector("#ofInt").value, helped:data.helped, comment:sh.querySelector("#ofCom").value.trim() };
      BF.store.update(function(x){ if(entry){ Object.assign(x.outcomes.find(function(o){ return o.id===entry.id; }), rec); } else x.outcomes.push(Object.assign({id:BF.store.uid()}, rec)); });
      BF.store.markActive(); sh.close();
      var a = BF.engine.adaptive().find(function(z){ return z.sit===sit; });
      BF.ui.toast(a ? BF.ui.esc(T(a.text)) : BF.L("Saved.","Сохранено."));
      if(done) done();
    };
  };
  V.outcomes = function(body, query){
    var c = BF.store.s, I = BF.icon, esc = BF.ui.esc, T = BF.ui.T;
    var list = (c.outcomes||[]).slice().sort(function(a,b){ return a.at<b.at?1:-1; });
    var adapt = BF.engine.adaptive(c);
    body.innerHTML = '<div class="d-actions"><button class="btn clay" id="ofAdd">'+I('plus',18)+' '+BF.L("Log a trigger outcome","Записать, как всё прошло")+'</button></div>'+
      (adapt.length?'<div class="adapt paper"><h3>'+I('sparkle',18)+' '+BF.L("Adaptive next steps","Что попробовать дальше")+'</h3><ul class="plain">'+adapt.slice(0,4).map(function(a){ return '<li class="ad-'+a.kind+'">'+esc(T(a.text))+'</li>'; }).join("")+'</ul></div>':'')+
      (list.length ? '<div class="oc-list">'+list.map(function(o){
        var r = BF.RESULTS.find(function(x){ return x.v===o.result; });
        return '<article class="oc paper oc-'+o.result+'"><div class="oc-top"><b>'+esc(BF.ui.sitTitle(o.sit))+'</b><span class="chip oc-res">'+(r?T(r.t):"")+'</span><span class="muted small">'+BF.dateFmt(o.at,true)+' · '+BF.L("intensity","интенсивность")+' '+o.intensity+'/5</span><span class="tl-tools"><button class="btn small ghost" data-edit="'+o.id+'">'+I('pencil',16)+'</button><button class="btn small ghost" data-del="'+o.id+'">'+I('trash',16)+'</button></span></div>'+
          '<p class="small"><b>'+BF.L("Reaction","Реакция")+':</b> '+(o.reaction||[]).map(function(v){ return BF.ui.lbl(BF.REACTIONS,v); }).join(", ")+(o.helped&&o.helped.length?' · <b>'+BF.L("Helped","Помогло")+':</b> '+o.helped.map(function(v){ return BF.ui.lbl(BF.HELPERS,v); }).join(", "):'')+'</p>'+(o.comment?'<p class="muted">'+esc(o.comment)+'</p>':'')+'</article>';
      }).join("")+'</div>' : '<div class="empty paper"><p class="muted">'+BF.L("No triggers logged yet. After a hard (or brave!) moment, note how it went — the next step adapts.","Пока нет записей. После трудного (или смелого!) момента отметьте, как всё прошло — следующий шаг подстроится.")+'</p></div>');
    function rerender(){ V.outcomes(body, {}); }
    body.querySelector("#ofAdd").onclick = function(){ BF.outcomeForm(null, null, rerender); };
    body.querySelectorAll("[data-edit]").forEach(function(b){ b.onclick = function(){ BF.outcomeForm(c.outcomes.find(function(o){ return o.id===b.getAttribute("data-edit"); }), null, rerender); }; });
    body.querySelectorAll("[data-del]").forEach(function(b){ b.onclick = function(){ if(confirm(BF.L("Delete this record?","Удалить запись?"))){ BF.store.update(function(x){ x.outcomes = x.outcomes.filter(function(o){ return o.id!==b.getAttribute("data-del"); }); }); rerender(); } }; });
    if(query.add) BF.outcomeForm(null, query.sit||null, rerender);
  };

  /* ---------- MOODS ---------- */
  V.moods = function(body, query){
    var st = BF.store, c = st.s, I = BF.icon, T = BF.ui.T;
    var view = query.view || "week", anchor = query.date || st.today();
    var base = new Date(anchor+"T12:00:00"), days = [];
    if(view==="week"){ var dow = (base.getDay()+6)%7; base.setDate(base.getDate()-dow); for(var i=0;i<7;i++){ var x = new Date(base); x.setDate(x.getDate()+i); days.push(st.dayKey(x)); } }
    else days = [anchor];
    function moodAt(d, p){ return (c.moods||[]).filter(function(m){ return m.date===d && m.part===p; }).pop(); }
    function go(n){ var x = new Date(anchor+"T12:00:00"); x.setDate(x.getDate()+n*(view==="week"?7:1)); BF.router.go("/diary?tab=moods&view="+view+"&date="+st.dayKey(x)); }
    var counts = {}; days.forEach(function(d){ BF.DAYPARTS.forEach(function(p){ var m = moodAt(d,p.v); if(m) counts[m.mood]=(counts[m.mood]||0)+1; }); });
    body.innerHTML = '<div class="day-nav paper"><button class="btn small ghost" id="mPrev">'+I('back',16)+'</button><div class="seg small"><button data-view="day" aria-pressed="'+(view==="day")+'">'+BF.L("Day","День")+'</button><button data-view="week" aria-pressed="'+(view==="week")+'">'+BF.L("Week","Неделя")+'</button></div><b>'+(view==="week"?BF.dateFmt(days[0])+" – "+BF.dateFmt(days[6]):BF.dateFmt(anchor))+'</b><button class="btn small ghost" id="mNext">'+I('next',16)+'</button></div>'+
      '<div class="mood-grid paper '+view+'"><div class="mg-row mg-head"><span></span>'+days.map(function(d){ var x = new Date(d+"T12:00:00"); return '<span class="'+(d===st.today()?'today':'')+'">'+BF.weekday(x)+'<small>'+x.getDate()+'</small></span>'; }).join("")+'</div>'+
        BF.DAYPARTS.map(function(p){ return '<div class="mg-row"><span class="mg-part">'+T(p.t)+'</span>'+days.map(function(d){ var m = moodAt(d,p.v); return '<button class="mg-cell" data-d="'+d+'" data-p="'+p.v+'" '+(d>st.today()?'disabled':'')+' aria-label="'+T(p.t)+' '+d+'">'+(m?BF.moodFace(m.mood, view==="week"?34:64):'<span class="mp-empty">+</span>')+(m&&view==="day"?'<small>'+BF.ui.lbl(BF.MOODS,m.mood)+'</small>':'')+'</button>'; }).join("")+'</div>'; }).join("")+
      '</div>'+
      '<div class="mood-sum paper"><h3>'+BF.L("This "+(view==="week"?"week":"day"),"За "+(view==="week"?"неделю":"день"))+'</h3>'+(Object.keys(counts).length?'<div class="ms-row">'+BF.MOODS.filter(function(m){ return counts[m.v]; }).map(function(m){ return '<span class="ms">'+BF.moodFace(m.v,30)+'<b>'+counts[m.v]+'</b><small>'+T(m.t)+'</small></span>'; }).join("")+'</div>':'<p class="muted">'+BF.L("No stickers yet — tap a cell to add one.","Наклеек пока нет — нажмите на клетку, чтобы добавить.")+'</p>')+'</div>';
    body.querySelector("#mPrev").onclick = function(){ go(-1); };
    body.querySelector("#mNext").onclick = function(){ go(1); };
    body.querySelectorAll("[data-view]").forEach(function(b){ b.onclick = function(){ BF.router.go("/diary?tab=moods&view="+b.getAttribute("data-view")+"&date="+anchor); }; });
    body.querySelectorAll(".mg-cell").forEach(function(b){ b.onclick = function(){ BF.moodPicker(b.getAttribute("data-d"), b.getAttribute("data-p"), function(){ V.moods(body, {view:view, date:anchor}); }); }; });
  };

  /* ---------- PROGRESS ---------- */
  V.progress = function(body){
    var st = BF.store, c = st.s, I = BF.icon, T = BF.ui.T, esc = BF.ui.esc;
    var plans = c.planOrder.map(function(id){ return c.plans[id]; }).filter(Boolean);
    var week = []; for(var i=6;i>=0;i--){ var d = new Date(); d.setDate(d.getDate()-i); week.push(st.dayKey(d)); }
    body.innerHTML = '<div class="stats-row">'+
      [[c.stars,BF.L("stars","звёзд"),"star"],[st.streak(),BF.L("days in a row","дней подряд"),"sun"],[c.done.length,BF.L("steps done","шагов пройдено"),"ladder"],[(c.outcomes||[]).filter(function(o){ return o.result==="managed"; }).length,BF.L("triggers managed","трудных моментов пройдено"),"target"]].map(function(s){ return '<div class="stat paper">'+I(s[2],22)+'<b>'+s[0]+'</b><small>'+s[1]+'</small></div>'; }).join("")+'</div>'+
      '<div class="week-strip paper"><h3>'+BF.L("This week","Эта неделя")+'</h3><div class="ws-row">'+week.map(function(d){ var on = c.days.indexOf(d)>=0, n = c.starLog.filter(function(x){ return x.date===d; }).reduce(function(a,x){ return a+x.n; },0); return '<span class="ws '+(on?'on':'')+'"><small>'+BF.weekday(new Date(d+"T12:00:00"))+'</small>'+(on?BF.starSVG(24,true):'<i></i>')+'<b>'+(n||"")+'</b></span>'; }).join("")+'</div></div>'+
      '<h2>'+BF.L("Plans","Планы")+'</h2>'+(plans.length?'<div class="pl-list">'+plans.map(function(p){ var done = p.ladder.filter(function(r){ return r.done; }).length; return '<a class="pl paper" href="#/'+(p.tag==="adhd"?"quest":"brave")+'/'+p.id+'">'+BF.ui.tagChip(p.tag)+'<b>'+esc(BF.ui.sitTitle(p.id))+'</b><span class="bar"><i style="width:'+Math.round(done/p.ladder.length*100)+'%"></i></span><small>'+done+'/'+p.ladder.length+'</small></a>'; }).join("")+'</div>':'<p class="muted">'+BF.L("No plans yet.","Планов пока нет.")+' <a href="#/library">'+BF.L("Open the library","Открыть библиотеку")+'</a></p>')+
      '<h2>'+BF.L("Game levels","Уровни в играх")+'</h2><div class="gl-list">'+BF.GAME_ORDER.map(function(id){ var g = BF.games[id]; if(!g) return ""; var lv = (c.gameLevels||{})[id]||"easy"; return '<span class="gl paper"><b>'+T(g.title)+'</b>'+BF.ui.stars((c.games||{})[id]||0,3,14)+'<small>'+BF.levelName(lv)+'</small></span>'; }).join("")+'</div>'+
      '<h2>'+BF.L("Evening check-ins","Вечерние отметки")+'</h2>'+((c.checkins||[]).length?'<ul class="plain">'+c.checkins.slice(-8).reverse().map(function(x){ return '<li>'+BF.dateFmt(x.date)+': <b>'+({easy:BF.L("easy","легко"),ok:BF.L("okay","нормально"),hard:BF.L("too hard","слишком трудно")}[x.mood])+'</b> — '+esc(BF.stepText(x.step))+'</li>'; }).join("")+'</ul>':'<p class="muted">'+BF.L("None yet.","Пока нет.")+'</p>');
  };
})();
