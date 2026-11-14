/* ==========================================================
   Scene engine — composes a unique animated SVG scene for each
   situation from a short recipe:
       "background | prop,prop,prop | pose | fx | time"
   e.g. "dentist|chair,tooth,adult|shy|sparkle|d"
   Pieces are reusable; the child's own avatar is the hero.
   Motion is CSS-only and switches off in Calm mode and with
   prefers-reduced-motion.
   ========================================================== */
var BF = window.BF = window.BF || {};
(function(){
  var C = { ink:"#3B3632", paper:"#FBF7EF", sand:"#E4CC8F", sandD:"#C7A65A", sage:"#A3B59C", sageD:"#6F8A6E", sageL:"#DCE4D5", dusty:"#93A9BA", dustyD:"#5F7889", dustyL:"#D8E1E7", clay:"#C98E70", clayD:"#A96C51", rose:"#D9B5A7", roseL:"#F1DED3", wall:"#F1E6D3", wood:"#B9A48A", woodD:"#8B6F64", floor:"#E7D7BC", stone:"#CDBFA8" };
  function r(x,y,w,h,f,rx,extra){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="'+f+'" '+(extra||'')+'/>'; }
  function c(x,y,rad,f,extra){ return '<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+f+'" '+(extra||'')+'/>'; }
  function p(d,f,extra){ return '<path d="'+d+'" fill="'+(f||"none")+'" '+(extra||'')+'/>'; }
  function st(col,w){ return 'stroke="'+col+'" stroke-width="'+(w||3)+'" stroke-linecap="round" stroke-linejoin="round"'; }
  function win(x,y,w,h,sky){ return r(x,y,w,h,C.wood,6)+r(x+5,y+5,w-10,h-10,sky||"#D8E1E7",3)+p("M"+(x+w/2)+" "+(y+5)+"v"+(h-10)+"M"+(x+5)+" "+(y+h/2)+"h"+(w-10),null,st(C.wood,4)); }
  function floor(col, y){ return r(0,y||196,400,240-(y||196),col||C.floor); }
  function person(x, top, body, hair, h){ /* simple paper-cut adult/kid silhouette, h = height */
    h = h||110; var s = h/110;
    return '<g transform="translate('+x+' '+(198-h)+') scale('+s+')">'+r(-14,34,28,48,body,12)+r(-11,78,9,32,C.dustyD,4)+r(2,78,9,32,C.dustyD,4)+c(0,18,16,"#E3B892")+p("M-16 16 q2 -20 16 -20 q16 0 16 20 q-6 -10 -16 -10 q-10 0 -16 10z",hair)+c(-5,19,1.8,C.ink)+c(5,19,1.8,C.ink)+p("M-4 26 q4 3 8 0",null,st(C.ink,1.6))+'</g>';
  }

  /* ---------------- BACKGROUNDS ---------------- */
  var BG = {
    classroom:function(){ return r(0,0,400,240,C.wall)+r(30,30,170,90,C.sageD,6)+r(36,36,158,78,"#71866F",4)+p("M50 60 h60 M50 76 h90 M50 92 h40",null,st("#E8EFE2",3)+' opacity=".7"')+win(260,30,90,80)+floor(C.floor,190)+r(214,150,120,10,C.wood,3)+r(222,160,8,34,C.woodD)+r(318,160,8,34,C.woodD); },
    gate:function(){ return r(0,0,400,240,"#E5ECEF")+r(210,40,170,150,C.roseL)+p("M200 44 L295 8 L390 44Z",C.clay)+r(276,110,40,80,C.dustyD,4)+win(226,62,36,32)+win(330,62,36,32)+floor("#D9CDB6",188)+p("M0 150 h200",null,st(C.woodD,4))+[20,50,80,110,140,170].map(function(x){ return p("M"+x+" 140 v50",null,st(C.woodD,4)); }).join(""); },
    bedroom:function(){ return r(0,0,400,240,"#E9E1EE".replace("E9E1EE","EDE4DA"))+win(40,30,80,74)+floor(C.floor,192)+r(220,130,160,50,C.paper,10)+r(220,120,40,40,C.wall,10)+r(216,172,168,22,C.wood,6)+r(260,124,120,40,C.dusty,10); },
    bathroom:function(){ var t=""; for(var y=0;y<190;y+=24) for(var x=0;x<400;x+=24) t+=r(x+1,y+1,22,22,"#E6EDEE",2); return r(0,0,400,240,"#D8E1E7")+t+floor("#C9D3C1",190)+r(250,120,130,60,C.paper,24)+r(256,110,10,22,C.stone,4)+r(40,40,60,70,"#EEF3F4",8,st(C.stone,3)); },
    kitchen:function(){ return r(0,0,400,240,"#F2E9D8")+r(0,120,400,10,C.wood)+r(0,130,400,64,C.sageL)+[20,110,200,290].map(function(x){ return r(x,138,80,50,C.sage,6)+c(x+70,162,3,C.sageD); }).join("")+r(30,30,90,60,C.paper,6,st(C.wood,4))+win(250,24,100,80)+floor(C.floor,194); },
    living:function(){ return r(0,0,400,240,"#EFE5D6")+win(150,24,100,80)+floor(C.floor,194)+r(250,130,140,46,C.clay,14)+r(250,116,140,30,C.clayD,14)+r(255,172,10,22,C.woodD)+r(375,172,10,22,C.woodD)+r(20,100,6,94,C.woodD)+p("M6 100 h34 l-8 -30 h-18z",C.sand); },
    clinic:function(){ return r(0,0,400,240,"#E8EEEC")+r(0,150,400,6,C.sage)+r(40,40,50,50,C.paper,6)+p("M58 52 h14 v14 h14 v14 h-14 v14 h-14 v-14 h-14 v-14 h14z".replace(/(\d+) (\d+)/,"$1 $2"),C.rose,'transform="translate(-6 -6) scale(.8)"')+floor("#D5DED8",194)+r(230,140,150,20,C.dustyL,8)+r(240,160,8,34,C.stone)+r(362,160,8,34,C.stone); },
    dentist:function(){ return r(0,0,400,240,"#E6EEF0")+floor("#D2DEE0",196)+p("M330 20 q20 30 0 60",null,st(C.stone,4))+c(318,86,22,"#FFF6D8")+c(318,86,30,"#FFF6D8",'opacity=".4" class="sc-pulse"')+r(30,40,70,46,C.paper,6,st(C.dusty,3)); },
    salon:function(){ return r(0,0,400,240,"#F0E6E0")+r(240,30,120,110,C.paper,50,st(C.wood,6))+r(252,42,96,86,"#E3ECEF",44)+floor("#E2D3C3",196)+[0,1,2,3,4,5,6,7].map(function(i){ return r(i*50,196,25,44,"#D6C4B0"); }).join(""); },
    park:function(){ return r(0,0,400,240,"#E3ECEF")+p("M0 150 C100 120 200 150 400 130 V240 H0Z",C.sageL)+p("M0 180 C120 160 260 190 400 172 V240 H0Z",C.sage)+'<g class="sc-sway" style="transform-origin:340px 180px">'+r(334,110,12,76,C.woodD,4)+c(340,100,34,C.sageD)+c(318,116,22,"#7F9A7D")+'</g>'; },
    playground:function(){ return r(0,0,400,240,"#E3ECEF")+floor("#E1CFAE",184)+p("M250 186 L290 70 L330 186 M260 150 h60",null,st(C.dustyD,6))+p("M290 70 v70",null,st(C.stone,2))+'<g class="sc-swing" style="transform-origin:290px 70px">'+p("M280 70 v80 M300 70 v80",null,st(C.stone,2))+r(274,148,32,8,C.clay,3)+'</g>'+p("M20 186 L60 100 L110 186",C.sand); },
    street:function(){ return r(0,0,400,240,"#E5ECEF")+r(20,60,80,130,C.roseL)+r(110,40,90,150,C.sageL)+r(210,80,80,110,C.dustyL)+r(300,50,90,140,"#EADFC9")+[30,60,120,160,220,250,310,350].map(function(x,i){ return r(x,(i%2?70:100),22,26,C.paper,3); }).join("")+r(0,190,400,50,"#BDB6AC")+p("M0 214 h400",null,st(C.paper,4)+' stroke-dasharray="20 18"'); },
    shop:function(){ return r(0,0,400,240,"#EFE7DA")+[30,80,130].map(function(y){ return r(20,y,360,6,C.wood); }).join("")+[0,1,2,3,4,5,6,7,8,9,10].map(function(i){ var x=30+i*32; return r(x,12,20,18,[C.sage,C.clay,C.sand,C.dusty,C.rose][i%5],3)+r(x+4,62,18,18,[C.rose,C.sand,C.sage,C.clay][i%4],9)+r(x,110,22,20,[C.dusty,C.sage,C.sand][i%3],3); }).join("")+floor("#E0D4C0",190); },
    car:function(){ return r(0,0,400,240,"#DDE6EA")+'<g class="sc-scroll">'+p("M0 120 C80 100 120 130 200 110 C280 92 320 120 400 104 C480 92 520 120 600 110 V140 H0Z",C.sageL)+'</g>'+r(0,140,400,100,"#6E655D")+p("M0 0 h400 v40 C300 30 100 30 0 40z",C.dustyD)+r(20,40,360,100,"none",20,st(C.dustyD,10))+r(0,170,400,70,C.clayD,0)+r(30,150,140,60,C.clay,16)+r(230,150,140,60,C.clay,16); },
    bus:function(){ return r(0,0,400,240,"#E8E0D0")+[0,1,2].map(function(i){ return win(20+i*130,30,110,70,"#DCE6EA"); }).join("")+r(0,100,400,6,C.sandD)+floor("#B9A48A",196)+[40,170,300].map(function(x){ return r(x,130,80,50,C.dusty,10)+r(x,120,80,20,C.dustyD,8); }).join(""); },
    airport:function(){ return r(0,0,400,240,"#E7ECEE")+r(0,20,400,100,"#D3DEE4")+r(0,20,400,100,"none",0,st(C.stone,4))+[100,200,300].map(function(x){ return p("M"+x+" 20 v100",null,st(C.stone,4)); }).join("")+'<g class="sc-fly">'+p("M60 70 l50 -6 l14 -14 h6 l-6 16 l22 -2 l6 -6 h4 l-2 10 l2 10 h-4 l-6 -6 l-22 -2 l6 16 h-6 l-14 -14z",C.paper)+'</g>'+r(220,130,150,30,C.ink,4)+r(226,136,138,18,"#4B4440",2)+p("M232 145 h40 M290 145 h60",null,st(C.sand,3))+floor("#DCD4C6",190); },
    pool:function(){ return r(0,0,400,240,"#E8EEEC")+r(0,140,400,100,C.dustyL)+'<g class="sc-wave">'+p("M-40 150 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V240 H-40Z",C.dusty,'opacity=".6"')+'</g>'+p("M0 190 h400 M0 220 h400",null,st(C.paper,3)+' stroke-dasharray="14 10"')+r(320,60,10,90,C.stone)+r(354,60,10,90,C.stone)+[80,100,120].map(function(y){ return r(320,y,44,5,C.stone); }).join(""); },
    beach:function(){ return r(0,0,400,240,"#E5ECEF")+c(320,50,26,"#EFD9A0")+r(0,120,400,50,C.dusty)+'<g class="sc-wave">'+p("M-40 150 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V180 H-40Z",C.dustyL)+'</g>'+p("M0 170 C120 160 260 178 400 166 V240 H0Z","#EBD9B3"); },
    party:function(){ return r(0,0,400,240,"#F2E7E0")+p("M0 20 Q100 60 200 20 Q300 60 400 20",null,st(C.wood,2))+[20,60,100,140,180,220,260,300,340,380].map(function(x,i){ var y = 20+ (Math.sin((x/400)*Math.PI*2)*0)+ (x%200<100? (x%100)/100*30 : (100-x%100)/100*30) ; return p("M"+(x-10)+" "+(y+4)+" l10 22 l10 -22z",[C.rose,C.sand,C.sage,C.dusty][i%4],'class="sc-flag" style="transform-origin:'+x+'px '+y+'px"'); }).join("")+floor("#E6D7C4",190)+r(250,140,130,12,C.paper,3)+r(260,152,8,40,C.wood)+r(362,152,8,40,C.wood); },
    cafe:function(){ return r(0,0,400,240,"#EFE4D3")+r(0,0,400,30,C.clay)+[0,1,2,3,4,5,6,7].map(function(i){ return p("M"+(i*50)+" 30 q25 20 50 0",C.paper); }).join("")+win(40,60,90,70)+floor("#D9C7AE",192)+r(220,140,150,10,C.paper,4)+r(290,150,10,44,C.woodD)+c(250,134,8,C.paper,st(C.stone,2)); },
    library:function(){ var b=""; [30,80,130].forEach(function(y,ri){ for(var i=0;i<14;i++){ b+=r(14+i*26,y-((i*7+ri*3)%6)*2-30+30,18,40-((i*5)%10),[C.sage,C.clay,C.sand,C.dusty,C.rose,C.wood][(i+ri)%6],2); } b+=r(10,y+40,380,6,C.woodD); }); return r(0,0,400,240,"#EEE5D5")+b+floor(C.floor,196); },
    field:function(){ return r(0,0,400,240,"#E3ECEF")+p("M0 130 H400 V240 H0Z","#B6C7AE")+p("M0 130 H400",null,st(C.paper,3))+p("M200 130 v110 M120 240 q80 -60 160 0",null,st(C.paper,3)+' opacity=".7"')+p("M330 130 v-60 h60 v60",null,st(C.paper,5))+p("M330 70 l60 60 M390 70 l-60 60",null,st(C.paper,1)+' opacity=".5"'); },
    stage:function(){ return r(0,0,400,240,"#5F5651")+p("M0 0 h80 q-20 120 0 200 h-80z",C.clayD)+p("M400 0 h-80 q20 120 0 200 h80z",C.clayD)+p("M0 0 h400 v30 q-200 20 -400 0z",C.clay)+'<g class="sc-pulse">'+p("M150 0 L90 196 H310 L250 0z","#FFF6D8",'opacity=".18"')+'</g>'+r(0,196,400,44,C.wood)+[60,120,180,240,300,360].map(function(x){ return c(x,236,16,"#3F3833"); }).join(""); },
    forest:function(){ return r(0,0,400,240,"#E1E9E3")+[30,90,150,240,300,360].map(function(x,i){ var h=110+(i%3)*20; return r(x-4,200-h+60,8,h-60,C.woodD)+p("M"+x+" "+(200-h)+" l30 60 h-14 l22 40 h-76 l22 -40 h-14z",i%2?C.sageD:"#7F9A7D"); }).join("")+floor("#C9D3C1",196); },
    garden:function(){ return r(0,0,400,240,"#E5ECEF")+r(0,120,400,10,C.woodD)+[0,1,2,3,4,5,6,7,8,9].map(function(i){ return r(i*42,100,8,40,C.wood,2); }).join("")+floor("#B6C7AE",170)+[40,90,140].map(function(x,i){ return p("M"+x+" 186 v-20",null,st(C.sageD,3))+c(x,162,8,[C.rose,C.sand,C.clay][i]); }).join(""); },
    museum:function(){ return r(0,0,400,240,"#ECE6DC")+[40,170,300].map(function(x,i){ return r(x,40,70,56,C.paper,2,st(C.sandD,6))+r(x+8,48,54,40,[C.sageL,C.roseL,C.dustyL][i]); }).join("")+floor("#D8CCBA",196)+r(170,130,60,66,C.stone,4); },
    hall:function(){ return r(0,0,400,240,"#EFE6D8")+[0,1,2,3].map(function(i){ return r(30+i*95,40,70,130,C.dustyL,4)+c(90+i*95,108,3,C.dustyD); }).join("")+floor("#D7C9B2",190)+r(0,186,400,6,C.woodD); },
    snow:function(){ return r(0,0,400,240,"#E6ECF0")+p("M0 150 C100 130 220 160 400 140 V240 H0Z","#F7F9FA")+p("M0 190 C140 176 260 196 400 182 V240 H0Z","#EEF2F4")+[60,330].map(function(x){ return r(x-3,110,6,40,C.woodD)+p("M"+x+" 70 l22 44 h-44z","#7F9A7D")+p("M"+x+" 70 l10 20 h-20z","#F7F9FA"); }).join(""); }
  };

  /* ---------------- PROPS (drawn around 0,0 = ground center) ---------------- */
  var PROP = {
    backpack:function(){ return r(-22,-52,44,52,C.clay,12)+r(-16,-30,32,20,C.clayD,6)+p("M-12 -52 q12 -16 24 0",null,st(C.clayD,4)); },
    books:function(){ return r(-26,-12,52,12,C.sage,2)+r(-22,-24,46,12,C.dusty,2)+r(-24,-36,48,12,C.rose,2)+r(-18,-48,40,12,C.sand,2); },
    clock:function(){ return '<g transform="translate(0 -40)">'+c(0,0,24,C.paper,st(C.woodD,4))+'<g class="sc-spin">'+p("M0 0 v-16",null,st(C.ink,3))+'</g><g class="sc-spin-slow">'+p("M0 0 h11",null,st(C.ink,3))+'</g>'+c(0,0,3,C.ink)+'</g>'; },
    bell:function(){ return '<g class="sc-ring" style="transform-origin:0px -60px">'+p("M-18 -20 q0 -36 18 -40 q18 4 18 40 h6 v6 h-48 v-6z",C.sand)+c(0,-10,5,C.sandD)+'</g>'; },
    pencil:function(){ return '<g transform="rotate(-30)" class="sc-bob">'+r(-5,-60,10,48,C.sand,2)+p("M-5 -12 l5 12 l5 -12z",C.wall)+r(-5,-64,10,6,C.rose,2)+'</g>'; },
    paper:function(){ return '<g transform="rotate(-6)">'+r(-24,-56,48,56,C.paper,3,st(C.stone,2))+p("M-14 -42 h28 M-14 -32 h28 M-14 -22 h18",null,st(C.stone,2))+p("M8 -14 l4 4 l8 -10",null,st(C.clay,3))+'</g>'; },
    tablet:function(){ return r(-30,-52,60,42,C.ink,6)+'<g class="sc-glow">'+r(-25,-47,50,32,"#9DB4C2",3)+'</g>'+c(0,-31,6,C.sand); },
    tv:function(){ return r(-40,-74,80,52,C.ink,6)+'<g class="sc-glow">'+r(-35,-69,70,42,"#A9BFC9",3)+'</g>'+r(-4,-22,8,14,C.woodD)+r(-20,-8,40,8,C.woodD,3); },
    bed:function(){ return r(-60,-34,120,26,C.paper,8)+r(-60,-48,40,22,C.wall,8)+r(-24,-40,84,26,C.sage,8)+r(-64,-12,128,12,C.wood,4); },
    teddy:function(){ return '<g class="sc-bob">'+c(-11,-46,7,C.wood)+c(11,-46,7,C.wood)+c(0,-36,15,C.wood)+r(-14,-24,28,24,C.wood,12)+c(-5,-38,2,C.ink)+c(5,-38,2,C.ink)+c(0,-32,4,C.wall)+'</g>'; },
    nightlight:function(){ return '<g class="sc-pulse">'+c(0,-16,22,"#FFF2C6",'opacity=".45"')+'</g>'+p("M-8 0 v-10 q8 -18 16 0 v10z",C.sand)+c(0,-16,6,"#FFF6D8"); },
    toothbrush:function(){ return '<g transform="rotate(-20)" class="sc-scrub">'+r(-4,-70,8,62,C.dusty,4)+r(-6,-80,12,14,C.paper,3)+'</g>'+r(-16,-14,32,14,C.sageL,4); },
    tub:function(){ return r(-60,-40,120,40,C.paper,18,st(C.stone,2))+'<g class="sc-bubble">'+c(-30,-44,8,C.dustyL)+c(-12,-50,10,C.dustyL)+c(10,-46,7,C.dustyL)+c(30,-50,9,C.dustyL)+'</g>'; },
    toilet:function(){ return r(-16,-70,32,30,C.paper,6,st(C.stone,2))+p("M-26 -40 h52 q0 26 -18 32 v8 h-16 v-8 q-18 -6 -18 -32z",C.paper,st(C.stone,2)); },
    plate:function(){ return '<ellipse cx="0" cy="-8" rx="34" ry="10" fill="'+C.paper+'" '+st(C.stone,2)+'/>'+c(-10,-14,8,C.sage)+c(4,-16,6,"#7F9A7D")+r(10,-18,14,6,C.sand,3); },
    broccoli:function(){ return r(-4,-24,8,24,"#8FA487",3)+c(-10,-32,10,C.sageD)+c(6,-36,11,"#7F9A7D")+c(0,-44,9,C.sageD); },
    cake:function(){ return r(-30,-36,60,36,C.roseL,6)+r(-30,-36,60,10,C.rose,4)+[-14,0,14].map(function(x){ return r(x-2,-52,4,16,C.paper,1)+'<ellipse class="sc-flicker" cx="'+x+'" cy="-56" rx="3" ry="5" fill="#EFC77E"/>'; }).join(""); },
    gift:function(){ return r(-24,-40,48,40,C.dusty,4)+r(-4,-40,8,40,C.sand)+r(-28,-46,56,10,C.dustyD,3)+p("M0 -46 q-16 -18 -20 -4z M0 -46 q16 -18 20 -4z",C.sand); },
    balloons:function(){ return '<g class="sc-float">'+[[-14,-110,C.rose],[10,-120,C.sage],[24,-98,C.sand]].map(function(b){ return p("M"+b[0]+" "+(b[1]+20)+" Q"+(b[0]/2)+" -40 0 0",null,st(C.stone,1.5))+'<ellipse cx="'+b[0]+'" cy="'+b[1]+'" rx="14" ry="17" fill="'+b[2]+'"/>'; }).join("")+'</g>'; },
    ball:function(){ return '<g class="sc-bounce">'+c(0,-18,18,C.clay)+p("M-18 -18 q18 10 36 0 M0 -36 q-10 18 0 36",null,st(C.paper,2))+'</g>'; },
    dog:function(){ return '<g class="sc-wag-body">'+'<ellipse cx="0" cy="-22" rx="26" ry="14" fill="'+C.wood+'"/>'+c(24,-36,12,C.wood)+p("M28 -46 l8 -6 l0 12z",C.woodD)+c(28,-38,2,C.ink)+r(-20,-12,6,12,C.woodD,2)+r(14,-12,6,12,C.woodD,2)+'<g class="sc-wag" style="transform-origin:-24px -26px">'+p("M-24 -26 q-14 -10 -10 -22",null,st(C.wood,5))+'</g></g>'; },
    cat:function(){ return '<ellipse cx="0" cy="-16" rx="20" ry="14" fill="'+C.stone+'"/>'+c(14,-32,11,C.stone)+p("M6 -40 l2 -10 l6 6z M18 -42 l4 -8 l3 9z",C.stone)+c(17,-33,1.6,C.ink)+'<g class="sc-wag" style="transform-origin:-18px -14px">'+p("M-18 -14 q-20 0 -16 -24",null,st(C.stone,5))+'</g>'; },
    umbrella:function(){ return p("M0 0 v-56 q0 -4 4 -4",null,st(C.woodD,3))+p("M-36 -56 q36 -40 72 0 q-12 -6 -24 0 q-12 -6 -24 0 q-12 -6 -24 0z",C.dusty); },
    tree:function(){ return '<g class="sc-sway" style="transform-origin:0 0">'+r(-5,-50,10,50,C.woodD,3)+c(0,-66,26,C.sageD)+c(-16,-54,16,"#7F9A7D")+c(16,-56,16,"#7F9A7D")+'</g>'; },
    flower:function(){ return p("M0 0 v-34",null,st(C.sageD,3))+'<g class="sc-spin-slow" style="transform-origin:0px -40px">'+[0,72,144,216,288].map(function(a){ return '<ellipse cx="0" cy="-50" rx="5" ry="9" fill="'+C.rose+'" transform="rotate('+a+' 0 -40)"/>'; }).join("")+'</g>'+c(0,-40,5,C.sand); },
    door:function(){ return r(-28,-110,56,110,C.woodD,4)+r(-22,-104,44,98,C.wood,3)+c(14,-54,4,C.sand); },
    suitcase:function(){ return r(-26,-50,52,50,C.dusty,8)+p("M-10 -50 v-10 h20 v10",null,st(C.dustyD,4))+p("M-26 -30 h52",null,st(C.dustyD,3))+c(-16,0,4,C.ink)+c(16,0,4,C.ink); },
    ticket:function(){ return '<g transform="rotate(-10)" class="sc-bob">'+p("M-30 -40 h60 v8 a6 6 0 0 0 0 12 v8 h-60 v-8 a6 6 0 0 0 0 -12z",C.sand)+p("M-14 -34 v20",null,st(C.sandD,2)+' stroke-dasharray="3 3"')+'</g>'; },
    mirror:function(){ return '<ellipse cx="0" cy="-60" rx="26" ry="34" fill="#E3ECEF" '+st(C.wood,5)+'/>'+p("M-10 -76 q6 -8 14 -6",null,st(C.paper,4))+r(-3,-26,6,26,C.wood); },
    scissors:function(){ return '<g class="sc-snip">'+c(-10,-12,8,"none",st(C.clay,4))+c(10,-12,8,"none",st(C.clay,4))+p("M-6 -18 L10 -60 M6 -18 L-10 -60",null,st(C.stone,4))+'</g>'; },
    chair:function(){ return p("M-30 -40 q-6 -40 10 -50",null,st(C.dustyD,10))+r(-30,-46,64,14,C.dusty,7)+r(-4,-32,8,30,C.stone)+r(-22,-4,44,6,C.stone,3); },
    syringe:function(){ return '<g transform="rotate(30 0 -30)">'+r(-6,-58,12,38,C.paper,3,st(C.stone,2))+r(-6,-44,12,24,C.roseL,2)+p("M0 -20 v14",null,st(C.stone,2))+r(-10,-62,20,4,C.stone,2)+'</g>'; },
    tooth:function(){ return '<g class="sc-bob">'+p("M-18 -50 q18 -12 36 0 q4 20 -6 44 q-4 6 -8 -6 q-4 -10 -8 0 q-4 12 -8 6 q-10 -24 -6 -44z",C.paper,st(C.stone,2))+c(-6,-38,2,C.ink)+c(6,-38,2,C.ink)+p("M-4 -30 q4 3 8 0",null,st(C.ink,1.5))+'</g>'; },
    phone:function(){ return '<g class="sc-ring" style="transform-origin:0px -30px">'+r(-14,-56,28,50,C.ink,6)+r(-10,-50,20,36,"#A9BFC9",2)+'</g>'; },
    mic:function(){ return p("M0 0 v-60",null,st(C.ink,3))+r(-10,-84,20,30,C.stone,10)+p("M-10 -72 h20",null,st(C.ink,1)); },
    trophy:function(){ return p("M-20 -60 h40 v10 q0 24 -20 28 q-20 -4 -20 -28z",C.sand)+r(-4,-22,8,12,C.sandD)+r(-16,-10,32,10,C.woodD,2)+p("M-20 -54 q-14 0 -10 12 M20 -54 q14 0 10 12",null,st(C.sandD,3)); },
    shoes:function(){ return p("M-30 0 v-14 q0 -6 8 -6 l8 4 q10 6 16 8 v8z",C.clay)+p("M4 0 v-14 q0 -6 8 -6 l8 4 q10 6 16 8 v8z",C.clayD); },
    jacket:function(){ return p("M-24 -70 l14 -6 q10 8 20 0 l14 6 l10 30 l-10 4 v36 h-48 v-36 l-10 -4z",C.sage)+p("M0 -70 v66",null,st(C.sageD,2)); },
    cart:function(){ return p("M-36 -54 h10 l10 40 h40 l8 -30 h-52",null,st(C.stone,4))+c(-10,-4,5,C.ink)+c(18,-4,5,C.ink)+r(-14,-40,14,14,C.sage,2)+r(4,-44,12,18,C.clay,2); },
    adult:function(){ return person(0, 0, C.dusty, C.woodD, 128); },
    teacher:function(){ return person(0, 0, C.sage, "#4B3428", 130)+r(14,-90,26,32,C.paper,2,'transform="rotate(10 0 0)"'); },
    doctor:function(){ return person(0, 0, C.paper, "#2E2623", 130)+p("M-8 -96 q8 20 16 0",null,st(C.dustyD,2)); },
    friend:function(){ return '<g class="sc-bob">'+person(0, 0, C.rose, C.sandD, 96)+'</g>'; },
    kids:function(){ return '<g class="sc-bob">'+person(-24,0,C.sand,"#2E2623",88)+'</g>'+person(20,0,C.dusty,C.clayD,92); },
    baby:function(){ return r(-34,-40,68,34,C.paper,10,st(C.wood,3))+p("M-34 -6 v6 M34 -6 v6",null,st(C.wood,3))+'<g class="sc-rock" style="transform-origin:0 -20px">'+c(-6,-44,10,"#E3B892")+r(-2,-46,26,12,C.roseL,6)+'</g>'; },
    crowd:function(){ return [-50,-20,10,40].map(function(x,i){ return '<g opacity="'+(0.55+i*0.1)+'">'+c(x,-60-(i%2)*6,12,C.stone)+r(x-14,-48-(i%2)*6,28,48,C.stone,10)+'</g>'; }).join(""); },
    lunchbox:function(){ return r(-28,-36,56,36,C.sage,6)+r(-28,-36,56,10,C.sageD,4)+p("M-10 -36 v-8 h20 v8",null,st(C.sageD,3)); },
    calendar:function(){ return r(-30,-66,60,58,C.paper,4,st(C.stone,2))+r(-30,-66,60,14,C.clay,4)+[0,1,2,3,4,5,6,7,8].map(function(i){ return r(-22+(i%3)*16,-46+Math.floor(i/3)*12,10,8,i===4?C.sand:C.wall,2); }).join(""); },
    star:function(){ return '<g class="sc-spin-slow" style="transform-origin:0px -40px">'+p("M0 -66 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2z",C.sand,st(C.sandD,2))+'</g>'; },
    map:function(){ return p("M-34 -10 v-50 l22 -8 l22 8 l22 -8 v50 l-22 8 l-22 -8z",C.wall,st(C.wood,2))+p("M-20 -40 q14 -14 20 4 t22 -6",null,st(C.clay,2)+' stroke-dasharray="4 4"')+c(22,-44,4,C.clay); },
    bike:function(){ return c(-24,-16,16,"none",st(C.ink,3))+c(24,-16,16,"none",st(C.ink,3))+p("M-24 -16 l16 -28 h22 l10 28 M-8 -44 l-6 -10 M14 -44 l4 -12 h8",null,st(C.clay,4)); },
    helmet:function(){ return p("M-22 -10 q0 -32 22 -32 q22 0 22 32z",C.sage)+p("M-22 -10 h44",null,st(C.sageD,3)); },
    bucket:function(){ return p("M-16 -30 h32 l-4 30 h-24z",C.clay)+p("M-16 -30 q16 -20 32 0",null,st(C.clayD,2))+p("M24 0 l10 -26",null,st(C.sand,4)); },
    shell:function(){ return p("M-20 0 q0 -30 20 -32 q20 2 20 32z",C.roseL,st(C.rose,2))+p("M0 0 v-30 M-10 0 l4 -28 M10 0 l-4 -28",null,st(C.rose,2)); },
    tent:function(){ return p("M-50 0 l50 -70 l50 70z",C.clay)+p("M0 -70 l-14 70 h28z",C.clayD); },
    music:function(){ return '<g class="sc-float">'+p("M-10 -40 v-30 l24 -6 v30",null,st(C.ink,3))+c(-14,-40,6,C.ink)+c(10,-46,6,C.ink)+'</g>'; },
    puzzle:function(){ return r(-24,-48,24,24,C.sage,2)+r(0,-48,24,24,C.dusty,2)+r(-24,-24,24,24,C.sand,2)+'<g class="sc-bob">'+r(6,-24,24,24,C.clay,2)+'</g>'; },
    bowl:function(){ return p("M-24 -16 h48 q-4 16 -24 16 q-20 0 -24 -16z",C.dusty)+c(-6,-18,4,C.wood)+c(6,-19,4,C.wood); },
    wave:function(){ return '<g class="sc-wave">'+p("M-60 -10 q15 -16 30 0 t30 0 t30 0 t30 0 V0 H-60z",C.dusty)+'</g>'; },
    car:function(){ return '<g class="sc-drive">'+r(-44,-32,88,22,C.dusty,8)+p("M-26 -32 l10 -18 h30 l12 18z",C.dustyL)+c(-24,-8,9,C.ink)+c(24,-8,9,C.ink)+'</g>'; },
    snowman:function(){ return c(0,-20,20,C.paper)+c(0,-54,14,C.paper)+c(-4,-56,1.6,C.ink)+c(4,-56,1.6,C.ink)+p("M0 -52 l10 2 l-10 2z",C.clay); },
    hat:function(){ return p("M-20 -6 q0 -30 20 -30 q20 0 20 30z",C.clay)+r(-26,-8,52,8,C.clayD,4); },
    worry:function(){ return '<g class="sc-float">'+p("M-30 -90 q-12 0 -12 -12 q0 -12 14 -12 q4 -14 20 -12 q14 -10 26 2 q16 0 14 14 q10 8 -2 20z",C.paper,st(C.stone,2))+p("M-14 -106 q4 -4 8 0 M6 -106 q4 -4 8 0 M-6 -96 q6 -4 12 0",null,st(C.stone,2))+'</g>'; },
    lightning:function(){ return '<g class="sc-flash">'+p("M10 -150 l-20 40 h16 l-14 36 l34 -48 h-16 l14 -28z",C.sand)+'</g>'; },
    flag:function(){ return p("M0 0 v-80",null,st(C.woodD,3))+'<g class="sc-wag" style="transform-origin:0px -80px">'+p("M0 -80 h34 l-8 12 l8 12 h-34z",C.sage)+'</g>'; },
    podium:function(){ return r(-30,-50,60,50,C.wood,4)+r(-36,-54,72,8,C.woodD,3); },
    pills:function(){ return r(-14,-40,28,40,C.paper,6,st(C.stone,2))+r(-14,-48,28,10,C.clay,3)+c(26,-6,6,C.sand); },
    stairs:function(){ return p("M-50 0 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v-14 h20 v70z",C.stone); },
    elevator:function(){ return r(-34,-110,68,110,C.stone,3)+p("M0 -104 v100",null,st(C.ink,2))+c(44,-60,5,C.sand); },
    sandbox:function(){ return r(-50,-18,100,18,C.wood,3)+p("M-44 -18 q20 -14 44 -6 q20 -10 44 6z","#EBD9B3"); },
    swim:function(){ return '<g class="sc-bob">'+c(0,-10,16,"none",st(C.clay,8))+'</g>'; },
    candle:function(){ return r(-6,-40,12,40,C.paper,3)+'<ellipse class="sc-flicker" cx="0" cy="-46" rx="5" ry="8" fill="#EFC77E"/>'; },
    leaves:function(){ return '<g class="sc-fall">'+p("M0 -110 q8 -8 12 2 q-8 6 -12 -2z",C.clay)+p("M-30 -80 q8 -8 12 2 q-8 6 -12 -2z",C.sand)+p("M30 -60 q8 -8 12 2 q-8 6 -12 -2z",C.clayD)+'</g>'; },
    desk:function(){ return r(-46,-46,92,10,C.wood,3)+r(-40,-36,8,36,C.woodD)+r(32,-36,8,36,C.woodD)+r(-30,-58,26,12,C.paper,2)+'<g class="sc-bob">'+r(6,-60,6,14,C.sand,2)+'</g>'; },
    swing:function(){ return p("M-40 0 L-30 -100 M40 0 L30 -100 M-34 -100 h68",null,st(C.dustyD,5))+'<g class="sc-swing" style="transform-origin:0px -100px">'+p("M-10 -100 v70 M10 -100 v70",null,st(C.stone,2))+r(-16,-32,32,7,C.clay,3)+'</g>'; },
    bag:function(){ return p("M-24 -44 h48 l-6 44 h-36z",C.sand)+p("M-12 -44 q12 -22 24 0",null,st(C.sandD,3))+r(-10,-58,8,16,C.sage,2)+c(8,-50,7,C.clay); },
    laptop:function(){ return r(-34,-56,68,44,C.ink,5)+'<g class="sc-glow">'+r(-29,-51,58,34,"#A9BFC9",2)+'</g>'+p("M-44 -10 h88 l-6 10 h-76z",C.stone); },
    slide:function(){ return p("M-50 0 v-90 h16 v90 M-50 -60 h16 M-50 -30 h16",null,st(C.dustyD,4))+p("M-34 -90 q30 0 50 50 q14 34 34 40",null,st(C.sand,10)); },
    globe:function(){ return c(0,-44,22,C.dustyL)+p("M-14 -54 q8 6 2 14 q10 4 12 -6 M6 -30 q6 -4 10 2",null,st(C.sage,4))+p("M0 -20 v20 M-14 0 h28",null,st(C.woodD,3)); }
  };

  /* ---------------- FX overlays ---------------- */
  function seq(n, f){ var o=""; for(var i=0;i<n;i++) o+=f(i); return o; }
  var FX = {
    rain:function(){ return '<g class="fx-rain">'+seq(28,function(i){ var x=(i*37)%400, y=(i*53)%200; return p("M"+x+" "+y+" l-4 12",null,st(C.dustyD,2)+' style="animation-delay:-'+(i%7)*0.15+'s"'); })+'</g>'; },
    snow:function(){ return '<g class="fx-snow">'+seq(26,function(i){ return c((i*41)%400,(i*29)%200,2+(i%3),C.paper,'style="animation-delay:-'+(i%9)*0.5+'s"'); })+'</g>'; },
    stars:function(){ return '<g class="fx-twinkle">'+seq(14,function(i){ return c((i*61+20)%400,(i*23)%90+8,1.6+(i%2),"#F4E6B8",'style="animation-delay:-'+(i%5)*0.4+'s"'); })+'</g>'; },
    zzz:function(){ return '<g class="fx-zzz">'+[0,1,2].map(function(i){ return '<text x="'+(250+i*14)+'" y="'+(90-i*18)+'" font-size="'+(14+i*4)+'" fill="'+C.dustyD+'" style="animation-delay:'+(i*0.6)+'s">z</text>'; }).join("")+'</g>'; },
    notes:function(){ return '<g class="fx-rise">'+[0,1,2,3].map(function(i){ return '<text x="'+(40+i*90)+'" y="120" font-size="20" fill="'+C.clayD+'" style="animation-delay:'+(i*0.7)+'s">'+(i%2?"♪":"♫")+'</text>'; }).join("")+'</g>'; },
    noise:function(){ return '<g class="fx-noise">'+[0,1,2].map(function(i){ return p("M"+(320+i*12)+" 70 q12 20 0 40",null,st(C.clay,3)+' style="animation-delay:'+(i*0.25)+'s"')+p("M"+(80-i*12)+" 70 q-12 20 0 40",null,st(C.clay,3)+' style="animation-delay:'+(i*0.25)+'s"'); }).join("")+'</g>'; },
    bubbles:function(){ return '<g class="fx-rise">'+seq(10,function(i){ return c(30+i*38,200,4+(i%3)*3,"none",st(C.dusty,2)+' style="animation-delay:'+(i*0.4)+'s"'); })+'</g>'; },
    confetti:function(){ return '<g class="fx-fall">'+seq(22,function(i){ return r((i*19)%400,(i*31)%60-60,6,10,[C.rose,C.sand,C.sage,C.dusty][i%4],1,'style="animation-delay:-'+(i%8)*0.4+'s"'); })+'</g>'; },
    wind:function(){ return '<g class="fx-wind">'+[60,110,150].map(function(y,i){ return p("M0 "+y+" q40 -10 80 0 t80 0",null,st(C.paper,3)+' opacity=".8" style="animation-delay:'+(i*0.5)+'s"'); }).join("")+'</g>'; },
    hearts:function(){ return '<g class="fx-rise">'+[0,1,2].map(function(i){ return p("M"+(150+i*40)+" 120 q-10 -12 0 -18 q10 6 0 18 q-10 -6 0 0z".replace("q-10 -6 0 0z","")+" q10 -12 20 0 q0 10 -20 20 q-20 -10 -20 -20 q10 -12 20 0z",C.rose,'style="animation-delay:'+(i*0.8)+'s"'); }).join("")+'</g>'; },
    sparkle:function(){ return '<g class="fx-twinkle">'+[[60,50],[340,40],[200,30],[300,110],[100,120]].map(function(q,i){ return p("M"+q[0]+" "+(q[1]-8)+" q2 6 8 8 q-6 2 -8 8 q-2 -6 -8 -8 q6 -2 8 -8z",C.sand,'style="animation-delay:-'+i*0.5+'s"'); }).join("")+'</g>'; },
    tick:function(){ return '<g class="fx-tick">'+[0,1,2].map(function(i){ return '<text x="'+(300+i*24)+'" y="'+(60+i*8)+'" font-size="12" fill="'+C.woodD+'" style="animation-delay:'+(i*0.5)+'s">'+BF.L("tick","тик")+'</text>'; }).join("")+'</g>'; },
    steam:function(){ return '<g class="fx-rise">'+[0,1,2].map(function(i){ return p("M"+(240+i*12)+" 130 q-6 -10 0 -20 t0 -20",null,st(C.paper,3)+' style="animation-delay:'+(i*0.5)+'s"'); }).join("")+'</g>'; },
    sun:function(){ return '<g class="sc-spin-slow" style="transform-origin:60px 40px">'+c(60,40,18,"#EFD9A0")+seq(8,function(i){ var a=i*Math.PI/4; return p("M"+(60+Math.cos(a)*24)+" "+(40+Math.sin(a)*24)+" L"+(60+Math.cos(a)*32)+" "+(40+Math.sin(a)*32),null,st("#E4CC8F",3)); })+'</g>'; },
    leaves:function(){ return '<g class="fx-fall">'+seq(10,function(i){ return p("M"+((i*43)%400)+" "+(-(i*20)%80)+" q6 -6 10 2 q-6 5 -10 -2z",[C.clay,C.sand,C.clayD][i%3],'style="animation-delay:-'+i*0.6+'s"'); })+'</g>'; },
    thought:function(){ return '<g class="fx-pulse">'+c(205,64,4,C.paper,st(C.stone,1.5))+c(215,50,6,C.paper,st(C.stone,1.5))+p("M218 40 q-10 -20 12 -24 q10 -14 26 -4 q20 -4 18 14 q10 12 -8 18 q-16 10 -28 2 q-22 4 -20 -6z",C.paper,st(C.stone,2))+p("M236 24 h20 M236 32 h14",null,st(C.stone,2))+'</g>'; },
    none:function(){ return ""; }
  };
  var TOD = { d:"", e:'<rect width="400" height="240" fill="#E9B98E" opacity=".16"/>', n:'<rect width="400" height="240" fill="#2F3A4A" opacity=".38"/>' };
  var SLOTS = [ [312,198], [56,198], [236,198], [370,120] ];

  function parse(recipe){
    var a = String(recipe||"park||idle|none|d").split("|");
    return { bg:a[0]||"park", props:(a[1]||"").split(",").filter(Boolean), pose:a[2]||"idle", fx:a[3]||"none", tod:a[4]||"d" };
  }
  var sid = 0;
  /* opts: {avatar, size:"thumb"|"big", label, still:true} */
  function render(recipe, opts){
    opts = opts||{}; var R = parse(recipe), id = "sc"+(++sid);
    var bg = (BG[R.bg]||BG.park)();
    var props = R.props.map(function(k, i){ var s = SLOTS[i]||SLOTS[0], f = PROP[k]; if(!f) return ""; var sc = (k==="adult"||k==="teacher"||k==="doctor"||k==="door"||k==="elevator") ? 1 : 0.95; return '<g class="sc-prop" transform="translate('+s[0]+' '+s[1]+') scale('+sc+')">'+f()+'</g>'; }).join("");
    var av = opts.avatar || (BF.store && BF.store.s.avatar);
    var hero = av && BF.avatar ? '<g class="sc-hero pose-'+R.pose+'">'+BF.avatar.svg(av,{size:92, pose: R.pose==="walk"?"walk":(R.pose==="cheer"||R.pose==="jump"?"cheer":(R.pose==="wave"?"wave":"idle"))}).replace('<svg ','<svg x="'+(opts.heroX||118)+'" y="62" ')+'</g>' : "";
    var fx = (FX[R.fx]||FX.none)();
    var top = (R.tod==="n" && R.fx!=="stars") ? FX.stars() : "";
    return '<svg class="scene'+(opts.still?' still':'')+' scene-'+(opts.size||"big")+'" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+(opts.label?String(opts.label).replace(/"/g,"&quot;"):"")+'"><defs><clipPath id="'+id+'"><rect width="400" height="240" rx="0"/></clipPath></defs><g clip-path="url(#'+id+')">'+bg+(TOD[R.tod]||"")+top+props+hero+fx+'</g></svg>';
  }
  BF.scene = { render:render, parse:parse, BG:BG, PROP:PROP, FX:FX };
})();
