/* Soft Web Audio cues. Muted by default; silenced in Calm mode. */
var BF = window.BF = window.BF || {};
(function(){
  var ctx = null;
  function ac(){ if(!ctx){ var C = window.AudioContext||window.webkitAudioContext; if(!C) return null; ctx = new C(); } return ctx; }
  function tone(freq, dur, when, vol, type){
    var c = ac(); if(!c) return;
    var t = c.currentTime + (when||0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type||"sine"; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol||0.08, t+0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.05);
  }
  function on(){ var s=BF.store.s.settings; return s.sound && !s.calm; }
  BF.sound = {
    pop:function(){ if(on()) tone(520,0.18,0,0.06); },
    soft:function(){ if(on()) tone(330,0.25,0,0.05,"triangle"); },
    star:function(){ if(on()){ tone(523,0.35,0,0.06); tone(659,0.35,0.12,0.06); tone(784,0.5,0.24,0.06); } },
    done:function(){ if(on()){ tone(392,0.4,0,0.05); tone(523,0.6,0.15,0.05); } },
    chime:function(){ if(on()) tone(880,0.8,0,0.035); },
    unlock:function(){ var c=ac(); if(c && c.state==="suspended") c.resume(); }
  };
})();
