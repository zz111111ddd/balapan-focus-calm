/* ==========================================================
   i18n — every UI string is written in place in both
   languages: L("English", "Русский"). The current language
   is stored in localStorage ("balapan.lang"), default EN.
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var lang = "en";
  try { lang = localStorage.getItem("balapan.lang") || (/^ru/i.test(navigator.language||"") ? "ru" : "en"); } catch(e){}
  if(lang!=="en" && lang!=="ru") lang = "en";
  BF.lang = function(){ return lang; };
  BF.setLang = function(l){ lang = (l==="ru"?"ru":"en"); try{ localStorage.setItem("balapan.lang", lang); }catch(e){} document.documentElement.lang = lang; };
  /* L("en","ru") or L({en:..,ru:..}) */
  window.L = BF.L = function(en, ru){
    if(en && typeof en==="object" && !Array.isArray(en)) return lang==="ru" ? (en.ru!=null?en.ru:en.en) : en.en;
    return lang==="ru" ? (ru!=null ? ru : en) : en;
  };
  /* fill {vars} */
  BF.fmt = function(s, v){ return String(s).replace(/\{(\w+)\}/g, function(m,k){ return v && v[k]!=null ? v[k] : m; }); };
  /* Russian plural: plural(n, "звезда","звезды","звёзд") */
  BF.plural = function(n, one, few, many){
    if(lang!=="ru") return n===1 ? one : few;
    var a = Math.abs(n)%100, b = a%10;
    if(a>10 && a<20) return many; if(b>1 && b<5) return few; if(b===1) return one; return many;
  };
  BF.dateFmt = function(iso, withTime){
    if(!iso) return "";
    var d = new Date(iso.length<=10 ? iso+"T12:00:00" : iso);
    var o = { day:"numeric", month:"short" }; if(withTime){ o.hour="2-digit"; o.minute="2-digit"; }
    try { return d.toLocaleString(lang==="ru"?"ru-RU":"en-US", o); } catch(e){ return iso; }
  };
  BF.weekday = function(d){ return d.toLocaleDateString(lang==="ru"?"ru-RU":"en-US", {weekday:"short"}); };
  document.documentElement.lang = lang;
})();
