/* Specialist tab: per-child progress, triggers, reactions, outcomes,
   diary/mood/sleep/food trends, correlations, printable A4 report,
   JSON export/import. Uses only data stored in this browser. */
var BF = window.BF = window.BF || {};
(function(){
  function range(days, from, to){
    var st = BF.store, out = [];
    if(from && to){ var a = new Date(from+"T12:00:00"), b = new Date(to+"T12:00:00"); for(var d=new Date(a); d<=b; d.setDate(d.getDate()+1)) out.push(st.dayKey(d)); return out; }
    for(var i=days-1;i>=0;i--){ var x = new Date(); x.setDate(x.getDate()-i); out.push(st.dayKey(x)); }
    return out;
  }
  function avg(a){ a = a.filter(function(x){ return x!=null && !isNaN(x); }); return a.length ? a.reduce(function(s,x){ return s+x; },0)/a.length : null; }
  /* Collect per-day series for a child */
  BF.specData = function(c, days){
    var moodVal = {}; BF.MOODS.forEach(function(m){ moodVal[m.v]=m.val; });
    var S = { days:days, labels:days.map(function(d){ return BF.dateFmt(d); }), sleep:[], wakings:[], quality:[], diary:[], stickers:[], mood:[], meltdowns:[], screen:[], outdoor:[], activity:[], sugar:[], appetite:[], managed:[], partly:[], not:[], body:[], school:[] };
    days.forEach(function(d){
      var L = (c.daily||{})[d] || null;
      var h = L ? BF.sleepHours(L.sleep) : null;
      S.sleep.push(h); S.wakings.push(L&&L.sleep.wakings!=null?L.sleep.wakings:null); S.quality.push(L?L.sleep.quality:null);
      var dm = avg((c.diary||[]).filter(function(e){ return e.at.slice(0,10)===d; }).map(function(e){ return e.mood; }));
      var sm = avg((c.moods||[]).filter(function(m){ return m.date===d; }).map(function(m){ return moodVal[m.mood]; }));
      S.diary.push(dm); S.stickers.push(sm); S.mood.push(dm!=null ? dm : sm);
      var oc = (c.outcomes||[]).filter(function(o){ return o.at.slice(0,10)===d; });
      S.meltdowns.push(oc.filter(function(o){ return (o.reaction||[]).some(function(r){ return r==="meltdown"||r==="shouted"||r==="cried"; }); }).length);
      ["managed","partly","not"].forEach(function(k){ S[k].push(oc.filter(function(o){ return o.result===k; }).length); });
      var has = L && (h!=null || L.screen || L.outdoor || L.activity);
      S.screen.push(has?L.screen:null); S.outdoor.push(has?L.outdoor:null); S.activity.push(has?L.activity:null);
      S.sugar.push(L&&L.food.sugar!=null?L.food.sugar:null); S.appetite.push(L?L.food.appetite:null);
      S.body.push(L&&L.body?L.body.length:0); S.school.push(L?L.school:null);
    });
    return S;
  };
  function strength(r){
    if(r==null) return BF.L("not enough data","мало данных");
    var a = Math.abs(r), dir = r>0 ? BF.L("goes up together","растут вместе") : BF.L("moves in opposite directions","меняются в противоположные стороны");
    var s = a<0.2 ? BF.L("no clear link","нет явной связи") : a<0.4 ? BF.L("weak link","слабая связь") : a<0.6 ? BF.L("moderate link","умеренная связь") : BF.L("strong link","сильная связь");
    return a<0.2 ? s : s+" — "+dir;
  }
  BF.specBlocks = function(c, S, opts){
    var T = BF.ui.T, esc = BF.ui.esc, CH = BF.charts, COL = CH.COL, print = opts && opts.print;
    var outs = (c.outcomes||[]).filter(function(o){ return S.days.indexOf(o.at.slice(0,10))>=0; });
    var diary = (c.diary||[]).filter(function(e){ return S.days.indexOf(e.at.slice(0,10))>=0; }).sort(function(a,b){ return a.at<b.at?1:-1; });
    var moods = (c.moods||[]).filter(function(m){ return S.days.indexOf(m.date)>=0; });
    var aSleep = avg(S.sleep), aMood = avg(S.mood), melt = S.meltdowns.reduce(function(a,b){ return a+b; },0), managed = outs.filter(function(o){ return o.result==="managed"; }).length;
    var steps = (c.done||[]).filter(function(x){ return S.days.indexOf(x.date)>=0; }).length, active = (c.days||[]).filter(function(d){ return S.days.indexOf(d)>=0; }).length;
    var markers = []; S.meltdowns.forEach(function(n,i){ if(n) markers.push({i:i, t:BF.L("Meltdown / crying","Срыв / слёзы")+" ×"+n}); });
    var b = {};
    b.summary = '<div class="stats-row">'+[
      [aSleep!=null?BF.ui.num(aSleep,1):"—", BF.L("avg sleep, h","средний сон, ч")],[aMood!=null?BF.ui.num(aMood,1):"—", BF.L("avg mood (1–5)","среднее настроение (1–5)")],
      [melt, BF.L("meltdowns / crying","срывов / слёз")],[outs.length?Math.round(managed/outs.length*100)+"%":"—", BF.L("triggers managed","триггеров преодолено")],
      [steps, BF.L("brave steps done","смелых шагов")],[active+"/"+S.days.length, BF.L("active days","активных дней")]].map(function(s){ return '<div class="stat paper"><b>'+s[0]+'</b><small>'+s[1]+'</small></div>'; }).join("")+'</div>';
    b.sleepMood = '<h3>'+BF.L("Sleep hours vs mood","Часы сна и настроение")+'</h3>'+CH.barsLine({ w:860, h:250, labels:S.labels, bars:S.sleep, bMin:6, bMax:11, line:S.mood, lMin:1, lMax:5, markers:markers, label:BF.L("Sleep hours (bars) and mood (line)","Сон (столбцы) и настроение (линия)") })+
      CH.legend([{color:COL.dusty,t:BF.L("Sleep, hours (left)","Сон, часы (слева)")},{color:COL.clay,t:BF.L("Mood 1–5 (right)","Настроение 1–5 (справа)")},{color:COL.clay,t:BF.L("▼ meltdown / crying","▼ срыв / слёзы")}]);
    var pts = S.sleep.map(function(h,i){ return { x:h, y:S.mood[i], big:S.meltdowns[i]>0, color:S.meltdowns[i]?COL.clay:COL.sage, t:S.labels[i] }; });
    var rSM = CH.pearson(S.sleep, S.mood), rSMe = CH.pearson(S.sleep, S.meltdowns);
    b.scatter = '<h3>'+BF.L("Sleep and mood, each dot is a day","Сон и настроение, точка — один день")+'</h3>'+CH.scatter({ w:420, h:250, points:pts, xMin:6, xMax:11, yMin:1, yMax:5, xLabel:BF.L("sleep, hours","сон, часы"), yLabel:BF.L("mood","настроение"), label:BF.L("Sleep and mood","Сон и настроение") })+
      '<p class="small muted">r = '+(rSM==null?"—":BF.ui.num(rSM,2))+' · '+strength(rSM)+'</p>';
    b.outcomes = '<h3>'+BF.L("Trigger outcomes by day","Исходы триггеров по дням")+'</h3>'+CH.stacked({ w:440, h:230, labels:S.labels, series:[{name:T(BF.RESULTS[0].t),color:COL.sage,values:S.managed},{name:T(BF.RESULTS[1].t),color:COL.sand,values:S.partly},{name:T(BF.RESULTS[2].t),color:COL.clay,values:S.not}], label:BF.L("Trigger outcomes by day","Исходы триггеров по дням") })+
      CH.legend([{color:COL.sage,t:T(BF.RESULTS[0].t)},{color:COL.sand,t:T(BF.RESULTS[1].t)},{color:COL.clay,t:T(BF.RESULTS[2].t)}]);
    b.screen = '<h3>'+BF.L("Screen time vs mood","Экранное время и настроение")+'</h3>'+CH.barsLine({ w:440, h:230, labels:S.labels, bars:S.screen, bMin:0, bMax:Math.max(120, Math.max.apply(null, S.screen.map(function(x){ return x||0; }))), bColor:COL.sand, line:S.mood, lMin:1, lMax:5, label:BF.L("Screen time vs mood","Экранное время и настроение") })+
      CH.legend([{color:COL.sand,t:BF.L("Screen, min (left)","Экраны, мин (слева)")},{color:COL.clay,t:BF.L("Mood (right)","Настроение (справа)")}]);
    var factors = [ [BF.L("Sleep hours","Часы сна"), S.sleep], [BF.L("Night wakings","Ночные пробуждения"), S.wakings], [BF.L("Screen time","Экранное время"), S.screen], [BF.L("Outdoor time","Время на улице"), S.outdoor], [BF.L("Physical activity","Физическая активность"), S.activity], [BF.L("Sugar","Сахар"), S.sugar], [BF.L("Tummy / illness signs","Живот / болезнь"), S.body] ];
    b.corr = '<h3>'+BF.L("Possible links (correlation, not cause)","Возможные связи (корреляция, а не причина)")+'</h3><table class="ctable"><thead><tr><th>'+BF.L("Factor","Фактор")+'</th><th>'+BF.L("vs mood","с настроением")+'</th><th>'+BF.L("vs meltdowns","со срывами")+'</th></tr></thead><tbody>'+
      factors.map(function(f){ var r1 = CH.pearson(f[1], S.mood), r2 = CH.pearson(f[1], S.meltdowns); return '<tr><td>'+f[0]+'</td><td><b>'+(r1==null?"—":BF.ui.num(r1,2))+'</b> <small>'+strength(r1)+'</small></td><td><b>'+(r2==null?"—":BF.ui.num(r2,2))+'</b> <small>'+strength(r2)+'</small></td></tr>'; }).join("")+'</tbody></table>'+
      '<p class="fine">'+BF.L("Pearson r over the selected days. Small samples can mislead — use as conversation starters, not conclusions.","Коэффициент Пирсона за выбранные дни. На малых выборках возможны случайности — это повод для разговора, а не вывод.")+'</p>';
    var bySit = {}; outs.forEach(function(o){ var x = bySit[o.sit] = bySit[o.sit] || {n:0, managed:0, partly:0, not:0, int:[], react:{}, helped:{}}; x.n++; x[o.result]++; x.int.push(o.intensity); (o.reaction||[]).forEach(function(r){ x.react[r]=(x.react[r]||0)+1; }); (o.helped||[]).forEach(function(h){ x.helped[h]=(x.helped[h]||0)+1; }); });
    function top(obj, list){ return Object.keys(obj).sort(function(a,b){ return obj[b]-obj[a]; }).slice(0,3).map(function(k){ return BF.ui.lbl(list,k); }).join(", "); }
    b.triggers = '<h3>'+BF.L("Triggered situations, reactions and outcomes","Ситуации-триггеры, реакции и исходы")+'</h3>'+(Object.keys(bySit).length?'<table class="ctable"><thead><tr><th>'+BF.L("Situation","Ситуация")+'</th><th>'+BF.L("Times","Раз")+'</th><th>'+BF.L("Managed / partly / not","Справился / частично / нет")+'</th><th>'+BF.L("Avg intensity","Ср. интенсивность")+'</th><th>'+BF.L("Typical reactions","Типичные реакции")+'</th><th>'+BF.L("What helped","Что помогло")+'</th></tr></thead><tbody>'+
      Object.keys(bySit).sort(function(a,b){ return bySit[b].n-bySit[a].n; }).map(function(id){ var x = bySit[id]; return '<tr><td>'+esc(BF.ui.sitTitle(id))+'</td><td>'+x.n+'</td><td>'+x.managed+' / '+x.partly+' / '+x.not+'</td><td>'+BF.ui.num(avg(x.int),1)+'</td><td>'+top(x.react, BF.REACTIONS)+'</td><td>'+top(x.helped, BF.HELPERS)+'</td></tr>'; }).join("")+'</tbody></table>':'<p class="muted">'+BF.L("No trigger outcomes in this period.","За этот период нет записей о триггерах.")+'</p>');
    var byPart = {}; moods.forEach(function(m){ byPart[m.part] = byPart[m.part]||{}; byPart[m.part][m.mood] = (byPart[m.part][m.mood]||0)+1; });
    b.moodParts = '<h3>'+BF.L("Mood stickers by time of day","Наклейки настроения по времени суток")+'</h3><div class="mp-table">'+BF.DAYPARTS.map(function(p){ var x = byPart[p.v]||{}; return '<div class="mpt-row"><b>'+T(p.t)+'</b><span>'+BF.MOODS.filter(function(m){ return x[m.v]; }).map(function(m){ return '<span class="ms">'+(print?'':BF.moodFace(m.v,22))+'<small>'+T(m.t)+' ×'+x[m.v]+'</small></span>'; }).join("")+'</span></div>'; }).join("")+'</div>';
    var sleepRows = S.days.map(function(d,i){ var L=(c.daily||{})[d]; if(!L) return ""; var f=L.food; var meds=(L.meds||[]).filter(function(m){ return m.name; }).map(function(m){ return esc(m.name)+(m.time?" "+m.time:""); }).join(", ");
      if(S.sleep[i]==null && !L.screen && !L.activity) return "";
      return '<tr><td>'+S.labels[i]+'</td><td>'+(L.sleep.bed||"—")+'–'+(L.sleep.wake||"—")+' ('+(S.sleep[i]!=null?BF.ui.num(S.sleep[i],1):"—")+')</td><td>'+(L.sleep.wakings!=null?L.sleep.wakings:"—")+'</td><td>'+(L.sleep.quality||"—")+'</td><td>'+(f.appetite||"—")+'</td><td>'+(f.sugar!=null?BF.ui.lbl(BF.SUGAR,f.sugar):"—")+'</td><td>'+(L.screen||0)+'/'+(L.outdoor||0)+'/'+(L.activity||0)+'</td><td>'+(L.school===true?BF.L("yes","да"):L.school===false?BF.L("no","нет"):"—")+'</td><td>'+[(L.body||[]).map(function(v){ return BF.ui.lbl(BF.BODY,v); }).join(", "),(L.events||[]).map(function(v){ return BF.ui.lbl(BF.EVENTS,v); }).join(", "),meds,f.newFood?BF.L("new food","новая еда"):""].filter(Boolean).join("; ")+'</td></tr>'; }).join("");
    b.daily = '<h3>'+BF.L("Daily log: sleep, food and factors","Дневник дня: сон, питание и факторы")+'</h3>'+(sleepRows?'<div class="tscroll"><table class="ctable small"><thead><tr><th>'+BF.L("Date","Дата")+'</th><th>'+BF.L("Sleep (h)","Сон (ч)")+'</th><th>'+BF.L("Wakings","Пробужд.")+'</th><th>'+BF.L("Quality","Кач-во")+'</th><th>'+BF.L("Appetite","Аппетит")+'</th><th>'+BF.L("Sugar","Сахар")+'</th><th>'+BF.L("Screen/out/active, min","Экран/улица/актив., мин")+'</th><th>'+BF.L("School","Школа")+'</th><th>'+BF.L("Body, events, meds","Тело, события, лекарства")+'</th></tr></thead><tbody>'+sleepRows+'</tbody></table></div>':'<p class="muted">'+BF.L("No daily logs in this period.","За этот период нет записей дня.")+'</p>');
    b.diary = '<h3>'+BF.L("Diary entries","Записи дневника")+'</h3>'+(diary.length?'<ul class="plain diary-ex">'+diary.slice(0, print?40:8).map(function(e){ return '<li><b>'+BF.dateFmt(e.at,true)+' · '+e.mood+'/5</b> — '+esc(e.text||"")+'</li>'; }).join("")+'</ul>':'<p class="muted">'+BF.L("No diary entries in this period.","За этот период нет записей.")+'</p>');
    var plans = c.planOrder.map(function(id){ return c.plans[id]; }).filter(Boolean);
    b.plans = '<h3>'+BF.L("Brave plans and routine quests","Смелые планы и квесты")+'</h3>'+(plans.length?plans.map(function(p){ return '<div class="pr-plan"><b>'+esc(BF.ui.sitTitle(p.id))+'</b> ('+T(BF.TAGS[p.tag].label)+')<ol>'+p.ladder.map(function(r){ return '<li>'+esc(T(r.text))+' — '+(r.done?BF.L("done ","сделано ")+BF.dateFmt(r.date):BF.L("not yet","ещё нет"))+'</li>'; }).join("")+'</ol></div>'; }).join(""):'<p class="muted">'+BF.L("No plans yet.","Планов пока нет.")+'</p>');
    return b;
  };

  BF.screens.specialist = {
    title:{en:"Specialist view",ru:"Для специалиста"},
    render:function(el, p, query){
      var st = BF.store, I = BF.icon, T = BF.ui.T, esc = BF.ui.esc, q = query||{};
      var c = (q.child && st.f.children[q.child]) || st.s;
      var period = q.days || "14", from = q.from||"", to = q.to||"";
      var days = period==="custom" && from && to ? range(0, from, to) : range(period==="all" ? Math.max(1, Math.ceil((Date.now()-new Date((c.created||st.today())+"T00:00:00"))/864e5)+1) : +period);
      var S = BF.specData(c, days), B = BF.specBlocks(c, S);
      var sp = c.specialist || {};
      el.innerHTML = '<div class="spec wrap">'+
        '<div class="d-head"><div><p class="eyebrow">'+BF.L("Specialist tab","Вкладка специалиста")+'</p><h1>'+BF.L("Progress report","Отчёт о прогрессе")+'</h1><p class="muted">'+BF.L("For a psychologist, teaching assistant, speech therapist or pediatrician. Parent-recorded observations — not a medical record or assessment.","Для психолога, педагога-ассистента, логопеда или педиатра. Наблюдения родителя — не медицинская карта и не диагностика.")+'</p></div>'+
          '<div class="spec-actions"><button class="btn clay" id="spPrint">'+I('print',18)+' '+BF.L("Print A4 report","Печать отчёта A4")+'</button><button class="btn ghost" id="spExport">'+I('download',18)+' '+BF.L("Export JSON","Экспорт JSON")+'</button><label class="btn ghost">'+I('upload',18)+' '+BF.L("Import JSON","Импорт JSON")+'<input type="file" accept="application/json,.json" id="spImport" hidden></label></div></div>'+
        '<div class="spec-filters paper">'+
          '<label>'+BF.L("Child","Ребёнок")+'<select class="input" id="spChild">'+st.children().map(function(k){ return '<option value="'+k.id+'" '+(k.id===c.id?'selected':'')+'>'+esc(BF.ui.heroName(k))+(k.isDemo?' ('+BF.L("demo","демо")+')':'')+'</option>'; }).join("")+'</select></label>'+
          '<label>'+BF.L("Period","Период")+'<select class="input" id="spDays">'+[["7",BF.L("7 days","7 дней")],["14",BF.L("14 days","14 дней")],["30",BF.L("30 days","30 дней")],["all",BF.L("All time","Всё время")],["custom",BF.L("Custom…","Свой период…")]].map(function(o){ return '<option value="'+o[0]+'" '+(o[0]===period?'selected':'')+'>'+o[1]+'</option>'; }).join("")+'</select></label>'+
          '<label class="'+(period==="custom"?'':'hidden')+'" id="spFromL">'+BF.L("From","С")+'<input type="date" class="input" id="spFrom" value="'+from+'"></label><label class="'+(period==="custom"?'':'hidden')+'" id="spToL">'+BF.L("To","По")+'<input type="date" class="input" id="spTo" value="'+to+'"></label>'+
          '<label>'+BF.L("Specialist","Специалист")+'<select class="input" id="spRole">'+BF.ROLES.map(function(r){ return '<option value="'+r.v+'" '+(sp.role===r.v?'selected':'')+'>'+T(r.t)+'</option>'; }).join("")+'</select></label>'+
          '<label>'+BF.L("Name (optional)","Имя (необязательно)")+'<input class="input" id="spName" value="'+esc(sp.name||"")+'" placeholder="'+BF.L("e.g. Dr. Lee","например, Айгерим С.")+'"></label>'+
        '</div>'+
        '<div class="spec-child paper">'+BF.avatar.svg(c.avatar,{size:64, headOnly:true})+'<div><b>'+esc(BF.ui.heroName(c))+'</b>'+(c.isDemo?' <span class="demo-tag">'+BF.L("demo data","демо-данные")+'</span>':'')+'<br><small class="muted">'+BF.L("age","возраст")+' '+c.age+' · '+T((BF.PROFILE_OPTS.find(function(o){ return o.v===c.profile; })||BF.PROFILE_OPTS[3]).t)+' · '+BF.L("hardest","труднее всего")+': '+(c.hard||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[1].options,v); }).join(", ")+' · '+BF.L("fears","страхи")+': '+(c.fears||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[2].options,v); }).join(", ")+'</small></div></div>'+
        B.summary+
        '<div class="spec-grid"><section class="paper chart-card wide">'+B.sleepMood+'</section><section class="paper chart-card">'+B.scatter+'</section><section class="paper chart-card">'+B.outcomes+'</section><section class="paper chart-card">'+B.screen+'</section><section class="paper chart-card">'+B.moodParts+'</section></div>'+
        '<section class="paper chart-card">'+B.corr+'</section>'+
        '<section class="paper chart-card">'+B.triggers+'</section>'+
        '<section class="paper chart-card">'+B.daily+'</section>'+
        '<div class="spec-grid"><section class="paper chart-card">'+B.diary+'</section><section class="paper chart-card">'+B.plans+'</section></div>'+
      '</div>';
      function go(extra){ var o = { child:el.querySelector("#spChild").value, days:el.querySelector("#spDays").value, from:el.querySelector("#spFrom").value, to:el.querySelector("#spTo").value }; Object.assign(o, extra||{}); BF.router.go("/specialist?"+Object.keys(o).filter(function(k){ return o[k]; }).map(function(k){ return k+"="+encodeURIComponent(o[k]); }).join("&")); }
      el.querySelector("#spChild").onchange = function(){ go(); };
      el.querySelector("#spDays").onchange = function(e){ if(e.target.value==="custom"){ el.querySelector("#spFromL").classList.remove("hidden"); el.querySelector("#spToL").classList.remove("hidden"); var f = el.querySelector("#spFrom"), t = el.querySelector("#spTo"); if(!f.value){ f.value = days[0]; t.value = days[days.length-1]; } } go(); };
      el.querySelector("#spFrom").onchange = el.querySelector("#spTo").onchange = function(){ go({days:"custom"}); };
      function saveSp(){ c.specialist = { role:el.querySelector("#spRole").value, name:el.querySelector("#spName").value.trim() }; st.save(); }
      el.querySelector("#spRole").onchange = saveSp; el.querySelector("#spName").onchange = saveSp;
      el.querySelector("#spPrint").onclick = function(){ BF.printReport(c, days); };
      el.querySelector("#spExport").onclick = function(){
        var blob = new Blob([st.exportChild(c.id)], {type:"application/json"}), a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = "balapan-"+(c.name||"child").toLowerCase().replace(/[^a-zа-яё0-9]+/gi,"-")+"-"+st.today()+".json"; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
        BF.ui.toast(BF.L("Exported. Share the file only with people you trust.","Файл сохранён. Передавайте его только тем, кому доверяете."));
      };
      el.querySelector("#spImport").onchange = function(e){
        var file = e.target.files[0]; if(!file) return; var r = new FileReader();
        r.onload = function(){ try{ var k = st.importChild(r.result); BF.renderShell(); BF.ui.toast(BF.L("Imported: ","Импортировано: ")+esc(BF.ui.heroName(k))); BF.router.go("/specialist?child="+k.id); } catch(err){ BF.ui.toast(BF.L("This file isn't a Balapan export.","Это не файл экспорта Balapan.")); } };
        r.readAsText(file);
      };
    }
  };
  BF.printReport = function(c, days){
    var st = BF.store, T = BF.ui.T, esc = BF.ui.esc, S = BF.specData(c, days), B = BF.specBlocks(c, S, {print:true}), sp = c.specialist||{};
    document.getElementById("printArea").innerHTML = '<div class="pr">'+
      '<div class="pr-head"><div><h1>Balapan Focus &amp; Calm — '+BF.L("report for a specialist","отчёт для специалиста")+'</h1><p class="pr-sub">'+BF.L("Prepared by the parent on ","Подготовлено родителем ")+BF.dateFmt(st.today())+' · '+BF.L("period","период")+': '+BF.dateFmt(days[0])+' – '+BF.dateFmt(days[days.length-1])+(sp.role?' · '+BF.L("for","для")+': '+T(BF.ROLES.find(function(r){ return r.v===sp.role; }).t)+(sp.name?' '+esc(sp.name):''):'')+'</p></div>'+BF.avatar.chick(48)+'</div>'+
      '<table class="pr-meta"><tr><th>'+BF.L("Child","Ребёнок")+'</th><td>'+esc(BF.ui.heroName(c))+', '+BF.L("age","возраст")+' '+c.age+(c.isDemo?' ('+BF.L("demo data","демо-данные")+')':'')+'</td></tr><tr><th>'+BF.L("Parent's description","Описание родителя")+'</th><td>'+T((BF.PROFILE_OPTS.find(function(o){ return o.v===c.profile; })||BF.PROFILE_OPTS[3]).t)+'</td></tr><tr><th>'+BF.L("Hardest moments","Труднее всего")+'</th><td>'+(c.hard||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[1].options,v); }).join(", ")+'</td></tr><tr><th>'+BF.L("Fears","Страхи")+'</th><td>'+(c.fears||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[2].options,v); }).join(", ")+'</td></tr><tr><th>'+BF.L("Parent's usual responses","Обычные реакции родителя")+'</th><td>'+(c.tries||[]).map(function(v){ return BF.ui.lbl(BF.QUIZ[3].options,v); }).join(", ")+'</td></tr></table>'+
      B.summary+'<div class="pr-charts">'+B.sleepMood+'</div><div class="pr-two"><div>'+B.scatter+'</div><div>'+B.outcomes+'</div></div>'+B.corr+B.triggers+B.moodParts+B.daily+B.diary+B.plans+
      '<h3>'+BF.L("Questions for the specialist","Вопросы специалисту")+'</h3><div class="pr-lines"></div>'+
      '<p class="pr-foot">'+BF.L("Balapan is a parenting support tool, not therapy or a medical device. Correlations are not causes. In a crisis in the US call or text 988.","Balapan — инструмент поддержки родителя, не терапия и не медицинское изделие. Корреляция — не причина. В кризисной ситуации в США — 988, в Казахстане — 112 / 150.")+'</p></div>';
    window.print();
  };
})();
