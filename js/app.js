/* Boot */
var BF = window.BF = window.BF || {};
(function(){
  var html = document.documentElement, s = BF.store.s;
  function applySettings(){
    html.classList.toggle("calm", !!s.settings.calm);
    var c = document.getElementById("calmToggle"), so = document.getElementById("soundToggle");
    c.setAttribute("aria-pressed", !!s.settings.calm);
    so.setAttribute("aria-pressed", !!s.settings.sound && !s.settings.calm);
    so.querySelector(".tgl-ico").innerHTML = BF.icon(s.settings.sound && !s.settings.calm ? "soundOn" : "soundOff", 18);
    c.querySelector(".tgl-ico").innerHTML = BF.icon("leaf", 18);
  }
  document.getElementById("brandMark").innerHTML = BF.avatar.chick(34);
  document.getElementById("calmToggle").onclick = function(){ BF.store.update(function(x){ x.settings.calm = !x.settings.calm; }); applySettings(); BF.ui.toast(s.settings.calm ? "Calm mode on: less motion, no sounds." : "Calm mode off."); };
  document.getElementById("soundToggle").onclick = function(){
    if(s.settings.calm){ BF.ui.toast("Sound stays off in Calm mode."); return; }
    BF.store.update(function(x){ x.settings.sound = !x.settings.sound; }); BF.sound.unlock(); applySettings(); BF.sound.chime();
  };
  document.getElementById("resetAll").onclick = function(){ if(confirm("Remove the hero, plans and progress from this browser?")){ BF.store.reset(); s = BF.store.s; applySettings(); BF.router.go("/"); location.reload(); } };
  if("scrollRestoration" in history) history.scrollRestoration = "manual";
  applySettings();
  BF.router.start();
})();
