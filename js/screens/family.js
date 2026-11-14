var BF = window.BF = window.BF || {};
BF.screens.family = {
  title:{en:"Children",ru:"Дети"},
  render:function(el){
    var st = BF.store, I = BF.icon, esc = BF.ui.esc, T = BF.ui.T, cur = st.f.active;
    var kids = st.children(), limit = st.childLimit(), real = st.realChildren().length;
    el.innerHTML = '<div class="family wrap"><div class="d-head"><div><p class="eyebrow">'+BF.L("Family","Семья")+'</p><h1>'+BF.L("Your children","Ваши дети")+'</h1><p class="muted">'+BF.L("Each child has their own hero, quiz answers, plans, diary, moods and progress.","У каждого ребёнка свой герой, ответы анкеты, планы, дневник, настроение и прогресс.")+' '+BF.L("On your plan: "+real+" of "+limit+".","На вашем тарифе: "+real+" из "+limit+".")+'</p></div><button class="btn clay" id="fAdd">'+I('plus',18)+' '+BF.L("Add a child","Добавить ребёнка")+'</button></div>'+
      '<div class="kid-cards">'+kids.map(function(c){
        return '<article class="kid-card paper'+(c.id===cur?' on':'')+'">'+BF.avatar.svg(c.avatar,{size:96})+'<div class="kc-body"><h3>'+esc(BF.ui.heroName(c))+(c.isDemo?' <span class="demo-tag">'+BF.L("demo","демо")+'</span>':'')+'</h3><p class="muted small">'+(c.quizDone?BF.L("age","возраст")+' '+c.age+' · '+T((BF.PROFILE_OPTS.find(function(o){ return o.v===c.profile; })||BF.PROFILE_OPTS[3]).t)+' · '+c.planOrder.length+' '+BF.L("plans","планов")+' · '+(c.diary||[]).length+' '+BF.L("diary notes","записей"):BF.L("Quiz not finished yet","Анкета ещё не заполнена"))+'</p>'+
          '<div class="cel-actions"><button class="btn small clay" data-open="'+c.id+'">'+(c.id===cur?BF.L("Active","Активен"):BF.L("Switch to","Выбрать"))+'</button><button class="btn small ghost" data-quiz="'+c.id+'">'+I('refresh',14)+' '+BF.L("Quiz","Анкета")+'</button><button class="btn small ghost" data-hero="'+c.id+'">'+I('user',14)+' '+BF.L("Hero","Герой")+'</button><button class="btn small ghost" data-del="'+c.id+'">'+I('trash',14)+'</button></div></div></article>';
      }).join("")+'</div>'+
      '<p class="fine">'+BF.L("Free: 1 child · Monthly ($12.99): 2 children · Yearly ($79.99): up to 3 children. Demo data doesn't count.","Бесплатно: 1 ребёнок · Месяц ($12.99): 2 ребёнка · Год ($79.99): до 3 детей. Демо-данные не считаются.")+' <a href="#/pricing">'+BF.L("Plans","Тарифы")+'</a></p></div>';
    el.querySelector("#fAdd").onclick = function(){ BF.addChildFlow(); };
    function sw(id){ st.setActive(id); BF.renderShell(); }
    el.querySelectorAll("[data-open]").forEach(function(b){ b.onclick = function(){ sw(b.getAttribute("data-open")); BF.router.go("/parent"); }; });
    el.querySelectorAll("[data-quiz]").forEach(function(b){ b.onclick = function(){ sw(b.getAttribute("data-quiz")); BF.router.go("/quiz"); }; });
    el.querySelectorAll("[data-hero]").forEach(function(b){ b.onclick = function(){ sw(b.getAttribute("data-hero")); BF.router.go("/hero"); }; });
    el.querySelectorAll("[data-del]").forEach(function(b){ b.onclick = function(){
      var k = st.f.children[b.getAttribute("data-del")];
      if(!confirm(BF.L("Delete "+BF.ui.heroName(k)+" and all their data from this browser?","Удалить «"+BF.ui.heroName(k)+"» и все данные из этого браузера?"))) return;
      if(k.isDemo) BF.clearDemo(); else st.removeChild(k.id);
      if(!st.children().length) st.child();
      BF.renderShell(); BF.router.refresh();
    }; });
  }
};
