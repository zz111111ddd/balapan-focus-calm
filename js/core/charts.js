/* Tiny SVG charts (no libraries). All return SVG strings.
   Colors are muted; text/grid use currentColor so they adapt
   to light/dark themes and print. */
var BF = window.BF = window.BF || {};
(function(){
  var COL = { sage:"#8FA487", clay:"#C98E70", dusty:"#93A9BA", sand:"#D9BC78", rose:"#D9B5A7", ink:"currentColor" };
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function frame(w,h,inner,label){ return '<svg class="chart" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label||"")+'" preserveAspectRatio="xMidYMid meet">'+inner+'</svg>'; }
  function axisX(labels, x0, x1, y, step){
    var n = labels.length, o = ""; step = step || Math.max(1, Math.ceil(n/8));
    labels.forEach(function(l,i){ if(i%step) return; var x = n>1 ? x0+(x1-x0)*i/(n-1) : (x0+x1)/2; o += '<text x="'+x+'" y="'+(y+14)+'" text-anchor="middle" class="ch-lbl">'+esc(l)+'</text>'; });
    return o;
  }
  function gridY(min, max, ticks, x0, x1, y0, y1, fmt){
    var o = ""; for(var i=0;i<=ticks;i++){ var v = min+(max-min)*i/ticks, y = y1-(y1-y0)*i/ticks; o += '<line x1="'+x0+'" x2="'+x1+'" y1="'+y+'" y2="'+y+'" class="ch-grid"/><text x="'+(x0-6)+'" y="'+(y+4)+'" text-anchor="end" class="ch-lbl">'+(fmt?fmt(v):Math.round(v*10)/10)+'</text>'; }
    return o;
  }
  /* bars (left axis) + line (right axis) */
  function barsLine(o){
    var W=o.w||640, H=o.h||220, x0=40, x1=W-40, y0=16, y1=H-28, n=o.labels.length;
    var bw = Math.max(4, (x1-x0)/n*0.55), s = "";
    s += gridY(o.bMin||0, o.bMax, 4, x0, x1, y0, y1);
    o.bars.forEach(function(v,i){ if(v==null) return; var x = x0+(x1-x0)*(n>1?i/(n-1):0.5), h=(y1-y0)*((v-(o.bMin||0))/(o.bMax-(o.bMin||0))); s += '<rect x="'+(x-bw/2)+'" y="'+(y1-h)+'" width="'+bw+'" height="'+Math.max(0,h)+'" rx="3" fill="'+(o.bColor||COL.dusty)+'" opacity=".75"><title>'+esc(o.labels[i]+": "+v)+'</title></rect>'; });
    var pts = []; o.line.forEach(function(v,i){ if(v==null) return; var x = x0+(x1-x0)*(n>1?i/(n-1):0.5), y = y1-(y1-y0)*((v-o.lMin)/(o.lMax-o.lMin)); pts.push([x,y,v,i]); });
    if(pts.length) s += '<polyline points="'+pts.map(function(p){ return p[0]+","+p[1]; }).join(" ")+'" fill="none" stroke="'+(o.lColor||COL.clay)+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'+pts.map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="'+(o.lColor||COL.clay)+'"><title>'+esc(o.labels[p[3]]+": "+p[2])+'</title></circle>'; }).join("");
    for(var i=0;i<=4;i++){ var v = o.lMin+(o.lMax-o.lMin)*i/4, y = y1-(y1-y0)*i/4; s += '<text x="'+(x1+6)+'" y="'+(y+4)+'" class="ch-lbl">'+(Math.round(v*10)/10)+'</text>'; }
    if(o.markers) o.markers.forEach(function(m){ var x = x0+(x1-x0)*(n>1?m.i/(n-1):0.5); s += '<path d="M'+(x-5)+' '+(y0+2)+' l5 8 l5 -8z" fill="'+(m.color||COL.clay)+'"><title>'+esc(m.t)+'</title></path>'; });
    s += axisX(o.labels, x0, x1, y1);
    return frame(W,H,s,o.label);
  }
  function scatter(o){
    var W=o.w||320, H=o.h||220, x0=40, x1=W-14, y0=14, y1=H-30, s = gridY(o.yMin, o.yMax, 4, x0, x1, y0, y1);
    for(var i=0;i<=4;i++){ var v = o.xMin+(o.xMax-o.xMin)*i/4, x = x0+(x1-x0)*i/4; s += '<text x="'+x+'" y="'+(y1+14)+'" text-anchor="middle" class="ch-lbl">'+(Math.round(v*10)/10)+'</text>'; }
    var pts = o.points.filter(function(p){ return p.x!=null && p.y!=null; });
    pts.forEach(function(p){ var x = x0+(x1-x0)*((p.x-o.xMin)/(o.xMax-o.xMin)), y = y1-(y1-y0)*((p.y-o.yMin)/(o.yMax-o.yMin)); s += '<circle cx="'+x+'" cy="'+y+'" r="'+(p.big?6:4.5)+'" fill="'+(p.color||COL.sage)+'" opacity=".8"><title>'+esc(p.t||"")+'</title></circle>'; });
    if(pts.length>2){ // least-squares trend line
      var n=pts.length, sx=0, sy=0, sxy=0, sxx=0; pts.forEach(function(p){ sx+=p.x; sy+=p.y; sxy+=p.x*p.y; sxx+=p.x*p.x; });
      var d = n*sxx-sx*sx; if(d){ var k=(n*sxy-sx*sy)/d, b=(sy-k*sx)/n; var ya=k*o.xMin+b, yb=k*o.xMax+b;
        function Y(v){ return y1-(y1-y0)*((Math.max(o.yMin,Math.min(o.yMax,v))-o.yMin)/(o.yMax-o.yMin)); }
        s += '<line x1="'+x0+'" y1="'+Y(ya)+'" x2="'+x1+'" y2="'+Y(yb)+'" stroke="'+COL.clay+'" stroke-width="2" stroke-dasharray="5 5"/>'; }
    }
    s += '<text x="'+((x0+x1)/2)+'" y="'+(H-2)+'" text-anchor="middle" class="ch-lbl ch-title">'+esc(o.xLabel||"")+'</text><text x="10" y="'+((y0+y1)/2)+'" transform="rotate(-90 10 '+((y0+y1)/2)+')" text-anchor="middle" class="ch-lbl ch-title">'+esc(o.yLabel||"")+'</text>';
    return frame(W,H,s,o.label);
  }
  function stacked(o){ /* o.labels, o.series:[{name,color,values}] */
    var W=o.w||640, H=o.h||200, x0=34, x1=W-10, y0=12, y1=H-28, n=o.labels.length, max = 1;
    for(var i=0;i<n;i++){ var t=0; o.series.forEach(function(se){ t+=se.values[i]||0; }); max=Math.max(max,t); }
    var s = gridY(0, max, Math.min(4,max), x0, x1, y0, y1, function(v){ return Math.round(v); }), bw = Math.max(5,(x1-x0)/n*0.6);
    for(i=0;i<n;i++){ var acc=0, x = x0+(x1-x0)*(n>1?i/(n-1):0.5); o.series.forEach(function(se){ var v=se.values[i]||0; if(!v) return; var h=(y1-y0)*v/max; s += '<rect x="'+(x-bw/2)+'" y="'+(y1-acc-h)+'" width="'+bw+'" height="'+h+'" fill="'+se.color+'" rx="2"><title>'+esc(o.labels[i]+" · "+se.name+": "+v)+'</title></rect>'; acc+=h; }); }
    s += axisX(o.labels, x0, x1, y1);
    return frame(W,H,s,o.label);
  }
  function legend(items){ return '<div class="ch-legend">'+items.map(function(it){ return '<span><i style="background:'+it.color+'"></i>'+esc(it.t)+'</span>'; }).join("")+'</div>'; }
  function pearson(xs, ys){
    var p = []; xs.forEach(function(x,i){ if(x!=null && ys[i]!=null) p.push([x,ys[i]]); }); if(p.length<3) return null;
    var n=p.length, mx=0, my=0; p.forEach(function(q){ mx+=q[0]; my+=q[1]; }); mx/=n; my/=n;
    var a=0,b=0,c=0; p.forEach(function(q){ a+=(q[0]-mx)*(q[1]-my); b+=(q[0]-mx)*(q[0]-mx); c+=(q[1]-my)*(q[1]-my); });
    return b&&c ? a/Math.sqrt(b*c) : null;
  }
  BF.charts = { COL:COL, barsLine:barsLine, scatter:scatter, stacked:stacked, legend:legend, pearson:pearson };
})();
