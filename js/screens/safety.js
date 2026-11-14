var BF = window.BF = window.BF || {};
BF.screens.safety = {
  title:"Safety & disclaimer",
  render:function(el, param, query){
    var I = BF.icon, fromQuiz = query && query.from==="quiz";
    el.innerHTML =
      '<div class="safety wrap">'+
        (fromQuiz?'<div class="flag-banner paper">'+I('heart',28)+'<div><b>Thank you for telling us.</b> Some of what you described is more than an app should handle alone. Please reach out to your pediatrician or a licensed child mental-health professional soon. You can still use Balapan alongside their care.<div class="cel-actions"><a class="btn clay small" href="#/hero?from=quiz">Continue to build the hero</a></div></div></div>':'')+
        '<p class="eyebrow">Safety &amp; disclaimer</p><h1>What Balapan is — and isn\'t</h1>'+
        '<div class="safe-grid">'+
          '<div class="paper safe-card"><h3>'+I('check',20)+' It is</h3><ul class="plain"><li>A parenting support tool with everyday ideas: stories, small steps, routines and calm games.</li><li>A way to practice brave steps together, at your child\'s pace.</li><li>A tidy record you can bring to a professional.</li></ul></div>'+
          '<div class="paper safe-card"><h3>'+I('shield',20)+' It is not</h3><ul class="plain"><li>Therapy, counseling, or a medical device.</li><li>A diagnosis of anxiety, ADHD, or anything else.</li><li>A replacement for your pediatrician, a psychologist, or medication decisions.</li></ul></div>'+
        '</div>'+
        '<section class="paper red-flags"><span class="tape"></span><h2>Talk to a specialist if…</h2><ul class="plain two">'+
          '<li>Your child talks about hurting themselves or not wanting to live.</li><li>Worry or meltdowns stop school, sleep or eating for weeks.</li>'+
          '<li>Panic attacks happen most days.</li><li>Your child refuses school for days at a time.</li>'+
          '<li>Your child hurts others or is in danger.</li><li>You feel out of your depth — that alone is a good reason.</li></ul>'+
          '<p>Start with your pediatrician. They can refer you to a child psychologist or psychiatrist.</p></section>'+
        '<section class="crisis"><div class="crisis-n"><b>988</b><span>Call or text — Suicide &amp; Crisis Lifeline (US), 24/7</span></div><div class="crisis-n"><b>911</b><span>If anyone is in immediate danger</span></div><div class="crisis-n"><b>741741</b><span>Text HOME — Crisis Text Line (US)</span></div></section>'+
        '<section class="paper privacy"><h3>'+I('lock',20)+' Privacy</h3><p>No account, no server. Your child\'s name, hero and progress are saved only in this browser\'s local storage. Clearing your browser data or pressing “Reset demo data” at the bottom removes everything.</p></section>'+
      '</div>';
  }
};
