var BF = window.BF = window.BF || {};
BF.screens.quiz = {
  title:"Parent quiz",
  render:function(el){
    var Q = BF.QUIZ, i = 0, s = BF.store.s, c = s.child, esc = BF.ui.esc, I = BF.icon;
    var qSteps = Q.filter(function(q){ return q.kind!=="cheer"; }).length;
    el.innerHTML = '<div class="quiz wrap"><div class="quiz-track" id="qTrack"></div><div class="quiz-card paper" id="qCard"></div></div>';
    var card = el.querySelector("#qCard"), track = el.querySelector("#qTrack");

    function stepNo(idx){ var n=0; for(var k=0;k<=idx;k++) if(Q[k].kind!=="cheer") n++; return n; }
    function drawTrack(){
      var n = stepNo(i), stones = "";
      for(var k=1;k<=qSteps;k++) stones += '<span class="stone '+(k<n?'done':k===n?'now':'')+'">'+(k<n?I('check',14):k)+'</span>';
      track.innerHTML = '<div class="stones">'+stones+'</div><div class="track-chick" style="--p:'+((n-1)/(qSteps-1))+'">'+BF.avatar.chick(46)+'</div><p class="track-lbl">Step '+n+' of '+qSteps+'</p>';
    }
    function canNext(q){
      if(q.kind==="child") return (c.name||"").trim().length>0;
      if(q.kind==="single") return !!c[q.id] && (q.id!=="profile" || c.profile);
      if(q.kind==="multi") return (c[q.id]||[]).length>0;
      return true;
    }
    function draw(){
      var q = Q[i]; drawTrack();
      var h = '';
      if(q.kind==="cheer"){
        h = '<div class="cheer"><div class="cheer-art">'+BF.avatar.chick(110)+'</div><h2>'+q.title+'</h2><p class="lede">'+q.text+'</p></div>';
      } else {
        h = '<p class="eyebrow">Question '+stepNo(i)+'</p><h2>'+q.title+'</h2><p class="muted">'+q.sub+'</p>';
        if(q.kind==="child"){
          h += '<div class="field"><label for="qName">Child\'s first name or nickname</label><input id="qName" class="input" maxlength="20" autocomplete="off" placeholder="e.g. Maya" value="'+esc(c.name)+'"></div>'+
            '<div class="field"><label>Age</label><div class="seg" data-k="age">'+[5,6,7,8,9,10].map(function(a){return '<button type="button" data-v="'+a+'" aria-pressed="'+(c.age==a)+'">'+a+'</button>';}).join("")+'</div></div>'+
            '<div class="field"><label>In stories, call them</label><div class="seg" data-k="pronoun">'+[["he","he / him"],["she","she / her"],["they","they / them"]].map(function(p){return '<button type="button" data-v="'+p[0]+'" aria-pressed="'+(c.pronoun===p[0])+'">'+p[1]+'</button>';}).join("")+'</div></div>';
        } else {
          var multi = q.kind==="multi", val = c[q.id];
          h += '<div class="opts '+(multi?'multi':'single')+' '+(q.options.length>6?'many':'')+'">'+q.options.map(function(o){
            var on = multi ? (val||[]).indexOf(o.v)>=0 : val===o.v;
            return '<button type="button" class="opt '+(q.id==='profile'?'opt-'+o.v:'')+'" data-v="'+o.v+'" aria-pressed="'+on+'"><span class="tick">'+I('check',14)+'</span><span><b>'+o.t+'</b>'+(o.d?'<small>'+o.d+'</small>':'')+'</span></button>';
          }).join("")+'</div>';
        }
      }
      h += '<div class="quiz-nav">'+(i>0?'<button class="btn ghost" id="qBack">'+I('back',18)+' Back</button>':'<span></span>')+
           '<button class="btn clay" id="qNext">'+(i===Q.length-1?'See our plan':'Continue')+' '+I('next',18)+'</button></div>';
      card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap"); window.scrollTo(0,0);
      card.innerHTML = h;
      bind(q);
    }
    function refreshNext(q){ var b = card.querySelector("#qNext"); if(b) b.disabled = !canNext(q); }
    function bind(q){
      var name = card.querySelector("#qName");
      if(name){ name.addEventListener("input", function(){ c.name = name.value; BF.store.save(); refreshNext(q); }); setTimeout(function(){ name.focus(); }, 50); }
      card.querySelectorAll(".seg").forEach(function(seg){
        seg.addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; var k=seg.getAttribute("data-k");
          c[k] = k==="age" ? +b.getAttribute("data-v") : b.getAttribute("data-v");
          seg.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); BF.store.save(); });
      });
      card.querySelectorAll(".opt").forEach(function(b){
        b.addEventListener("click", function(){
          var v = b.getAttribute("data-v");
          if(q.kind==="single"){ c[q.id]=v; card.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); }
          else {
            var arr = (c[q.id]||[]).slice(), opt = q.options.find(function(o){return o.v===v;});
            var ix = arr.indexOf(v);
            if(ix>=0) arr.splice(ix,1); else { if(opt.exclusive) arr=[]; else arr = arr.filter(function(x){ var o=q.options.find(function(oo){return oo.v===x;}); return !(o&&o.exclusive); }); arr.push(v); }
            c[q.id]=arr; card.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed", arr.indexOf(x.getAttribute("data-v"))>=0); });
          }
          BF.sound.pop(); BF.store.save(); refreshNext(q);
        });
      });
      var back = card.querySelector("#qBack"); if(back) back.onclick = function(){ i--; draw(); };
      card.querySelector("#qNext").onclick = function(){
        if(!canNext(q)) return;
        if(i < Q.length-1){ i++; draw(); }
        else finish();
      };
      refreshNext(q);
    }
    function finish(){
      BF.store.update(function(st){ st.quizDone = true; if(!st.child.profile) st.child.profile="unsure"; });
      BF.store.markActive();
      if(BF.store.hasRedFlag()) BF.router.go("/safety?from=quiz");
      else BF.router.go(BF.store.s.avatarSaved ? "/plan" : "/hero?from=quiz");
    }
    draw();
  }
};
