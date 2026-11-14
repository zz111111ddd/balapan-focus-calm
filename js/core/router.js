/* Tiny hash router: #/route/param  — works from file:// too. */
var BF = window.BF = window.BF || {};
(function(){
  var routes = {}, current = null, cleanup = null;
  BF.screens = BF.screens || {};
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
    if(window.speechSynthesis) try{ speechSynthesis.cancel(); }catch(e){}
    var old = app.firstElementChild;
    function swap(){
      app.innerHTML = "";
      var el = document.createElement("section");
      el.className = "screen screen-"+r.name;
      app.appendChild(el);
      cleanup = scr.render(el, r.param, r.query) || null;
      document.querySelectorAll("[data-nav]").forEach(function(a){ a.classList.toggle("on", a.getAttribute("data-nav")===r.name || (r.name==="game"&&a.getAttribute("data-nav")==="games") || ((r.name==="brave"||r.name==="quest")&&a.getAttribute("data-nav")==="library")); });
      window.scrollTo(0,0);
      if(scr.title) document.title = scr.title + " · Balapan Focus & Calm";
      app.focus({preventScroll:true});
    }
    if(old && current){ old.classList.add("leaving"); setTimeout(swap, document.documentElement.classList.contains("calm")?0:180); }
    else swap();
    current = r;
  }
  BF.router = {
    go:function(path){ if(location.hash === "#"+path) render(); else location.hash = path; },
    start:function(){ window.addEventListener("hashchange", render); render(); },
    refresh:render
  };
})();
