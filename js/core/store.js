/* ==========================================================
   Store — everything lives in localStorage (no accounts,
   no server). Key: "balapan.v1".
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var KEY = "balapan.v1";
  var FREE_PLANS = 3;

  function today(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }

  function defaults(){
    return {
      v:1,
      child:{ name:"", age:7, pronoun:"they", profile:"", hard:[], reactions:[], interest:"space", tries:[], flags:[] },
      quizDone:false,
      avatar:{ skin:3, hair:"curly", hairColor:1, eyes:0, top:"hoodie", topColor:2, bottom:"pants", bottomColor:0, shoes:"sneakers", shoeColor:0, build:"medium", extra:"none" },
      avatarSaved:false,
      plans:{},          // id -> plan
      planOrder:[],
      activePlan:null,
      stars:0,
      starLog:[],        // {date, n, src}
      done:[],           // {date, plan, text}
      checkins:[],       // {date, plan, mood}
      days:[],           // active dates
      settings:{ calm:false, sound:false },
      games:{},          // id -> best stars
      premium:false
    };
  }

  function merge(base, saved){
    if(!saved || typeof saved!=="object") return base;
    Object.keys(saved).forEach(function(k){
      if(base[k] && typeof base[k]==="object" && !Array.isArray(base[k]) && saved[k] && typeof saved[k]==="object" && !Array.isArray(saved[k])) base[k]=merge(base[k], saved[k]);
      else base[k]=saved[k];
    });
    return base;
  }

  var state;
  try { state = merge(defaults(), JSON.parse(localStorage.getItem(KEY)||"null")); }
  catch(e){ state = defaults(); }

  BF.store = {
    FREE_PLANS: FREE_PLANS,
    today: today,
    get s(){ return state; },
    save: function(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} },
    update: function(fn){ fn(state); this.save(); },
    reset: function(){ state = defaults(); this.save(); },
    markActive: function(){ var t=today(); if(state.days.indexOf(t)<0){ state.days.push(t); } this.save(); },
    addStars: function(n, src){
      if(!n) return;
      state.stars += n; state.starLog.push({date:today(), n:n, src:src||""});
      if(state.activePlan && state.plans[state.activePlan]){
        var p = state.plans[state.activePlan]; var r = p.ladder[p.current];
        if(r) r.practice = Math.min(3, (r.practice||0) + n);
      }
      this.markActive();
    },
    plansLeft: function(){ return state.premium ? Infinity : Math.max(0, FREE_PLANS - state.planOrder.length); },
    streak: function(){
      var set = {}; state.days.forEach(function(d){ set[d]=1; });
      var n=0, d=new Date();
      if(!set[today()]) d.setDate(d.getDate()-1); // streak still alive until tonight
      while(true){
        var k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
        if(set[k]){ n++; d.setDate(d.getDate()-1); } else break;
      }
      return n;
    },
    hasRedFlag: function(){ return (state.child.flags||[]).some(function(f){ return BF.RED_FLAGS.indexOf(f)>=0; }); }
  };
})();
