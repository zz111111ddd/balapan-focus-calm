var BF = window.BF = window.BF || {};
BF.screens.dashboard = {
  title:"Parent dashboard",
  render:function(el){
    var st = BF.store.s, I = BF.icon, esc = BF.ui.esc, A = BF.avatar;
    var streak = BF.store.streak(), plans = st.planOrder.map(function(id){ return st.plans[id]; }).filter(Boolean);
    var active = st.activePlan && st.plans[st.activePlan] ? st.plans[st.activePlan] : plans[plans.length-1];
    var stepsDone = st.done.length;
    function plant(n){
      var k = Math.min(7, n), leaves = "";
      for(var i=0;i<k;i++){ var y = 150 - i*16, s = i%2 ? 1 : -1; leaves += '<path class="leaf-'+i+'" d="M60 '+y+' q'+(s*26)+' -14 '+(s*34)+' 4 q'+(s*-18)+' 12 '+(s*-34)+' -4z" fill="'+(i%2?'#A3B59C':'#8FA58A')+'"/>'; }
      return '<svg viewBox="0 0 120 200" class="plant"><path d="M60 170 V'+(158-k*16)+'" stroke="#6F8A6E" stroke-width="5" stroke-linecap="round"/>'+leaves+(k>=7?'<circle cx="60" cy="40" r="10" fill="#E4CC8F"/>':'')+'<path d="M30 168 h60 l-8 28 h-44z" fill="#C98E70"/><rect x="26" y="162" width="68" height="10" rx="4" fill="#A96C51"/></svg>';
    }
    // last 7 days
    var week = [], d = new Date();
    for(var i=6;i>=0;i--){ var x = new Date(d); x.setDate(d.getDate()-i); var k = x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); week.push({k:k, on:st.days.indexOf(k)>=0, lbl:["Su","Mo","Tu","We","Th","Fr","Sa"][x.getDay()]}); }
    var cur = active ? active.ladder[active.current] : null;
    el.innerHTML =
      '<div class="dash wrap">'+
        '<div class="dash-head"><div class="dh-av">'+A.svg(st.avatar,{size:84, headOnly:true})+'</div><div><p class="eyebrow">Parent dashboard</p><h1>'+esc(BF.ui.heroName())+'\'s progress</h1><p class="muted">Only you see this. Everything is stored on this device.</p></div>'+
          '<button class="btn dusty" id="dPrint">'+I('print',18)+' Summary for the doctor</button></div>'+
        '<div class="dash-top">'+
          '<div class="streak paper">'+plant(streak)+'<div><b class="big-n">'+streak+'</b><span>day'+(streak===1?'':'s')+' in a row</span><div class="week">'+week.map(function(w){ return '<span class="wd '+(w.on?'on':'')+'" title="'+w.k+'"><i></i>'+w.lbl+'</span>'; }).join("")+'</div></div></div>'+
          '<div class="kpis">'+
            '<div class="kpi paper">'+BF.starSVG(30,true)+'<b>'+st.stars+'</b><span>stars earned</span></div>'+
            '<div class="kpi paper">'+I('ladder',28)+'<b>'+stepsDone+'</b><span>steps &amp; cards done</span></div>'+
            '<div class="kpi paper">'+I('book',28)+'<b>'+plans.length+'</b><span>plan'+(plans.length===1?'':'s')+' made</span></div>'+
          '</div>'+
        '</div>'+
        '<div class="dash-grid">'+
          '<section class="checkin paper"><span class="tape"></span><h2>Evening check-in</h2>'+
            (cur ? '<p class="muted">Plan: <b>'+esc(active.title)+'</b></p><p class="ci-step">“'+esc(cur.text)+'”</p><p>How did today\'s step feel for '+esc(BF.ui.heroName())+'?</p>'+
              '<div class="ci-btns"><button class="ci ci-easy" data-m="easy"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#DCE4D5"/><path d="M12 22 q8 8 16 0" stroke="#6F8A6E" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="14" cy="16" r="2" fill="#6F8A6E"/><circle cx="26" cy="16" r="2" fill="#6F8A6E"/></svg>Easy</button>'+
              '<button class="ci ci-ok" data-m="ok"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#F1E6C8"/><path d="M13 24 h14" stroke="#B8964B" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="16" r="2" fill="#B8964B"/><circle cx="26" cy="16" r="2" fill="#B8964B"/></svg>Okay</button>'+
              '<button class="ci ci-hard" data-m="hard"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#F1DED3"/><path d="M13 27 q7 -6 14 0" stroke="#A96C51" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="14" cy="16" r="2" fill="#A96C51"/><circle cx="26" cy="16" r="2" fill="#A96C51"/></svg>Too hard</button></div>'+
              '<p class="fine">“Too hard” splits this step into a smaller mini step. Nothing is ever failed.</p>'
            : (active ? '<p>Every step in <b>'+esc(active.title)+'</b> is done. Time to pick a new situation!</p><a class="btn clay" href="#/library">Open the library</a>' : '<p class="muted">Make your first Brave Plan or Routine Quest, then come back tonight for a 10-second check-in.</p><a class="btn clay" href="#/library">Choose a situation</a>'))+
          '</section>'+
          '<section class="plans-list paper"><h2>Plans</h2>'+(plans.length? '<ul>'+plans.map(function(p){
              var dn = p.ladder.filter(function(r){return r.done;}).length, pct = Math.round(dn/p.ladder.length*100);
              return '<li><div class="pl-top">'+BF.ui.tagChip(p.tag)+'<b>'+esc(p.title)+'</b></div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="pl-foot"><small>'+dn+' of '+p.ladder.length+' steps · since '+p.created+'</small><span><a href="#/brave/'+p.id+'">Story</a>'+(p.tag!=="anxiety"?' · <a href="#/quest/'+p.id+'">Quest</a>':'')+'</span></div></li>';
            }).join("")+'</ul>' : '<p class="muted">No plans yet.</p>')+'</section>'+
          '<section class="timeline paper"><h2>Completed steps</h2>'+(st.done.length? '<ol>'+st.done.slice(-14).reverse().map(function(x){ return '<li><time>'+x.date+'</time><span>'+esc(x.text)+'</span></li>'; }).join("")+'</ol>' : '<p class="muted">Finished steps and quest cards will appear here with their dates.</p>')+
            (st.checkins.length? '<h3>Check-ins</h3><ul class="ci-log">'+st.checkins.slice(-6).reverse().map(function(c){ return '<li><time>'+c.date+'</time> '+({easy:"Easy",ok:"Okay",hard:"Too hard → split"}[c.mood])+' · <small>'+esc(c.step)+'</small></li>'; }).join("")+'</ul>':'')+'</section>'+
        '</div>'+
      '</div>';
    el.querySelectorAll(".ci").forEach(function(b){ b.onclick = function(){
      var m = b.getAttribute("data-m"), wasMini = active.ladder[active.current] && active.ladder[active.current].mini;
      BF.store.update(function(s){
        var p = s.plans[active.id], step = p.ladder[p.current];
        s.checkins.push({date:BF.store.today(), plan:active.id, mood:m, step:step.text});
        if(m==="hard" && !step.mini){ var parts = BF.engine.splitStep(step); p.ladder.splice(p.current, 1, parts[0], parts[1]); }
      });
      BF.store.markActive();
      BF.ui.toast({easy:"Lovely. Tomorrow, try the next rung — or repeat once to make it boring.", ok:"Good. Repeat this step tomorrow until it feels easy.", hard: wasMini ? "Thanks for being honest. Repeat this mini step tomorrow — stay extra close." : "Thanks for being honest. We added a smaller mini step first."}[m]);
      BF.router.refresh();
    }; });
    el.querySelector("#dPrint").onclick = function(){ BF.screens.dashboard.printSummary(); };
  },
  printSummary:function(){
    var st = BF.store.s, esc = BF.ui.esc, c = st.child;
    var plans = st.planOrder.map(function(id){ return st.plans[id]; }).filter(Boolean);
    var prof = {anxiety:"Worry & fears", adhd:"Focus & starting", both:"Worry and focus (both)", unsure:"Not sure yet"}[c.profile]||"—";
    function lbl(qid, arr){ var q = BF.QUIZ.find(function(x){ return x.id===qid; }); return (arr||[]).map(function(v){ var o = q && q.options.find(function(o){ return o.v===v; }); return o ? o.t : v; }).join("; ")||"—"; }
    var hardL = lbl("hard", c.hard), reL = lbl("reactions", c.reactions);
    document.getElementById("printArea").innerHTML =
      '<div class="pr"><h1>Balapan Focus &amp; Calm — parent summary</h1><p class="pr-sub">Prepared by the parent on '+BF.store.today()+' for a conversation with a pediatrician, therapist or school. Not a medical record or assessment.</p>'+
      '<table><tr><th>Child</th><td>'+esc(c.name||"—")+', age '+esc(c.age)+'</td></tr><tr><th>Parent\'s description</th><td>'+prof+'</td></tr><tr><th>Hardest moments</th><td>'+esc(hardL)+'</td></tr><tr><th>Typical reactions</th><td>'+esc(reL)+'</td></tr><tr><th>Active days in a row</th><td>'+BF.store.streak()+'</td></tr><tr><th>Steps completed</th><td>'+st.done.length+'</td></tr></table>'+
      '<h2>Plans and progress</h2>'+(plans.length? plans.map(function(p){ return '<h3>'+esc(p.title)+' ('+BF.TAGS[p.tag].label+')</h3><ol>'+p.ladder.map(function(r){ return '<li>'+esc(r.text)+' — '+(r.done?'done '+r.date:'not yet')+'</li>'; }).join("")+'</ol>'; }).join("") : '<p>No plans yet.</p>')+
      '<h2>Evening check-ins</h2>'+(st.checkins.length? '<ul>'+st.checkins.map(function(x){ return '<li>'+x.date+': '+({easy:"easy",ok:"okay",hard:"too hard (step was split)"}[x.mood])+' — '+esc(x.step)+'</li>'; }).join("")+'</ul>':'<p>None yet.</p>')+
      '<h2>Questions I want to ask</h2><div class="pr-lines"></div>'+
      '<p class="pr-foot">Balapan is a parenting support tool, not therapy. In a crisis in the US, call or text 988.</p></div>';
    window.print();
  }
};
