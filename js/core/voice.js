/* ==========================================================
   Read-aloud voice.
   1) Optional neural TTS (OpenAI-compatible /audio/speech).
      The key is typed by the parent in Settings and stays in
      this browser's localStorage only — never in the repo.
      For production, point ttsEndpoint at your own proxy.
   2) Fallback: the most natural browser voice available,
      chosen automatically (Natural / Neural / Premium /
      Enhanced voices first), slower calm rate, sentence
      chunking so long pages don't get cut off.
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var PREFER = {
    en:[/Aria.*Natural/i,/Jenny.*Natural/i,/Ava.*Natural/i,/Emma.*Natural/i,/Natural/i,/Neural/i,/Google US English/i,/Samantha/i,/Ava/i,/Allison/i,/Serena/i,/Premium|Enhanced/i,/Google UK English Female/i,/Karen|Moira|Tessa/i],
    ru:[/Svetlana.*Natural/i,/Dariya.*Natural/i,/Natural/i,/Neural/i,/Google.*(русский|Russian)/i,/Milena/i,/Katya/i,/Premium|Enhanced/i,/Irina/i,/Yuri|Pavel/i]
  };
  var current = null, audio = null, queue = [], btnRef = null, token = 0;
  function S(){ return BF.store.f.settings; }
  function voices(lang){
    if(!("speechSynthesis" in window)) return [];
    var re = lang==="ru" ? /^ru/i : /^en/i;
    return speechSynthesis.getVoices().filter(function(v){ return re.test(v.lang); });
  }
  function best(lang){
    var list = voices(lang); if(!list.length) return null;
    var saved = lang==="ru" ? S().voiceRu : S().voiceEn;
    if(saved){ var m = list.find(function(v){ return v.name===saved; }); if(m) return m; }
    var P = PREFER[lang]||PREFER.en;
    for(var i=0;i<P.length;i++){ var hit = list.find(function(v){ return P[i].test(v.name); }); if(hit) return hit; }
    return list.find(function(v){ return /US|GB/i.test(v.lang); }) || list[0];
  }
  function chunks(text){
    var parts = String(text).replace(/\s+/g," ").match(/[^.!?…»]+[.!?…»]*\s*/g) || [text], out = [], buf = "";
    parts.forEach(function(p){ if((buf+p).length > 180 && buf){ out.push(buf.trim()); buf = p; } else buf += p; });
    if(buf.trim()) out.push(buf.trim());
    return out;
  }
  function setBtn(on){ if(btnRef) btnRef.classList.toggle("on", on); if(!on) btnRef = null; }
  function stop(){
    token++; queue = [];
    if(audio){ try{ audio.pause(); }catch(e){} audio = null; }
    if("speechSynthesis" in window) try{ speechSynthesis.cancel(); }catch(e){}
    setBtn(false); current = null;
  }
  function browserSpeak(text, lang, my){
    if(!("speechSynthesis" in window)){ BF.ui.toast(BF.L("Read-aloud isn't supported in this browser.","Этот браузер не умеет читать вслух.")); setBtn(false); return; }
    queue = chunks(text);
    var v = best(lang);
    (function next(){
      if(my!==token) return;
      var t = queue.shift(); if(!t){ setBtn(false); current=null; return; }
      var u = new SpeechSynthesisUtterance(t);
      u.lang = v ? v.lang : (lang==="ru"?"ru-RU":"en-US"); if(v) u.voice = v;
      u.rate = +S().rate || 0.86; u.pitch = +S().pitch || 1;
      u.onend = function(){ setTimeout(next, 260); };   // small calm pause between sentences
      u.onerror = function(){ setBtn(false); };
      speechSynthesis.speak(u);
    })();
  }
  function neuralSpeak(text, lang, my){
    var s = S();
    return fetch(s.ttsEndpoint, { method:"POST", headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+s.ttsKey },
      body: JSON.stringify({ model:s.ttsModel||"gpt-4o-mini-tts", voice:s.ttsVoice||"shimmer", input:text, speed: Math.max(0.7, Math.min(1.1, +s.rate||0.9)),
        instructions: lang==="ru" ? "Говори тепло, медленно и спокойно, как мама читает ребёнку сказку на ночь." : "Speak warmly, slowly and calmly, like a parent reading a bedtime story to a young child." }) })
      .then(function(r){ if(!r.ok) throw new Error("tts "+r.status); return r.blob(); })
      .then(function(b){ if(my!==token) return; audio = new Audio(URL.createObjectURL(b)); audio.onended = function(){ setBtn(false); }; return audio.play(); });
  }
  function speak(text, btn, lang){
    lang = lang || BF.lang();
    if(btn && btn.classList.contains("on")){ stop(); return; }
    stop(); btnRef = btn || null; setBtn(true); current = text; var my = ++token;
    var s = S();
    if(s.ttsOn && s.ttsKey && s.ttsEndpoint){
      neuralSpeak(text, lang, my).catch(function(){ if(my!==token) return; BF.ui.toast(BF.L("Neural voice unavailable — using the browser voice.","Нейроголос недоступен — читаем голосом браузера.")); browserSpeak(text, lang, my); });
    } else browserSpeak(text, lang, my);
  }
  if("speechSynthesis" in window) speechSynthesis.onvoiceschanged = function(){ document.dispatchEvent(new Event("bf-voices")); };
  BF.voice = { speak:speak, stop:stop, voices:voices, best:best, chunks:chunks };
})();
