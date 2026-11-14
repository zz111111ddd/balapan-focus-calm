/* Small hand-drawn style line icons (stroke = currentColor). */
var BF = window.BF = window.BF || {};
(function(){
  var P = {
    leaf:'<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-10"/>',
    soundOn:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9c1.2 1.6 1.2 4.4 0 6"/><path d="M18 6.5c2.5 3 2.5 8 0 11"/>',
    soundOff:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
    star:'<path d="M12 3.6l2.5 5.2 5.6.8-4.1 3.9 1 5.6L12 16.4l-5 2.7 1-5.6-4.1-3.9 5.6-.8z"/>',
    back:'<path d="M15 5l-7 7 7 7"/>',
    next:'<path d="M9 5l7 7-7 7"/>',
    speaker:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9c1.2 1.6 1.2 4.4 0 6"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
    clock:'<circle cx="12" cy="12.5" r="8"/><path d="M12 8.5v4.5l3 2"/>',
    search:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    ladder:'<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',
    heart:'<path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z"/>',
    print:'<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/>',
    shield:'<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/>',
    play:'<path d="M8 5.5v13l10-6.5z"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    refresh:'<path d="M19 12a7 7 0 1 1-2-4.9"/><path d="M19 4v4h-4"/>',
    hand:'<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V5a1.5 1.5 0 0 1 3 0v6"/><path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 6.5-6 6.5-2.5 0-4-1.2-5.5-3.5L4 14.5a1.5 1.5 0 0 1 2.5-1.7L8 14.5"/>',
    book:'<path d="M4 5.5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6.5v13"/>',
    pencil:'<path d="M5 19l1-4 10-10 3 3-10 10z"/><path d="M14 7l3 3"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    moon:'<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    school:'<path d="M4 20V10l8-5 8 5v10"/><path d="M9 20v-5h6v5"/><path d="M12 5V2.5h3"/>',
    home:'<path d="M4 11l8-6.5 8 6.5"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
    health:'<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>',
    out:'<path d="M12 21v-5"/><path d="M12 3c-4 3-6 6-6 9a6 6 0 0 0 12 0c0-3-2-6-6-9z"/>',
    social:'<circle cx="8.5" cy="9" r="3"/><circle cx="16" cy="10" r="2.5"/><path d="M3.5 19c.5-3 2.5-5 5-5s4.5 2 5 5M14 19c.3-2.2 1.5-4 3.5-4 1.7 0 3 1.4 3.5 3.5"/>',
    travel:'<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M9 8V5.5h6V8M9 19v1.5M15 19v1.5"/>',
    lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M7 15l4-5 3 3 5-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    trash:'<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>',
    download:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>',
    upload:'<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 19h14"/>',
    user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    puzzle:'<path d="M10 4h4v3a2 2 0 1 0 3 0V4h3v6h-3a2 2 0 1 0 0 3h3v7h-6v-3a2 2 0 1 0-3 0v3H4v-7h3a2 2 0 1 0 0-3H4V4z"/>',
    globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.2 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.2-3.6-8.5S9.5 5.9 12 3.5z"/>',
    list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    bed:'<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    food:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M16 3c-2 1-3 4-3 7h3v11"/>',
    pill:'<rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M10 8.3l4 5.4"/>',
    run:'<circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M6 11l3-3 4 1 3 4h3M11 15l1-5"/>',
    screen:'<rect x="3.5" y="5" width="17" height="11" rx="2"/><path d="M9 20h6M12 16v4"/>',
    tree:'<path d="M12 3l6 9h-4l4 6H6l4-6H6z"/><path d="M12 18v3"/>',
    smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1 1.5 2.2 2 3.5 2s2.5-.5 3.5-2"/><circle cx="9" cy="10" r=".8"/><circle cx="15" cy="10" r=".8"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    sparkle:'<path d="M12 4c.7 4 2 5.3 6 6-4 .7-5.3 2-6 6-.7-4-2-5.3-6-6 4-.7 5.3-2 6-6z"/>'
  };
  BF.icon = function(name, size, cls){
    size = size || 22;
    return '<svg class="ico '+(cls||'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[name]||'')+'</svg>';
  };
  /* Paper-cut star used for rewards */
  BF.starSVG = function(size, filled){
    size = size || 28;
    return '<svg class="pstar '+(filled?'on':'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3.5l4.6 10 10.9 1.3-8.1 7.4 2.2 10.8L20 27.6l-9.6 5.4 2.2-10.8-8.1-7.4 10.9-1.3z" fill="'+(filled?'#E4CC8F':'none')+'" stroke="'+(filled?'#B8964B':'#CDBFA8')+'" stroke-width="2" stroke-linejoin="round"/>'+(filled?'<path d="M14 15l3 1" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>':'')+'</svg>';
  };
})();
