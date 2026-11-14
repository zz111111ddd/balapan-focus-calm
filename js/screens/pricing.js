var BF = window.BF = window.BF || {};
/* Replace with your real Stripe Payment Links (test mode) before demo day. */
BF.config = BF.config || {};
BF.config.stripeMonthly = "https://buy.stripe.com/test_REPLACE_MONTHLY";
BF.config.stripeYearly  = "https://buy.stripe.com/test_REPLACE_YEARLY";
BF.screens.pricing = {
  title:{en:"Plans & pricing",ru:"Тарифы"},
  render:function(el, param, query){
    var st = BF.store, f = st.f, I = BF.icon, T = BF.ui.T, q = query||{}, locked = q.locked ? BF.engine.find(q.locked) : null;
    var used = st.plansUsed(), plan = f.plan;
    el.innerHTML =
      '<div class="pricing wrap">'+
        (locked?'<div class="lock-banner paper">'+I('lock',22)+'<div><b>'+BF.L("You've used your 3 free plans.","Вы использовали 3 бесплатных плана.")+'</b> '+BF.L("To make “"+T(locked.title)+"”, start a membership — or keep using your existing plans, the diary and all games for free.","Чтобы создать «"+T(locked.title)+"», оформите подписку — или продолжайте бесплатно пользоваться созданными планами, дневником и всеми играми.")+'</div></div>':'')+
        (q.children?'<div class="lock-banner paper">'+I('user',22)+'<div><b>'+BF.L("More children need a membership.","Для нескольких детей нужна подписка.")+'</b> '+BF.L("Monthly covers 2 children, yearly up to 3.","Месяц — 2 ребёнка, год — до 3 детей.")+'</div></div>':'')+
        '<div class="pr-head"><p class="eyebrow">'+BF.L("Simple, honest pricing","Простые и честные цены")+'</p><h1>'+BF.L("Start free. Stay if it helps.","Начните бесплатно. Оставайтесь, если помогает.")+'</h1><p class="muted">'+BF.L("Quiz → 3 free plans → a membership at market price. Cancel in one click, reminder before every charge.","Квиз → 3 бесплатных плана → подписка по рыночной цене. Отмена в один клик и напоминание перед каждым списанием.")+'</p></div>'+
        '<div class="tickets">'+
          '<div class="ticket free'+(plan==="free"?' current':'')+'"><div class="t-l"><p class="eyebrow">'+BF.L("Free","Бесплатно")+'</p><h2>$0</h2><ul><li>'+BF.L("3 plans (Brave Plan or Routine Quest)","3 плана (Brave Plan или Routine Quest)")+'</li><li>'+BF.L("1 child · all 16 games · diary","1 ребёнок · все 16 игр · дневник")+'</li></ul></div><div class="t-r"><b>'+(plan==="free"?Math.max(0,3-used)+' '+BF.L("left","осталось"):'✓')+'</b><small>'+(plan==="free"?BF.L("plans","планов"):BF.L("included","включено"))+'</small></div></div>'+
          '<div class="ticket'+(plan==="monthly"?' current':'')+'"><div class="t-l"><p class="eyebrow">'+BF.L("Monthly","Месяц")+'</p><h2>$12.99<small>'+BF.L("/month","/мес")+'</small></h2><ul><li>'+BF.L("Unlimited plans &amp; quests","Безлимитные планы и квесты")+'</li><li>'+BF.L("Dashboard with dates, specialist report","Кабинет с датами, отчёт для врача")+'</li><li>'+BF.L("Up to 2 children","До 2 детей")+'</li></ul><button class="btn clay" data-plan="monthly">'+(plan==="monthly"?BF.L("Current plan","Текущий тариф"):BF.L("Choose monthly","Выбрать месяц"))+'</button></div><div class="t-r"><b>'+BF.L("Flexible","Гибко")+'</b><small>'+BF.L("cancel anytime","отмена в любой момент")+'</small></div></div>'+
          '<div class="ticket best'+(plan==="yearly"?' current':'')+'"><span class="ribbon">'+BF.L("Best value","Выгоднее")+'</span><div class="t-l"><p class="eyebrow">'+BF.L("Yearly","Год")+'</p><h2>$79.99<small>'+BF.L("/year","/год")+'</small></h2><p class="muted small">'+BF.L("About $6.67 a month, billed once a year.","Около $6.67 в месяц, оплата раз в год.")+'</p><ul><li>'+BF.L("Everything in monthly","Всё, что в месячном")+'</li><li>'+BF.L("Up to 3 children","До 3 детей")+'</li></ul><button class="btn sage" data-plan="yearly">'+(plan==="yearly"?BF.L("Current plan","Текущий тариф"):BF.L("Choose yearly","Выбрать год"))+'</button></div><div class="t-r"><b>'+BF.L("Save ~49%","Экономия ~49%")+'</b><small>'+BF.L("vs monthly","к месячному")+'</small></div></div>'+
        '</div>'+
        '<div class="honest paper"><span class="tape"></span><h3>'+BF.L("Our cancel promise","Наше обещание об отмене")+'</h3><ul class="plain"><li>'+BF.L("Cancel in two taps from this page — no calls, no mazes.","Отмена в два нажатия на этой странице — без звонков и лабиринтов.")+'</li><li>'+BF.L("We email a reminder before every yearly renewal.","Перед каждым годовым продлением мы пришлём напоминание.")+'</li><li>'+BF.L("Payments run through Stripe. We never see your card.","Оплата через Stripe. Мы не видим данные вашей карты.")+'</li></ul>'+
          '<p class="fine">'+BF.L("Prototype note: buttons open a Stripe test-mode placeholder. Checkout is simulated and unlocks on this device only.","Примечание: кнопки ведут на заглушку Stripe в тестовом режиме. Оплата имитируется и действует только на этом устройстве.")+'</p>'+
          (plan!=="free"?'<button class="btn ghost small" id="cancelSub">'+BF.L("Cancel membership (demo)","Отменить подписку (демо)")+'</button>':'')+'</div>'+
      '</div>';
    el.querySelectorAll("[data-plan]").forEach(function(b){ b.onclick = function(){
      var p = b.getAttribute("data-plan"); if(p===plan) return;
      var sh = BF.ui.sheet('<h2>'+BF.L("Test checkout","Тестовая оплата")+'</h2><p>'+BF.L("In the live product this opens Stripe Checkout:","В рабочей версии здесь откроется Stripe Checkout:")+'</p><p class="mono">'+(p==="yearly"?BF.config.stripeYearly:BF.config.stripeMonthly)+'</p><p class="muted small">'+BF.L("For the demo we don't charge anything.","В демо ничего не списывается.")+'</p><div class="cel-actions"><button class="btn clay" id="paySim">'+BF.L("Simulate test payment","Имитировать оплату")+'</button><button class="btn ghost" data-close>'+BF.L("Not now","Не сейчас")+'</button></div>', "narrow");
      sh.querySelector("#paySim").onclick = function(e){
        st.updateFamily(function(x){ x.plan = p; }); BF.ui.burst(e.currentTarget, 2); sh.close();
        BF.ui.toast(BF.L("Membership active (test mode).","Подписка активна (тестовый режим)."));
        setTimeout(function(){ if(locked) BF.plans.open(locked.id); else if(q.children) BF.addChildFlow(); else BF.router.refresh(); }, 600);
      };
    }; });
    var c = el.querySelector("#cancelSub"); if(c) c.onclick = function(){ st.updateFamily(function(x){ x.plan="free"; }); BF.ui.toast(BF.L("Cancelled. Your plans and progress stay saved.","Подписка отменена. Планы и прогресс сохранены.")); BF.router.refresh(); };
  }
};
