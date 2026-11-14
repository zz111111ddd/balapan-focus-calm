/* Shared UI helpers */
var BF = window.BF = window.BF || {};
(function(){
  var T = function(o){ return BF.L(o); };
  BF.ui = {
    T:T,
    esc:function(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); },
    toast:function(msg){
      var t = document.getElementById("toast"); t.innerHTML = msg; t.classList.add("show");
      clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("show"); }, 2800);
    },
    tagChip:function(tag){ var X = BF.TAGS[tag]; return '<span class="chip chip-'+tag+'"><i></i>'+T(X.label)+'</span>'; },
    stars:function(n, max, size){ var o=""; for(var i=0;i<max;i++) o += BF.starSVG(size||22, i<n); return '<span class="starrow">'+o+'</span>'; },
    burst:function(fromEl, n){
      BF.sound.star();
      if(!fromEl || document.documentElement.classList.contains("calm")) return;
      var r = fromEl.getBoundingClientRect();
      for(var i=0;i<(n||1)*3;i++){
        var s = document.createElement("span"); s.className="fly-star"; s.innerHTML = BF.starSVG(26,true);
        s.style.left = (r.left + r.width/2 - 13)+"px"; s.style.top = (r.top + r.height/2 - 13)+"px";
        s.style.setProperty("--dx", ((Math.random()-.5)*160)+"px"); s.style.setProperty("--dy", (-60 - Math.random()*90)+"px");
        s.style.animationDelay = (i*40)+"ms";
        document.body.appendChild(s); setTimeout(function(x){ return function(){ x.remove(); }; }(s), 1400);
      }
    },
    speak:function(text, btn){ BF.voice.speak(text, btn); },
    hills:function(variant){
      var v = variant||0;
      return '<svg class="hills" viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle class="sun" cx="'+(v%2?150:640)+'" cy="70" r="38" fill="#E9D7A6"/>'+
        '<g class="cloud c1"><path d="M90 70 q10 -24 34 -14 q12 -18 32 -4 q22 -2 20 18 z" fill="#FBF7EF"/></g>'+
        '<g class="cloud c2"><path d="M520 46 q8 -18 26 -10 q10 -14 26 -2 q18 0 16 14 z" fill="#FBF7EF" opacity=".9"/></g>'+
        '<path class="h3" d="M0 170 C120 120 220 150 320 140 C430 128 520 96 620 120 C700 140 760 130 800 120 V260 H0Z" fill="#C9D3C1"/>'+
        '<path class="h2" d="M0 200 C100 170 200 190 300 176 C420 160 500 190 620 172 C700 160 760 176 800 170 V260 H0Z" fill="#A9BBA2"/>'+
        '<path class="h1" d="M0 230 C140 205 260 222 400 214 C540 206 650 226 800 212 V260 H0Z" fill="#E7D7BC"/></svg>';
    },
    childName:function(c){ c = c || BF.store.s; return (c.name||"").trim() || BF.L("your child","ваш ребёнок"); },
    heroName:function(c){ c = c || BF.store.s; return (c.name||"").trim() || BF.L("Hero","Герой"); },
    /* option label lookup from a list of {v,t} */
    lbl:function(list, v){ var o = (list||[]).find(function(x){ return x.v===v; }); return o ? T(o.t) : v; },
    sheet:function(html, cls){
      var wrap = document.createElement("div"); wrap.className = "sheet"; wrap.innerHTML = '<div class="sheet-bg" data-close></div><div class="sheet-card paper '+(cls||"")+'" role="dialog" aria-modal="true"><button class="sheet-x" data-close aria-label="'+BF.L("Close","Закрыть")+'">×</button><div class="sheet-body">'+html+'</div></div>';
      document.body.appendChild(wrap); requestAnimationFrame(function(){ wrap.classList.add("open"); });
      function close(){ wrap.classList.remove("open"); document.removeEventListener("keydown", key); setTimeout(function(){ wrap.remove(); }, 220); }
      function key(e){ if(e.key==="Escape") close(); }
      wrap.addEventListener("click", function(e){ if(e.target.hasAttribute("data-close")) close(); });
      document.addEventListener("keydown", key);
      wrap.close = close; return wrap;
    },
    childChip:function(c, size){ return '<span class="kid-chip">'+BF.avatar.svg(c.avatar,{size:size||28, headOnly:true})+'<b>'+BF.ui.esc(BF.ui.heroName(c))+'</b>'+(c.isDemo?'<small class="demo-tag">'+BF.L("demo","демо")+'</small>':'')+'</span>'; },
    sit:function(id){ return BF.engine.find(id); },
    sitTitle:function(id){ var s = BF.engine.find(id); return s ? T(s.title) : id; },
    num:function(n, d){ return (Math.round(n*Math.pow(10,d||0))/Math.pow(10,d||0)).toLocaleString(BF.lang()==="ru"?"ru-RU":"en-US"); }
  };
})();
