var BF = window.BF = window.BF || {};
BF.screens.hero = {
  title:"Build the hero",
  render:function(el, param, query){
    var A = BF.avatar, s = BF.store.s, cfg = JSON.parse(JSON.stringify(s.avatar)), I = BF.icon;
    var fromQuiz = query && query.from==="quiz";
    var tabs = [
      {id:"body", t:"Skin & body"}, {id:"hair", t:"Hair"}, {id:"face", t:"Eyes & extras"}, {id:"clothes", t:"Clothes"}, {id:"shoes", t:"Shoes"}
    ], tab = "body";
    el.innerHTML =
      '<div class="builder wrap">'+
        '<div class="b-head"><p class="eyebrow">'+(fromQuiz?'Step 2 of 3 · ':'')+'Character builder</p><h1>Make a hero who looks like '+BF.ui.esc(BF.ui.childName())+'</h1><p class="muted">Build it together with your child if you can — kids love choosing their own hair and shoes.</p></div>'+
        '<div class="b-grid">'+
          '<div class="b-stage paper"><div class="b-scene">'+BF.ui.hills(1)+'</div><div class="b-av" id="bAv"></div>'+
            '<div class="b-name">'+BF.ui.esc(BF.ui.heroName())+'</div>'+
            '<div class="b-stage-actions"><button class="btn small paper" id="bShuffle">'+I('refresh',16)+' Surprise me</button></div></div>'+
          '<div class="b-panel paper">'+
            '<div class="b-tabs" role="tablist">'+tabs.map(function(t){ return '<button role="tab" data-tab="'+t.id+'">'+t.t+'</button>'; }).join("")+'</div>'+
            '<div class="b-body" id="bBody"></div>'+
            '<div class="b-save"><button class="btn clay big" id="bSave">'+(fromQuiz?'Save hero & see our plan':'Save hero')+' '+I('next',18)+'</button></div>'+
          '</div>'+
        '</div>'+
      '</div>';
    var av = el.querySelector("#bAv"), body = el.querySelector("#bBody");
    function paint(){ av.innerHTML = A.svg(cfg,{size:240, pose:"idle"}); av.classList.remove("pop"); void av.offsetWidth; av.classList.add("pop"); }
    function swatches(key, list, label){
      return '<div class="b-row"><h4>'+label+'</h4><div class="swatches">'+list.map(function(c,ix){ var col = c.c||c; return '<button class="sw" data-k="'+key+'" data-v="'+ix+'" aria-pressed="'+(cfg[key]===ix)+'" style="--c:'+col+'" title="'+(c.n||col)+'" aria-label="'+(c.n||("Color "+(ix+1)))+'"></button>'; }).join("")+'</div></div>';
    }
    function choices(key, list, label){
      return '<div class="b-row"><h4>'+label+'</h4><div class="seg">'+list.map(function(o){ return '<button data-k="'+key+'" data-v="'+o.v+'" aria-pressed="'+(cfg[key]===o.v)+'">'+o.n+'</button>'; }).join("")+'</div></div>';
    }
    function drawTab(){
      el.querySelectorAll(".b-tabs button").forEach(function(b){ b.setAttribute("aria-selected", b.getAttribute("data-tab")===tab); });
      var h = "";
      if(tab==="body") h = swatches("skin", A.SKIN, "Skin tone") + choices("build", A.BUILDS, "Body build");
      if(tab==="hair") h = choices("hair", A.HAIRS, "Hairstyle") + swatches("hairColor", A.HAIRC, "Hair color");
      if(tab==="face") h = swatches("eyes", A.EYES, "Eye color") + choices("extra", A.EXTRAS, "Something special");
      if(tab==="clothes") h = choices("top", A.TOPS, "Top") + swatches("topColor", A.CLOTH, "Top color") + choices("bottom", A.BOTTOMS, "Bottoms") + swatches("bottomColor", A.BOTTOMC, "Bottoms color");
      if(tab==="shoes") h = choices("shoes", A.SHOES, "Shoes") + swatches("shoeColor", A.SHOEC, "Shoe color");
      body.innerHTML = h;
    }
    body.addEventListener("click", function(e){
      var b = e.target.closest("button[data-k]"); if(!b) return;
      var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
      cfg[k] = b.classList.contains("sw") ? +v : v;
      body.querySelectorAll('button[data-k="'+k+'"]').forEach(function(x){ x.setAttribute("aria-pressed", x===b); });
      BF.sound.pop(); paint();
    });
    el.querySelector(".b-tabs").addEventListener("click", function(e){ var b=e.target.closest("button"); if(!b) return; tab=b.getAttribute("data-tab"); drawTab(); });
    el.querySelector("#bShuffle").onclick = function(){
      function r(n){ return Math.floor(Math.random()*n); }
      cfg.skin=r(A.SKIN.length); cfg.hair=A.HAIRS[r(A.HAIRS.length)].v; cfg.hairColor=r(A.HAIRC.length); cfg.eyes=r(A.EYES.length);
      cfg.top=A.TOPS[r(A.TOPS.length)].v; cfg.topColor=r(A.CLOTH.length); cfg.bottom=A.BOTTOMS[r(A.BOTTOMS.length)].v; cfg.bottomColor=r(A.BOTTOMC.length);
      cfg.shoes=A.SHOES[r(3)].v; cfg.shoeColor=r(A.SHOEC.length); cfg.build=A.BUILDS[r(3)].v; cfg.extra=A.EXTRAS[r(A.EXTRAS.length)].v;
      paint(); drawTab();
    };
    el.querySelector("#bSave").onclick = function(e){
      BF.store.update(function(st){ st.avatar = cfg; st.avatarSaved = true; });
      BF.ui.burst(e.currentTarget,1); BF.ui.toast("Hero saved — they'll star in every story and game.");
      document.getElementById("brandMark").innerHTML = BF.avatar.chick(34);
      if(fromQuiz) setTimeout(function(){ BF.router.go("/plan"); }, 700);
    };
    paint(); drawTab();
  }
};
