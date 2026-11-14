var BF = window.BF = window.BF || {};
BF.AVATAR_RU = {
  hairColor:{"Black":"Чёрные","Dark brown":"Тёмно-каштановые","Brown":"Каштановые","Auburn":"Рыжевато-каштановые","Copper":"Медные","Golden":"Золотистые","Light blond":"Светло-русые","Silver":"Серебристые"},
  eyes:{"Dark brown":"Тёмно-карие","Brown":"Карие","Hazel":"Ореховые","Green":"Зелёные","Blue":"Голубые","Gray":"Серые"},
  any:{"Short":"Короткие","Curly":"Кудрявые","Long":"Длинные","Ponytail":"Хвостик","Bun":"Пучок","Braids":"Косички","Puff":"Афро-пучок","Buzz":"Ёжик","T-shirt":"Футболка","Hoodie":"Толстовка","Striped sweater":"Полосатый свитер","Dress":"Платье",
    "Pants":"Брюки","Shorts":"Шорты","Skirt":"Юбка","Leggings":"Леггинсы","Sneakers":"Кроссовки","Boots":"Ботинки","Sandals":"Сандалии","Slim":"Худое","Medium":"Среднее","Chubby":"Пухлое","Nothing":"Ничего","Glasses":"Очки","Ear muffs":"Наушники","Freckles":"Веснушки"}
};
BF.screens.hero = {
  title:{en:"Build the hero",ru:"Собрать героя"},
  render:function(el, param, query){
    var A = BF.avatar, c = BF.store.s, cfg = JSON.parse(JSON.stringify(c.avatar)), I = BF.icon;
    var fromQuiz = query && query.from==="quiz";
    function nm(key, n){ if(BF.lang()!=="ru" || !n) return n; return (BF.AVATAR_RU[key]&&BF.AVATAR_RU[key][n]) || BF.AVATAR_RU.any[n] || n; }
    var tabs = [ {id:"body", t:BF.L("Skin & body","Кожа и тело")}, {id:"hair", t:BF.L("Hair","Волосы")}, {id:"face", t:BF.L("Eyes & extras","Глаза и детали")}, {id:"clothes", t:BF.L("Clothes","Одежда")}, {id:"shoes", t:BF.L("Shoes","Обувь")} ], tab = "body";
    el.innerHTML =
      '<div class="builder wrap">'+
        '<div class="b-head"><p class="eyebrow">'+(fromQuiz?BF.L("Almost there · ","Почти готово · "):'')+BF.L("Character builder","Конструктор героя")+'</p><h1>'+BF.L("Make a hero who looks like "+BF.ui.esc(BF.ui.childName()),"Соберите героя, похожего на ребёнка: "+BF.ui.esc(BF.ui.childName()))+'</h1><p class="muted">'+BF.L("Build it together with your child if you can — kids love choosing their own hair and shoes.","Если получится, собирайте вместе с ребёнком — дети обожают сами выбирать причёску и обувь.")+'</p></div>'+
        '<div class="b-grid">'+
          '<div class="b-stage paper"><div class="b-scene">'+BF.ui.hills(1)+'</div><div class="b-av" id="bAv"></div>'+
            '<div class="b-name">'+BF.ui.esc(BF.ui.heroName())+'</div>'+
            '<div class="b-stage-actions"><button class="btn small paper" id="bShuffle">'+I('refresh',16)+' '+BF.L("Surprise me","Случайно")+'</button></div></div>'+
          '<div class="b-panel paper">'+
            '<div class="b-tabs" role="tablist">'+tabs.map(function(t){ return '<button role="tab" data-tab="'+t.id+'">'+t.t+'</button>'; }).join("")+'</div>'+
            '<div class="b-body" id="bBody"></div>'+
            '<div class="b-save"><button class="btn clay big" id="bSave">'+(fromQuiz?BF.L("Save hero & see our plan","Сохранить и открыть план"):BF.L("Save hero","Сохранить героя"))+' '+I('next',18)+'</button></div>'+
          '</div>'+
        '</div>'+
      '</div>';
    var av = el.querySelector("#bAv"), body = el.querySelector("#bBody");
    function paint(){ av.innerHTML = A.svg(cfg,{size:240, pose:"idle"}); av.classList.remove("pop"); void av.offsetWidth; av.classList.add("pop"); }
    function swatches(key, list, label){
      return '<div class="b-row"><h4>'+label+'</h4><div class="swatches">'+list.map(function(x,ix){ var col = x.c||x, n = nm(key, x.n) || (BF.L("Color ","Цвет ")+(ix+1)); return '<button class="sw" data-k="'+key+'" data-v="'+ix+'" aria-pressed="'+(cfg[key]===ix)+'" style="--c:'+col+'" title="'+n+'" aria-label="'+n+'"></button>'; }).join("")+'</div></div>';
    }
    function choices(key, list, label){
      return '<div class="b-row"><h4>'+label+'</h4><div class="seg">'+list.map(function(o){ return '<button data-k="'+key+'" data-v="'+o.v+'" aria-pressed="'+(cfg[key]===o.v)+'">'+nm(key,o.n)+'</button>'; }).join("")+'</div></div>';
    }
    function drawTab(){
      el.querySelectorAll(".b-tabs button").forEach(function(b){ b.setAttribute("aria-selected", b.getAttribute("data-tab")===tab); });
      var h = "";
      if(tab==="body") h = swatches("skin", A.SKIN, BF.L("Skin tone","Цвет кожи")) + choices("build", A.BUILDS, BF.L("Body build","Телосложение"));
      if(tab==="hair") h = choices("hair", A.HAIRS, BF.L("Hairstyle","Причёска")) + swatches("hairColor", A.HAIRC, BF.L("Hair color","Цвет волос"));
      if(tab==="face") h = swatches("eyes", A.EYES, BF.L("Eye color","Цвет глаз")) + choices("extra", A.EXTRAS, BF.L("Something special","Особая деталь"));
      if(tab==="clothes") h = choices("top", A.TOPS, BF.L("Top","Верх")) + swatches("topColor", A.CLOTH, BF.L("Top color","Цвет верха")) + choices("bottom", A.BOTTOMS, BF.L("Bottoms","Низ")) + swatches("bottomColor", A.BOTTOMC, BF.L("Bottoms color","Цвет низа"));
      if(tab==="shoes") h = choices("shoes", A.SHOES, BF.L("Shoes","Обувь")) + swatches("shoeColor", A.SHOEC, BF.L("Shoe color","Цвет обуви"));
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
      BF.store.update(function(x){ x.avatar = cfg; x.avatarSaved = true; });
      BF.ui.burst(e.currentTarget,1); BF.ui.toast(BF.L("Hero saved — they'll star in every story, scene and game.","Герой сохранён — он будет в каждой истории, сцене и игре."));
      BF.renderShell();
      if(fromQuiz) setTimeout(function(){ BF.router.go("/plan"); }, 700);
    };
    paint(); drawTab();
  }
};
