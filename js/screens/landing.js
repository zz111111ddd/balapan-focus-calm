var BF = window.BF = window.BF || {};
BF.screens = BF.screens || {};
BF.screens.home = {
  title:"Home",
  render:function(el){
    var s = BF.store.s, A = BF.avatar, I = BF.icon;
    var started = s.quizDone;
    el.innerHTML =
    '<div class="hero wrap">'+
      '<div class="hero-copy">'+
        '<p class="eyebrow reveal">For parents of kids 5–10 · anxiety, ADHD, or both</p>'+
        '<h1 class="reveal d1">Turn tomorrow\'s worry into <em class="ul">tonight\'s story.</em></h1>'+
        '<p class="lede reveal d2">Balapan builds a tiny brave plan where <b>your child is the hero</b> — a story, five small steps, and calm games that train focus and steady hands. Ten minutes a day, together.</p>'+
        '<div class="cta-row reveal d3">'+
          '<a class="btn big clay" href="#/'+(started?'plan':'quiz')+'">'+(started?'Open our family plan':'Start — no sign-up')+' '+I('next',20)+'</a>'+
          '<a class="btn big ghost" href="#/games">Try a game first</a>'+
        '</div>'+
        '<p class="fine reveal d4">'+I('lock',16)+' Nothing to register. Everything stays in this browser.</p>'+
      '</div>'+
      '<div class="hero-art reveal d2" aria-hidden="true">'+
        '<div class="hero-blob"><div class="hero-scene">'+BF.ui.hills(0)+'</div></div>'+
        '<div class="hero-ladder">'+[0,1,2,3,4].map(function(i){ return '<span class="rung r'+i+'">'+BF.starSVG(22, i<2)+'</span>'; }).join("")+'</div>'+
        '<div class="hero-kid">'+A.svg(s.avatar,{size:220,pose:"wave"})+'</div>'+
        '<div class="hero-chick">'+A.chick(78)+'</div>'+
        '<div class="note n1 paper"><span class="tape"></span><b>Brave step 3</b><br>Sit in the big dentist chair</div>'+
        '<div class="note n2 paper"><span class="tape"></span>“You can feel nervous <i>and</i> still do it.”</div>'+
      '</div>'+
    '</div>'+

    '<section class="how wrap">'+
      '<h2 class="center reveal">How a calmer week works</h2>'+
      '<svg class="how-path" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M20 60 C200 0 300 120 500 60 C700 0 800 120 980 60" fill="none" stroke="#D6C09C" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/></svg>'+
      '<ol class="how-steps">'+
        '<li class="reveal d1"><span class="num">1</span><h3>A 2-minute parent quiz</h3><p>What\'s hard, how it looks, what your child loves. No diagnosis needed.</p></li>'+
        '<li class="reveal d2"><span class="num">2</span><h3>Build the hero</h3><p>Skin, hair, eyes, clothes, body shape — your child sees <i>themself</i> being brave.</p></li>'+
        '<li class="reveal d3"><span class="num">3</span><h3>Climb one small step</h3><p>A story, a five-rung ladder, a timer for one task at a time, and stars for every try.</p></li>'+
        '<li class="reveal d4"><span class="num">4</span><h3>Check in at night</h3><p>Easy, okay, or too hard? Too hard splits tomorrow\'s step in half. Never a fail.</p></li>'+
      '</ol>'+
    '</section>'+

    '<section class="venn-sec wrap">'+
      '<div class="venn-copy">'+
        '<p class="eyebrow">Built for the overlap</p>'+
        '<h2>Worry and wiggles often show up in the same child.</h2>'+
        '<p>Most apps pick one lane. Balapan treats <b>anxiety</b>, <b>focus struggles</b> and <b>both at once</b> as three real starting points — each with its own situations, words to say, and pacing.</p>'+
        '<a class="btn dusty" href="#/library">Browse 32 everyday situations</a>'+
      '</div>'+
      '<div class="venn" aria-hidden="true">'+
        '<div class="v v1"><span>Anxiety<small>new places, goodbyes,<br>doctors, storms</small></span></div>'+
        '<div class="v v2"><span>ADHD / focus<small>mornings, homework,<br>switching, waiting</small></span></div>'+
        '<div class="v-mid"><b>Both</b><small>test day, loud lunch,<br>parties, travel</small></div>'+
      '</div>'+
    '</section>'+

    '<section class="tools wrap">'+
      '<article class="tool calm-tool reveal">'+
        '<div class="tool-art">'+BF.screens.home.miniStory()+'</div>'+
        '<div><p class="eyebrow">Calm</p><h3>Brave Plan</h3><p>A short read-aloud story starring your child, a five-step brave ladder, and parent phrases that mix <i>acceptance</i> with <i>confidence</i>.</p></div>'+
      '</article>'+
      '<article class="tool focus-tool reveal d1">'+
        '<div class="tool-art"><div class="mini-timer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FBF7EF"/><path class="mt-wedge" d="M50 50 L50 10 A40 40 0 1 1 15.4 70 Z" fill="#A3B59C"/><circle cx="50" cy="50" r="5" fill="#3B3632"/></svg></div></div>'+
        '<div><p class="eyebrow">Focus</p><h3>Routine Quest</h3><p>One card at a time, a big slow timer, a satisfying Done button, and a 60-second movement break when the wiggles win.</p></div>'+
      '</article>'+
      '<article class="tool play-tool reveal d2">'+
        '<div class="tool-art"><svg viewBox="0 0 120 80" class="mini-trace"><path d="M10 60 C30 10 50 70 70 30 S100 20 110 50" fill="none" stroke="#E7D7BC" stroke-width="14" stroke-linecap="round"/><path class="mt-draw" d="M10 60 C30 10 50 70 70 30 S100 20 110 50" fill="none" stroke="#C98E70" stroke-width="5" stroke-linecap="round"/></svg></div>'+
        '<div><p class="eyebrow">Play</p><h3>8 calm games</h3><p>Trace a trail, lace a shoe, sort buttons into jars — fine-motor and focus practice that earns stars for the next brave step.</p></div>'+
      '</article>'+
    '</section>'+

    '<section class="promise wrap">'+
      '<div class="promise-card paper"><span class="tape"></span>'+
        '<div class="promise-ico">'+I('shield',30)+'</div>'+
        '<div><h3>Honest about what this is</h3><p>Balapan is a parenting support tool, not therapy, and it doesn\'t diagnose anything. If something feels bigger than everyday hard, we\'ll point you to a specialist — and in a crisis in the US, call or text <b>988</b>.</p><a href="#/safety">Read our safety page</a></div>'+
      '</div>'+
      '<div class="final-cta"><h2>Ready to meet your child\'s hero?</h2><a class="btn big clay" href="#/'+(started?'plan':'quiz')+'">'+(started?'Back to our plan':'Start the 2-minute quiz')+'</a><p class="fine">3 brave plans free · then $12.99/month or $79.99/year</p></div>'+
    '</section>';
  },
  miniStory:function(){
    return '<div class="mini-book"><div class="mb-page l"><span></span><span></span><span class="s"></span></div><div class="mb-page r">'+BF.avatar.svg(BF.store.s.avatar,{size:56,headOnly:true})+'</div></div>';
  }
};
