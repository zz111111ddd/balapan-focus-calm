var BF = window.BF = window.BF || {};
/* Replace with your real Stripe Payment Link (test mode) before demo day. */
BF.config = BF.config || {};
BF.config.stripeMonthly = "https://buy.stripe.com/test_REPLACE_MONTHLY";
BF.config.stripeYearly  = "https://buy.stripe.com/test_REPLACE_YEARLY";
BF.screens.pricing = {
  title:"Plans & pricing",
  render:function(el, param, query){
    var st = BF.store.s, I = BF.icon, locked = query && query.locked ? BF.plans.find(query.locked) : null;
    var used = st.planOrder.length;
    el.innerHTML =
      '<div class="pricing wrap">'+
        (locked?'<div class="lock-banner paper">'+I('lock',22)+'<div><b>You\'ve used your 3 free brave plans.</b> To make “'+locked.title+'”, start a membership — or keep using your existing plans and all games for free.</div></div>':'')+
        '<div class="pr-head"><p class="eyebrow">Simple, honest pricing</p><h1>Start free. Stay if it helps.</h1><p class="muted">Your first 3 brave plans are free, with all games and the parent dashboard. No card needed to try.</p></div>'+
        '<div class="tickets">'+
          '<div class="ticket free"><div class="t-l"><p class="eyebrow">Free</p><h2>$0</h2><p>3 brave plans · all 8 games · dashboard</p></div><div class="t-r"><b>'+(st.premium?'Member':Math.max(0,3-used)+' left')+'</b><small>'+(st.premium?'unlimited':'plans')+'</small></div></div>'+
          '<div class="ticket"><div class="t-l"><p class="eyebrow">Monthly</p><h2>$12.99<small>/month</small></h2><ul><li>Unlimited brave plans &amp; routine quests</li><li>New situations added over time</li><li>Printable summaries for the doctor</li></ul><button class="btn clay" data-plan="monthly">Choose monthly</button></div><div class="t-r"><b>Flexible</b><small>cancel anytime</small></div></div>'+
          '<div class="ticket best"><span class="ribbon">Best value</span><div class="t-l"><p class="eyebrow">Yearly</p><h2>$79.99<small>/year</small></h2><p class="muted small">That\'s about $6.67 a month, billed once a year.</p><ul><li>Everything in monthly</li><li>One payment, a calmer school year</li></ul><button class="btn sage" data-plan="yearly">Choose yearly</button></div><div class="t-r"><b>Save ~49%</b><small>vs monthly</small></div></div>'+
        '</div>'+
        '<div class="honest paper"><span class="tape"></span><h3>Our cancel promise</h3><ul class="plain"><li>Cancel in two taps from this page — no calls, no “are you sure?” mazes.</li><li>We email a reminder before every yearly renewal.</li><li>Payments run through Stripe. We never see your card.</li></ul>'+
          '<p class="fine">Prototype note: buttons open a Stripe <b>test-mode</b> link placeholder. In this demo, checkout is simulated and unlocks unlimited plans on this device only.</p>'+
          (st.premium?'<button class="btn ghost small" id="cancelSub">Cancel membership (demo)</button>':'')+'</div>'+
      '</div>'+
      '<div class="sheet" id="paySheet" hidden><div class="sheet-bg" data-close></div><div class="sheet-card paper narrow" role="dialog" aria-modal="true"><button class="sheet-x" data-close aria-label="Close">×</button><h2>Test checkout</h2><p>In the live product this opens Stripe Checkout:</p><p class="mono" id="payLink"></p><p class="muted small">For the hackathon demo we don\'t charge anything. Tap below to simulate a successful test payment.</p><div class="cel-actions"><button class="btn clay" id="paySim">Simulate test payment</button><button class="btn ghost" data-close>Not now</button></div></div></div>';
    var sheet = el.querySelector("#paySheet");
    el.querySelectorAll("[data-plan]").forEach(function(b){ b.onclick = function(){
      el.querySelector("#payLink").textContent = b.getAttribute("data-plan")==="yearly" ? BF.config.stripeYearly : BF.config.stripeMonthly;
      sheet.hidden = false; requestAnimationFrame(function(){ sheet.classList.add("open"); });
    }; });
    sheet.addEventListener("click", function(e){ if(e.target.hasAttribute("data-close")){ sheet.classList.remove("open"); setTimeout(function(){ sheet.hidden = true; }, 200); } });
    el.querySelector("#paySim").onclick = function(e){
      BF.store.update(function(s){ s.premium = true; }); BF.ui.burst(e.currentTarget, 2); BF.ui.toast("Membership active (test mode). Unlimited plans unlocked.");
      setTimeout(function(){ if(locked) BF.plans.open(locked.id); else BF.router.refresh(); }, 700);
    };
    var c = el.querySelector("#cancelSub"); if(c) c.onclick = function(){ BF.store.update(function(s){ s.premium=false; }); BF.ui.toast("Cancelled. Your plans and progress stay saved."); BF.router.refresh(); };
  }
};
