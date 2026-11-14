/* ==========================================================
   Plan engine: situation + child profile -> Brave Plan /
   Routine Quest. Plans store only language-neutral data
   (ladder steps keep {en,ru}); story and phrases are rendered
   in the current language at view time, so EN/RU switching
   works for existing plans too.

   >>> LLM PLUG-IN POINT <<<
   BF.engine.generateWithLLM() is a stub. To use a real model:
   1. Create a serverless function that holds the API key
      server-side — NEVER put keys in this repo.
   2. Set BF.config.llmEndpoint = "/.netlify/functions/story".
   3. Return JSON {story:{en:[...],ru:[...]}}. Only the situation
      description is sent — never the child's name (spec ethics).
   ========================================================== */
var BF = window.BF = window.BF || {};
BF.config = BF.config || {};
BF.config.llmEndpoint = BF.config.llmEndpoint || null;
(function(){
  function pron(p){
    if(p==="she") return {they:"she", them:"her", their:"her"};
    if(p==="he") return {they:"he", them:"him", their:"his"};
    return {they:"they", them:"them", their:"their"};
  }
  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
  function lowerFirst(s){ return s ? s.charAt(0).toLowerCase()+s.slice(1) : s; }
  function hash(s){ var h=0; s=String(s); for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))|0; return Math.abs(h); }
  function T(o){ return BF.L(o); }

  function ctxFor(sit, child, lang){
    lang = lang || BF.lang();
    var c = child || BF.store.s, pr = pron(c.pronoun), it = BF.INTERESTS[c.interest] || BF.INTERESTS.space;
    var name = (c.name||"").trim() || (lang==="ru" ? "Алия" : "Sam");
    var feels = BF.FEELINGS[lang] || BF.FEELINGS.en;
    var pick = function(o){ return lang==="ru" ? (o.ru||o.en) : o.en; };
    var buddy = pick(it.buddy);
    var ctx = { name:name, they:pr.they, them:pr.them, their:pr.their, They:cap(pr.they), Their:cap(pr.their),
      buddy:buddy, Buddy:cap(buddy), world:pick(it.world), power:pick(it.power), event:pick(sit.event), feel:feels[hash(name+sit.id) % feels.length], fem: c.pronoun==="she" };
    sit.steps.forEach(function(s,i){ ctx["step"+(i+1)] = lowerFirst(pick(s)); });
    return ctx;
  }
  function fill(tpl, ctx){
    var out = tpl.replace(/\{g:([^|}]*)\|([^}]*)\}/g, function(m,a,b){ return ctx.fem ? b : a; })
                 .replace(/\{(\w+)\}/g, function(m,k){ return ctx[k]!=null ? ctx[k] : m; });
    if(ctx.they==="they") out = out.replace(/\bthey has\b/g,"they have").replace(/\bThey has\b/g,"They have").replace(/\bthey was\b/g,"they were");
    return out;
  }
  function story(sit, child, lang){
    lang = lang || BF.lang(); var ctx = ctxFor(sit, child, lang), S = BF.STORY[lang] || BF.STORY.en;
    var pages = [ fill(S.open[hash(sit.id) % S.open.length], ctx) ];
    S[sit.tag].forEach(function(t){ pages.push(fill(t, ctx)); });
    pages.push(fill(S.close, ctx));
    return pages;
  }
  /* "acceptance + confidence" phrases: 3 lines picked per situation */
  function phrases(sit){
    var P = BF.PHRASES[sit.tag] || BF.PHRASES.both, h = hash(sit.id);
    var a1 = P.accept[h % P.accept.length], c1 = P.confident[(h>>3) % P.confident.length];
    var a2 = P.accept[(h+2) % P.accept.length], c2 = P.confident[((h>>3)+3) % P.confident.length];
    return [ T(a1)+" "+T(c1), T(a2), T(c2) ];
  }
  function habitsFor(child){
    var tries = (child||BF.store.s).tries || [];
    var list = tries.map(function(k){ return BF.HABITS[k]; }).filter(Boolean);
    if(!list.length) list = [BF.HABITS.reassure, BF.HABITS.repeat];
    return list.slice(0,3);
  }
  function buildPlan(sit, child){
    return { id:sit.id, tag:sit.tag, created:BF.store.today(), current:0, game:sit.game, source:"template",
      ladder: sit.steps.map(function(s, i){ return { text:{en:s.en, ru:s.ru}, min:sit.mins[i]||3, done:false, date:null, practice:0 }; }) };
  }
  function splitStep(step){
    var t = step.text;
    return [
      { text:{ en:"Mini step: just the first part of “"+t.en.replace(/\.$/,"")+"” — for one minute, with you right beside them", ru:"Мини-шаг: только начало шага «"+t.ru.replace(/\.$/,"")+"» — одну минуту, вы рядом" }, min:Math.max(1, Math.round(step.min/2)), done:false, date:null, practice:0, mini:true },
      { text:t, min:step.min, done:false, date:null, practice:0 }
    ];
  }
  function generateWithLLM(sit, child){
    if(!BF.config.llmEndpoint) return Promise.resolve(null);
    var body = { system:"Write short, warm, non-clinical stories for kids 5-10, child is the hero, placeholder {name}. No medical claims. Return JSON {story:{en:[7],ru:[7]}}.",
      child:{ age:child.age, interest:child.interest, profile:child.profile }, situation:{ title:sit.title, tag:sit.tag, steps:sit.steps } };
    return fetch(BF.config.llmEndpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ if(!j || !j.story) return null; var b = buildPlan(sit, child); b.llmStory = j.story; b.source="llm"; return b; })
      .catch(function(){ return null; });
  }
  function generate(sit, child){ child = child || BF.store.s; return generateWithLLM(sit, child).then(function(p){ return p || buildPlan(sit, child); }); }
  function planStory(plan, sit, child){
    if(plan && plan.llmStory){ var pages = plan.llmStory[BF.lang()] || plan.llmStory.en; var nm = ((child||BF.store.s).name||"").trim()||"Sam"; return pages.map(function(p){ return p.replace(/\{name\}/g, nm); }); }
    return story(sit, child);
  }

  /* Quiz answers -> starting situations */
  var HARD_MAP = { mornings:["morning","dressed","pack"], homework:["homework","test","worksheet"], bedtime:["bedtime","dark","separationnight"], fears:["storm","dog","nightmare"],
    transitions:["switch","screens","parkleave"], noise:["cafeteria","party","dryer"], losing:["losing","mistakes","tryout"], screens:["screens","sleepwind"] };
  var FEAR_MAP = { separation:["dropoff","babysitter"], sleepover:["sleepover","grandma"], doctors:["dentist","shot","bloodtest"], tests:["test","mistakes"], dark:["dark","storm","monsters"],
    loud:["dryer","firedrill","cinema"], "new":["newplace","clubnew","kindergarten"], speaking:["showtell","presentation","askhelp"] };
  function find(id){ return BF.SITUATIONS.find(function(s){ return s.id===id; }); }
  function recommend(child, n){
    child = child || BF.store.s; n = n||3;
    var prof = (child.profile==="unsure"||!child.profile) ? null : child.profile, picks = [];
    function add(id){ if(picks.indexOf(id)<0 && find(id)) picks.push(id); }
    // adaptive: situations where the last outcome was hard come first
    adaptive(child).forEach(function(a){ if(a.kind!=="next") add(a.sit); });
    (child.hard||[]).forEach(function(h){ (HARD_MAP[h]||[]).forEach(add); });
    (child.fears||[]).forEach(function(f){ (FEAR_MAP[f]||[]).forEach(add); });
    var list = picks.map(find);
    if(prof) list.sort(function(a,b){ return (b.tag===prof||b.tag==="both") - (a.tag===prof||a.tag==="both"); });
    BF.SITUATIONS.forEach(function(s){ if(list.length<n && list.indexOf(s)<0 && (!prof || s.tag===prof)) list.push(s); });
    return list.slice(0,n);
  }
  /* Outcome log -> next-step suggestions (bilingual) */
  function adaptive(child){
    child = child || BF.store.s; var last = {}, out = [];
    (child.outcomes||[]).slice().sort(function(a,b){ return a.at<b.at?-1:1; }).forEach(function(o){ if(o.sit) last[o.sit]=o; });
    Object.keys(last).forEach(function(id){
      var o = last[id], s = find(id); if(!s) return;
      var helped = (o.helped||[]).map(function(h){ var x = BF.HELPERS.find(function(k){ return k.v===h; }); return x ? T(x.t).toLowerCase() : null; }).filter(Boolean);
      if(o.result==="not") out.push({ sit:id, kind:"split", at:o.at, text:{ en:"Last time “"+s.title.en+"” was too hard. Make the next step smaller and practice it twice"+(helped.length?" — keep using "+helped.join(", "):"")+".", ru:"В прошлый раз «"+s.title.ru+"» было слишком трудно. Сделайте следующий шаг меньше и потренируйте его дважды"+(helped.length?" — продолжайте использовать: "+helped.join(", "):"")+"." } });
      else if(o.result==="partly") out.push({ sit:id, kind:"repeat", at:o.at, text:{ en:"“"+s.title.en+"” went partly well. Repeat the same step until it feels boring"+(helped.length?" — "+helped[0]+" helped":"")+".", ru:"«"+s.title.ru+"» получилось частично. Повторяйте этот же шаг, пока он не станет скучным"+(helped.length?" — помогло: "+helped[0]:"")+"." } });
      else out.push({ sit:id, kind:"next", at:o.at, text:{ en:"“"+s.title.en+"” was managed! Ready for the next rung.", ru:"С «"+s.title.ru+"» справились! Можно переходить к следующей ступеньке." } });
    });
    return out.sort(function(a,b){ return a.at<b.at?1:-1; });
  }
  /* Step texts are stored as {en,ru}. Older saves (and the old demo seed) stored plain English strings:
     map them back to the situation's bilingual text so Russian never shows English steps. */
  var stepMap = null;
  function stepObj(v){
    if(!v || typeof v === "object") return v;
    if(!stepMap){ stepMap = {}; BF.SITUATIONS.forEach(function(s){ (s.steps||[]).forEach(function(t){ stepMap[t.en.trim()] = {en:t.en, ru:t.ru}; }); }); }
    var str = String(v).trim(), m;
    if(stepMap[str]) return stepMap[str];
    if((m = str.match(/^Quest card: (.*)$/))){ var q = stepObj(m[1]); return typeof q==="object" ? {en:"Quest card: "+q.en, ru:"Карточка распорядка: "+q.ru} : v; }
    if((m = str.match(/^Mini step: just the first part of “(.*)” — for one minute, with you right beside them$/))){ var b = stepObj(m[1]) || stepObj(m[1]+"."); if(typeof b==="object") return splitStep({text:b, min:2})[0].text; }
    return v;
  }
  function stepText(v){ var o = stepObj(v); return o && typeof o === "object" ? BF.L(o) : (o||""); }
  BF.stepText = stepText;
  BF.migrateSteps = function(c){
    var ch = false;
    (c.done||[]).forEach(function(d){ var o = stepObj(d.text); if(o !== d.text){ d.text = o; ch = true; } });
    (c.checkins||[]).forEach(function(d){ var o = stepObj(d.step); if(o !== d.step){ d.step = o; ch = true; } });
    return ch;
  };
  BF.engine = { fill:fill, ctxFor:ctxFor, story:story, planStory:planStory, phrases:phrases, habitsFor:habitsFor, buildPlan:buildPlan, splitStep:splitStep, generate:generate, generateWithLLM:generateWithLLM, recommend:recommend, adaptive:adaptive, pron:pron, find:find, hash:hash };
})();
