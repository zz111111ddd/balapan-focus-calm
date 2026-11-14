/* ==========================================================
   Plan engine: turns a library situation + the child profile
   into a Brave Plan (story + ladder + parent tips) or a
   Routine Quest. Works fully offline with templates.

   >>> LLM PLUG-IN POINT <<<
   BF.engine.generateWithLLM() is a stub. To use a real model:
   1. Create a serverless function (Netlify/Vercel) that holds
      your API key server-side — NEVER put keys in this repo.
   2. Set BF.config.llmEndpoint = "/.netlify/functions/story".
   3. Return JSON in the same shape as buildPlan() below.
   Templates stay as the fallback when the call fails.
   ========================================================== */
var BF = window.BF = window.BF || {};
BF.config = BF.config || { llmEndpoint: null };
(function(){
  function pron(p){
    if(p==="she") return {they:"she", them:"her", their:"her", theyre:"she's"};
    if(p==="he") return {they:"he", them:"him", their:"his", theyre:"he's"};
    return {they:"they", them:"them", their:"their", theyre:"they're"};
  }
  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
  function lowerFirst(s){ return s ? s.charAt(0).toLowerCase()+s.slice(1) : s; }

  function ctxFor(sit, child){
    var c = child || BF.store.s.child, pr = pron(c.pronoun), it = BF.INTERESTS[c.interest] || BF.INTERESTS.space;
    var name = (c.name||"").trim() || "Sam";
    var feel = BF.FEELINGS[(name.length + sit.id.length) % BF.FEELINGS.length];
    var ctx = { name:name, they:pr.they, them:pr.them, their:pr.their, They:cap(pr.they), Their:cap(pr.their), buddy:it.buddy, world:it.world, power:it.power, event:sit.event, feel:feel };
    sit.steps.forEach(function(s,i){ ctx["step"+(i+1)] = lowerFirst(s); });
    return ctx;
  }

  /* {key} replacement; also fixes "they has"-type grammar for singular they */
  function fill(tpl, ctx){
    var out = tpl.replace(/\{(\w+)\}/g, function(m,k){ return ctx[k]!=null ? ctx[k] : m; });
    if(ctx.they==="they") out = out.replace(/\bthey has\b/g,"they have").replace(/\bThey has\b/g,"They have").replace(/\bthey was\b/g,"they were");
    return out;
  }

  function storyFor(sit, ctx){
    var mode = sit.tag;
    var pages = [ fill(BF.STORY.open[sit.id.length % 2], ctx) ];
    BF.STORY[mode].forEach(function(t){ pages.push(fill(t, ctx)); });
    pages.push(fill(BF.STORY.close, ctx));
    return pages;
  }

  function habitsFor(child){
    var tries = (child||BF.store.s.child).tries || [];
    var list = tries.map(function(k){ return BF.HABITS[k]; }).filter(Boolean);
    if(!list.length) list = [BF.HABITS.reassure, BF.HABITS.repeat];
    return list.slice(0,3);
  }

  /* Template generator — the default */
  function buildPlan(sit, child){
    child = child || BF.store.s.child;
    var ctx = ctxFor(sit, child);
    return {
      id: sit.id,
      title: sit.title,
      tag: sit.tag,
      created: BF.store.today(),
      story: storyFor(sit, ctx),
      ladder: sit.steps.map(function(s, i){ return { text:s, min:sit.mins[i]||3, done:false, date:null, practice:0 }; }),
      current: 0,
      phrases: sit.phrases.map(function(p){ return fill(p, ctx); }),
      habits: habitsFor(child),
      game: sit.game,
      source: "template"
    };
  }

  /* Make a too-hard step smaller (evening check-in → "too hard") */
  function splitStep(step){
    return [
      { text:"Mini step: just the first part of “"+step.text.replace(/\.$/,"")+"” — for one minute, with you right beside them", min:Math.max(1, Math.round(step.min/2)), done:false, date:null, practice:0, mini:true },
      { text:step.text, min:step.min, done:false, date:null, practice:0 }
    ];
  }

  /* ---- LLM STUB ------------------------------------------------
     Return a Promise resolving to a plan object (same shape as
     buildPlan) or null to fall back to templates.               */
  function generateWithLLM(sit, child){
    if(!BF.config.llmEndpoint) return Promise.resolve(null);
    var prompt = {
      system: "You write short, warm, non-clinical stories for kids 5-10. The child is the hero. No medical claims. Return JSON {story:[7 strings], phrases:[3 strings]}.",
      child: { name:child.name, age:child.age, pronoun:child.pronoun, interest:child.interest, profile:child.profile },
      situation: { title:sit.title, tag:sit.tag, steps:sit.steps }
    };
    return fetch(BF.config.llmEndpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(prompt) })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if(!j || !Array.isArray(j.story)) return null;
        var base = buildPlan(sit, child); base.story = j.story; if(Array.isArray(j.phrases)) base.phrases = j.phrases; base.source = "llm"; return base;
      })
      .catch(function(){ return null; });
  }

  function generate(sit, child){
    child = child || BF.store.s.child;
    return generateWithLLM(sit, child).then(function(p){ return p || buildPlan(sit, child); });
  }

  /* Recommend situations from quiz answers */
  var HARD_MAP = { mornings:["morning","dressed"], homework:["homework","test"], bedtime:["bedtime","dark"], separation:["dropoff","sleepover"], new:["newplace","newteacher"], noise:["cafeteria","party","dryer"], doctor:["dentist","shot","haircut"], transitions:["switch","screens"], waiting:["line","restaurant"], losing:["losing","tryout"] };
  function recommend(child){
    child = child || BF.store.s.child;
    var prof = child.profile==="unsure" ? null : child.profile;
    var picks = [];
    (child.hard||[]).forEach(function(h){ (HARD_MAP[h]||[]).forEach(function(id){ if(picks.indexOf(id)<0) picks.push(id); }); });
    var list = picks.map(function(id){ return BF.SITUATIONS.find(function(s){ return s.id===id; }); }).filter(Boolean);
    if(prof){ list.sort(function(a,b){ return (b.tag===prof) - (a.tag===prof); }); }
    if(list.length<3){ BF.SITUATIONS.forEach(function(s){ if(list.length<3 && list.indexOf(s)<0 && (!prof || s.tag===prof)) list.push(s); }); }
    return list.slice(0,3);
  }

  BF.engine = { fill:fill, ctxFor:ctxFor, buildPlan:buildPlan, splitStep:splitStep, generate:generate, generateWithLLM:generateWithLLM, recommend:recommend, pron:pron };
})();
