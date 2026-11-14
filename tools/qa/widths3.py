# Simulate wider Windows fonts (Verdana/DejaVu stand-in) + mid widths; any header control covered/offscreen?
from playwright.sync_api import sync_playwright
import sys
U=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(); bad_total=0
    for lang in ["en","ru"]:
      for w in [900,1000,1093,1180,1229,1280,1366,1440,1536]:
        pg=b.new_page(viewport={"width":w,"height":700}); pg.goto(U); pg.evaluate("l=>localStorage.setItem('balapan.lang',l)",lang); pg.goto("about:blank"); pg.goto(U+"#/"); pg.wait_for_timeout(400)
        pg.add_style_tag(content=":root{--f-body:'DejaVu Sans',Verdana,sans-serif !important; --f-head:'DejaVu Sans',Verdana,sans-serif !important} body,button,a{font-family:'DejaVu Sans',Verdana,sans-serif !important}"); pg.wait_for_timeout(200)
        res=pg.evaluate("""()=>[...document.querySelectorAll('#topbar a, #topbar button')].map(a=>{var r=a.getBoundingClientRect(); if(!r.width) return null; var x=r.x+r.width/2,y=r.y+r.height/2; var t=document.elementFromPoint(x,y); return (x>innerWidth||!a.contains(t))?(a.dataset.nav||a.dataset.lang||a.id||a.className)+'->'+(t?(t.closest('a,button')||t).textContent.trim().slice(0,12)||t.className:'off'):null}).filter(Boolean)""")
        bad_total+=len(res); print(lang,w,res or "ok")
        pg.close()
    print("TOTAL covered/offscreen header controls:", bad_total)
