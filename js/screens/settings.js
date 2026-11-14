var BF = window.BF = window.BF || {};
BF.screens.settings = {
  title:{en:"Settings",ru:"Настройки"},
  render:function(el){
    var st = BF.store, s = st.f.settings, I = BF.icon, esc = BF.ui.esc;
    var hasDemo = st.children().some(function(c){ return c.isDemo; });
    function voiceOpts(lang){
      var list = BF.voice.voices(lang), best = BF.voice.best(lang), saved = lang==="ru" ? s.voiceRu : s.voiceEn;
      if(!list.length) return '<option value="">'+BF.L("No "+(lang==="ru"?"Russian":"English")+" voices in this browser","В браузере нет "+(lang==="ru"?"русских":"английских")+" голосов")+'</option>';
      return '<option value="">'+BF.L("Automatic — most natural","Автоматически — самый естественный")+(best?' ('+esc(best.name)+')':'')+'</option>'+list.map(function(v){ var nat = /Natural|Neural|Premium|Enhanced|Online/i.test(v.name); return '<option value="'+esc(v.name)+'" '+(saved===v.name?'selected':'')+'>'+(nat?'★ ':'')+esc(v.name)+' · '+v.lang+'</option>'; }).join("");
    }
    el.innerHTML = '<div class="settings wrap"><p class="eyebrow">'+BF.L("Settings","Настройки")+'</p><h1>'+BF.L("Make it comfortable","Сделайте удобно")+'</h1>'+
      '<section class="set paper"><h2>'+I('globe',20)+' '+BF.L("Language & look","Язык и оформление")+'</h2>'+
        '<div class="set-row"><span>'+BF.L("Language","Язык")+'</span><div class="seg"><button data-lang="en" aria-pressed="'+(BF.lang()==="en")+'">English</button><button data-lang="ru" aria-pressed="'+(BF.lang()==="ru")+'">Русский</button></div></div>'+
        '<div class="set-row"><span>'+BF.L("Theme","Тема")+'</span><div class="seg"><button data-theme="light" aria-pressed="'+(s.theme!=="dark")+'">'+BF.L("Light (oat)","Светлая")+'</button><button data-theme="dark" aria-pressed="'+(s.theme==="dark")+'">'+BF.L("Dark (midnight)","Тёмная (ночная)")+'</button></div></div>'+
        '<div class="set-row"><span>'+BF.L("Calm mode — less motion, no sound","Спокойный режим — меньше движения, без звука")+'</span><label class="switch"><input type="checkbox" id="setCalm" '+(s.calm?'checked':'')+'><i></i></label></div>'+
        '<div class="set-row"><span>'+BF.L("Soft sounds","Мягкие звуки")+'</span><label class="switch"><input type="checkbox" id="setSound" '+(s.sound?'checked':'')+'><i></i></label></div>'+
      '</section>'+
      '<section class="set paper"><h2>'+I('speaker',20)+' '+BF.L("Read-aloud voice","Голос для чтения вслух")+'</h2><p class="muted small">'+BF.L("We automatically choose the most natural voice your device has (★ = natural/neural). On Windows, Edge has the best free voices; on Mac/iPhone, download “Enhanced” voices in system settings.","Мы автоматически выбираем самый естественный голос на устройстве (★ — естественный/нейронный). В Windows лучшие бесплатные голоса — в Edge; на Mac/iPhone скачайте «улучшенные» голоса в настройках системы.")+'</p>'+
        '<div class="set-row"><span>English</span><select class="input" id="vEn">'+voiceOpts("en")+'</select><button class="btn small ghost" data-test="en">'+I('play',14)+'</button></div>'+
        '<div class="set-row"><span>Русский</span><select class="input" id="vRu">'+voiceOpts("ru")+'</select><button class="btn small ghost" data-test="ru">'+I('play',14)+'</button></div>'+
        '<div class="set-row"><span>'+BF.L("Speed","Скорость")+' <output id="rateO">'+s.rate+'</output></span><input type="range" id="vRate" min="0.6" max="1.1" step="0.02" value="'+s.rate+'"></div>'+
        '<div class="set-row"><span>'+BF.L("Pitch","Высота")+' <output id="pitchO">'+s.pitch+'</output></span><input type="range" id="vPitch" min="0.7" max="1.3" step="0.05" value="'+s.pitch+'"></div>'+
        '<details class="tts"><summary><b>'+BF.L("Neural voice (optional, advanced)","Нейроголос (необязательно, для продвинутых)")+'</b></summary><p class="muted small">'+BF.L("Uses an OpenAI-compatible text-to-speech API for a very natural voice. Your key is stored only in this browser and sent only to the endpoint you enter. For a public site, use your own server proxy instead of a key. If it fails, we fall back to the browser voice.","Использует совместимый с OpenAI API синтеза речи для очень естественного голоса. Ключ хранится только в этом браузере и отправляется только на указанный адрес. Для публичного сайта используйте свой серверный прокси вместо ключа. При ошибке используется голос браузера.")+'</p>'+
          '<div class="set-row"><span>'+BF.L("Use neural voice","Использовать нейроголос")+'</span><label class="switch"><input type="checkbox" id="ttsOn" '+(s.ttsOn?'checked':'')+'><i></i></label></div>'+
          '<label class="field">'+BF.L("Endpoint","Адрес API")+'<input class="input" id="ttsEp" value="'+esc(s.ttsEndpoint)+'"></label>'+
          '<label class="field">'+BF.L("API key (stays in this browser)","Ключ API (остаётся в этом браузере)")+'<input class="input" id="ttsKey" type="password" autocomplete="off" value="'+esc(s.ttsKey)+'" placeholder="sk-…"></label>'+
          '<div class="set-row"><label class="field">'+BF.L("Model","Модель")+'<input class="input" id="ttsModel" value="'+esc(s.ttsModel)+'"></label><label class="field">'+BF.L("Voice","Голос")+'<select class="input" id="ttsVoice">'+["shimmer","nova","coral","sage","alloy","fable"].map(function(v){ return '<option '+(s.ttsVoice===v?'selected':'')+'>'+v+'</option>'; }).join("")+'</select></label></div>'+
        '</details>'+
      '</section>'+
      '<section class="set paper"><h2>'+I('user',20)+' '+BF.L("Children & data","Дети и данные")+'</h2>'+
        '<div class="set-row"><span>'+BF.L("Children on this device","Дети на этом устройстве")+': '+st.children().length+'</span><a class="btn small ghost" href="#/family">'+BF.L("Manage","Управлять")+'</a></div>'+
        '<div class="set-row"><span>'+BF.L("Demo child “Mira” with 2 weeks of sample data","Демо-ребёнок «Мира» с примерами за 2 недели")+'</span>'+(hasDemo?'<button class="btn small ghost" id="clrDemo">'+I('trash',14)+' '+BF.L("Clear demo data","Удалить демо-данные")+'</button>':'<button class="btn small ghost" id="addDemo">'+I('plus',14)+' '+BF.L("Restore demo","Вернуть демо")+'</button>')+'</div>'+
        '<p class="fine">'+BF.L("Everything is saved only in this browser's localStorage. No account, no server.","Всё хранится только в localStorage этого браузера. Без аккаунта и сервера.")+'</p>'+
      '</section></div>';
    function upd(fn, shell){ st.updateFamily(function(f){ fn(f.settings); }); if(shell) BF.renderShell(); }
    el.querySelectorAll("[data-lang]").forEach(function(b){ b.onclick = function(){ BF.setLang(b.getAttribute("data-lang")); BF.renderShell(); BF.router.refresh(); }; });
    el.querySelectorAll("[data-theme]").forEach(function(b){ b.onclick = function(){ upd(function(x){ x.theme = b.getAttribute("data-theme"); }, true); BF.router.refresh(); }; });
    el.querySelector("#setCalm").onchange = function(e){ upd(function(x){ x.calm = e.target.checked; }, true); };
    el.querySelector("#setSound").onchange = function(e){ upd(function(x){ x.sound = e.target.checked; }, true); };
    el.querySelector("#vEn").onchange = function(e){ upd(function(x){ x.voiceEn = e.target.value; }); };
    el.querySelector("#vRu").onchange = function(e){ upd(function(x){ x.voiceRu = e.target.value; }); };
    el.querySelector("#vRate").oninput = function(e){ el.querySelector("#rateO").textContent = e.target.value; upd(function(x){ x.rate = +e.target.value; }); };
    el.querySelector("#vPitch").oninput = function(e){ el.querySelector("#pitchO").textContent = e.target.value; upd(function(x){ x.pitch = +e.target.value; }); };
    el.querySelectorAll("[data-test]").forEach(function(b){ b.onclick = function(){ var l = b.getAttribute("data-test"); BF.voice.speak(l==="ru" ? "Привет! Это смелая история. Сделаем один маленький шаг вместе." : "Hello! This is a brave story. Let's take one small step together.", b, l); }; });
    el.querySelector("#ttsOn").onchange = function(e){ upd(function(x){ x.ttsOn = e.target.checked; }); };
    [["ttsEp","ttsEndpoint"],["ttsKey","ttsKey"],["ttsModel","ttsModel"],["ttsVoice","ttsVoice"]].forEach(function(p){ el.querySelector("#"+p[0]).onchange = function(e){ upd(function(x){ x[p[1]] = e.target.value.trim(); }); }; });
    var cd = el.querySelector("#clrDemo"); if(cd) cd.onclick = function(){ BF.clearDemo(); BF.renderShell(); BF.router.refresh(); BF.ui.toast(BF.L("Demo data removed.","Демо-данные удалены.")); };
    var ad = el.querySelector("#addDemo"); if(ad) ad.onclick = function(){ st.updateFamily(function(f){ f.demoCleared=false; }); BF.seedDemo(); BF.renderShell(); BF.router.refresh(); };
    function onVoices(){ var a = el.querySelector("#vEn"), b = el.querySelector("#vRu"); if(a){ a.innerHTML = voiceOpts("en"); b.innerHTML = voiceOpts("ru"); } }
    document.addEventListener("bf-voices", onVoices);
    return function(){ document.removeEventListener("bf-voices", onVoices); };
  }
};
