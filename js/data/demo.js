/* ==========================================================
   Demo child "Mira (demo)" with ~2 weeks of realistic data,
   so the parent dashboard and the specialist tab can be tried
   instantly. Clearly labeled; "Clear demo data" removes it.
   Fictional data — not a real child.
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  function pad(n){ return String(n).padStart(2,"0"); }
  function seed(n){ var x = Math.sin(n*9301+49297)*233280; return x - Math.floor(x); }
  function hm(mins){ mins = ((mins%1440)+1440)%1440; return pad(Math.floor(mins/60))+":"+pad(Math.round(mins%60)); }
  BF.seedDemo = function(){
    var st = BF.store, f = st.f;
    if(!st.realChildren().length && !st.children().length){ st.child(); }        // blank real child stays active
    var keepActive = f.active;
    if(st.children().some(function(c){ return c.isDemo; })) return;
    var c = st.addChild({ name:"Mira", age:8, pronoun:"she", profile:"both", isDemo:true, quizDone:true, avatarSaved:true, interest:"animals",
      hard:["mornings","homework","noise","fears"], fears:["separation","loud","tests"], tries:["reassure","repeat","stay"], motivators:["stars","time","choice"],
      avatar:{ skin:2, hair:"braids", hairColor:2, eyes:2, top:"stripes", topColor:4, bottom:"leggings", bottomColor:1, shoes:"sneakers", shoeColor:1, build:"slim", extra:"freckles" } });
    var today = new Date(); today.setHours(12,0,0,0);
    var days = []; for(var i=13;i>=0;i--){ var d = new Date(today); d.setDate(d.getDate()-i); days.push(d); }
    var plans = ["dropoff","homework","cafeteria"];
    plans.forEach(function(id, k){
      var p = BF.engine.buildPlan(BF.engine.find(id), c);
      var doneN = [3,4,2][k];
      for(var j=0;j<doneN;j++){ p.ladder[j].done = true; p.ladder[j].date = st.dayKey(days[2+j*3+k]); c.done.push({date:p.ladder[j].date, plan:p.id, text:p.ladder[j].text}); }
      p.current = doneN; p.created = st.dayKey(days[k]);
      if(k===2){ var parts = BF.engine.splitStep(p.ladder[2]); p.ladder.splice(2,1,parts[0],parts[1]); }
      c.plans[id] = p; c.planOrder.push(id);
    });
    c.activePlan = "dropoff";
    var diaryTxt = [
      ["Calm morning, left on time with the step cards.","Спокойное утро, вышли вовремя по карточкам."],
      ["Cried at the gate, but walked in after the high-five.","Плакала у ворот, но зашла после «дай пять»."],
      ["Homework took forever, two breaks helped.","Домашка тянулась долго, помогли два перерыва."],
      ["Loud lunch day — came home very tired.","Шумный день в столовой — пришла очень уставшей."],
      ["Proud: read the story to her little cousin.","Гордость: прочитала сказку двоюродному брату."],
      ["Slept badly, meltdown about socks in the morning.","Плохо спала, утром истерика из-за носков."],
      ["Good day overall, played with a friend after school.","В целом хороший день, после школы играла с подругой."]
    ];
    var outcomesPlan = [ [1,"dropoff","partly"],[2,"cafeteria","not"],[4,"dropoff","managed"],[5,"homework","partly"],[6,"cafeteria","partly"],[8,"homework","managed"],[9,"dryer","not"],[10,"dropoff","managed"],[11,"test","partly"],[12,"cafeteria","managed"],[13,"homework","managed"] ];
    days.forEach(function(d, i){
      var key = st.dayKey(d), weekend = d.getDay()===0 || d.getDay()===6, r = seed(i+1);
      var bed = 21*60 + Math.round((r*70) - 10) + (weekend?30:0), sleepH = 8 + Math.round((seed(i+7)*2.4)*4)/4;
      if(i===5 || i===9) sleepH = 7.75;
      var wake = bed + sleepH*60, wakings = sleepH<8.6 ? 2 : (seed(i+3)>0.7?1:0), q = sleepH<8.6 ? 2 : (sleepH>9.5?5:(seed(i+5)>0.5?4:3));
      var mood = Math.max(1, Math.min(5, Math.round(1.6 + (sleepH-7.6)*1.25 + (seed(i+11)-0.5))));
      var sugar = sleepH<8.6 ? 3 : Math.floor(seed(i+13)*3);
      c.daily[key] = {
        sleep:{ bed:hm(bed), wake:hm(wake), wakings:wakings, quality:q },
        food:{ breakfast:{items: seed(i+17)>0.8?["nothing"]:["porridge","fruit"].concat(seed(i+2)>0.5?["dairy"]:[]), text:""}, lunch:{items:["soup","bread"].concat(seed(i+4)>0.6?["meat"]:["pasta"]), text:""},
               dinner:{items:["pasta","veg"].concat(seed(i+6)>0.5?["fish"]:["meat"]), text:""}, snacks:{items: sugar>=2?["sweets","juice"]:["fruit"], text:""},
               appetite: Math.max(1, Math.min(5, Math.round(2+seed(i+19)*3))), sugar:sugar, newFood: i===7, note: i===7 ? "Tried hummus — liked it!" : "" },
        meds: [], activity: Math.round(20+seed(i+23)*60), screen: Math.round((sleepH<8.6?110:40)+seed(i+29)*50), outdoor: Math.round((weekend?90:30)+seed(i+31)*40),
        body: sleepH<8.6 ? ["tired"].concat(i===5?["tummy"]:[]) : (i===10?["cold"]:[]), school: !weekend, events: i===11?["test"]:(i===6?["guests"]:[]), eventNote:""
      };
      ["morning","midday","afternoon","evening"].forEach(function(part, pi){
        if(pi===1 && seed(i+pi+40)>0.6) return;
        var set = mood>=4 ? ["happy","calm","proud","calm"] : mood===3 ? ["calm","tired","worried","calm"] : ["worried","overwhelmed","angry","sad"];
        c.moods.push({ id:st.uid(), date:key, part:part, mood:set[(pi+i)%4] });
      });
      var t = diaryTxt[(i + (mood<3?5:0)) % diaryTxt.length];
      c.diary.push({ id:st.uid(), at:key+"T"+(20+(i%2))+":"+pad((i*7)%60), mood:mood, text:t[BF.lang()==="ru"?1:0] });
      c.days.push(key);
      c.stars += 1 + (i%3); c.starLog.push({date:key, n:1+(i%3), src:i%2?"game:trail":"brave step"});
      if(i%3===0) c.checkins.push({date:key, plan:"dropoff", mood:mood>=4?"easy":(mood===3?"ok":"hard"), step:c.plans.dropoff.ladder[c.plans.dropoff.current].text});
    });
    outcomesPlan.forEach(function(o, k){
      var d = days[o[0]], key = st.dayKey(d), lowSleep = c.daily[key].sleep.quality<=2;
      var res = lowSleep && o[2]==="managed" ? "partly" : o[2];
      c.outcomes.push({ id:st.uid(), at:key+"T"+pad(8+(k%8))+":"+pad((k*13)%60), sit:o[1], result:res, intensity: res==="not"?5:res==="partly"?3:2,
        reaction: res==="not" ? ["meltdown","cried"] : res==="partly" ? ["worried","distracted"] : ["calm"],
        helped: res==="not" ? ["quiet","hug"] : res==="partly" ? ["breath","timer"] : ["phrase","breath"],
        comment: res==="not" ? BF.L("Too loud today, needed to leave early.","Сегодня было слишком шумно, пришлось уйти пораньше.") : res==="partly" ? BF.L("Needed reminders, but got through.","Нужны были напоминания, но справилась.") : BF.L("Walked in on her own!","Зашла сама!") });
    });
    c.games = { trail:3, balloon:3, bubbles:2, memory:2, keys:2, simon:1 };
    c.gameLevels = { trail:"medium", bubbles:"medium", keys:"easy" };
    c.specialist = { name:"", role:"psych" };
    f.active = keepActive || f.active; f.demoSeeded = true; st.save();
    return c;
  };
  BF.clearDemo = function(){
    var st = BF.store; st.children().filter(function(c){ return c.isDemo; }).forEach(function(c){ st.removeChild(c.id); });
    st.updateFamily(function(f){ f.demoCleared = true; });
    if(!st.children().length) st.child();
  };
})();
