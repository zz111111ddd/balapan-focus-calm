var BF = window.BF = window.BF || {};
BF.screens.library = {
  title:"Situation library",
  render:function(el, param, query){
    var I = BF.icon, tag = (query&&query.tag)||"all", cat = "all", q = "";
    var counts = {all:BF.SITUATIONS.length}; BF.SITUATIONS.forEach(function(s){ counts[s.tag]=(counts[s.tag]||0)+1; });
    el.innerHTML =
      '<div class="library wrap">'+
        '<div class="lib-head"><div><p class="eyebrow">Situation library</p><h1>The moments that get hard</h1>'+
        '<p class="muted">'+counts.all+' everyday situations. Tap one to see why it\'s hard, what to say, and the five small steps — then turn it into '+BF.ui.esc(BF.ui.heroName())+'\'s own story.</p></div>'+
        '<div class="lib-legend paper"><b>Three starting points</b><span>'+BF.ui.tagChip("anxiety")+' worry, fear, avoiding</span><span>'+BF.ui.tagChip("adhd")+' starting, switching, waiting</span><span>'+BF.ui.tagChip("both")+' when both show up in one child</span></div></div>'+
        '<div class="lib-tools">'+
          '<div class="filter-tabs" role="tablist">'+["all","anxiety","adhd","both"].map(function(t){ return '<button data-tag="'+t+'" class="ft ft-'+t+'" aria-pressed="'+(t===tag)+'">'+(t==="all"?"All":BF.TAGS[t].label)+' <small>'+counts[t]+'</small></button>'; }).join("")+'</div>'+
          '<label class="search"><span class="sr">Search situations</span>'+I('search',18)+'<input class="input" id="libQ" placeholder="Search: dentist, homework, noise…" autocomplete="off"></label>'+
          '<div class="cat-row">'+['all'].concat(Object.keys(BF.CATS)).map(function(k){ return '<button data-cat="'+k+'" aria-pressed="'+(k===cat)+'">'+(k==="all"?"Everywhere":BF.CATS[k])+'</button>'; }).join("")+'</div>'+
        '</div>'+
        '<div class="lib-grid" id="libGrid"></div>'+
        '<p class="empty-note muted" id="libEmpty" hidden>No situations match. Try another word — or <a href="#/library">clear filters</a>.</p>'+
      '</div>'+
      '<div class="sheet" id="sheet" hidden><div class="sheet-bg" data-close></div><div class="sheet-card paper" role="dialog" aria-modal="true" aria-labelledby="shT"><button class="sheet-x" data-close aria-label="Close">×</button><div id="sheetBody"></div></div></div>';
    var grid = el.querySelector("#libGrid");
    function draw(){
      var ql = q.toLowerCase().trim();
      var list = BF.SITUATIONS.filter(function(s){
        return (tag==="all"||s.tag===tag) && (cat==="all"||s.cat===cat) &&
          (!ql || (s.title+" "+s.why+" "+s.event+" "+s.steps.join(" ")).toLowerCase().indexOf(ql)>=0);
      });
      grid.innerHTML = list.map(function(s, ix){
        var rot = ((s.id.charCodeAt(0)+s.id.length*7)%5-2)*0.5;
        var has = !!BF.store.s.plans[s.id];
        return '<button class="sit-card sit-'+s.tag+'" data-id="'+s.id+'" style="--rot:'+rot+'deg; animation-delay:'+(Math.min(ix,12)*35)+'ms">'+
          '<span class="tape"></span><span class="sit-ico">'+I(s.cat,24)+'</span>'+BF.ui.tagChip(s.tag)+
          '<h3>'+s.title+'</h3><p>'+s.why.split(". ")[0].replace(/\.$/,"")+'.</p>'+
          '<span class="sit-foot">'+(has?'<span class="has">'+I('check',14)+' plan made</span>':'<span>'+BF.CATS[s.cat]+'</span>')+'<span class="go">Open '+I('next',14)+'</span></span></button>';
      }).join("");
      el.querySelector("#libEmpty").hidden = list.length>0;
    }
    el.querySelector(".filter-tabs").addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; tag=b.getAttribute("data-tag"); el.querySelectorAll(".filter-tabs button").forEach(function(x){ x.setAttribute("aria-pressed",x===b); }); draw(); });
    el.querySelector(".cat-row").addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; cat=b.getAttribute("data-cat"); el.querySelectorAll(".cat-row button").forEach(function(x){ x.setAttribute("aria-pressed",x===b); }); draw(); });
    el.querySelector("#libQ").addEventListener("input", function(e){ q=e.target.value; draw(); });

    var sheet = el.querySelector("#sheet"), sb = el.querySelector("#sheetBody");
    function openSheet(id){
      var s = BF.plans.find(id), has = !!BF.store.s.plans[id];
      var ladderTitle = s.tag==="adhd" ? "Routine steps" : (s.tag==="both" ? "Brave ladder · one timed card at a time" : "Brave ladder");
      sb.innerHTML = '<div class="sh-top">'+BF.ui.tagChip(s.tag)+'<span class="chip">'+I(s.cat,14)+' '+BF.CATS[s.cat]+'</span></div>'+
        '<h2 id="shT">'+s.title+'</h2>'+
        '<div class="sh-grid"><div><h4>Why it\'s hard</h4><p>'+s.why+'</p><h4>Try saying</h4><ul class="quote-list">'+s.phrases.map(function(p){ return '<li>“'+p+'”</li>'; }).join("")+'</ul></div>'+
        '<div><h4>'+ladderTitle+'</h4><ol class="mini-ladder">'+s.steps.map(function(t,i){ return '<li><span>'+(i+1)+'</span><div>'+t+(s.tag!=="anxiety"?' <small>· '+s.mins[i]+'&nbsp;min</small>':'')+'</div></li>'; }).join("")+'</ol></div></div>'+
        '<div class="sh-actions">'+(s.tag!=="adhd"?'<button class="btn clay" data-mode="brave">'+I('book',18)+' '+(has?'Open':'Make')+' Brave Plan</button>':'')+
        (s.tag!=="anxiety"?'<button class="btn sage" data-mode="quest">'+I('clock',18)+' '+(has?'Open':'Start')+' Routine Quest</button>':'')+
        '<a class="btn ghost" href="#/game/'+s.game+'">Warm-up game</a></div>'+
        (has?'':'<p class="fine">'+(BF.store.plansLeft()===Infinity?'Unlimited plans':BF.store.plansLeft()+' free plans left')+' · plans are generated from templates with '+BF.ui.esc(BF.ui.heroName())+'\'s name, buddy and hero.</p>');
      sb.querySelectorAll("[data-mode]").forEach(function(b){ b.onclick = function(){ BF.plans.open(id, b.getAttribute("data-mode")); }; });
      sheet.hidden = false; requestAnimationFrame(function(){ sheet.classList.add("open"); });
      sb.querySelector("button").focus();
    }
    function closeSheet(){ sheet.classList.remove("open"); setTimeout(function(){ sheet.hidden = true; }, 220); }
    grid.addEventListener("click", function(e){ var b=e.target.closest(".sit-card"); if(b){ BF.sound.soft(); openSheet(b.getAttribute("data-id")); } });
    sheet.addEventListener("click", function(e){ if(e.target.hasAttribute("data-close")) closeSheet(); });
    function onKey(e){ if(e.key==="Escape" && !sheet.hidden) closeSheet(); }
    document.addEventListener("keydown", onKey);
    draw();
    if(query && query.open) openSheet(query.open);
    return function(){ document.removeEventListener("keydown", onKey); };
  }
};
