/* ==========================================================
   Layered SVG avatar — the child's own hero.
   BF.avatar.svg(cfg, {size, pose:'idle'|'wave'|'walk', headOnly})
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var SKIN = ["#F7E0CC","#EFCDAF","#E3B892","#D4A27E","#C28C65","#A9724E","#8E5B3D","#76472F","#5D3624","#46291B"];
  var HAIRC = [ {n:"Black",c:"#2E2623"},{n:"Dark brown",c:"#4B3428"},{n:"Brown",c:"#6F4B35"},{n:"Auburn",c:"#8A4F37"},{n:"Copper",c:"#AE6A43"},{n:"Golden",c:"#C9A465"},{n:"Light blond",c:"#DCC694"},{n:"Silver",c:"#B2ACA4"} ];
  var EYES = [ {n:"Dark brown",c:"#3B2A22"},{n:"Brown",c:"#6B4630"},{n:"Hazel",c:"#8A7442"},{n:"Green",c:"#5E7D5A"},{n:"Blue",c:"#5C7E98"},{n:"Gray",c:"#7C8790"} ];
  var CLOTH = [ "#93A9BA","#A3B59C","#C98E70","#E4CC8F","#D9B5A7","#7E8C9A","#B9A48A","#6F7E6A","#F1E6D3","#8B6F64" ];
  var BOTTOMC = [ "#5F7889","#6E655D","#B9A48A","#6F8A6E","#A96C51","#47525C" ];
  var SHOEC = [ "#F1E6D3","#C98E70","#5F7889","#6E655D","#A3B59C" ];
  var HAIRS = [ {v:"short",n:"Short"},{v:"curly",n:"Curly"},{v:"long",n:"Long"},{v:"ponytail",n:"Ponytail"},{v:"bun",n:"Bun"},{v:"braids",n:"Braids"},{v:"afro",n:"Puff"},{v:"buzz",n:"Buzz"} ];
  var TOPS = [ {v:"tee",n:"T-shirt"},{v:"hoodie",n:"Hoodie"},{v:"stripes",n:"Striped sweater"},{v:"dress",n:"Dress"} ];
  var BOTTOMS = [ {v:"pants",n:"Pants"},{v:"shorts",n:"Shorts"},{v:"skirt",n:"Skirt"},{v:"leggings",n:"Leggings"} ];
  var SHOES = [ {v:"sneakers",n:"Sneakers"},{v:"boots",n:"Boots"},{v:"sandals",n:"Sandals"} ];
  var BUILDS = [ {v:"slim",n:"Slim"},{v:"medium",n:"Medium"},{v:"chubby",n:"Chubby"} ];
  var EXTRAS = [ {v:"none",n:"Nothing"},{v:"glasses",n:"Glasses"},{v:"headphones",n:"Ear muffs"},{v:"freckles",n:"Freckles"} ];

  function shade(hex, amt){
    var n = parseInt(hex.slice(1),16), r=(n>>16)&255, g=(n>>8)&255, b=n&255;
    function f(x){ return Math.max(0,Math.min(255, Math.round(amt<0 ? x*(1+amt) : x+(255-x)*amt))); }
    return "#"+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);
  }
  var uid = 0;

  function svg(cfg, opts){
    cfg = cfg || BF.store.s.avatar; opts = opts || {};
    var id = "av"+(++uid);
    var skin = SKIN[cfg.skin] || SKIN[3], skinD = shade(skin,-.12);
    var hairC = (HAIRC[cfg.hairColor]||HAIRC[1]).c, hairD = shade(hairC,-.25), hairL = shade(hairC,.18);
    var eyeC = (EYES[cfg.eyes]||EYES[0]).c;
    var topC = CLOTH[cfg.topColor]||CLOTH[0], topD = shade(topC,-.16), topL = shade(topC,.35);
    var botC = BOTTOMC[cfg.bottomColor]||BOTTOMC[0], botD = shade(botC,-.18);
    var shoeC = SHOEC[cfg.shoeColor]||SHOEC[0], shoeD = shade(shoeC,-.25);
    var B = {slim:{hw:25,leg:13,arm:10.5,bulge:0}, medium:{hw:31,leg:15.5,arm:12.5,bulge:2}, chubby:{hw:39,leg:18.5,arm:14.5,bulge:7}}[cfg.build] || {hw:31,leg:15.5,arm:12.5,bulge:2};
    var hw=B.hw, L=100-hw, R=100+hw, lx=100-hw*0.46, rx=100+hw*0.46, lw=B.leg;
    var stroke = 'stroke="'+shade("#3B3632",0)+'" stroke-opacity=".0"';
    var o = [];

    // ground shadow
    o.push('<ellipse class="av-shadow" cx="100" cy="287" rx="'+(hw+22)+'" ry="7" fill="#3B3632" opacity=".09"/>');

    // ---------- BACK HAIR ----------
    var bh = "";
    if(cfg.hair==="long") bh='<path d="M56 82 C50 40 74 26 100 26 C128 26 152 40 145 84 C150 112 150 140 142 158 L58 158 C50 140 50 110 56 82Z" fill="'+hairD+'"/>';
    if(cfg.hair==="afro") bh='<circle cx="100" cy="66" r="56" fill="'+hairC+'"/><circle cx="100" cy="66" r="56" fill="url(#'+id+'tex)" opacity=".5"/>';
    if(cfg.hair==="bun") bh='<circle cx="100" cy="28" r="17" fill="'+hairC+'"/><path d="M88 22 q12 -8 24 0" stroke="'+hairL+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
    if(cfg.hair==="ponytail") bh='<path d="M128 48 C160 50 164 92 150 126 C146 136 138 132 140 122 C148 96 146 70 124 62Z" fill="'+hairD+'"/>';
    if(cfg.hair==="braids") bh='<g fill="'+hairC+'">'+[0,1,2,3,4].map(function(i){ return '<ellipse cx="'+(60-i*0.6)+'" cy="'+(108+i*11)+'" rx="7" ry="7.5"/><ellipse cx="'+(140+i*0.6)+'" cy="'+(108+i*11)+'" rx="7" ry="7.5"/>'; }).join("")+'</g><circle cx="57" cy="165" r="4" fill="'+CLOTH[cfg.topColor||0]+'"/><circle cx="143" cy="165" r="4" fill="'+CLOTH[cfg.topColor||0]+'"/>';
    if(cfg.hair==="curly") bh='<g fill="'+hairD+'">'+[[60,70],[64,94],[140,70],[136,94]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="12"/>';}).join("")+'</g>';

    // ---------- LEGS + BOTTOMS ----------
    var legs = '<g class="av-legs">';
    var isDress = cfg.top==="dress";
    function leg(x, cls){
      var g = '<g class="'+cls+'" style="transform-origin:'+x+'px 202px">';
      var skinLeg = '<rect x="'+(x-lw/2)+'" y="198" width="'+lw+'" height="68" rx="'+(lw/2)+'" fill="'+skin+'"/>';
      if(isDress){ g += skinLeg; if(cfg.bottom==="leggings"||cfg.bottom==="pants") g += '<rect x="'+(x-lw/2)+'" y="198" width="'+lw+'" height="64" rx="'+(lw/2-1)+'" fill="'+botC+'"/>'; }
      else if(cfg.bottom==="pants") g += '<rect x="'+(x-lw/2-1.5)+'" y="196" width="'+(lw+3)+'" height="68" rx="6" fill="'+botC+'"/><path d="M'+(x-lw/2+1)+' 258h'+(lw-2)+'" stroke="'+botD+'" stroke-width="3" stroke-linecap="round"/>';
      else if(cfg.bottom==="leggings") g += '<rect x="'+(x-lw/2)+'" y="196" width="'+lw+'" height="68" rx="'+(lw/2-1)+'" fill="'+botC+'"/>';
      else g += skinLeg; // shorts / skirt show legs
      // shoes
      var sx = x + (cls.indexOf("l")>-1? -2: 2), sw = lw*0.75+5;
      if(cfg.shoes==="boots") g += '<rect x="'+(x-lw/2-1.5)+'" y="244" width="'+(lw+3)+'" height="22" rx="5" fill="'+shoeC+'"/><path d="M'+(sx-sw)+' 270 q0 -9 '+sw+' -9 q'+sw+' 0 '+sw+' 9 z" fill="'+shoeC+'"/><rect x="'+(sx-sw)+'" y="268" width="'+(sw*2)+'" height="5" rx="2.5" fill="'+shoeD+'"/>';
      else if(cfg.shoes==="sandals") g += '<path d="M'+(sx-sw+2)+' 270 q0 -8 '+(sw-2)+' -8 q'+(sw-2)+' 0 '+(sw-2)+' 8 z" fill="'+skin+'"/><rect x="'+(sx-sw)+'" y="269" width="'+(sw*2)+'" height="4.5" rx="2.2" fill="'+shoeD+'"/><path d="M'+(sx-sw+4)+' 265 h'+(sw*2-8)+'" stroke="'+shoeC+'" stroke-width="3.2" stroke-linecap="round"/>';
      else g += '<path d="M'+(sx-sw)+' 271 q0 -12 '+sw+' -12 q'+sw+' 0 '+sw+' 12 z" fill="'+shoeC+'"/><rect x="'+(sx-sw)+'" y="268.5" width="'+(sw*2)+'" height="5" rx="2.5" fill="'+shoeD+'"/><path d="M'+(sx-3)+' 263 l6 0 M'+(sx-3)+' 266 l6 0" stroke="'+shoeD+'" stroke-width="1.4" stroke-linecap="round"/>';
      return g + '</g>';
    }
    legs += leg(lx,"av-leg-l") + leg(rx,"av-leg-r");
    // hips for pants / shorts / skirt
    if(!isDress){
      if(cfg.bottom==="pants"||cfg.bottom==="leggings") legs += '<rect x="'+(L+3)+'" y="190" width="'+(hw*2-6)+'" height="22" rx="8" fill="'+botC+'"/>';
      if(cfg.bottom==="shorts") legs += '<path d="M'+(L+2)+' 190 h'+(hw*2-4)+' l3 40 h-'+(hw-2)+' l-3 -14 l-3 14 h-'+(hw-2)+'z" fill="'+botC+'"/><path d="M100 196 v18" stroke="'+botD+'" stroke-width="1.6"/>';
      if(cfg.bottom==="skirt") legs += '<path d="M'+(L+3)+' 190 h'+(hw*2-6)+' l12 46 q-'+(hw+12)+' 8 -'+(hw*2+18)+' 0z" fill="'+botC+'"/><path d="M'+(L+3)+' 232 q'+(hw)+' 6 '+(hw*2-6)+' 0" stroke="'+botD+'" stroke-width="2" fill="none" opacity=".5"/>';
    }
    legs += '</g>';

    // ---------- TORSO ----------
    var bg = B.bulge;
    var torsoD = 'M'+(L+8)+' 128 Q'+(L-1)+' 130 '+(L-1)+' 144 C'+(L-1-bg)+' 166 '+(L-1-bg)+' 186 '+L+' 200 Q'+(L+1)+' 206 '+(L+9)+' 206 L'+(R-9)+' 206 Q'+(R-1)+' 206 '+R+' 200 C'+(R+1+bg)+' 186 '+(R+1+bg)+' 166 '+(R+1)+' 144 Q'+(R+1)+' 130 '+(R-8)+' 128 Z';
    var torso = '<g class="av-torso">';
    if(cfg.top==="hoodie") torso += '<path d="M'+(100-24)+' 122 q24 22 48 0 l4 10 q-28 24 -56 0z" fill="'+topD+'"/>';
    torso += '<defs><clipPath id="'+id+'c"><path d="'+torsoD+'"/></clipPath><pattern id="'+id+'tex" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="'+hairL+'"/></pattern></defs>';
    torso += '<path d="'+torsoD+'" fill="'+topC+'"/>';
    if(cfg.top==="stripes") torso += '<g clip-path="url(#'+id+'c)" fill="'+topL+'">'+[140,156,172,188].map(function(y){return '<rect x="40" y="'+y+'" width="120" height="7"/>';}).join("")+'</g>';
    if(cfg.top==="tee") torso += '<path d="M90 128 q10 12 20 0" fill="'+skin+'"/><path d="M90 128 q10 12 20 0" fill="none" stroke="'+topD+'" stroke-width="2.4"/>';
    if(cfg.top==="hoodie") torso += '<path d="M'+(100-hw*0.55)+' 178 h'+(hw*1.1)+' l-5 20 h-'+(hw*1.1-10)+'z" fill="'+topD+'" opacity=".55"/><path d="M95 132 v16 M105 132 v16" stroke="'+topL+'" stroke-width="2" stroke-linecap="round"/><circle cx="95" cy="149" r="2" fill="'+topL+'"/><circle cx="105" cy="149" r="2" fill="'+topL+'"/>';
    if(cfg.top==="stripes") torso += '<path d="M90 128 q10 9 20 0" fill="none" stroke="'+topD+'" stroke-width="3"/>';
    if(cfg.top==="dress") torso += '<path d="M'+(L+2)+' 188 L'+(L-14)+' 240 Q100 252 '+(R+14)+' 240 L'+(R-2)+' 188Z" fill="'+topC+'"/><path d="M'+(L-10)+' 234 Q100 246 '+(R+10)+' 234" stroke="'+topL+'" stroke-width="3" fill="none"/><path d="M90 128 q10 12 20 0" fill="'+skin+'"/><path d="M'+(L+2)+' 186 h'+(hw*2-4)+'" stroke="'+topD+'" stroke-width="3"/>';
    torso += '</g>';

    // ---------- ARMS ----------
    function arm(side){
      var s = side==="l" ? -1 : 1;
      var sx = 100 + s*(hw-3), sy = 136, ex = 100 + s*(hw+9), ey = 166, hx = 100 + s*(hw+11), hy = 192;
      var longSleeve = cfg.top==="hoodie" || cfg.top==="stripes";
      var g = '<g class="av-arm-'+side+'" style="transform-origin:'+sx+'px '+sy+'px">';
      g += '<path d="M'+sx+' '+sy+' Q'+(ex)+' '+(sy+4)+' '+ex+' '+ey+' L'+hx+' '+hy+'" stroke="'+(longSleeve?topC:skin)+'" stroke-width="'+B.arm+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      if(!longSleeve) g += '<path d="M'+sx+' '+sy+' Q'+(ex)+' '+(sy+4)+' '+(ex-s*0.5)+' '+(sy+16)+'" stroke="'+topC+'" stroke-width="'+(B.arm+3)+'" fill="none" stroke-linecap="round"/>';
      if(cfg.top==="stripes") g += '<path d="M'+(ex-s*1)+' '+(ey-2)+' l'+(s*0)+' 6 M'+(hx-s*0.6)+' '+(hy-12)+' l0 5" stroke="'+topL+'" stroke-width="'+(B.arm)+'" stroke-linecap="butt" opacity=".9"/>';
      g += '<circle cx="'+hx+'" cy="'+(hy+3)+'" r="'+(B.arm*0.56+1.5)+'" fill="'+skin+'"/>';
      return g+'</g>';
    }

    // ---------- HEAD ----------
    var head = '<g class="av-head" style="transform-origin:100px 120px">';
    head += '<circle cx="61.5" cy="84" r="8.5" fill="'+skin+'"/><circle cx="138.5" cy="84" r="8.5" fill="'+skin+'"/><circle cx="62.5" cy="84" r="4" fill="'+skinD+'" opacity=".5"/><circle cx="137.5" cy="84" r="4" fill="'+skinD+'" opacity=".5"/>';
    head += '<ellipse cx="100" cy="78" rx="39" ry="41" fill="'+skin+'"/>';
    // front hair
    var fh = "";
    if(cfg.hair==="short") fh='<path d="M61 80 C56 42 82 31 101 31 C126 31 146 44 139 80 C134 64 124 54 108 52 C112 58 106 60 100 56 C88 54 70 60 61 80Z" fill="'+hairC+'"/><path d="M84 40 q10 -5 22 -3" stroke="'+hairL+'" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>';
    if(cfg.hair==="buzz") fh='<path d="M62.5 74 C63 44 84 36.5 100 36.5 C117 36.5 137 44 137.5 74 C129 60 116 53 100 53 C84 53 71 60 62.5 74Z" fill="'+hairC+'" opacity=".92"/>';
    if(cfg.hair==="curly"){ fh='<path d="M60 82 C56 44 80 32 100 32 C122 32 146 44 140 82 C130 62 116 56 100 57 C84 56 70 62 60 82Z" fill="'+hairC+'"/>'; var cs=[[64,64],[70,48],[82,38],[96,34],[110,35],[123,40],[133,51],[137,66],[89,52],[106,50],[76,57],[122,56]]; fh+= cs.map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i>7?8:10.5)+'" fill="'+(i%3===0?hairL:hairC)+'"/>';}).join(""); }
    if(cfg.hair==="long") fh='<path d="M58 96 C52 50 76 31 100 31 C126 31 150 48 142 96 C140 76 134 64 122 58 C108 66 86 62 76 54 C68 62 60 76 58 96Z" fill="'+hairC+'"/><path d="M60 92 C58 112 60 132 66 150 L58 150 C52 132 52 110 56 90Z M140 92 C142 112 140 132 134 150 L142 150 C148 132 148 110 144 90Z" fill="'+hairC+'"/><path d="M80 42 q16 -8 34 0" stroke="'+hairL+'" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>';
    if(cfg.hair==="ponytail"||cfg.hair==="bun"||cfg.hair==="braids") fh='<path d="M60 82 C56 44 80 32 100 32 C124 32 146 44 140 82 C136 62 122 50 100 50 C80 50 66 60 60 82Z" fill="'+hairC+'"/><path d="M100 33 C99 40 99 45 100 50" stroke="'+hairD+'" stroke-width="2" fill="none"/><path d="M78 42 q8 -4 16 -4" stroke="'+hairL+'" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>';
    if(cfg.hair==="afro") fh='<path d="M60 80 C58 50 76 36 100 36 C124 36 142 50 140 80 C134 62 118 54 100 54 C82 54 66 62 60 80Z" fill="'+hairC+'"/><path d="M60 80 C58 50 76 36 100 36 C124 36 142 50 140 80 C134 62 118 54 100 54 C82 54 66 62 60 80Z" fill="url(#'+id+'tex)" opacity=".45"/>';
    // face
    var face = '';
    face += '<path d="M78 72 q6 -4 12 -1 M110 71 q6 -3 12 1" stroke="'+hairD+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    [84,116].forEach(function(x){
      face += '<g class="av-eye" style="transform-origin:'+x+'px 86px"><ellipse cx="'+x+'" cy="86" rx="7.2" ry="8" fill="#FFFCF6"/><circle cx="'+x+'" cy="87" r="5" fill="'+eyeC+'"/><circle cx="'+x+'" cy="87.5" r="2.4" fill="#231C19"/><circle cx="'+(x+1.8)+'" cy="85" r="1.5" fill="#fff"/></g>';
    });
    face += '<ellipse cx="75" cy="100" rx="7" ry="4.2" fill="#D98F7E" opacity=".28"/><ellipse cx="125" cy="100" rx="7" ry="4.2" fill="#D98F7E" opacity=".28"/>';
    face += '<path d="M98 94 q2 3 4 0" stroke="'+skinD+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    face += '<path class="av-mouth" d="M91 104 Q100 112 109 104" stroke="#6B3F33" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    if(cfg.extra==="freckles") face += '<g fill="'+skinD+'" opacity=".8">'+[[72,95],[77,98],[71,101],[128,95],[123,98],[129,101]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.2"/>';}).join("")+'</g>';
    var extra = '';
    if(cfg.extra==="glasses") extra = '<g fill="none" stroke="#5B4E45" stroke-width="2.4"><circle cx="84" cy="86" r="11"/><circle cx="116" cy="86" r="11"/><path d="M95 85 q5 -3 10 0 M73 84 l-10 -3 M127 84 l10 -3"/></g>';
    if(cfg.extra==="headphones") extra = '<path d="M56 86 C52 34 148 34 144 86" stroke="#8A9AA7" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="48" y="72" width="16" height="26" rx="8" fill="#93A9BA"/><rect x="136" y="72" width="16" height="26" rx="8" fill="#93A9BA"/>';
    head += fh + face + extra + '</g>';

    var neck = '<rect x="91" y="106" width="18" height="28" rx="7" fill="'+skinD+'"/>';
    o.push('<g class="av-body">' + bh + legs + neck + arm("l") + arm("r") + torso + head + '</g>');

    var vb = opts.headOnly ? "44 18 112 112" : "0 0 200 300";
    var cls = "avatar pose-"+(opts.pose||"idle")+(opts.headOnly?" head-only":"")+(opts.cls?(" "+opts.cls):"");
    var w = opts.size || 200, h = opts.headOnly ? w : Math.round(w*1.5);
    return '<svg class="'+cls+'" viewBox="'+vb+'" width="'+w+'" height="'+h+'" role="img" aria-label="'+(opts.label||BF.L("Your child's hero character","Герой вашего ребёнка"))+'">'+o.join("")+'</svg>';
  }

  /* Balapan = "little chick" in Kazakh — our paper-cut mascot */
  function chick(size, cls){
    size = size||64;
    return '<svg class="chick '+(cls||"")+'" viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true">'+
      '<ellipse cx="50" cy="92" rx="26" ry="4" fill="#3B3632" opacity=".08"/>'+
      '<path d="M22 60 C20 36 38 22 54 24 C72 26 82 42 80 60 C78 80 64 88 50 88 C34 88 23 78 22 60Z" fill="#E4CC8F"/>'+
      '<path d="M30 64 C40 74 58 74 66 62 C62 78 40 80 30 64Z" fill="#D4B672"/>'+
      '<path class="chick-wing" d="M30 56 C22 58 20 70 30 72 C36 70 38 62 30 56Z" fill="#CFAF69" style="transform-origin:32px 58px"/>'+
      '<circle cx="60" cy="46" r="4" fill="#3B3632"/><circle cx="61.4" cy="44.6" r="1.3" fill="#fff"/>'+
      '<path d="M74 50 L86 54 L74 58Z" fill="#C98E70"/>'+
      '<path d="M50 24 C48 16 54 12 56 18 C58 12 64 16 60 24" fill="#E4CC8F"/>'+
      '<ellipse cx="66" cy="56" rx="5" ry="3" fill="#D98F7E" opacity=".35"/>'+
      '<path d="M42 87 v6 M56 87 v6" stroke="#C98E70" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  BF.avatar = { svg:svg, chick:chick, SKIN:SKIN, HAIRC:HAIRC, EYES:EYES, CLOTH:CLOTH, BOTTOMC:BOTTOMC, SHOEC:SHOEC, HAIRS:HAIRS, TOPS:TOPS, BOTTOMS:BOTTOMS, SHOES:SHOES, BUILDS:BUILDS, EXTRAS:EXTRAS, shade:shade };
})();
