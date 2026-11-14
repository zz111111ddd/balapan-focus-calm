/* ==========================================================
   Store v2 — family state in localStorage ("balapan.v2").
   Several children, each with own avatar, plans, diary,
   trigger outcomes, moods and progress. No server, no login.
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var KEY = "balapan.v2", OLD = "balapan.v1";
  var FREE_PLANS = 3;
  var LIMITS = { free:1, monthly:2, yearly:3 };

  function pad(n){ return String(n).padStart(2,"0"); }
  function dayKey(d){ d = d || new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function uid(){ return "c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

  function newChild(extra){
    var c = {
      id: uid(), name:"", age:7, pronoun:"they", profile:"", hard:[], fears:[], tries:[], interest:"space", motivators:[], flags:[], specialist:false,
      quizDone:false, created: dayKey(),
      avatar:{ skin:3, hair:"curly", hairColor:1, eyes:0, top:"hoodie", topColor:2, bottom:"pants", bottomColor:0, shoes:"sneakers", shoeColor:0, build:"medium", extra:"none" },
      avatarSaved:false,
      plans:{}, planOrder:[], activePlan:null,
      stars:0, starLog:[], done:[], checkins:[], days:[], games:{},
      diary:[], outcomes:[], moods:[], daily:{}, gameLevels:{},
      isDemo:false
    };
    if(extra) Object.keys(extra).forEach(function(k){ c[k]=extra[k]; });
    return c;
  }
  function defaults(){
    return { v:2, children:{}, order:[], active:null, plan:"free", settings:{ calm:false, sound:false, theme:"light", voiceEn:"", voiceRu:"", rate:0.86, pitch:1.0, ttsOn:false, ttsEndpoint:"https://api.openai.com/v1/audio/speech", ttsKey:"", ttsModel:"gpt-4o-mini-tts", ttsVoice:"shimmer" }, demoCleared:false, demoSeeded:false };
  }
  function migrate(old){
    var st = defaults(); if(!old || !old.child) return st;
    var c = newChild({ name:old.child.name, age:old.child.age, pronoun:old.child.pronoun, profile:old.child.profile, hard:old.child.hard||[], tries:old.child.tries||[], interest:old.child.interest||"space", flags:old.child.flags||[],
      quizDone:!!old.quizDone, avatar:old.avatar||undefined, avatarSaved:!!old.avatarSaved, plans:old.plans||{}, planOrder:old.planOrder||[], activePlan:old.activePlan, stars:old.stars||0, starLog:old.starLog||[], done:old.done||[], checkins:old.checkins||[], days:old.days||[], games:old.games||{} });
    if(!c.avatar) c.avatar = newChild().avatar;
    st.children[c.id]=c; st.order=[c.id]; st.active=c.id; st.plan = old.premium ? "yearly" : "free";
    if(old.settings){ st.settings.calm=!!old.settings.calm; st.settings.sound=!!old.settings.sound; }
    return st;
  }

  var state;
  try {
    var raw = JSON.parse(localStorage.getItem(KEY)||"null");
    if(raw && raw.v===2) { state = defaults(); Object.keys(raw).forEach(function(k){ state[k]=raw[k]; }); state.settings = Object.assign(defaults().settings, raw.settings||{}); }
    else state = migrate(JSON.parse(localStorage.getItem(OLD)||"null"));
  } catch(e){ state = defaults(); }
  // repair children objects (new fields)
  Object.keys(state.children).forEach(function(id){ var base = newChild(); var c = state.children[id]; Object.keys(base).forEach(function(k){ if(c[k]===undefined) c[k]=base[k]; }); });
  state.order = state.order.filter(function(id){ return state.children[id]; });
  if(!state.active || !state.children[state.active]) state.active = state.order[0] || null;

  BF.store = {
    FREE_PLANS: FREE_PLANS, LIMITS: LIMITS,
    today: dayKey, dayKey: dayKey, uid: uid,
    get f(){ return state; },                         // family
    get s(){ return BF.store.child(); },              // active child (back-compat)
    child: function(){
      if(!state.active || !state.children[state.active]){
        var c = newChild(); state.children[c.id]=c; state.order.push(c.id); state.active=c.id; this.save();
      }
      return state.children[state.active];
    },
    children: function(){ return state.order.map(function(id){ return state.children[id]; }).filter(Boolean); },
    realChildren: function(){ return this.children().filter(function(c){ return !c.isDemo; }); },
    childLimit: function(){ return LIMITS[state.plan]||1; },
    canAddChild: function(){ return this.realChildren().length < this.childLimit(); },
    addChild: function(extra){ var c = newChild(extra); state.children[c.id]=c; state.order.push(c.id); state.active=c.id; this.save(); return c; },
    setActive: function(id){ if(state.children[id]){ state.active=id; this.save(); } },
    removeChild: function(id){ delete state.children[id]; state.order = state.order.filter(function(x){ return x!==id; }); if(state.active===id) state.active = state.order[0]||null; this.save(); },
    save: function(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} },
    update: function(fn){ fn(this.child(), state); this.save(); },
    updateFamily: function(fn){ fn(state); this.save(); },
    reset: function(){ state = defaults(); this.save(); },
    isPaid: function(){ return state.plan!=="free"; },
    markActive: function(){ var c=this.child(), t=dayKey(); if(c.days.indexOf(t)<0) c.days.push(t); this.save(); },
    addStars: function(n, src){
      if(!n) return; var c = this.child();
      c.stars += n; c.starLog.push({date:dayKey(), n:n, src:src||""});
      if(c.activePlan && c.plans[c.activePlan]){ var p=c.plans[c.activePlan], r=p.ladder[p.current]; if(r) r.practice = Math.min(3,(r.practice||0)+n); }
      this.markActive();
    },
    plansUsed: function(){ var n=0; this.realChildren().forEach(function(c){ n += c.planOrder.length; }); return n; },
    plansLeft: function(){ if(this.isPaid() || this.child().isDemo) return Infinity; return Math.max(0, FREE_PLANS - this.plansUsed()); },
    streak: function(c){
      c = c || this.child(); var set = {}; c.days.forEach(function(d){ set[d]=1; });
      var n=0, d=new Date(); if(!set[dayKey()]) d.setDate(d.getDate()-1);
      while(set[dayKey(d)]){ n++; d.setDate(d.getDate()-1); }
      return n;
    },
    hasRedFlag: function(c){ c = c || this.child(); return (c.flags||[]).some(function(f){ return BF.RED_FLAGS.indexOf(f)>=0; }); },
    planBlocked: function(c){ c = c || this.child(); return this.hasRedFlag(c) && !c.specialistAck; },
    exportChild: function(id){ var c = state.children[id||state.active]; return JSON.stringify({ app:"balapan-focus-calm", version:2, exported:new Date().toISOString(), child:c }, null, 2); },
    importChild: function(json){
      var o = typeof json==="string" ? JSON.parse(json) : json; if(!o || !o.child || o.app!=="balapan-focus-calm") throw new Error("bad file");
      var c = newChild(); Object.keys(o.child).forEach(function(k){ c[k]=o.child[k]; }); c.id = uid(); c.imported = true; c.isDemo = false;
      state.children[c.id]=c; state.order.push(c.id); state.active=c.id; this.save(); return c;
    }
  };
})();
