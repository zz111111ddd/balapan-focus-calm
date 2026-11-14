var BF = window.BF = window.BF || {};
/* Plan opening logic shared by library, plan and dashboard */
BF.plans = {
  find:function(id){ return BF.SITUATIONS.find(function(s){ return s.id===id; }); },
  open:function(id, mode){
    var st = BF.store.s, sit = BF.plans.find(id); if(!sit) return;
    mode = mode || (sit.tag==="adhd" ? "quest" : "brave");
    if(st.plans[id]){ BF.store.update(function(s){ s.activePlan = id; }); BF.router.go("/"+mode+"/"+id); return; }
    if(BF.store.plansLeft()<=0){ BF.router.go("/pricing?locked="+id); return; }
    BF.engine.generate(sit, st.child).then(function(plan){
      BF.store.update(function(s){ s.plans[id]=plan; s.planOrder.push(id); s.activePlan=id; });
      BF.store.markActive();
      BF.router.go("/"+mode+"/"+id);
    });
  }
};
BF.screens.plan = {
  title:"Family plan",
  render:function(el){
    var st = BF.store.s, c = st.child, I = BF.icon, esc = BF.ui.esc, A = BF.avatar;
    if(!st.quizDone){
      el.innerHTML = '<div class="wrap empty paper"><div>'+A.chick(110)+'</div><h2>Your family plan starts with a 2-minute quiz</h2><p class="muted">Seven short questions. No account, no email.</p><a class="btn clay big" href="#/quiz">Start the quiz</a></div>';
      return;
    }
    var name = esc(BF.ui.heroName()), prof = c.profile, recs = BF.engine.recommend(c), it = BF.INTERESTS[c.interest]||BF.INTERESTS.space;
    var profText = { anxiety:"Worry & fears", adhd:"Focus & starting", both:"Worry and focus — both at once", unsure:"Still figuring it out" }[prof] || "Still figuring it out";
    var habits = BF.engine.buildPlan(recs[0]||BF.SITUATIONS[0], c).habits;
    var flag = BF.store.hasRedFlag();
    var left = BF.store.plansLeft();
    var words = {
      anxiety:["It makes sense that you feel worried.","You can feel scared and still do it.","I'm right here, and I know you can handle this."],
      adhd:["One step at a time — what's the next card?","I noticed you started on your own. That's big.","Let's beat the slow timer together."],
      both:["Your heart and your brain are both busy today. That's okay.","One breath, one step, one card.","You can feel wobbly and still be the one in charge."],
      unsure:["It makes sense that this feels hard.","Let's make the step smaller, not skip it.","I believe you can do hard things."]
    }[prof] || [];
    el.innerHTML =
      '<div class="plan wrap">'+
        (flag?'<div class="flag-banner paper">'+I('heart',26)+'<div><b>You mentioned something that deserves extra support.</b> Please talk with your pediatrician or a child mental-health professional soon. If your child is in danger or talks about not wanting to live, call or text <b>988</b> (US Suicide & Crisis Lifeline) or <b>911</b>. <a href="#/safety">More on our safety page</a></div></div>':'')+
        '<header class="plan-head">'+
          '<div class="plan-hero">'+BF.ui.hills(0)+'<div class="ph-kid">'+A.svg(st.avatar,{size:170,pose:"wave"})+'</div><div class="ph-chick">'+A.chick(60)+'</div></div>'+
          '<div class="plan-intro"><p class="eyebrow">Our family plan</p><h1>'+name+'\'s brave &amp; focused week</h1>'+
            '<p class="lede">Starting point: <b>'+profText+'</b>. Story world: <b>'+it.world+'</b> with '+it.buddy+'.</p>'+
            '<div class="plan-meta"><span class="chip">'+I('star',14)+' '+st.stars+' stars</span><span class="chip">'+(left===Infinity?'Unlimited plans':left+' of '+BF.store.FREE_PLANS+' free plans left')+'</span><a class="chip" href="#/hero">'+I('pencil',14)+' Edit hero</a><a class="chip" href="#/quiz">'+I('refresh',14)+' Retake quiz</a></div>'+
          '</div>'+
        '</header>'+

        '<section class="start-here"><h2>Start here</h2><p class="muted">Picked from what you said is hardest. Each one turns into a story and a five-step ladder.</p>'+
          '<div class="stones-path">'+recs.map(function(s,ix){
            var has = !!st.plans[s.id];
            return '<article class="stone-card paper reveal d'+(ix+1)+'"><span class="stone-n">'+(ix+1)+'</span>'+BF.ui.tagChip(s.tag)+'<h3>'+s.title+'</h3><p class="muted">'+s.why+'</p>'+
              '<div class="sc-actions">'+(s.tag!=="adhd"?'<button class="btn small clay" data-open="'+s.id+'" data-mode="brave">'+(has?'Open':'Make')+' Brave Plan</button>':'')+
              (s.tag!=="anxiety"?'<button class="btn small sage" data-open="'+s.id+'" data-mode="quest">'+(has?'Open':'Start')+' Routine Quest</button>':'')+'</div></article>';
          }).join("")+'</div>'+
          '<p class="center"><a class="btn ghost" href="#/library">See all 32 situations</a></p>'+
        '</section>'+

        '<section class="two-col">'+
          '<div class="words paper"><span class="tape"></span><h3>Words for this week</h3><p class="muted small">Acceptance first, then confidence.</p><ul class="quote-list">'+words.map(function(w){ return '<li>“'+w+'”</li>'; }).join("")+'</ul></div>'+
          '<div class="habits paper"><h3>Gently drop → try instead</h3><ul class="swap-list">'+habits.map(function(h){ return '<li><span class="drop">'+h.drop+'</span><span class="arrow">'+I('next',16)+'</span><span class="instead">'+h.instead+'</span></li>'; }).join("")+'</ul></div>'+
        '</section>'+

        '<section class="rhythm"><h2>Ten minutes a day</h2><div class="rhythm-row">'+
          '<div class="rh paper"><span class="rh-ico">'+I('sun',26)+'</span><b>Morning · 3 min</b><p>One Routine Quest card with the slow timer.</p></div>'+
          '<div class="rh paper"><span class="rh-ico">'+I('hand',26)+'</span><b>After school · 3 min</b><p>One calm game — stars go to the next brave step.</p></div>'+
          '<div class="rh paper"><span class="rh-ico">'+I('moon',26)+'</span><b>Evening · 4 min</b><p>Read the story, then a 10-second check-in.</p></div>'+
        '</div></section>'+
      '</div>';
    el.querySelectorAll("[data-open]").forEach(function(b){ b.onclick = function(){ BF.plans.open(b.getAttribute("data-open"), b.getAttribute("data-mode")); }; });
  }
};
