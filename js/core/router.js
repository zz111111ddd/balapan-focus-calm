/* Tiny hash router: #/route/param?x=y — works from file:// too. */
var BF = window.BF = window.BF || {};
(function(){
  var current = null, cleanup = null;
  BF.screens = BF.screens || {};
  var NAV = { home:"home", plan:"home", quiz:"home", hero:"home", library:"library", brave:"library", quest:"library", games:"games", game:"games", diary:"diary", specialist:"specialist", family:"home", settings:"settings", pricing:"pricing" };
  function parse(){
    var h = location.hash.replace(/^#\/?/,"");
    var parts = h.split("?")[0].split("/").filter(Boolean);
    var q = {}; (h.split("?")[1]||"").split("&").forEach(function(kv){ if(!kv) return; var p=kv.split("="); q[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||""); });
    return { name: parts[0]||"home", param: parts[1]||null, query:q };
  }
  function render(){
    var r = parse(), app = document.getElementById("app");
    var scr = BF.screens[r.name] || BF.screens.home;
    if(typeof cleanup === "function"){ try{ cleanup(); }catch(e){} cleanup = null; }
    if(BF.voice) BF.voice.stop(); document.querySelectorAll(".sheet").forEach(function(x){ x.remove(); });
    var old = app.firstElementChild;
    function swap(){
      app.innerHTML = "";
      var el = document.createElement("section");
      el.className = "screen screen-"+r.name;
      app.appendChild(el);
      document.body.setAttribute("data-route", r.name);
      cleanup = scr.render(el, r.param, r.query) || null;
      var nav = NAV[r.name] || r.name;
      document.querySelectorAll("[data-nav]").forEach(function(a){ a.classList.toggle("on", a.getAttribute("data-nav")===nav); });
      window.scrollTo(0,0);
      var t = typeof scr.title==="function" ? scr.title(r.param) : scr.title; t = !t ? "" : (typeof t==="string" ? t : BF.L(t));
      document.title = (t ? t+" · " : "") + "Balapan Focus & Calm";
      app.focus({preventScroll:true});
    }
    if(old && current){ old.classList.add("leaving"); setTimeout(swap, document.documentElement.classList.contains("calm")?0:160); }
    else swap();
    current = r;
  }
  BF.router = {
    go:function(path){ if(location.hash === "#"+path) render(); else location.hash = path; },
    start:function(){ window.addEventListener("hashchange", render); render(); },
    refresh:render,
    current:function(){ return current; }
  };
})();
