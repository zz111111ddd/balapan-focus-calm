/* Shared UI helpers */
var BF = window.BF = window.BF || {};
(function(){
  BF.ui = {
    esc:function(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); },
    toast:function(msg){
      var t = document.getElementById("toast"); t.innerHTML = msg; t.classList.add("show");
      clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("show"); }, 2600);
    },
    tagChip:function(tag){ var T = BF.TAGS[tag]; return '<span class="chip chip-'+tag+'"><i></i>'+T.label+'</span>'; },
    stars:function(n, max, size){ var o=""; for(var i=0;i<max;i++) o += BF.starSVG(size||22, i<n); return '<span class="starrow">'+o+'</span>'; },
    /* fly a star from an element to the header counter */
    burst:function(fromEl, n){
      BF.sound.star();
      if(!fromEl || document.documentElement.classList.contains("calm")) return;
      var r = fromEl.getBoundingClientRect();
      for(var i=0;i<(n||1)*3;i++){
        var s = document.createElement("span"); s.className="fly-star"; s.innerHTML = BF.starSVG(26,true);
        s.style.left = (r.left + r.width/2 - 13)+"px"; s.style.top = (r.top + r.height/2 - 13)+"px";
        var dx = (Math.random()-.5)*160, dy = -60 - Math.random()*90;
        s.style.setProperty("--dx", dx+"px"); s.style.setProperty("--dy", dy+"px");
        s.style.animationDelay = (i*40)+"ms";
        document.body.appendChild(s); setTimeout(function(x){ return function(){ x.remove(); }; }(s), 1400);
      }
    },
    speak:function(text, btn){
      if(!("speechSynthesis" in window)){ BF.ui.toast("Read-aloud isn't supported in this browser."); return; }
      if(speechSynthesis.speaking){ speechSynthesis.cancel(); if(btn) btn.classList.remove("on"); return; }
      var u = new SpeechSynthesisUtterance(text); u.rate = .88; u.pitch = 1.05; u.lang = "en-US";
      var v = speechSynthesis.getVoices().filter(function(v){ return /en(-|_)US/i.test(v.lang); });
      if(v.length) u.voice = v.find(function(x){ return /female|samantha|aria|jenny/i.test(x.name); }) || v[0];
      u.onend = function(){ if(btn) btn.classList.remove("on"); };
      if(btn) btn.classList.add("on");
      speechSynthesis.speak(u);
    },
    /* decorative paper-cut landscape */
    hills:function(variant){
      var v = variant||0;
      var sky = ['<circle class="sun" cx="'+(v%2?150:640)+'" cy="70" r="38" fill="#E9D7A6"/>'];
      return '<svg class="hills" viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'+sky.join("")+
        '<g class="cloud c1"><path d="M90 70 q10 -24 34 -14 q12 -18 32 -4 q22 -2 20 18 z" fill="#FBF7EF"/></g>'+
        '<g class="cloud c2"><path d="M520 46 q8 -18 26 -10 q10 -14 26 -2 q18 0 16 14 z" fill="#FBF7EF" opacity=".9"/></g>'+
        '<path class="h3" d="M0 170 C120 120 220 150 320 140 C430 128 520 96 620 120 C700 140 760 130 800 120 V260 H0Z" fill="#C9D3C1"/>'+
        '<path class="h2" d="M0 200 C100 170 200 190 300 176 C420 160 500 190 620 172 C700 160 760 176 800 170 V260 H0Z" fill="#A9BBA2"/>'+
        '<path class="h1" d="M0 230 C140 205 260 222 400 214 C540 206 650 226 800 212 V260 H0Z" fill="#E7D7BC"/>'+
        '<path d="M60 238 q20 -6 40 0 M300 230 q16 -5 32 0 M620 234 q18 -6 36 0" stroke="#D6C09C" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '</svg>';
    },
    activeHero:function(){ return BF.store.s.avatar; },
    childName:function(){ return (BF.store.s.child.name||"").trim() || "your child"; },
    heroName:function(){ return (BF.store.s.child.name||"").trim() || "Hero"; }
  };
})();
